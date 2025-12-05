"use client"
import React, { useCallback, useState } from 'react'
import noteContext from './noteContext'

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)

  //Fetch all notes
  // Fetch all notes with useCallback
  const getNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const parsedText = await response.json();
      setNotes(parsedText)
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  // Add note
  const addNote = useCallback(async (title, description, tag) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tag })
      });
      const note = await response.json();
      // Optimistic update - add to existing notes instead of refetching
      setNotes(prevNotes => [note, ...prevNotes]);
    } catch (error) {
      console.error('Error adding note:', error);
      // If error, refetch to ensure consistency
      getNotes();
    }
  }, [getNotes]);

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
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tag })
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
      getNotes(); // Refetch on error
    }
  }, [notes, getNotes]);

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