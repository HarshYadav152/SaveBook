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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={onchange}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={onchange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </form>

      {/* ========== RECOVERY CODES MODAL ========== */}
      {showRecoveryModal && recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
