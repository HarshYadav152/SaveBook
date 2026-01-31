"use client";
import noteContext from '@/context/noteContext';
import React, { useContext, useState } from 'react';
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
    "General", "Basic", "Finance", "Grocery", "Office",
    "Personal", "Work", "Ideas"
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

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return Array.isArray(data.imageUrls) ? data.imageUrls : [];
  };

  // Handle audio recording
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
      console.error('Audio upload error:', { status: res.status, error: errorMessage });
      throw new Error(`Audio upload failed: ${errorMessage}`);
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
      const imageUrls = images.length ? await uploadImages() : [];

      let finalAudioData = null;
      if (audioBlob) {
        setIsUploadingAudio(true);
        try {
          finalAudioData = await uploadAudio(audioBlob);
        } catch (audioError) {
          console.error('Audio upload error:', audioError);
          toast.error(audioError.message || 'Audio upload failed. Please try again.');
          return;
        }
      }

      await addNote(
        note.title,
        note.description,
        note.tag,
        imageUrls,
        finalAudioData
      );

      toast.success("Note has been saved");
      setNote({ title: "", description: "", tag: "" });
      setImages([]);
      setPreview([]);
      clearAudioRecording();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.message || "Failed to save note. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploadingAudio(false);
    }
  };

  // Corrected handler name
  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Template handling
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
  };

  const confirmTemplateChange = () => {
    if (pendingTemplate) {
      setNote({ ...note, description: pendingTemplate.content });
      toast.success(`${pendingTemplate.key.charAt(0).toUpperCase() + pendingTemplate.key.slice(1)} template applied!`);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPendingTemplate(null);
  };

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
                onChange={handleChange}
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
                <span className="text-xs text-gray-600 dark:text-gray-400">Quick Templates:</span>
              </div>

              {/* Template Buttons */}
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => applyTemplate('meeting')} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  Meeting
                </button>
                <button type="button" onClick={() => applyTemplate('journal')} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  Daily
                </button>
                <button type="button" onClick={() => applyTemplate('checklist')} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  Checklist
                </button>
              </div>

              <textarea
                name="description"
                id="description"
                rows="6"
                value={note.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Write your note content here..."
                minLength={5}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 5 characters required. Click template buttons to auto-fill with pre-formatted structures.
              </p>
            </div>

            {/* Audio Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attach Audio (Optional)</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Recording */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  {!recordedAudioUrl ? (
                    <AudioRecorder onRecordingComplete={handleAudioRecorded} />
                  ) : (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <audio controls src={recordedAudioUrl} className="w-full h-8 mb-2" />
                      <button type="button" onClick={clearAudioRecording} className="w-full text-xs px-2 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  {audioBlob ? (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-400">File ready</p>
                      <button type="button" onClick={() => setAudioBlob(null)} className="w-full text-xs px-2 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded mt-2">
                        Clear Selection
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input type="file" id="audioFile" accept="audio/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) setAudioBlob(file); }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attach Images</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              {preview.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {preview.map((src, index) => (
                    <img key={index} src={src} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>

            {/* Tag Field */}
            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
              <input
                list="datalistOptions"
                name="tag"
                id="tag"
                value={note.tag}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Select or type a tag"
                minLength={2}
                required
              />
              <datalist id="datalistOptions">
                {allTags.map((tag, index) => <option key={index} value={tag} />)}
              </datalist>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || isUploadingAudio}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg"
            >
              {isSubmitting || isUploadingAudio ? (isUploadingAudio ? "Uploading Audio..." : "Adding Note...") : "Add Note"}
            </button>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">Quick Tips</h3>
          <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-2">
            <li>• Use descriptive titles to easily find your notes later</li>
            <li>• Click template buttons to auto-fill note structure</li>
            <li>• Tags help organize and categorize your notes effectively</li>
            <li>• All fields require at least 5 characters for better note quality</li>
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
            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border rounded-lg">Cancel</button>
            <button onClick={confirmTemplateChange} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Confirm Replacement</button>
          </>
        }
      >
        <p>Are you sure you want to replace your current note content with the <span className="font-semibold">{pendingTemplate?.key}</span> template?</p>
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">⚠️ This action cannot be undone.</p>
      </Modal>
    </div>
  );
}