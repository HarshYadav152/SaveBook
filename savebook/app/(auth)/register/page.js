"use client"
import { useAuth } from '@/context/auth/authContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { Eye, EyeOff } from 'lucide-react';

// Signup Form Component
const SignupForm = () => {
    const { register, isAuthenticated } = useAuth();
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
    const router = useRouter();

    // Handle redirection based on authentication status
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

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

    // Show loading state while checking authentication
    if (isAuthenticated === undefined) {
        return <SignupFormSkeleton />;
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50 ${errors.username
                            ? 'border-red-500 bg-red-900/20 focus:ring-red-500'
                            : 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                        }`}
                    placeholder="Choose a username"
                    required
                />
                {errors.username && (
                    <p id="username-error" role="alert" className="mt-1 text-sm text-red-400">
                        {errors.username}
                    </p>
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
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : "password-hint"}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                    </button>
                </div>
                {errors.password && (
                    <p id="password-error" role="alert" className="mt-1 text-sm text-red-400">
                        {errors.password}
                    </p>
                )}
                {!errors.password && (
                    <p id="password-hint" className="mt-1 text-xs text-gray-400">
                        Password must be at least 6 characters long.
                    </p>
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
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        aria-pressed={showConfirmPassword}
                    >
                        {showConfirmPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p id="confirmPassword-error" role="alert" className="mt-1 text-sm text-red-400">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || isAuthenticated}
                className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-live="polite"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Registering...</span>
                    </>
                ) : (
                    <span>{isAuthenticated ? 'Redirecting...' : 'Create Account'}</span>
                )}
            </button>

            {/* Login link */}
            <div className="text-center">
                <span className="text-sm text-gray-300">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-green-400 hover:text-green-300 focus:outline-none focus:underline rounded-sm"
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
    );
}

// Signup Skeleton Component for loading state
const SignupFormSkeleton = () => {
    return (
        <div className="space-y-6" aria-hidden="true">
            {/* Username Field Skeleton */}
            <div>
                <div className="h-5 w-20 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Password Field Skeleton */}
            <div>
                <div className="h-5 w-20 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Confirm Password Field Skeleton */}
            <div>
                <div className="h-5 w-32 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gradient-to-r from-green-600/30 to-blue-700/30 rounded-lg animate-pulse"></div>

            {/* Sign up link Skeleton */}
            <div className="flex justify-center">
                <div className="h-5 w-48 bg-gray-700 rounded animate-pulse"></div>
            </div>
        </div>
    );
};

// Main component
export default function Signup() {
    const { isAuthenticated } = useAuth();

    // Show loading while checking initial auth state
    if (isAuthenticated === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
                <div className="max-w-md w-full">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8" aria-hidden="true">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse"></div>
                        <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </div>

                    {/* Form Skeleton */}
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                        <SignupFormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-gray-300">
                        Join us and get started
                    </p>
                </div>

                {/* Signup Form */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}