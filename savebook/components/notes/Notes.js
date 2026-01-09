"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import noteContext from "@/context/noteContext";
import { useAuth } from "@/context/auth/authContext";

import Addnote from "./AddNote";
import NoteItem from "./NoteItem";

export default function Notes() {
    const router = useRouter();
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

    
    useEffect(() => {
        
        if (!isAuthenticated) {
            clearNotes?.();          
            router.push("/login");
            return;
        }

        
        clearNotes?.();

        const fetchUserNotes = async () => {
            try {
                await getNotes();    
                console.error(error);
                toast.error("Failed to load notes");
            }
        };

        fetchUserNotes();
    }, [isAuthenticated]);

    
    const tagOptions = [
        "General",
        "Basic",
        "Finance",
        "Grocery",
        "Office",
        "Personal",
        "Work",
        "Ideas"
    ];

    const filteredNotes = notes.filter((note) => {
        const matchesSearch =
            note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag =
            selectedTag === "all" || note.tag === selectedTag;

        return matchesSearch && matchesTag;
    });

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

    return (
        <>
            <Addnote />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Your Notes
                </h1>

               
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white"
                />

                
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedTag("all")}
                        className={`px-3 py-1 rounded ${
                            selectedTag === "all"
                                ? "bg-blue-600"
                                : "bg-gray-700"
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
                                    ? "bg-blue-600"
                                    : "bg-gray-700"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

               
                {filteredNotes.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No notes found
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
