"use client"
import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define Note Templates
const NOTE_TEMPLATES = {
  meeting: `Date: [Insert Date]\n\nAttendees: [List attendees]\n\nAgenda:\n- \n- \n- \n\nNotes:\n\nAction Items:\n- [ ] \n- [ ] `,
  journal: `**What happened today:**\n[Write your experiences here]\n\n**Goals for tomorrow:**\n1. [List your goals]\n\n**Gratitude:**\n> [Write things you're grateful for]`,
  checklist: `## Project: [Project Name]\n\n**Tasks:**\n- [ ] Define project goal\n- [ ] List all tasks\n- [ ] Assign owners\n- [ ] Set deadlines\n- [ ] Plan resources\n- [ ] Review progress\n- [ ] Complete project`
};

export default function Addnote() {
    const context = useContext(noteContext);
    const { addNote, notes } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const defaultTags = [
        "General", "Basic", "Finance", "Grocery", "Office", "Personal", "Work", "Ideas"
    ];

    const handleSaveNote = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addNote(note.title, note.description, note.tag);
            toast.success("Note has been saved");
            setNote({ title: '', description: '', tag: '' });
            setPreviewMode(false);
        } catch (error) {
            toast.error("Failed to save note");
        } finally {
            setIsSubmitting(false);
        }
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    // Apply Template Handler
    const applyTemplate = (templateKey) => {
        const template = NOTE_TEMPLATES[templateKey];
        if (!template) return;

        if (!note.description.trim()) {
            setNote({ ...note, description: template });
            toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied!`);
        } else {
            if (window.confirm('Replace current content with this template? This action cannot be undone.')) {
                setNote({ ...note, description: template });
                toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied!`);
            }
        }
    }

    // Collect unique tags from existing notes
    const userTags = Array.from(
        new Set(
            (Array.isArray(notes) ? notes : [])
                .map(note => note.tag)
                .filter(tag => tag && tag.trim() !== "")
        )
    );
    
    const allTags = Array.from(new Set([...defaultTags, ...userTags]));
    const isFormValid = note.title.length >= 5 && note.description.length >= 5 && note.tag.length >= 2;
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-18 p-2">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Notebook on the Cloud
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your notes, securely stored and accessible anywhere
                    </p>
                </div>

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

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(false)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!previewMode ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        Write
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode(true)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewMode ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>

                            {!previewMode && (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => applyTemplate('meeting')}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Meeting
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => applyTemplate('journal')}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                            title="Auto-fill with Daily Journal template"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                                            </svg>
                                            Journal
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => applyTemplate('checklist')}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                            title="Auto-fill with Project Checklist template"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                            Checklist
                                        </button>        
                                    </div>

                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="6"
                                        value={note.description}
                                        onChange={onchange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 outline-none font-mono text-sm"
                                        placeholder="Write your note in Markdown... # Heading, **bold**, - list"
                                        minLength={5}
                                        required
                                    />
                                </>
                            )}

                            {previewMode && (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[200px] prose prose-sm dark:prose-invert max-w-none overflow-y-auto">
                                    {note.description ? (
                                        <p className="text-white">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {note.description}
                                            </ReactMarkdown>
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 italic">Nothing to preview yet...</p>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                                <span>Minimum 5 characters required.</span>
                                <span>Markdown Supported <svg className="inline w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z" clipRule="evenodd"/></svg></span>
                            </p>
                        </div>

                        {/* Tag Field */}
                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                            <input list="datalistOptions" name="tag" id="tag" value={note.tag} onChange={onchange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 outline-none" placeholder="Select or type a tag" minLength={2} required />
                            <datalist id="datalistOptions" className="bg-white dark:bg-gray-700">{allTags.map((tag, index) => (<option key={index} value={tag}/>))}</datalist>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
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
                            Click template buttons (Meeting, Daily, Checklist) to auto-fill note structure
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Tags help organize and categorize your notes effectively
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            All fields require at least 5 characters for better note quality
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}