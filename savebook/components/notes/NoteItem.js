"use client";

import React, { useContext, useMemo, useState } from "react";
import noteContext from "@/context/noteContext";
import { decrypt } from "@/lib/utils/crypto";
import toast from "react-hot-toast";
import LinkPreviewCard from "./LinkPreviewCard";

export default function NoteItem({ note, updateNote }) {
  const { deleteNote } = useContext(noteContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /* 🔐 Decryption */
  const secret =
    typeof window !== "undefined"
      ? localStorage.getItem("encryptionKey")
      : null;

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

  /* Counts */
  const descriptionLength =
    typeof decryptedDescription === "string"
      ? decryptedDescription.length
      : 0;

  const wordCount = decryptedDescription
    ? decryptedDescription.split(/\s+/).filter(Boolean).length
    : 0;

  /* URLs */
  const noteUrls = useMemo(() => {
    if (!decryptedDescription) return [];
    return decryptedDescription.match(/https?:\/\/[^\s]+/g) || [];
  }, [decryptedDescription]);

  /* Tag color */
  const getTagColor = (tag) => {
    const colors = {
      General: { bg: "bg-blue-500", text: "text-blue-100" },
      Work: { bg: "bg-indigo-500", text: "text-indigo-100" },
      Personal: { bg: "bg-pink-500", text: "text-pink-100" },
      Finance: { bg: "bg-green-500", text: "text-green-100" },
    };
    return colors[tag] || colors.General;
  };

  const tagColor = getTagColor(note?.tag || "General");

  /* Actions */
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

  const handleEdit = () => {
    updateNote({
      ...note,
      title: decryptedTitle,
      description: decryptedDescription,
    });
  };

  return (
    <div className="group relative bg-gray-900 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-700 flex justify-between items-start">
        <h3 className="text-white font-bold text-lg line-clamp-2">
          {decryptedTitle || "Untitled Note"}
        </h3>
        <span
          className={`${tagColor.bg} ${tagColor.text} px-2 py-1 rounded text-xs`}
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

        {/* Images */}
        {Array.isArray(note?.images) && note.images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {note.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="note"
                className="w-24 h-24 object-cover rounded cursor-pointer"
                onClick={() => setPreviewImage(img)}
              />
            ))}
          </div>
        )}

        {/* Link previews */}
        {noteUrls.map((url, i) => (
          <LinkPreviewCard key={i} url={url} />
        ))}

        {/* Audio */}
        {note?.audio?.url && (
          <audio controls src={note.audio.url} className="w-full mt-2" />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 flex justify-between text-sm text-gray-400">
        <span>{wordCount} words • {descriptionLength} chars</span>

        <div className="space-x-4">
          <button
            onClick={handleEdit}
            className="text-blue-400 hover:underline"
          >
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