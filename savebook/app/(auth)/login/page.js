"use client";

import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

/* =========================
   Login Form Component
========================= */
const LoginForm = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //  Recovery modal state
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated || isLoading) return;

    console.log("➡️ SUBMIT CLICKED");
    console.log("➡️ Username:", credentials.username);

    setIsLoading(true);

    try {
      const result = await login(
        credentials.username,
        credentials.password
      );

      
      console.log("🧠 LOGIN RESULT FROM AuthProvider 👉", result);

      if (result.success) {
        toast.success("Welcome back! 🎉");

        
        console.log("recoveryCodes value ", result.recoveryCodes);

        if (result.recoveryCodes && result.recoveryCodes.length > 0) {
          console.log("SHOWING RECOVERY MODAL");
          setRecoveryCodes(result.recoveryCodes);
          setShowRecoveryModal(true);
        } else {
          console.log(" NO RECOVERY CODES → DIRECT REDIRECT");
          router.push("/notes");
        }
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(" Login error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onchange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <LoginFormSkeleton />;

  return (
    <>
      {/* ===== Login Form ===== */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={onchange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={onchange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* ===== Recovery Codes Modal ===== */}
      {showRecoveryModal && recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-3">
              Save your recovery codes
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-center text-white font-mono"
                >
                  {code}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                console.log("✅ MODAL CLOSED → REDIRECT");
                setShowRecoveryModal(false);
                router.push("/notes");
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              I have saved these codes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* =========================
   Skeleton
========================= */
const LoginFormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-12 bg-gray-700 rounded"></div>
    <div className="h-12 bg-gray-700 rounded"></div>
    <div className="h-12 bg-gray-700 rounded"></div>
  </div>
);

/* =========================
   Page Wrapper
========================= */
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your account
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
