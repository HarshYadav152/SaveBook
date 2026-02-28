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

// Define Note Templates with Math and Tables
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
    const [audioData, setAudioData] = useState(null);
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
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Audio upload failed');
        }

        const data = await res.json();
        return { url: data.audioUrl, duration: data.duration || 0 };
    };

    const clearAudioRecording = () => {
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        setAudioBlob(null);
        setRecordedAudioUrl(null);
        setAudioData(null);
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
            toast.success(`${templateKey} template applied!`);
        } else {
            setPendingTemplate({ key: templateKey, content: template });
            setShowModal(true);
        }
    }

    const confirmTemplateChange = () => {
        if (pendingTemplate) {
            setNote({ ...note, description: pendingTemplate.content });
            toast.success(`${pendingTemplate.key} template applied!`);
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
        h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2 text-white border-b border-gray-700 pb-1" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2 text-white" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-md font-bold my-1 text-white" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1 pl-1 text-gray-300" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 space-y-1 pl-1 text-gray-300" {...props} />,
        li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
        p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-gray-300" {...props} />,
        strong: ({node, ...props}) => <strong className="font-bold text-gray-100" {...props} />,
        em: ({node, ...props}) => <em className="italic text-gray-200" {...props} />,
        a: ({node, ...props}) => <a className="text-blue-400 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-600 pl-4 my-2 italic text-gray-400" {...props} />,
        code: ({node, inline, className, children, ...props}) => {
             return inline ? 
                <code className="bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-pink-300" {...props}>{children}</code> :
                <code className="block bg-gray-800 rounded p-2 text-sm font-mono overflow-x-auto text-gray-200 my-2" {...props}>{children}</code>
        },
        table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-600" {...props} />
            </div>
        ),
        thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
        tbody: ({node, ...props}) => <tbody className="bg-gray-900" {...props} />,
        tr: ({node, ...props}) => <tr className="border-b border-gray-700" {...props} />,
        th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-white" {...props} />,
        td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2 text-gray-300" {...props} />,
    };

    const insertMarkdown = (syntax) => {
        const examples = {
            math: '$$\nE = mc^2\n$$',
            table: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
        };
        setNote({ ...note, description: note.description + '\n\n' + examples[syntax] + '\n\n' });
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
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
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
                                    <button type="button" onClick={() => insertMarkdown('math')} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                                        ∑ Math
                                    </button>
                                    <button type="button" onClick={() => insertMarkdown('table')} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                        ⊞ Table
                                    </button>
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button type="button" onClick={() => setPreviewMode(false)} className={`px-3 py-1 text-xs rounded ${!previewMode ? 'bg-white dark:bg-gray-600 text-blue-600' : 'text-gray-500'}`}>
                                            Write
                                        </button>
                                        <button type="button" onClick={() => setPreviewMode(true)} className={`px-3 py-1 text-xs rounded ${previewMode ? 'bg-white dark:bg-gray-600 text-blue-600' : 'text-gray-500'}`}>
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {!previewMode && (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <button type="button" onClick={() => applyTemplate('meeting')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                                            📅 Meeting
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('journal')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                                            📔 Journal
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('checklist')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                                            ✓ Checklist
                                        </button>
                                        <button type="button" onClick={() => applyTemplate('study')} className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg font-medium">
                                            📚 Study Notes
                                        </button>
                                    </div>

                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="8"
                                        value={note.description}
                                        onChange={onchange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none font-mono text-sm"
                                        placeholder="Write in Markdown... Use $E=mc^2$ for inline math or $$...$$  for block math"
                                        minLength={5}
                                        required
                                    />
                                </>
                            )}

                            {previewMode && (
                                <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[200px] overflow-y-auto">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Attach Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {preview.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {preview.map((src, index) => (
                                        <img key={index} src={src} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
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
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                            />
                            {attachmentPreviews.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {attachmentPreviews.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                            <span className="text-2xl">📄</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                                <p className="text-xs text-gray-500">{file.size} MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                            <input list="datalistOptions" name="tag" id="tag" value={note.tag} onChange={onchange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" placeholder="Select or type a tag" minLength={2} required />
                            <datalist id="datalistOptions">{allTags.map((tag, index) => (<option key={index} value={tag}/>))}</datalist>
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all"
                        >
                            {isSubmitting ? 'Saving...' : 'Add Note'}
                        </button>
                    </form>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">📚 Study Notes Features</h3>
                    <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-2">
                        <li>• <strong>Math:</strong> Use $E=mc^2$ for inline or $$...$$ for block formulas</li>
                        <li>• <strong>Tables:</strong> Create comparison tables with | Header | syntax</li>
                        <li>• <strong>Images:</strong> Upload diagrams and screenshots</li>
                        <li>• <strong>PDFs:</strong> Attach reference materials and documents</li>
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Replace Content?"
                footer={
                    <>
                        <button onClick={handleCloseModal} className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border rounded-lg">Cancel</button>
                        <button onClick={confirmTemplateChange} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">Confirm</button>
                    </>
                }
            >
                <p>Replace current content with {pendingTemplate?.key} template?</p>
            </Modal>
        </div>
    )
}
