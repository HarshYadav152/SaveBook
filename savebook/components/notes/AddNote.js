"use client"
import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Modal from '../common/Modal';
import AudioRecorder from '@/components/AudioRecorder';

// Define Note Templates
const NOTE_TEMPLATES = {
    meeting: `Date: [Insert Date]\n\nAttendees: [List attendees]\n\nAgenda:\n- \n- \n- \n\nNotes:\n\nAction Items:\n- [ ] \n- [ ] `,
    journal: `**What happened today:**\n[Write your experiences here]\n\n**Goals for tomorrow:**\n1. [List your goals]\n\n**Gratitude:**\n> [Write things you're grateful for]`,
    checklist: `## Project: [Project Name]\n\n**Tasks:**\n- [ ] Define project goal\n- [ ] List all tasks\n- [ ] Assign owners\n- [ ] Set deadlines\n- [ ] Plan resources\n- [ ] Review progress\n- [ ] Complete project`,
    study: `# [Subject] - Chapter [X]\n\n## Key Concepts\n\n### Formula 1\n$$\nE = mc^2\n$$\n\n## Comparison Table\n\n| Concept | Definition | Example |\n|---------|------------|----------|\n| Term 1  | Def 1      | Ex 1     |\n| Term 2  | Def 2      | Ex 2     |\n\n## Notes\n\n`
};

export default function Addnote() {
    const context = useContext(noteContext);
    const { addNote, notes } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState(null);

    const defaultTags = ["General", "Basic", "Finance", "Grocery", "Office", "Personal", "Work", "Ideas", "Study"];

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);

    const [audioBlob, setAudioBlob] = useState(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreview(files.map(file => URL.createObjectURL(file)));
    };

    const handleAttachmentChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files);
        setAttachmentPreviews(files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            type: file.type
        })));
    };

    const uploadImages = async () => {
        if (!images.length) return [];
        const formData = new FormData();
        images.forEach((file) => formData.append("image", file));

        const res = await fetch("/api/upload/user-media", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        return Array.isArray(data.imageUrls) ? data.imageUrls : [];
    };

    const uploadAttachments = async () => {
        if (!attachments.length) return [];
        const formData = new FormData();
        attachments.forEach((file) => formData.append("attachment", file));

        const res = await fetch("/api/upload/attachments", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!res.ok) throw new Error("Attachment upload failed");
        const data = await res.json();
        return data.attachments || [];
    };

    const handleAudioRecorded = (blob) => {
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
    };

    const uploadAudio = async (blob) => {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        const res = await fetch('/api/upload/audio', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!res.ok) {
            let errorMessage = `HTTP ${res.status}`;
            const contentType = res.headers.get('content-type');
            try {
                if (contentType?.includes('application/json')) {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } else {
                    const errorText = await res.text();
                    errorMessage = errorText.slice(0, 200) || errorMessage;
                }
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
            }
            throw new Error(`Audio upload failed: ${errorMessage}`);
        }

        const data = await res.json();
        return { url: data.audioUrl, duration: data.duration || 0 };
    };

    const clearAudioRecording = () => {
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        setAudioBlob(null);
        setRecordedAudioUrl(null);
    };

    const handleSaveNote = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const imageUrls = await uploadImages();
            const attachmentData = await uploadAttachments();

            let finalAudioData = null;
            if (audioBlob) {
                setIsUploadingAudio(true);
                finalAudioData = await uploadAudio(audioBlob);
            }

            await addNote(
                note.title,
                note.description,
                note.tag,
                imageUrls,
                finalAudioData,
                attachmentData
            );

            toast.success("Note saved successfully!");
            setNote({ title: "", description: "", tag: "" });
            setImages([]);
            setPreview([]);
            setAttachments([]);
            setAttachmentPreviews([]);
            setPreviewMode(false);
            clearAudioRecording();
        } catch (error) {
            toast.error(error.message || "Failed to save note");
        } finally {
            setIsSubmitting(false);
            setIsUploadingAudio(false);
        }
    };

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    const applyTemplate = (templateKey) => {
        const template = NOTE_TEMPLATES[templateKey];
        if (!template) return;

        if (!note.description.trim()) {
            setNote({ ...note, description: template });
            toast.success(`${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} template applied!`);
        } else {
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

    const userTags = Array.from(new Set((Array.isArray(notes) ? notes : []).map(note => note.tag).filter(tag => tag && tag.trim() !== "")));
    const allTags = Array.from(new Set([...defaultTags, ...userTags]));
    const isFormValid = note.title.length >= 5 && note.description.length >= 5 && note.tag.length >= 2;

    const customRenderers = {
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-2 text-white border-b border-gray-700 pb-1" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2 text-white" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold my-1 text-white" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1 pl-1 text-gray-300" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1 pl-1 text-gray-300" {...props} />,
        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-gray-300" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-gray-100" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-gray-200" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 my-2 italic text-gray-400" {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
            return inline ?
                <code className="bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-pink-300" {...props}>{children}</code> :
                <code className="block bg-gray-800 rounded p-2 text-sm font-mono overflow-x-auto text-gray-200 my-2" {...props}>{children}</code>
        },
        table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-600" {...props} />
            </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
        tbody: ({ node, ...props }) => <tbody className="bg-gray-900" {...props} />,
        tr: ({ node, ...props }) => <tr className="border-b border-gray-700" {...props} />,
        th: ({ node, ...props }) => <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-white" {...props} />,
        td: ({ node, ...props }) => <td className="border border-gray-600 px-4 py-2 text-gray-300" {...props} />,
    };

    const insertSyntax = (syntax) => {
        const syntaxMap = {
            math: '$$\nE = mc^2\n$$',
            table: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
        };
        setNote({ ...note, description: note.description + (note.description.length ? '\n\n' : '') + syntaxMap[syntax] + '\n\n' });
        toast.success(`${syntax} template inserted!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 p-2">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Notebook on the Cloud
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your notes with Math, Tables, Images & PDFs
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                        Add New Note
                    </h2>

                    <form onSubmit={handleSaveNote} className="space-y-6">
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
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all"
                                placeholder="Enter note title"
                                minLength={5}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => insertSyntax('math')} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 transition-colors">
                                        ∑ Math
                                    </button>
                                    <button type="button" onClick={() => insertSyntax('table')} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 transition-colors">
                                        ⊞ Table
                                    </button>
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button type="button" onClick={() => setPreviewMode(false)} className={`px-3 py-1 text-xs rounded transition-all ${!previewMode ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                                            Write
                                        </button>
                                        <button type="button" onClick={() => setPreviewMode(true)} className={`px-3 py-1 text-xs rounded transition-all ${previewMode ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {!previewMode && (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <button type="button" onClick={() => applyTemplate('meeting')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            📅 Meeting
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('journal')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            📔 Journal
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('checklist')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            ✓ Checklist
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('study')} className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg font-medium transition-colors">
                                            📚 Study
                                        </button>
                                    </div>

                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="8"
                                        value={note.description}
                                        onChange={onchange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none font-mono text-sm"
                                        placeholder="Write in Markdown... Use $E=mc^2$ or $$...$$ for math"
                                        minLength={5}
                                        required
                                    />
                                </>
                            )}

                            {previewMode && (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[200px] overflow-y-auto max-w-none">
                                    {note.description ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={customRenderers}
                                        >
                                            {note.description}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-gray-400 italic">Nothing to preview...</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Attach Images
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                                />
                                {preview.length > 0 && (
                                    <div className="flex gap-3 mt-3 flex-wrap">
                                        {preview.map((src, index) => (
                                            <img key={index} src={src} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-300" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Attach PDFs
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    multiple
                                    onChange={handleAttachmentChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all"
                                />
                                {attachmentPreviews.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {attachmentPreviews.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                                                <span className="text-xl">📄</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                                                    <p className="text-[10px] text-gray-500">{file.size} MB</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Audio Recording (Optional)
                            </label>
                            <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/30">
                                {!recordedAudioUrl ? (
                                    <AudioRecorder onRecordingComplete={handleAudioRecorded} />
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-xs font-medium text-green-700 dark:text-green-400">Recording Ready</p>
                                        </div>
                                        <audio controls src={recordedAudioUrl} className="w-full h-10" />
                                        <button type="button" onClick={clearAudioRecording} className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline">
                                            Remove Recording
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                            <input list="datalistOptions" name="tag" id="tag" value={note.tag} onChange={onchange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" placeholder="Select or type a tag" minLength={2} required />
                            <datalist id="datalistOptions">{allTags.map((tag, index) => (<option key={index} value={tag} />))}</datalist>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting || isUploadingAudio}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isUploadingAudio ? 'Uploading Audio...' : 'Saving Note...'}
                                </span>
                            ) : (
                                'Add Note'
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Study Enhancements enabled
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="font-bold">∑</span>
                            <span><strong>Math:</strong> Render complex formulas using LaTeX syntax. Use <code>$equation$</code> for inline and <code>$$equation$$</code> for blocks.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">⊞</span>
                            <span><strong>Tables:</strong> Create organized comparison tables using standard Markdown format.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">📄</span>
                            <span><strong>PDFs:</strong> Attach textbooks, research papers, or assignment briefs (up to 10MB per file).</span>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Replace Content?"
                footer={
                    <div className="flex gap-2">
                        <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={confirmTemplateChange} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Confirm Replacement</button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">Are you sure you want to replace your current note content with the <span className="font-bold text-blue-600">{pendingTemplate?.key}</span> template?</p>
                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">⚠️ This action cannot be undone and your current text will be lost.</p>
                </div>
            </Modal>
        </div>
    )
}




