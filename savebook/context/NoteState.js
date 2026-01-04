"use client"
import React, { useCallback, useState } from 'react'
import noteContext from './noteContext'
import toast from 'react-hot-toast';

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
      throw new Error(`Expected JSON but got ${contentType}`);
    }
    
    return response.json();
  };

  // Fetch all notes with useCallback
  const getNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const parsedText = await handleResponse(response);
      setNotes(parsedText);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error(`Failed to load notes: ${error.message}`);
    }
  }, []);

  // Add note with toast
  const addNote = useCallback(async (title, description, tag) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tag })
      });
      
      const note = await handleResponse(response);
      // Optimistic update
      setNotes(prevNotes => [note, ...prevNotes]);
      toast.success('Note saved successfully! 🎉');
      return note;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(`Failed to save note: ${error.message}`);
      getNotes(); // Refetch on error
      throw error;
    }
  }, [getNotes]);

  // Delete note with toast
  const deleteNote = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      await handleResponse(response);

      // Optimistic update
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
      toast.success('Note deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(`Failed to delete note: ${error.message}`);
      getNotes(); // Refetch on error
      throw error;
    }
  }, [notes, getNotes]);

  // Edit note with toast
  const editNote = useCallback(async (id, title, description, tag) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tag })
      });
      
      await handleResponse(response);

      // Optimistic update
      let newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          newNotes[index].updatedAt = new Date().toISOString();
          break;
        }
      }
      setNotes(newNotes);
      toast.success('Note updated successfully! ✏️');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(`Failed to update note: ${error.message}`);
      getNotes();
      throw error;
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