"use client"
import React, { useCallback, useState } from 'react'
import noteContext from './noteContext'

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotes: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(false)

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

  // Fetch notes with pagination
  const getNotes = useCallback(async (page = 1, limit = 10, append = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (append) {
        setNotes(prevNotes => [...prevNotes, ...data.notes]);
      } else {
        setNotes(data.notes);
      }
      
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add note
  const addNote = useCallback(async (title, description, tag,images = []) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, tag, images, })
      });
      const note = await response.json();
      // Optimistic update - add to existing notes instead of refetching
      setNotes(prevNotes => [note, ...(Array.isArray(prevNotes) ? prevNotes : [])]);
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
        credentials: "include",
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
 const editNote = useCallback(
  async (id, title, description, tag, images = []) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, tag, images }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();

      
      setNotes((prev) =>
        prev.map((note) =>
          note._id === id ? updatedNote : note
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
      getNotes(); // fallback
      throw error;
    }
  },
  [getNotes]
);


  return (
    <noteContext.Provider 
      value={{ 
        notes, 
        setNotes, 
        addNote, 
        deleteNote, 
        editNote, 
        getNotes,
        pagination,
        loading: loading
      }}>
      {props.children}
    </noteContext.Provider>
  )
}
export default NoteState;


