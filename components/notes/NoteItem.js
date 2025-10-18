import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';

export default function NoteItem(props) {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Format date with relative time - with error handling
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Unknown date';
            }
            
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        } catch (error) {
            console.error("Date formatting error:", error);
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

    return (
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

                {/* Body with Enhanced Text Display */}
                <div className="p-5 relative z-10">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 min-h-[84px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 relative z-10">
                        {note?.description || 'No description provided. Click edit to add content to this note.'}
                    </p>
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

                    {/* Enhanced Date and Stats Row */}
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-gray-400">
                            <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-lg border border-gray-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{note?.date ? formatDate(note.date) : 'Unknown'}</span>
                            </div>
                        </div>
                        
                        {/* Enhanced Character Count */}
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

                {/* Enhanced Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-600 rounded-2xl transition-all duration-300 pointer-events-none" />
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none -z-10" />
        </div>
    );
}