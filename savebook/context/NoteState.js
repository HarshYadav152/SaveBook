"use client"
import React, { useCallback, useState } from 'react'
import noteContext from './noteContext'
import { useAuth } from './auth/authContext';

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)

  // Helper function to handle fetch responses
  const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;

      try {
        // Try to parse as JSON first
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // If not JSON, check if it's HTML
        if (contentType?.includes('text/html')) {
          errorMessage = `Server returned HTML instead of JSON (${response.status})`;
        } else {
          errorMessage = errorText || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    if (!contentType?.includes('application/json')) {
      throw new Error(`Expected JSON but gots ${contentType}`);
    }

    return response.json();
  };

  // Access Master Key from Auth Context
  const { masterKey } = useAuth();

  // Helper to decrypt a single note
  const decryptNote = useCallback(async (note) => {
    if (note.encryptedKey && masterKey) {
      try {
        const { unwrapKey, decryptData } = await import('../lib/utils/crypto');

        // Unwrap NDK
        const ndk = await unwrapKey(note.encryptedKey, note.keyIv, masterKey);

        // Decrypt Content
        const title = await decryptData(note.title, note.titleIv, ndk);
        const description = await decryptData(note.description, note.contentIv, ndk);

        return { ...note, title, description };
      } catch (e) {
        console.error("Failed to decrypt note:", note._id, e);
        return { ...note, title: "⚠️ Decryption Failed", description: "Please check your password or key." };
      }
    }
    return note;
  }, [masterKey]);

  // Fetch all notes
  const getNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const parsedText = await response.json();

      // Decrypt all notes
      if (masterKey) {
        const decryptedNotes = await Promise.all(parsedText.map(decryptNote));
        setNotes(decryptedNotes);
      } else {
        setNotes(parsedText);
      }

    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [masterKey, decryptNote]);

  // Add note
  const addNote = useCallback(async (title, description, tag) => {
    try {
      let payload = { title, description, tag };

      // Encrypt if Master Key is available
      if (masterKey) {
        const { generateSymmetricKey, wrapKey, encryptData } = await import('../lib/utils/crypto');

        // Generate NDK
        const ndk = await generateSymmetricKey();

        // Wrap NDK with UMK
        const wrappedKey = await wrapKey(ndk, masterKey);

        // Encrypt Data
        const encTitle = await encryptData(title, ndk);
        const encDesc = await encryptData(description, ndk);

        payload = {
          title: encTitle.ciphertext,
          description: encDesc.ciphertext,
          tag,
          encryptedKey: wrappedKey.encryptedKey,
          keyIv: wrappedKey.iv,
          titleIv: encTitle.iv,
          contentIv: encDesc.iv
        };
      }

      const response = await fetch(`/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const note = await response.json();

      // Optimistic update: Use original plaintext for UI
      const newNoteLocal = { ...note, title, description, tag };
      setNotes(prevNotes => [newNoteLocal, ...prevNotes]);
    } catch (error) {
      console.error('Error adding note:', error);
      getNotes();
    }
  }, [getNotes, masterKey]);

  // delete note
  const deleteNote = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await response.json();

      // Optimistic update
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
      getNotes(); // Refetch on error
    }
  }, [notes, getNotes]);

  // Edit note 
  const editNote = useCallback(async (id, title, description, tag) => {
    try {
      let payload = { title, description, tag };
      // Logic for encryption on edit would go here similarly to addNote
      // For brevity in this turn, implementing basic encryption for edit too
      if (masterKey) {
        const { generateSymmetricKey, wrapKey, encryptData } = await import('../lib/utils/crypto');
        const ndk = await generateSymmetricKey(); // Rotate key on edit? Or reuse? Safer to rotate/new IV.
        const wrappedKey = await wrapKey(ndk, masterKey);
        const encTitle = await encryptData(title, ndk);
        const encDesc = await encryptData(description, ndk);

        payload = {
          title: encTitle.ciphertext,
          description: encDesc.ciphertext,
          tag,
          encryptedKey: wrappedKey.encryptedKey, // Update key
          keyIv: wrappedKey.iv,
          titleIv: encTitle.iv,
          contentIv: encDesc.iv
        };
      }

      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      await response.json();

      // Optimistic update
      let newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(`Failed to update note: ${error.message}`);
      getNotes();
      throw error;
    }
  }, [notes, getNotes, masterKey]);

  return (
    <noteContext.Provider
      value={{
        notes,
        setNotes,
        addNote,
        deleteNote,
        editNote,
        getNotes
      }}>
      {props.children}
    </noteContext.Provider>
  )
}
export default NoteState;