"use client"
import { useAuth } from '@/context/auth/authContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Signup Form Component
const SignupForm = () => {
    const { register, isAuthenticated } = useAuth();
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
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
        
        if (!credentials.username || !credentials.password || !credentials.confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (credentials.password.length < 6) {
            toast.error('Password must be at least 6 characters');
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
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Show loading state while checking authentication
    if (isAuthenticated === undefined) {
        return <SignupFormSkeleton />;
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={credentials.username}
                    onChange={onchange}
                    disabled={isLoading || isAuthenticated}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                    placeholder="Choose a username"
                    required
                />
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={credentials.password}
                    onChange={onchange}
                    disabled={isLoading || isAuthenticated}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                    placeholder="Create a password"
                    required
                />
            </div>

            {/* Confirm Password Field */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={onchange}
                    disabled={isLoading || isAuthenticated}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                    placeholder="Confirm your password"
                    required
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || isAuthenticated}
                className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </>
                ) : (
                    isAuthenticated ? 'Redirecting...' : 'Create Account'
                )}
            </button>

            {/* Login link */}
            <div className="text-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link 
                        href="/login" 
                        className="font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
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
        <div className="space-y-6">
            {/* Username Field Skeleton */}
            <div>
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Password Field Skeleton */}
            <div>
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Confirm Password Field Skeleton */}
            <div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
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
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="max-w-md w-full">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse"></div>
                        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </div>

                    {/* Form Skeleton */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <SignupFormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    // // Redirect if already authenticated
    // if (isAuthenticated) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
    //                 <p className="text-white">Redirecting...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Join us and get started
                    </p>
                </div>

                {/* Signup Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}