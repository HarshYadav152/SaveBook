"use client";
import { useState } from "react";
import { Bookmark } from "lucide-react"; // Using Lucide icon
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BookmarkButton({ resourceId, initialBookmarked }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsBookmarked(data.action === "added");
        toast.success(
          data.action === "added" ? "Added to Bookmarks" : "Removed from Bookmarks"
        );
        router.refresh(); // Refresh to update UI if needed
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked ? "text-yellow-500 hover:bg-yellow-100" : "text-gray-400 hover:bg-gray-100"
      }`}
      title={isBookmarked ? "Remove Bookmark" : "Bookmark this"}
    >
      <Bookmark
        size={20}
        fill={isBookmarked ? "currentColor" : "none"} // Fills the icon if bookmarked
      />
    </button>
  );
}