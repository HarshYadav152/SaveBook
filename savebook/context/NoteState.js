"use client";

import React, { useCallback, useState } from "react";
import noteContext from "./noteContext";
import { encrypt } from "@/lib/utils/crypto";

const NoteState = (props) => {
  const [notes, setNotes] = useState([]);

  // Fetch all notes
  const getNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, []);

  // Add note (ALREADY ENCRYPTED BEFORE CALLING THIS)
  const addNote = useCallback(
    async (title, description, tag) => {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, tag }),
        });

        const note = await response.json();
        setNotes((prev) => [note, ...prev]);
      } catch (error) {
        console.error("Error adding note:", error);
        getNotes();
      }
    },
    [getNotes]
  );

  // Delete note
  const deleteNote = useCallback(
    async (id) => {
      try {
        await fetch(`/api/notes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setNotes((prev) => prev.filter((note) => note._id !== id));
      } catch (error) {
        console.error("Error deleting note:", error);
        getNotes();
      }
    },
    [getNotes]
  );

  // ✨ EDIT NOTE — FULLY E2EE SAFE ✨
  const editNote = useCallback(
    async (id, title, description, tag) => {
      try {
        const secret = localStorage.getItem("encryptionKey");
        if (!secret) {
          throw new Error("Encryption key missing");
        }

        // 🔐 Encrypt BEFORE sending to server
        const encryptedTitle = encrypt(title, secret);
        const encryptedDescription = encrypt(description, secret);

        await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: encryptedTitle,
            description: encryptedDescription,
            tag,
          }),
        });

        // Optimistic update (store encrypted data in state)
        setNotes((prev) =>
          prev.map((note) =>
            note._id === id
              ? {
                  ...note,
                  title: encryptedTitle,
                  description: encryptedDescription,
                  tag,
                }
              : note
          )
        );
      } catch (error) {
        console.error("Error updating note:", error);
        getNotes();
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
      }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
