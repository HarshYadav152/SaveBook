"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth/authContext";
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Handle input change
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });

    if (e.target.name === "username") {
      if (e.target.value.length < 3) {
        setUsernameMessage("Username must be in lowercase and at least 3 characters long");
      } else {
        setUsernameMessage("Looks good ✅");
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }
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
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(
        credentials.username,
        credentials.password,
        credentials.confirmPassword
      );

      if (result?.success) {
        setSuccessMessage("Account created successfully! 🎉 Redirecting...");
        setErrorMessage("");
        toast.success("Account created successfully! 🎉");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setSuccessMessage("");
        setErrorMessage(result?.message || "Registration failed");
        toast.error(result?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
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
            disabled={isLoading || isAuthenticated}
            className={`w-full px-4 py-3 border ${
              errors.username ? "border-red-500" : "border-gray-600"
            } bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Choose a username"
            required
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          {usernameMessage && !errors.username && (
            <p className="text-blue-400 text-sm mt-1">{usernameMessage}</p>
          )}
        </div>

        {/* Password Field */}
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
              disabled={isLoading || isAuthenticated}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 pr-10 ${
                errors.password
                  ? 'border-red-500 bg-red-900/20 focus:ring-red-500'
                  : 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
              }`}
              placeholder="Create a password"
              required
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
          {!errors.password && (
            <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters long.</p>
          )}
        </div>

        {/* Confirm Password Field */}
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
              disabled={isLoading || isAuthenticated}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 pr-10 ${
                errors.confirmPassword
                  ? 'border-red-500 bg-red-900/20 focus:ring-red-500'
                  : 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
              }`}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Login link */}
        <div className="text-center">
          <span className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-400 hover:text-green-300"
              onClick={(e) => {
                if (isLoading || isAuthenticated) {
                  e.preventDefault();
                }
              }}
            >
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}