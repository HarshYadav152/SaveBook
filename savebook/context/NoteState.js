"use client"
import React, { useCallback, useState } from 'react'
import noteContext from './noteContext'
import { useAuth } from '@/context/auth/authContext'

// Dynamically imported — never runs on the server
let clientCrypto = null;
async function getCrypto() {
  if (!clientCrypto) {
    clientCrypto = await import('@/lib/utils/clientCrypto');
  }
  return clientCrypto;
}

const NoteState = (props) => {
  const [notes, setNotes] = useState([])
  const { getMasterKey } = useAuth()

  const encryptNote = async (title, description, whiteboardData) => {
    const key = getMasterKey()
    if (!key) return { title, description, whiteboardData }
    const { encryptWithKey } = await getCrypto()
    const encrypted = {
      title: await encryptWithKey(title, key),
      description: await encryptWithKey(description, key),
    }
    if (whiteboardData !== undefined) {
      const serialized = whiteboardData === null ? null : JSON.stringify(whiteboardData)
      encrypted.whiteboardData = serialized ? await encryptWithKey(serialized, key) : null
    }
    return encrypted
  }

  const decryptNote = async (note) => {
    const key = getMasterKey()
    if (!key) return note
    try {
      const { decryptWithKey } = await getCrypto()
      const decrypted = {
        ...note,
        title: await decryptWithKey(note.title, key),
        description: await decryptWithKey(note.description, key),
      }
      if (note.whiteboardData && typeof note.whiteboardData === "string") {
        try {
          const whiteboardJson = await decryptWithKey(note.whiteboardData, key)
          decrypted.whiteboardData = JSON.parse(whiteboardJson)
        } catch {
          decrypted.whiteboardData = null
        }
      }
      return decrypted
    } catch {
      return note
    }
  }

  const getNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const raw = await response.json()
      if (!Array.isArray(raw)) { setNotes([]); return }
      const decrypted = await Promise.all(raw.map(decryptNote))
      setNotes(decrypted)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [getMasterKey])

  const addNote = useCallback(async (title, description, tag, images = [], audio = null, whiteboardData = undefined, isWhiteboard = false) => {
    try {
      const encrypted = await encryptNote(title, description, whiteboardData)
      const response = await fetch(`/api/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...encrypted, tag, images, audio, isWhiteboard })
      })
      const note = await response.json()
      const decrypted = await decryptNote(note)
      setNotes(prev => [decrypted, ...(Array.isArray(prev) ? prev : [])])
      return decrypted
    } catch (error) {
      console.error('Error adding note:', error)
      getNotes()
    }
  }, [getNotes, getMasterKey])

  // Bug 6 (stale closure) is a pre-existing issue — not reverted here
  const deleteNote = useCallback(async (id) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      setNotes(prev => prev.filter(note => note._id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
      getNotes()
    }
  }, [notes, getNotes])

  const editNote = useCallback(async (id, title, description, tag, images = [], audio = null, whiteboardData = undefined, isWhiteboard = false) => {
    try {
      const encrypted = await encryptNote(title, description, whiteboardData)
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...encrypted, tag, images, audio, isWhiteboard }),
      })
      if (!response.ok) throw new Error('Failed to update note')
      const updatedNote = await response.json()
      const decrypted = await decryptNote(updatedNote)
      setNotes(prev => prev.map(note => note._id === id ? decrypted : note))
    } catch (error) {
      console.error('Error updating note:', error)
      getNotes()
      throw error
    }
  }, [getNotes, getMasterKey])

  // Fix Bug 7: removed dead `body` variable
  const toggleShare = useCallback(async (id) => {
    try {
      const note = notes.find(n => n._id === id)

      if (note && !note.isPublic) {
        const { generateShareKeyHex, importShareKey, encryptWithKey } = await getCrypto()
        const shareKeyHex = generateShareKeyHex()
        const shareKey = await importShareKey(shareKeyHex)
        const sharePayload = {
          title: note.title,
          description: note.description,
          isWhiteboard: Boolean(note.isWhiteboard),
          whiteboardData: note.isWhiteboard ? (note.whiteboardData ?? null) : undefined,
        }
        const shareEncryptedContent = await encryptWithKey(
          JSON.stringify(sharePayload),
          shareKey
        )
        // shareKeyHex goes into the URL fragment — never sent to server
        const response = await fetch(`/api/notes/share/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shareEncryptedContent }),
        })
        if (!response.ok) throw new Error('Failed to toggle share status')
        const updatedNote = await response.json()
        setNotes(prev => prev.map(n => n._id === id ? { ...n, isPublic: updatedNote.isPublic, _shareKeyHex: shareKeyHex } : n))
        return { ...updatedNote, shareKeyHex }
      } else {
        // Making private: clear share content
        const response = await fetch(`/api/notes/share/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        if (!response.ok) throw new Error('Failed to toggle share status')
        const updatedNote = await response.json()
        setNotes(prev => prev.map(n => n._id === id ? { ...n, isPublic: updatedNote.isPublic, _shareKeyHex: undefined } : n))
        return updatedNote
      }
    } catch (error) {
      console.error('Error toggling share:', error)
      throw error
    }
  }, [notes, getMasterKey])

  return (
    <noteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes, toggleShare, decryptNote }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState
