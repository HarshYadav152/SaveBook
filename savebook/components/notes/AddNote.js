"use client"
import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import AudioRecorder from '@/components/AudioRecorder';
import AudioPlayer from '@/components/AudioPlayer';

// Define Note Templates
const NOTE_TEMPLATES = {
    meeting: `Date: [Insert Date]\n\nAttendees: [List attendees]\n\nAgenda:\n- \n- \n- \n\nNotes:\n\nAction Items:\n- \n- `,
    journal: `What happened today:\n[Write your experiences here]\n\nGoals for tomorrow:\n[List your goals]\n\nGratitude:\n[Write things you're grateful for]`,
    checklist: `Project: [Project Name]\n\nTasks:\n- [ ] Define project goal\n- [ ] List all tasks\n- [ ] Assign owners\n- [ ] Set deadlines\n- [ ] Plan resources\n- [ ] Review progress\n- [ ] Complete project`
};

export default function Addnote() {
    const context = useContext(noteContext);
    const { addNote, notes } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState(null);
    const defaultTags = [
        "General",
        "Basic",
        "Finance",
        "Grocery",
        "Office",
        "Personal",
        "Work",
        "Ideas"
    ];
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    
    // Audio state management
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages(files);
        setPreview(files.map(file => URL.createObjectURL(file)));
    };


    const uploadImages = async () => {
        const formData = new FormData();
        images.forEach((file) => formData.append("image", file));

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

    // Handle audio recording from AudioRecorder component
    const handleAudioRecorded = (blob) => {
        setAudioBlob(blob);
        // Create temporary URL for preview
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
    };

    // Upload audio to API
    const uploadAudio = async (blob) => {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        const res = await fetch('/api/upload/audio', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!res.ok) {
            // Log full error response for debugging
            let errorMessage = `HTTP ${res.status}`;
            const contentType = res.headers.get('content-type');
            
            try {
                // Try to parse as JSON first
                if (contentType?.includes('application/json')) {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } else {
                    // Fallback to text
                    const errorText = await res.text();
                    errorMessage = errorText.slice(0, 200) || errorMessage;
                }
            } catch (parseError) {
                // If parsing fails, use status code
                console.error('Failed to parse error response:', parseError);
            }
            
            console.error('Audio upload error:', { status: res.status, error: errorMessage });
            throw new Error(`Audio upload failed: ${errorMessage}`);
        }

        const data = await res.json();
        return {
            url: data.audioUrl,
            duration: data.duration || 0,
        };
    };

    // Clear audio recording
    const clearAudioRecording = () => {
        if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
        }
        setAudioBlob(null);
        setRecordedAudioUrl(null);
        setAudioData(null);
    };

    const handleSaveNote = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Upload images
            const imageUrls = images.length ? await uploadImages() : [];

            // Upload audio if recording exists - REQUIRED before note creation
            let finalAudioData = null;
            if (audioBlob) {
                setIsUploadingAudio(true);
                try {
                    finalAudioData = await uploadAudio(audioBlob);
                } catch (audioError) {
                    console.error('Audio upload error:', audioError);
                    toast.error(audioError.message || 'Audio upload failed. Please try again.');
                    // Abort note creation - do NOT save note without audio
                    return;
                }
            }

            // Save note with audio data (if available)
            await addNote(
                note.title,
                note.description,
                note.tag,
                imageUrls,
                finalAudioData // Pass audio data (or null)
            );

            toast.success("Note has been saved");
            setNote({ title: "", description: "", tag: "" });
            setImages([]);
            setPreview([]);
            clearAudioRecording(); // Only clear after successful save
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error(error.message || "Failed to save note. Please try again.");
        } finally {
            setIsSubmitting(false);
            setIsUploadingAudio(false);
        }
    };





    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    // Apply Template Handler
    const applyTemplate = (templateKey) => {
        const template = NOTE_TEMPLATES[templateKey];
        if (!template) return;

        // If description is empty, directly apply the template
        if (!note.description.trim()) {
            setNote({ ...note, description: template });
            toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied!`);
        } else {
            // If description has content, trigger modal
            setPendingTemplate({ key: templateKey, content: template });
            setShowModal(true);
        }
    }

    const confirmTemplateChange = () => {
        if (pendingTemplate) {
            setNote({ ...note, description: pendingTemplate.content });
            toast.success(`${pendingTemplate.key.charAt(0).toUpperCase() + pendingTemplate.key.slice(1)} template applied!`);
            handleCloseModal();
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setPendingTemplate(null);
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

                        {/* Description Field with Templates */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Quick Templates:
                                </span>
                            </div>

                            {/* Templates Row - Quick Start Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => applyTemplate('meeting')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    title="Auto-fill with Meeting Notes template"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Meeting
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyTemplate('journal')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    title="Auto-fill with Daily Journal template"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                                    </svg>
                                    Daily
                                </button>

                                <button
                                    type="button"
                                    onClick={() => applyTemplate('checklist')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 outline-none"
                                placeholder="Write your note content here... or click a template button above to get started!"
                                minLength={5}
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Minimum 5 characters required. Click template buttons to auto-fill with pre-formatted structures.
                            </p>
                        </div>
                        {/* Audio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Attach Audio (Optional)
                            </label>

                            {/* Audio Container - Two Column Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Recording Section */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col min-h-64">
                                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">🎤 Record</h3>
                                    
                                    <div className="flex-1 flex flex-col">
                                        {!recordedAudioUrl && (
                                            <div className="flex-1 flex items-center justify-center">
                                                <div className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                                    <AudioRecorder onRecordingComplete={handleAudioRecorded} />
                                                </div>
                                            </div>
                                        )}

                                        {recordedAudioUrl && (
                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center mt-0.5">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-green-700 dark:text-green-400">Recording ready</p>
                                                        </div>
                                                    </div>
                                                    <audio controls src={recordedAudioUrl} className="w-full h-8 mb-2" />
                                                    <button
                                                        type="button"
                                                        onClick={clearAudioRecording}
                                                        className="w-full text-xs px-2 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                {/* Upload Section */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col min-h-64">
                                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">📁 Upload</h3>
                                    
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        {audioBlob ? (
                                            // File Selected State
                                            <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center mt-0.5">
                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">File ready</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate break-all font-medium mt-1" title={audioBlob.name || 'Audio file'}>
                                                            {audioBlob.name || 'Audio file'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setAudioBlob(null)}
                                                    className="w-full text-xs px-2 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors font-medium mt-2"
                                                >
                                                    Clear Selection
                                                </button>
                                            </div>
                                        ) : (
                                            // Empty State with Drop Zone
                                            <div className="w-full">
                                                <label htmlFor="audioFile" className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                                    <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16m0 0l-3.5-3.5m3.5 3.5l3.5-3.5m-7-4.5h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h7m0-2v2m0 0h2m-2 0H8" />
                                                    </svg>
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Choose File</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">or drag and drop</p>
                                                </label>
                                                <input
                                                    type="file"
                                                    id="audioFile"
                                                    accept="audio/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setAudioBlob(file);
                                                    }}
                                                    className="hidden"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Attach Images
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />

                        {preview.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                            {preview.map((src, index) => (
                                <img
                                key={index}
                                src={src}
                                alt="preview"
                                className="w-24 h-24 object-cover rounded-lg border"
                                />
                            ))}
                            </div>
                        )}
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
                                minLength={2}
                                required
                            />
                            <datalist id="datalistOptions" className="bg-white dark:bg-gray-700">
                                {allTags.map((tag, index) => (
                                    <option
                                        key={index}
                                        value={tag}
                                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                ))}
                            </datalist>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Choose from suggestions or type your own (min. 2 chars)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting || isUploadingAudio}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            <span className="flex items-center justify-center">
                                {isSubmitting || isUploadingAudio ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isUploadingAudio ? 'Uploading Audio...' : 'Adding Note...'}
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
            {/* Confirmation Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Replace Content?"
                footer={
                    <>
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmTemplateChange}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                        >
                            Confirm Replacement
                        </button>
                    </>
                }
            >
                <div className="space-y-3">
                    <p>
                        Are you sure you want to replace your current note content with the
                        <span className="font-semibold text-blue-600 dark:text-blue-400"> {pendingTemplate?.key} </span>
                        template?
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                        ⚠️ This action cannot be undone. Your current description will be overwritten.
                    </p>
                </div>
            </Modal>
        </div>
    )
}



