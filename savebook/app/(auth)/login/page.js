"use client"
import { useAuth } from '@/context/auth/authContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Login Form Component
const LoginForm = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [hasRedirected, setHasRedirected] = useState(false);
    const router = useRouter();

    // Handle redirection based on authentication status
    useEffect(() => {
        // Only redirect if authenticated, not loading, and hasn't already redirected
        if (isAuthenticated && !loading && !hasRedirected) {
            setHasRedirected(true);
            router.push("/notes");
        }
    }, [isAuthenticated, loading, hasRedirected, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent submission if already authenticated or loading
        if (isAuthenticated || isLoading) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await login(credentials.username, credentials.password);
            
            if (result.success) {
                toast.success("Welcome back! 🎉");
                // Don't call router.push here - let useEffect handle it
                // The AuthState will update isAuthenticated which triggers the redirect
            } else {
                toast.error(result.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    // Show loading state while checking authentication
    if (loading) {
        return <LoginFormSkeleton />;
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    Username
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={credentials.username}
                        onChange={onchange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                        placeholder="Enter your username"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Password Field */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                        Password
                    </label>
                    <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={credentials.password}
                        onChange={onchange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none disabled:opacity-50"
                        placeholder="Enter your password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || isAuthenticated}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    isAuthenticated ? 'Redirecting...' : 'Sign in'
                )}
            </button>

            {/* Sign up link */}
            <div className="text-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                        Register
                    </Link>
                </span>
            </div>
        </form>
    );
};

// Loading component
const LoginFormSkeleton = () => {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-12 bg-gradient-to-r from-blue-600/30 to-purple-700/30 rounded-lg animate-pulse"></div>
            <div className="flex justify-center">
                <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        </div>
    );
};

// Main component
const LoginPage = () => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/notes');
        }
    }, [isAuthenticated, loading, router]);

    // Show loading while checking initial auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse"></div>
                        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <LoginFormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;