"use client";

import noteContext from "@/context/noteContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import Addnote from "./AddNote";
import NoteItem from "./NoteItem";
import { useAuth } from "@/context/auth/authContext";

// Separate navigation handler component to use router with Suspense
const NavigationHandler = ({ isAuthenticated, loading }) => {
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  return null;
};

export default function Notes() {
  const { isAuthenticated, loading } = useAuth();
  const context = useContext(noteContext);
  const { notes: contextNotes = [], getNotes, editNote } = context || {};

  const notes =
    isAuthenticated && Array.isArray(contextNotes) ? contextNotes : [];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  // Fetch notes
  useEffect(() => {
    if (isAuthenticated && !loading) {
      getNotes().catch(() => toast.error("Failed to load notes"));
    }
  }, [isAuthenticated, loading, getNotes]);

  // ✅ RESTORE UNSAVED DRAFT WHEN EDIT MODAL OPENS
  useEffect(() => {
    if (!isEditModalOpen || !note.id) return;

    const savedDraft = localStorage.getItem(`note-draft-${note.id}`);
    if (savedDraft) {
      setNote((prev) => ({
        ...prev,
        edescription: savedDraft,
      }));
    }
  }, [isEditModalOpen, note.id]);

  // ✅ AUTOSAVE NOTE DESCRIPTION (DEBOUNCED)
  useEffect(() => {
    if (!isEditModalOpen || !note.id) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        `note-draft-${note.id}`,
        note.edescription
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [note.edescription, note.id, isEditModalOpen]);

  const tagOptions = [
    { id: 1, value: "General", color: "bg-blue-500" },
    { id: 2, value: "Basic", color: "bg-gray-500" },
    { id: 3, value: "Finance", color: "bg-green-500" },
    { id: 4, value: "Grocery", color: "bg-orange-500" },
    { id: 5, value: "Office", color: "bg-purple-500" },
    { id: 6, value: "Personal", color: "bg-pink-500" },
    { id: 7, value: "Work", color: "bg-indigo-500" },
    { id: 8, value: "Ideas", color: "bg-teal-500" },
  ];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === "all" || n.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });

    setExistingImages(currentNote.images || []);
    setNewImages([]);
    setPreview([]);
    setReplaceImages(false);
    setPreviewImage(null);
    setIsEditModalOpen(true);
  };

  const handleClick = async () => {
    try {
      await editNote(
        note.id,
        note.etitle,
        note.edescription,
        note.etag,
        existingImages
      );

      // ✅ clear draft after successful save
      localStorage.removeItem(`note-draft-${note.id}`);

      setIsEditModalOpen(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    }
  };

  const onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const isFormValid =
    note.etitle.length >= 5 &&
    note.edescription.length >= 5 &&
    note.etag.length >= 3;

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={null}>
        <NavigationHandler
          isAuthenticated={isAuthenticated}
          loading={loading}
        />
      </Suspense>
    );
  }

  return (
    <>
      <Addnote />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <NoteItem
            key={note._id}
            note={note}
            updateNote={updateNote}
          />
        ))}
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <input
            name="etitle"
            value={note.etitle}
            onChange={onchange}
          />
          <textarea
            name="edescription"
            value={note.edescription}
            onChange={onchange}
          />
          <button
            disabled={!isFormValid}
            onClick={handleClick}
          >
            Update Note
          </button>
        </div>
      )}
    </>
  );
}



