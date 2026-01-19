"use client"
import noteContext from '@/context/noteContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, Suspense } from 'react'
import toast from 'react-hot-toast';
import Addnote from './AddNote';
import NoteItem from './NoteItem';
import { useAuth } from '@/context/auth/authContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Separate navigation handler component to use router with Suspense
const NavigationHandler = ({ isAuthenticated, loading }) => {
    const router = useRouter();
    
    useEffect(() => {
        // Only redirect if loading is complete and user is not authenticated
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
    const [editPreview, setEditPreview] = useState(false);
    
    // Ensure notes is always an array
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

    useEffect(() => {
        if (isAuthenticated && !loading) {
            getNotes().catch(() => toast.error("Failed to load notes"));
        }
    }, [isAuthenticated, loading, getNotes]);
    
    // Enhanced tag options with colors
    const tagOptions = [
        { id: 1, value: "General", color: "bg-blue-500" },
        { id: 2, value: "Basic", color: "bg-gray-500" },
        { id: 3, value: "Finance", color: "bg-green-500" },
        { id: 4, value: "Grocery", color: "bg-orange-500" },
        { id: 5, value: "Office", color: "bg-purple-500" },
        { id: 6, value: "Personal", color: "bg-pink-500" },
        { id: 7, value: "Work", color: "bg-indigo-500" },
        { id: 8, value: "Ideas", color: "bg-teal-500" }
    ];

    // Filter notes based on search and tag
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            note.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === 'all' || note.tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag
        });
        setEditPreview(false);
        setExistingImages(currentNote.images || []);
        setNewImages([]);
        setPreview([]);
        setReplaceImages(false);
        setPreviewImage(null);
        setIsEditModalOpen(true);
    }

    //Upload images to Cloudinary
    const uploadImages = async (files) => {
        if (!files || files.length === 0) return [];
        const formData = new FormData();
        files.forEach(file => formData.append("image", file));
        const res = await fetch("/api/upload/user-media", {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        if (!res.ok) {
            throw new Error("Image upload failed");
        }
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
            setIsEditModalOpen(false);
            setExistingImages([]);
            setNewImages([]);
            setPreview([]);
            setReplaceImages(false);
            setPreviewImage(null);
            toast.success("Note updated successfully! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update note");
        }
    };

    // Add new images
    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
        setPreview(files.map(file => URL.createObjectURL(file)));
    };

    // Remove old image
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Remove newly selected image
    const removePreviewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreview(prev => prev.filter((_, i) => i !== index));
    };

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const isFormValid = note.etitle?.length >= 5 && note.edescription?.length >= 5 && note.etag?.length >= 5;

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render notes if not authenticated (will be redirected)
    if (!isAuthenticated) {
        return (
            <Suspense fallback={null}>
                <NavigationHandler isAuthenticated={isAuthenticated} loading={loading} />
            </Suspense>
        );
    }

    return (
        <>
            {/* Navigation handler with Suspense */}
            <Suspense fallback={null}>
                <NavigationHandler isAuthenticated={isAuthenticated} loading={loading} />
            </Suspense>
            
            <Addnote />

            {/* Edit Note Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Edit Note
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Update your note details</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="etitle" className="block text-sm font-medium text-gray-300 mb-3">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="etitle"
                                    id="etitle"
                                    value={note.etitle}
                                    onChange={onchange}
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500 transition-all duration-200 outline-none"
                                    placeholder="Enter note title"
                                    minLength={5}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    {note.etitle.length}/5 characters
                                </p>
                            </div>

                            {/* Description Field */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label htmlFor="edescription" className="block text-sm font-medium text-gray-300">
                                        Description
                                    </label>
                                    <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setEditPreview(false)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!editPreview ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                                        >
                                            Write
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditPreview(true)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${editPreview ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                {!editPreview ? (
                                    <textarea
                                        name="edescription"
                                        id="edescription"
                                        rows="4"
                                        value={note.edescription}
                                        onChange={onchange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500 resize-none transition-all duration-200 outline-none font-mono text-sm"
                                        placeholder="Enter note description (Markdown supported)"
                                        minLength={5}
                                        required
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 min-h-[120px] prose prose-sm prose-invert max-w-none overflow-y-auto">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {note.edescription}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    {note.edescription.length}/5 characters
                                </p>
                            </div>

                            {/* Tag Field */}
                            <div>
                                <label htmlFor="etag" className="block text-sm font-medium text-gray-300 mb-3">
                                    Tag
                                </label>
                                <select
                                    name="etag"
                                    id="etag"
                                    value={note.etag}
                                    onChange={onchange}
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white transition-all duration-200 outline-none"
                                    required
                                >
                                    <option value="">Select a tag</option>
                                    {tagOptions.map(option => (
                                        <option key={option.id} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400 mt-2">
                                    Choose a category for your note
                                </p>
                            </div>

                            {/* ===== Existing Images ===== */}
                            {existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Existing Images ({existingImages.length})
                                    </label>
                                    <div className="flex gap-3 flex-wrap p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                        {existingImages.map((img, i) => (
                                            <div key={i} className="relative group overflow-hidden rounded-xl border border-gray-700 bg-gray-800 cursor-pointer">
                                                <img
                                                    src={img}
                                                    alt={`Existing image ${i + 1}`}
                                                    loading="lazy"
                                                    className="w-24 h-24 object-cover"
                                                    onClick={() => setPreviewImage(img)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(i)}
                                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    title="Remove image"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {/* Preview Icon */}
                                                <div className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ===== Add New Images ===== */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Add New Images
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleNewImageChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer transition-all duration-200 outline-none"
                                    />
                                </div>
                                
                                {/* Replace Images Checkbox */}
                                <div className="flex items-center gap-2 mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <input
                                        type="checkbox"
                                        id="replaceImages"
                                        checked={replaceImages}
                                        onChange={(e) => setReplaceImages(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor="replaceImages" className="text-sm text-gray-300 cursor-pointer">
                                        Replace existing images (instead of adding to them)
                                    </label>
                                </div>
                                
                                <p className="text-xs text-gray-400 mt-2">
                                    Select one or more images to {replaceImages ? 'replace all existing images' : 'add to your note'}
                                </p>
                            </div>

                            {/* ===== New Image Preview ===== */}
                            {preview.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        New Images Preview ({preview.length})
                                    </label>
                                    <div className="flex gap-3 flex-wrap p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                        {preview.map((src, i) => (
                                            <div key={i} className="relative group overflow-hidden rounded-xl border border-gray-700 bg-gray-800 cursor-pointer">
                                                <img
                                                    src={src}
                                                    alt={`New image ${i + 1}`}
                                                    className="w-24 h-24 object-cover"
                                                    onClick={() => setPreviewImage(src)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePreviewImage(i)}
                                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    title="Remove image"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {/* Preview Icon */}
                                                <div className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-700">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!isFormValid}
                                onClick={handleClick}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center w-full sm:w-auto"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full p-3 transition-all duration-200 z-10 border border-gray-700"
                            title="Close preview"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* Image */}
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Notes Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-grey-900">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Your Notes
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Organize and access all your notes in one secure place
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="flex-1 w-full lg:max-w-md">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>

                        {/* Tag Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedTag('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedTag === 'all' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                All
                            </button>
                            {tagOptions.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => setSelectedTag(tag.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        selectedTag === tag.value 
                                            ? `${tag.color} text-white` 
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {tag.value}
                                </button>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="text-sm text-gray-400">
                            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                        </div>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="mb-8">
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-700">
                            <div className="w-24 h-24 mx-auto mb-6 text-gray-600">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-400 mb-3">
                                {searchTerm || selectedTag !== 'all' ? 'No matching notes found' : 'No notes yet'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchTerm || selectedTag !== 'all' 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first note to get started!'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNotes.map((note) => (
                                <NoteItem
                                    key={note._id}
                                    updateNote={updateNote}
                                    note={note}
                                    tag={note.tag}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Enhanced Stats */}
                {filteredNotes.length > 0 && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{filteredNotes.length}</div>
                                <div className="text-gray-400 text-sm">Total Notes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">
                                    {new Set(filteredNotes.map(note => note.tag)).size}
                                </div>
                                <div className="text-gray-400 text-sm">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">
                                    {filteredNotes.reduce((total, note) => total + (note.description?.length || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {filteredNotes.reduce((total, note) => total + (note.description?.length || 0), 0) === 1
                                        ? "1 Character"
                                        : "Total Characters"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}