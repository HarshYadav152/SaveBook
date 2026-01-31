"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth/authContext";

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!credentials.username.trim()) newErrors.username = "Username is required";
    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGlobalMessage("All fields are required");
      return;
    }

    setErrors({});
    setGlobalMessage("");
    setIsLoading(true);

    try {
        const result = await register(credentials.username, credentials.password);
        if (result?.success) {
            setGlobalMessage({ text: "Account created successfully!", type: "success" });
            setTimeout(() => router.push("/login"), 1500);
        } else {
            // Username already exists
            setGlobalMessage({ text: "Account already exists", type: "error" });
        }
    } catch (error) {
        // Password mismatch case handled separately
        if (credentials.password !== credentials.confirmPassword) {
            setGlobalMessage({ text: "Passwords Mismatched", type: "error" });
        } else {
            setGlobalMessage({ text: "Something went wrong. Please try again.", type: "error" });
        }
    } finally {
        setIsLoading(false);
    }
};

  if (isAuthenticated === undefined) {
    return <SignupFormSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900 text-white flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-end items-center px-6 py-4 space-x-4 text-sm">
        <Link href="/login" className="hover:text-green-400 transition">Login</Link>
        <Link href="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow hover:opacity-90 transition">
          Sign Up
        </Link>
      </div>

      {/* Main Form */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 p-8 rounded-lg shadow-lg space-y-6">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SaveBook
          </h1>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">Create Account</h2>
            <p className="text-sm text-gray-400">Join us and get started</p>
          </div>

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
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 ${
                  errors.username
                    ? "border-red-500 bg-red-100 text-black"
                    : "border-gray-300 bg-white text-black"
                }`}
                placeholder="Enter your name"
                required
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={credentials.password}
                  onChange={onChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-lg outline-none pr-10 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 bg-red-900/20 text-white"
                      : "border-gray-600 bg-gray-700 text-white"
                  }`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={onChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-lg outline-none pr-10 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-900/20 text-white"
                      : "border-gray-600 bg-gray-700 text-white"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Global Message Above Button */}
            {globalMessage?.text && (
                <div
                    className={`text-center text-sm font-medium mb-2 ${
                        globalMessage.type === "success" ? "text-green-400" : "text-red-400"
                    }`}
                >
                    {globalMessage.text}
                </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2">
            <span className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-green-400 hover:text-green-300">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component
const SignupFormSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-lg shadow-lg space-y-6 animate-pulse">
        
        {/* Logo Skeleton */}
        <div className="h-8 w-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded mx-auto mb-4"></div>

        {/* Heading Skeleton */}
        <div className="h-6 w-40 bg-gray-600 rounded mx-auto mb-2"></div>
        <div className="h-4 w-32 bg-gray-600 rounded mx-auto mb-6"></div>

        {/* Username Field Skeleton */}
        <div>
          <div className="h-5 w-24 bg-gray-600 rounded mb-2"></div>
          {/* White box to mimic actual username input */}
          <div className="h-12 bg-white rounded-lg"></div>
        </div>

        {/* Password Field Skeleton */}
        <div>
          <div className="h-5 w-24 bg-gray-600 rounded mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Confirm Password Field Skeleton */}
        <div>
          <div className="h-5 w-32 bg-gray-600 rounded mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Global Message Skeleton */}
        <div className="h-5 w-64 bg-red-400/30 rounded mx-auto"></div>

        {/* Submit Button Skeleton */}
        <div className="h-12 bg-gradient-to-r from-green-600/30 to-blue-700/30 rounded-lg"></div>

        {/* Login Link Skeleton */}
        <div className="flex justify-center">
          <div className="h-5 w-48 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};