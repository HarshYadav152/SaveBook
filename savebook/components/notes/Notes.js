"use client"
import noteContext from '@/context/noteContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, Suspense } from 'react'
import toast from 'react-hot-toast';
import Addnote from './AddNote';
import NoteItem from './NoteItem';
import { useAuth } from '@/context/auth/authContext';

// Separate navigation handler component to use router with Suspense
const NavigationHandler = ({ isAuthenticated, loading }) => {
    const router = useRouter();
    
    useEffect(() => {
        // Only redirect if loading is complete and user is not authenticated
        if (!loading && !isAuthenticated) {
            console.log("User not authenticated, redirecting to login");
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);
    
    return null;
};

export default function Notes() {
    const { isAuthenticated, loading } = useAuth();
    const context = useContext(noteContext);
    const { notes: contextNotes = [], getNotes, editNote } = context || {};
    
    // Ensure notes is always an array
    const notes = Array.isArray(contextNotes) ? contextNotes : [];
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');
    
    useEffect(() => {
        // Only fetch notes if authenticated and not loading
        if (isAuthenticated && !loading) {
            async function fetch() {   
                try {
                    await getNotes();
                } catch (error) {
                    console.error("Error fetching notes:", error);
                    toast.error("Failed to load notes");
                }
            }
            fetch();
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
        setIsEditModalOpen(true);
    }

    const handleClick = async (e) => {
        try {
            await editNote(note.id, note.etitle, note.edescription, note.etag);
            setIsEditModalOpen(false);
            toast.success("Note updated successfully! 🎉");
        } catch (error) {
            toast.error("Failed to update note");
        }
    }

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
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
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
                                <label htmlFor="edescription" className="block text-sm font-medium text-gray-300 mb-3">
                                    Description
                                </label>
                                <textarea
                                    name="edescription"
                                    id="edescription"
                                    rows="4"
                                    value={note.edescription}
                                    onChange={onchange}
                                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500 resize-none transition-all duration-200 outline-none"
                                    placeholder="Enter note description"
                                    minLength={5}
                                    required
                                />
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