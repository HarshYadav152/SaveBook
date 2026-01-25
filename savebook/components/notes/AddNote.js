"use client";

import React, { useContext, useState } from "react";
import noteContext from "@/context/noteContext";
import toast from "react-hot-toast";
import { encrypt } from "@/lib/utils/crypto";

/* Note templates */
const NOTE_TEMPLATES = {
  meeting: `Date:\n\nAttendees:\n\nAgenda:\n- \n- \n\nNotes:\n\nAction Items:\n- `,
  journal: `What happened today:\n\nGoals for tomorrow:\n\nGratitude:\n`,
  checklist: `Tasks:\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3`,
};

export default function AddNote() {
  const { addNote, notes } = useContext(noteContext);

  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultTags = [
    "General",
    "Basic",
    "Finance",
    "Grocery",
    "Office",
    "Personal",
    "Work",
    "Ideas",
  ];

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const secret = localStorage.getItem("encryptionKey");
      if (!secret) {
        toast.error("Encryption key missing. Please log in again.");
        return;
      }

      const encryptedTitle = encrypt(note.title, secret);
      const encryptedDescription = encrypt(note.description, secret);

      await addNote(encryptedTitle, encryptedDescription, note.tag);

      toast.success("Note saved");
      setNote({ title: "", description: "", tag: "" });
    } catch (err) {
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyTemplate = (key) => {
    if (NOTE_TEMPLATES[key]) {
      setNote({ ...note, description: NOTE_TEMPLATES[key] });
      toast.success("Template applied");
    }
  };

  const userTags = Array.from(
    new Set((Array.isArray(notes) ? notes : []).map((n) => n.tag).filter(Boolean))
  );

  const allTags = Array.from(new Set([...defaultTags, ...userTags]));

  const isFormValid =
    note.title.length >= 5 &&
    note.description.length >= 5 &&
    note.tag.length >= 2;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Note</h1>

      <form onSubmit={handleSaveNote} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={note.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          minLength={5}
        />

        <div className="flex gap-2">
          <button type="button" onClick={() => applyTemplate("meeting")}>
            Meeting
          </button>
          <button type="button" onClick={() => applyTemplate("journal")}>
            Journal
          </button>
          <button type="button" onClick={() => applyTemplate("checklist")}>
            Checklist
          </button>
        </div>

        <textarea
          name="description"
          placeholder="Write your note..."
          value={note.description}
          onChange={handleChange}
          rows={6}
          className="w-full p-2 border rounded"
          required
          minLength={5}
        />

        <input
          name="tag"
          list="tags"
          placeholder="Tag"
          value={note.tag}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          minLength={2}
        />

        <datalist id="tags">
          {allTags.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Save Note"}
        </button>
      </form>
    </div>
  );
}