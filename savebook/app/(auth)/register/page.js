"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth/authContext";
import { Eye, EyeOff } from 'lucide-react';

// Signup Form Component
export default async function SignupPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already authenticated
        if (isAuthenticated) {
            router.push("/");
            return;
        }

        // Validate and collect errors
        const newErrors = {};

        if (!credentials.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!credentials.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (credentials.password !== credentials.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // If validation errors exist, show them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Use the register method from AuthContext
            const result = await register(
                credentials.username,
                credentials.password
            );

            if (result.success) {
                toast.success("Account created successfully! 🎉");
                router.push("/login")
                // The useEffect will handle the redirect
            } else {
                toast.error(result.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);

            // Attempt to extract meaningful error message
            let errorMessage = "Something went wrong. Please try again.";

            try {
                // Check if response exists and extract message from JSON
                if (error.response?.data) {
                    const data = error.response.data;

                    // Try to get message from JSON response
                    if (typeof data === 'object' && data !== null) {
                        if (data.message) {
                            errorMessage = data.message;
                        } else if (data.error) {
                            errorMessage = data.error;
                        }
                    }
                    // If data is a string (HTML), it means we got an error page
                    else if (typeof data === 'string' && data.includes('<')) {
                        // HTML response detected, use status code instead
                        throw new Error('HTML_RESPONSE');
                    }
                }

                // Handle HTTP status codes if no JSON message was found
                if (errorMessage.includes('Something went wrong')) {
                    if (error.response?.status === 500) {
                        errorMessage = "Server error. Please try again later.";
                    } else if (error.response?.status === 400) {
                        errorMessage = "Invalid registration details. Please check your input.";
                    }
                }
            } catch (parseError) {
                // If JSON parsing failed or HTML was detected, use status-based message
                if (error.response?.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                } else if (error.response?.status === 400) {
                    errorMessage = "Invalid registration details. Please check your input.";
                } else if (error.response?.status) {
                    errorMessage = `Registration failed with error ${error.response.status}. Please try again.`;
                } else if (error.message && !error.message.includes('<!DOCTYPE')) {
                    errorMessage = error.message;
                }
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        // Clear error for this field when user starts typing
        setErrors({ ...errors, [e.target.name]: '' });
    };

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
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={credentials.username}
                    onChange={onchange}
                    disabled={isLoading || isAuthenticated}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 ${errors.username
                            ? 'border-red-500 bg-red-900/20 focus:ring-red-500'
                            : 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                        }`}
                    placeholder="Choose a username"
                    required
                />
                {errors.username && (
                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
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
                        onChange={onchange}
                        disabled={isLoading || isAuthenticated}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 pr-10 ${errors.password
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
                        onChange={onchange}
                        disabled={isLoading || isAuthenticated}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 pr-10 ${errors.confirmPassword
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
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                    </>
                ) : (
                    isAuthenticated ? 'Redirecting...' : 'Create Account'
                )}
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

            {/* Login link */}
            <div className="text-center">
                <span className="text-sm text-gray-300">
                    Already have an account?{' '}
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
      </form>
  );
}