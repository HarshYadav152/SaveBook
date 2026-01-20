"use client";

import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

/* =========================
   Login Form
========================= */
const LoginForm = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //  Recovery Codes
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && !loading && !hasRedirected) {
      setHasRedirected(true);
      router.push("/notes");
    }
  }, [isAuthenticated, loading, hasRedirected, router]);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");

    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await login(credentials.username, credentials.password, rememberMe);

      if (result.success) {
        setSuccessMessage("Logging in...");
        setErrorMessage("");
        // redirect handled by useEffect
      } else {
        setSuccessMessage("");
        setErrorMessage(result.message);
      }
    } catch (error) {
      // Removed console.error
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
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
          <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={credentials.password}
            onChange={onChange}
            className={`w-full px-4 py-3 border ${
              errors.password ? "border-red-500" : "border-gray-600"
            } bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 pr-10`}
            placeholder="Enter your password"
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
              value={credentials.password}
              onChange={onchange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
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
        disabled={isAuthenticated}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
      >
        {isAuthenticated ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0..."
              ></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Sign in"
        )}
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
  );
};