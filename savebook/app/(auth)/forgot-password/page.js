"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => router.push("/reset-password"), 1200);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
          <p className="mt-2 text-gray-300">
            Enter your username to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-required="true"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your username"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-live="polite"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {loading ? "Checking..." : "Continue"}
            </button>

            {message && (
              <p role="alert" className="text-sm text-center text-gray-300">
                {message}
              </p>
            )}

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline rounded-sm"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}