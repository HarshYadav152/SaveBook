"use client";

import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

/* =========================
   Login Form
========================= */
const LoginForm = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //  Recovery Codes
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  /* -------------------------
     Redirect after login
  ------------------------- */
  useEffect(() => {
    if (
      isAuthenticated &&
      !loading &&
      !hasRedirected &&
      !showRecoveryModal
    ) {
      setHasRedirected(true);
      router.push("/notes");
    }
  }, [isAuthenticated, loading, hasRedirected, showRecoveryModal, router]);

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isAuthenticated) return;

    setIsLoading(true);

    try {
      const result = await login(
        credentials.username,
        credentials.password
      );

      if (result.success) {
        toast.success("Welcome back! 🎉");

        // First login show recovery codes
        if (result.recoveryCodes && result.recoveryCodes.length > 0) {
          setRecoveryCodes(result.recoveryCodes);
          setShowRecoveryModal(true);
        }
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------
     Helpers
  ------------------------- */
  const onchange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(recoveryCodes.join("\n"));
    toast.success("Recovery codes copied");
  };

  const handleDownload = () => {
    const blob = new Blob([recoveryCodes.join("\n")], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "savebook-recovery-codes.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  if (loading) return <LoginFormSkeleton />;

  return (
    <>
      {/* ========== LOGIN FORM ========== */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={onchange}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="Enter username or email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={onchange}
              required
              aria-required="true"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-800 px-2 text-gray-400">Or continue with</span></div>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = "/api/auth/github"}
          className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          Continue with GitHub
        </button>

        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </form>

      {/* ========== RECOVERY CODES MODAL ========== */}
      {showRecoveryModal && recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md focus:outline-none" tabIndex="-1">
            <h3 id="recovery-title" className="text-xl font-semibold text-white mb-3">
              Save your recovery codes
            </h3>

            <p className="text-sm text-gray-300 mb-4">
              These codes will be shown only once.
              Save them securely.
            </p>

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

            {/* Copy + Download */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
              >
                Download
              </button>
            </div>

            <button
              onClick={() => setShowRecoveryModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
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
export default function LoginPage() {
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
}
