"use client";

import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

/* =========================
   Login Form
========================= */
const LoginForm = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Recovery Codes
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && !loading && !hasRedirected && !showRecoveryModal) {
      setHasRedirected(true);
      router.push("/notes");
    }
  }, [isAuthenticated, loading, hasRedirected, showRecoveryModal, router]);

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleCopy = async () => {
    if (!recoveryCodes) return;
    await navigator.clipboard.writeText(recoveryCodes.join("\n"));
    toast.success("Recovery codes copied");
  };

  const handleDownload = () => {
    if (!recoveryCodes) return;
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savebook-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isAuthenticated) return;

    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const newErrors = {};
    if (!credentials.username.trim()) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(credentials.username, credentials.password, rememberMe);

      if (result.success) {
        setSuccessMessage("Login successful! Redirecting...");
        toast.success("Welcome back! 🎉");

        if (result.recoveryCodes && result.recoveryCodes.length > 0) {
          setRecoveryCodes(result.recoveryCodes);
          setShowRecoveryModal(true);
        } else {
          router.push("/notes");
        }
      } else {
        setSuccessMessage("");
        // Always show generic error message from backend
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <LoginFormSkeleton />;

  return (
    <>
      {/* ========== LOGIN FORM ========== */}
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={credentials.username}
            onChange={onChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 border ${
              errors.username ? "border-red-500" : "border-gray-600"
            } bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your username"
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={onChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 pr-10`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
            Remember me
          </label>
        </div>

        {/* Inline messages */}
        {errorMessage && (
          <p className="text-red-400 text-sm font-medium text-center mb-2">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-400 text-sm font-medium text-center mb-2">{successMessage}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || isAuthenticated}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* Sign up link */}
        <div className="text-center">
          <span className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Register
            </Link>
          </span>
        </div>
      </form>

      {/* ========== RECOVERY CODES MODAL ========== */}
      {showRecoveryModal && recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-3">Save your recovery codes</h3>
            <p className="text-sm text-gray-300 mb-4">
              These codes will be shown only once. Save them securely.
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
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to your account</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}