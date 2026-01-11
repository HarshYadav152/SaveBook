"use client";

import React, { useContext, useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";

import noteContext from "@/context/noteContext";
import { useAuth } from "@/context/auth/authContext";

import AddNote from "./AddNote";
import NoteItem from "./NoteItem";

export default function Notes() {
    const { isAuthenticated } = useAuth();
    const context = useContext(noteContext);

    const {
        notes = [],
        getNotes,
        editNote,
        clearNotes
    } = context || {};

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [note, setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: ""
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("all");

    /* ===========================
       AUTH BASED NOTES HANDLING
       =========================== */

    // Clear notes when user logs out or auth changes
    useEffect(() => {
        if (!isAuthenticated) {
            clearNotes();
        }
    }, [isAuthenticated, clearNotes]);

    // Fetch notes ONLY for authenticated users
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchNotes = async () => {
            try {
                await getNotes();
            } catch (error) {
                console.error("Error fetching notes:", error);
                toast.error("Failed to load notes");
            }
        };

        fetchNotes();
    }, [isAuthenticated, getNotes]);

    /* ===========================
       EDIT NOTE HANDLERS
       =========================== */

    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag
        });
        setIsEditModalOpen(true);
    };

    const handleClick = async () => {
        try {
            await editNote(
                note.id,
                note.etitle,
                note.edescription,
                note.etag
            );
            setIsEditModalOpen(false);
            toast.success("Note updated successfully");
        } catch {
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

    /* ===========================
       FILTERING
       =========================== */

    const tagOptions = [
        "General",
        "Work",
        "Personal",
        "Ideas",
        "Office",
        "Finance",
        "Grocery"
    ];

    const filteredNotes = notes.filter((n) => {
        const matchesSearch =
            n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag =
            selectedTag === "all" || n.tag === selectedTag;

        return matchesSearch && matchesTag;
    });

    /* ===========================
       UI
       =========================== */

    return (
        <>
            <AddNote />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Your Notes
                </h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedTag("all")}
                        className={`px-3 py-1 rounded ${
                            selectedTag === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300"
                        }`}
                    >
                        All
                    </button>

                    {tagOptions.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1 rounded ${
                                selectedTag === tag
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <p className="text-gray-400 text-center">
                        No notes found
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <NoteItem
                                key={note._id}
                                note={note}
                                updateNote={updateNote}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
