"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth/authContext";

export default function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // State
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Handle input change
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

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
    setErrors({});
    setSuccessMessage("");

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
      const result = await register(credentials.username, credentials.password, credentials.confirmPassword);

      if (result?.success) {
        setSuccessMessage("Account created successfully! 🎉 Redirecting...");
        setErrorMessage(""); //clear any previous error
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setSuccessMessage(""); // clear success
        setErrorMessage(result?.message || "Registration failed");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Skeleton loader
  if (isAuthenticated === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirecting state
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-center text-2xl font-bold text-white mb-6">Create your account</h2>

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
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}

            {usernameMessage && !errors.username && (
              <p className="text-blue-400 text-sm mt-1">{usernameMessage}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={onChange}
              disabled={isLoading || isAuthenticated}
              className={`w-full px-4 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={credentials.confirmPassword}
              onChange={onChange}
              disabled={isLoading || isAuthenticated}
              className={`w-full px-4 py-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              } bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-red-400 text-sm font-medium text-center mb-2">
              {errorMessage}
            </p>
          )}

          {/* Success message */}
          {successMessage && (
            <p className="text-green-400 text-sm font-medium text-center mb-2">
              {successMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isAuthenticated}
            className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login link */}
          <div className="text-center">
            <span className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-green-400 hover:text-green-300">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}