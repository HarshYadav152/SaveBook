"use client";

import React, { useContext, useMemo, useState } from "react";
import noteContext from "@/context/noteContext";
import LinkPreviewCard from "./LinkPreviewCard";
import toast from "react-hot-toast";
import { decrypt } from "@/lib/utils/crypto";

export default function NoteItem({ note, updateNote }) {
  const { deleteNote } = useContext(noteContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // 🔐 Get encryption key
  const secret =
    typeof window !== "undefined"
      ? localStorage.getItem("encryptionKey")
      : null;

  // 🔓 Decrypt note
  let decryptedTitle = "🔒 Encrypted";
  let decryptedDescription = "🔒 Encrypted";

  try {
    if (secret) {
      decryptedTitle = decrypt(note?.title || "", secret);
      decryptedDescription = decrypt(note?.description || "", secret);
    }
  } catch (err) {
    console.error("Decryption failed:", err);
  }

  // 🏷 Tag colors
  const getTagColor = (tag) => {
    const colors = {
      General: "bg-blue-500",
      Basic: "bg-gray-500",
      Finance: "bg-green-500",
      Grocery: "bg-orange-500",
      Office: "bg-purple-500",
      Personal: "bg-pink-500",
      Work: "bg-indigo-500",
      Ideas: "bg-teal-500",
    };
    return colors[tag] || "bg-blue-500";
  };

  const wordCount = decryptedDescription
    ? decryptedDescription.split(/\s+/).filter(Boolean).length
    : 0;

  const noteUrls = useMemo(() => {
    if (!decryptedDescription) return [];
    return decryptedDescription.match(/https?:\/\/[^\s]+/g) || [];
  }, [decryptedDescription]);

  // 🗑 Delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(note._id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  // ✏️ Edit
  const handleEdit = () => {
    updateNote({
      ...note,
      title: decryptedTitle,
      description: decryptedDescription,
    });
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-700 flex justify-between items-start">
        <h3 className="text-white font-bold text-lg line-clamp-2">
          {decryptedTitle || "Untitled Note"}
        </h3>
        <span
          className={`${getTagColor(
            note?.tag
          )} text-white text-xs px-2 py-1 rounded`}
        >
          {note?.tag || "General"}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <p className="text-gray-300 text-sm whitespace-pre-wrap">
          {decryptedDescription ||
            "No description provided. Click edit to add content."}
        </p>

        <p className="text-xs text-gray-400">{wordCount} words</p>

        {/* Images */}
        {Array.isArray(note?.images) &&
          note.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="note"
              className="w-24 h-24 object-cover rounded cursor-pointer"
              onClick={() => setPreviewImage(img)}
            />
          ))}

        {/* Links */}
        {noteUrls.map((url, i) => (
          <LinkPreviewCard key={i} url={url} />
        ))}

        {/* Audio */}
        {note?.audio?.url && (
          <audio controls src={note.audio.url} className="w-full" />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 flex justify-between">
        <button onClick={handleEdit} className="text-blue-400 hover:underline">
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-400 hover:underline"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
}