
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LinkPreviewCard from "@/components/notes/LinkPreviewCard";
import { Loader2 } from "lucide-react";

export default function SharedNotePage() {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`/api/public/notes/${id}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error("Note not found");
                    if (response.status === 403) throw new Error("This note is private");
                    throw new Error("Failed to load note");
                }
                const data = await response.json();
                setNote(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNote();
        }
    }, [id]);

    const customRenderers = {
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-2 text-white border-b border-gray-700 pb-1" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2 text-white" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold my-1 text-white" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1 pl-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1 pl-1" {...props} />,
        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 my-2 italic text-gray-400" {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
            return inline ?
                <code className="bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-pink-300" {...props}>{children}</code> :
                <code className="block bg-gray-800 rounded p-2 text-sm font-mono overflow-x-auto text-gray-200 my-2" {...props}>{children}</code>
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Unavailable</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <a href="/" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 mt-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {note.title}
                            </h1>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium w-fit">
                                {note.tag}
                            </span>
                        </div>
                        <div className="mt-4 text-sm text-gray-400 flex items-center gap-4">
                            <span>{new Date(note.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Public Note</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={customRenderers}
                            >
                                {note.description}
                            </ReactMarkdown>
                        </div>

                        {/* Images */}
                        {note.images && note.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                                {note.images.map((img, i) => (
                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                                        <img
                                            src={img}
                                            alt={`Note attachment ${i + 1}`}
                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Audio */}
                        {note.audio && note.audio.url && (
                            <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Audio Recording
                                </h3>
                                <audio controls src={note.audio.url} className="w-full" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 mb-4">Content shared via SaveBook</p>
                    <a href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <span>Create your own notes</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
