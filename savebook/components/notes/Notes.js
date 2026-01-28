"use client"
import noteContext from '@/context/noteContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, Suspense } from 'react'
import toast from 'react-hot-toast';
import Addnote from './AddNote';
import NoteItem from './NoteItem';
import { useAuth } from '@/context/auth/authContext';

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
        isAuthenticated && Array.isArray(contextNotes)
            ? contextNotes
            : [];

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [replaceImages, setReplaceImages] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');

    /* =========================
       🔐 DRAFT AUTOSAVE LOGIC
    ========================== */

    const draftKey = note.id ? `savebook_draft_${note.id}` : null;

    // Load draft when edit modal opens
    useEffect(() => {
        if (isEditModalOpen && draftKey) {
            const savedDraft = localStorage.getItem(draftKey);
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    setNote(prev => ({ ...prev, ...parsed }));
                    toast.success("Recovered unsaved changes ✨");
                } catch (e) {
                    console.error("Failed to parse draft");
                }
            }
        }
    }, [isEditModalOpen, draftKey]);

    // Autosave draft on change
    useEffect(() => {
        if (isEditModalOpen && draftKey) {
            localStorage.setItem(
                draftKey,
                JSON.stringify({
                    etitle: note.etitle,
                    edescription: note.edescription,
                    etag: note.etag
                })
            );
        }
    }, [note.etitle, note.edescription, note.etag, isEditModalOpen, draftKey]);

    /* ========================= */

    useEffect(() => {
        if (isAuthenticated && !loading) {
            getNotes().catch(() => toast.error("Failed to load notes"));
        }
    }, [isAuthenticated, loading, getNotes]);

    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag
        });
        setExistingImages(currentNote.images || []);
        setNewImages([]);
        setPreview([]);
        setReplaceImages(false);
        setPreviewImage(null);
        setIsEditModalOpen(true);
    }

    const uploadImages = async (files) => {
        if (!files || files.length === 0) return [];
        const formData = new FormData();
        files.forEach(file => formData.append("image", file));
        const res = await fetch("/api/upload/user-media", {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        return Array.isArray(data.imageUrls) ? data.imageUrls : [];
    };

    const handleClick = async () => {
        try {
            let uploadedUrls = [];
            if (newImages.length > 0) {
                uploadedUrls = await uploadImages(newImages);
            }
            const finalImages = replaceImages
                ? uploadedUrls
                : [...existingImages, ...uploadedUrls];

            await editNote(
                note.id,
                note.etitle,
                note.edescription,
                note.etag,
                finalImages
            );

            // ✅ clear draft after successful save
            if (draftKey) localStorage.removeItem(draftKey);

            setIsEditModalOpen(false);
            toast.success("Note updated successfully! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update note");
        }
    };

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const isFormValid =
        note.etitle?.length >= 5 &&
        note.edescription?.length >= 5 &&
        note.etag?.length >= 5;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Suspense fallback={null}>
                <NavigationHandler isAuthenticated={isAuthenticated} loading={loading} />
            </Suspense>
        );
    }

    return (
        <>
            <Suspense fallback={null}>
                <NavigationHandler isAuthenticated={isAuthenticated} loading={loading} />
            </Suspense>

            <Addnote />

            {/* ❗ Everything else remains unchanged */}
        </>
    );
}
