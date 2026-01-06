"use client"
import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';

export default function Addnote() {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveNote = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addNote(note.title, note.description, note.tag);
            setNote({ title: '', description: '', tag: '' });
            // Toast is now handled in the context addNote function
        } catch (error) {
            // Error toast is now handled in the context addNote function
            console.error("Save note error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const isFormValid = note.title.length >= 5 && note.description.length >= 5 && note.tag.length >= 5;
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-18 p-2">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Notebook on the Cloud
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your notes, securely stored and accessible anywhere
                    </p>
                </div>

                {/* Add Note Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                        Add New Note
                    </h2>

                    <form onSubmit={handleSaveNote} className="space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={note.title}
                                onChange={onchange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 outline-none"
                                placeholder="Enter a descriptive title for your note"
                                minLength={5}
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Minimum 5 characters required
                            </p>
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows="4"
                                value={note.description}
                                onChange={onchange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 outline-none"
                                placeholder="Write your note content here..."
                                minLength={5}
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Minimum 5 characters required
                            </p>
                        </div>

                        {/* Tag Field */}
                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tag
                            </label>
                            <input
                                list="datalistOptions"
                                name="tag"
                                id="tag"
                                value={note.tag}
                                onChange={onchange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 outline-none"
                                placeholder="Select or type a tag"
                                minLength={5}
                                required
                            />
                            <datalist id="datalistOptions" className="bg-white dark:bg-gray-700">
                                <option value="General" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Basic" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Finance" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Grocery" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Office" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Personal" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Work" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                <option value="Ideas" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </datalist>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Choose from suggestions or type your own (min. 5 chars)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            <span className="flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Note...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Note
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Tips
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Use descriptive titles to easily find your notes later
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Tags help organize and categorize your notes effectively
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            All fieldss require at least 5 characters for better note quality
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}