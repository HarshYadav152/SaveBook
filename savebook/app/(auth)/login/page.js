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
                <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={credentials.username}
                    onChange={onchange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-black/20 bg-white text-black rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none disabled:opacity-50 placeholder:text-gray-400"
                    placeholder="Enter your username"
                />
            </div>

            {/* Password Field */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-black">
                        Password
                    </label>
                    <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                        Forgot password?
                    </a>
                </div>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={credentials.password}
                    onChange={onchange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-black/20 bg-white text-black rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 outline-none disabled:opacity-50 placeholder:text-gray-400"
                    placeholder="Enter your password"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || isAuthenticated}
                className="w-full bg-black text-white py-3.5 px-4 rounded-xl font-semibold text-base hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
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
                <span className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        className="font-medium text-black hover:underline transition-colors duration-200"
                    >
                        Create account
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
                <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-900 rounded-xl animate-pulse"></div>
            <div className="flex justify-center">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
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
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4 animate-pulse"></div>
                        <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-100 rounded mx-auto animate-pulse"></div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-black/10">
                        <LoginFormSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-black font-display">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-8 rounded-2xl border border-black/10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;