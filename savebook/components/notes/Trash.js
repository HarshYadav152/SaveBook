"use client"
import React, { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast';
import NoteItem from './NoteItem';
import { useAuth } from '@/context/auth/authContext';
import noteContext from '@/context/noteContext';

export default function Trash() {
    const { isAuthenticated, loading } = useAuth();
    const context = useContext(noteContext);
    const { decryptNote } = context || {};
    const [trashedNotes, setTrashedNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');

    // Fetch trashed notes
    const getTrashedNotes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes/trash');

            if (!response.ok) {
                throw new Error('Failed to fetch trash');
            }

            const data = await response.json();
            const notesData = data.data || [];

            // Decrypt notes if decryptNote function is available
            const decryptedNotes = decryptNote
                ? await Promise.all(notesData.map(note => decryptNote(note)))
                : notesData;

            setTrashedNotes(decryptedNotes);

            if (decryptedNotes.length > 0) {
                toast.success(`Loaded ${decryptedNotes.length} deleted notes`);
            }
        } catch (error) {
            console.error('Error fetching trash:', error);
            toast.error('Failed to load trash');
            setTrashedNotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load trash on mount
    useEffect(() => {
        if (isAuthenticated && !loading) {
            getTrashedNotes();
        }
    }, [isAuthenticated, loading, decryptNote]);

    // Restore note from trash
    const restoreNote = async (noteId) => {
        try {
            const response = await fetch(`/api/notes/trash/restore/${noteId}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Failed to restore note');
            }

            const data = await response.json();

            // Remove from trash display
            setTrashedNotes(trashedNotes.filter(note => note._id !== noteId));
            toast.success('Note restored successfully');
        } catch (error) {
            console.error('Error restoring note:', error);
            toast.error('Failed to restore note');
        }
    };

    // Permanently delete note from trash
    const permanentlyDeleteNote = async (noteId) => {
        try {
            // Confirm deletion
            const userConfirmed = window.confirm(
                'This will permanently delete the note. This action cannot be undone. Are you sure?'
            );

            if (!userConfirmed) {
                return;
            }

            const response = await fetch(`/api/notes/trash/${noteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to permanently delete note');
            }

            // Remove from trash display
            setTrashedNotes(trashedNotes.filter(note => note._id !== noteId));
            toast.success('Note permanently deleted');
        } catch (error) {
            console.error('Error permanently deleting note:', error);
            toast.error('Failed to permanently delete note');
        }
    };

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

    // Filter trashed notes by search and tag
    const filteredNotes = trashedNotes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === 'all' || note.tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    if (!isAuthenticated && !loading) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        🗑️ Trash
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Recover deleted notes within 30 days. After 30 days, notes are permanently deleted.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => window.location.href = '/notes'}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                        📝 Back to Notes
                    </button>
                    <button
                        onClick={() => window.location.href = '/notes/whiteboard'}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                        🎨 Back to Whiteboard
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    <input
                        type="text"
                        placeholder="Search deleted notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Tags</option>
                        {tagOptions.map(tag => (
                            <option key={tag.id} value={tag.value}>
                                {tag.value}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={getTrashedNotes}
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total in Trash</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {trashedNotes.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Matching Search</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {filteredNotes.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Recovery Window</p>
                        <p className="text-lg font-bold text-orange-500">30 days</p>
                    </div>
                </div>

                {/* Trash Items */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                {trashedNotes.length === 0 ? "No deleted notes" : "No notes match your search"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">
                                {trashedNotes.length === 0 ? "Your trash is empty. Deleted notes will appear here." : "Try adjusting your search filters."}
                            </p>
                        </div>
                    ) : (
                        filteredNotes.map(note => (
                            <div key={note._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-4 md:p-6">
                                    {/* Note Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {note.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                                                {note.description}
                                            </p>
                                        </div>
                                        {note.tag && (
                                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium whitespace-nowrap ${
                                                tagOptions.find(t => t.value === note.tag)?.color || 'bg-gray-500'
                                            }`}>
                                                {note.tag}
                                            </span>
                                        )}
                                    </div>

                                    {/* Deletion Info */}
                                    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                        <p className="text-orange-700 dark:text-orange-300 text-sm">
                                            Deleted {new Date(note.deletedAt).toLocaleDateString()} at {new Date(note.deletedAt).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <button
                                            onClick={() => restoreNote(note._id)}
                                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                        >
                                            ♻️ Restore
                                        </button>
                                        <button
                                            onClick={() => permanentlyDeleteNote(note._id)}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                        >
                                            🗑️ Permanently Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
