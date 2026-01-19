import noteContext from '@/context/noteContext';
import React, { useContext, useState, useMemo } from 'react'
import LinkPreviewCard from './LinkPreviewCard';
import toast from 'react-hot-toast';

export default function NoteItem(props) {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteNote(note._id);
            toast.success("Note deleted successfully 🗑️");
        } catch (error) {
            toast.error("Failed to delete note");
        } finally {
            setIsDeleting(false);
        }
    }

    const handleEdit = () => {
        updateNote(note);
    }

    // Enhanced tag colors with better dark mode variants
    const getTagColor = (tag) => {
        const tagColors = {
            'General': { bg: 'bg-blue-500', text: 'text-blue-100' },
            'Basic': { bg: 'bg-gray-500', text: 'text-gray-100' },
            'Finance': { bg: 'bg-green-500', text: 'text-green-100' },
            'Grocery': { bg: 'bg-orange-500', text: 'text-orange-100' },
            'Office': { bg: 'bg-purple-500', text: 'text-purple-100' },
            'Personal': { bg: 'bg-pink-500', text: 'text-pink-100' },
            'Work': { bg: 'bg-indigo-500', text: 'text-indigo-100' },
            'Ideas': { bg: 'bg-teal-500', text: 'text-teal-100' }
        };
        return tagColors[tag] || { bg: 'bg-blue-500', text: 'text-blue-100' };
    };

    // Format date with relative time -with error handling
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Unknown date';

            const now = new Date();

            // Compare calendar dates in LOCAL timezone
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const noteDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const diffTime = today - noteDay;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        } catch (err) {
            console.error("Date formatting error:", err);
            return 'Unknown date';
        }
    };


    // Calculate reading time - with error handling
    const getReadingTime = (text) => {
        try {
            if (!text) return '< 1 min';

            const wordsPerMinute = 200;
            const wordCount = text.split(/\s+/).length || 0;
            const readingTime = Math.ceil(wordCount / wordsPerMinute);
            return readingTime < 1 ? '< 1 min' : `${readingTime} min read`;
        } catch (error) {
            console.error("Reading time calculation error:", error);
            return '< 1 min';
        }
    };

    // Safely calculate description length and word count
    const descriptionLength = note?.description?.length || 0;
    const wordCount = note?.description ? note.description.split(/\s+/).filter(Boolean).length : 0;

    // Safely get tag color
    const tagColor = getTagColor(note?.tag || 'General');

    // Extract URLs from description
    const noteUrls = useMemo(() => {
        if (!note?.description) return [];
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return note.description.match(urlRegex) || [];
    }, [note?.description]);

    return (
        <>
            <div className="group relative">
                <div className="relative bg-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02]">

                    {/* Header with Gradient */}
                    <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 relative">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 flex-1 pr-2">
                                {note?.title || 'Untitled Note'}
                            </h3>

                            {/* Tag moved to top right corner */}
                            <div className="flex-shrink-0">
                                <span className={`${tagColor.bg} ${tagColor.text} px-2 py-1 rounded-md text-xs font-medium`}>
                                    {note?.tag || 'General'}
                                </span>
                            </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center space-x-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{getReadingTime(note?.description)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{wordCount} words</span>
                            </div>
                        </div>
                    </div>

                    {/* Body  */}
                    <div className="p-5 relative z-10">
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 min-h-[84px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 relative z-10 whitespace-pre-wrap">
                            {note?.description ? (
                                note.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                                    part.match(/https?:\/\/[^\s]+/) ? (
                                        <a
                                            key={i}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors z-20 relative font-medium"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {part}
                                        </a>
                                    ) : (
                                        <span key={i}>{part}</span>
                                    )
                                ))
                            ) : (
                                'No description provided. Click edit to add content to this note.'
                            )}
                        </p>

                        {/* Images */}
                        {Array.isArray(note?.images) && note.images.length > 0 && (
                            <div className="mt-4 flex gap-3 flex-wrap">
                                {note.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 hover:scale-105 transition-transform duration-300 cursor-pointer group/img"
                                        onClick={() => setPreviewImage(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={`note image ${index + 1}`}
                                            loading="lazy"
                                            className="w-24 h-24 object-cover"
                                        />
                                        {/* Preview */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Link Previews */}
                        {noteUrls.map((url, index) => (
                            <div key={index} className="relative z-20" onClick={(e) => e.stopPropagation()}>
                                <LinkPreviewCard url={url} />
                            </div>
                        ))}

                        {/* Audio */}
                        {note?.audio && note.audio.url && (
                            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                    </svg>
                                    Audio Recording
                                </p>
                                <audio
                                    controls
                                    src={note.audio.url}
                                    className="w-full"
                                    style={{ maxHeight: '32px' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Enhanced Footer */}
                    <div className="px-5 py-4 bg-gray-800/50 border-t border-gray-700 backdrop-blur-sm relative z-10">
                        {/* Action Buttons with Enhanced Design */}
                        <div className="flex justify-between items-center mb-3">
                            <button
                                onClick={handleEdit}
                                disabled={isDeleting}
                                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-all duration-200 group/edit disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 group-hover/edit:bg-blue-500/20 border border-blue-500/20 group-hover/edit:border-blue-500/30 transition-all duration-200 group-hover/edit:scale-110">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">Edit</span>
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-all duration-200 group/delete disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 group-hover/delete:bg-red-500/20 border border-red-500/20 group-hover/delete:border-red-500/30 transition-all duration-200 group-hover/delete:scale-110">
                                    {isDeleting ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </span>
                            </button>
                        </div>

                        {/* Enhanced*/}
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-lg border border-gray-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{note?.date ? formatDate(note.date) : 'Unknown'}</span>
                                </div>
                            </div>

                            {/* Character Count */}
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-lg border border-gray-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{descriptionLength.toLocaleString()} chars</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 rounded-2xl transition-all duration-300 pointer-events-none" />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none -z-10" />
            </div>

            {/* Image Preview      */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
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
        </>
    );
}