"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(" RESET SUBMIT CLICKED", {
      username,
      recoveryCode,
      password,
    });

    if (!username) {
      setMessage("Username is required");
      return;
    }

    if (!recoveryCode) {
      setMessage("Recovery code is required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          recoveryCode,
        }),
      });

      
      const data = await res.json();
      

      if (!res.ok) {
        setMessage(data.message || "Reset failed");
        return;
      }

      setMessage(data.message || "Password reset successful");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(" RESET PASSWORD ERROR", error);
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
          <h2 className="text-3xl font-extrabold text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your recovery code to set a new password
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Recovery Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recovery Code
              </label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono tracking-wider focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="XXXX-XXXX"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>

            {message && (
              <p className="text-sm text-center text-gray-300">
                {message}
              </p>
            )}

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:text-blue-300"
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
