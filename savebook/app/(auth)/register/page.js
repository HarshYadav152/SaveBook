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
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        course: '',
        subjectsOfInterest: ''
    });
    const [errors, setErrors] = useState({});
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

        if (!credentials.username.trim()) newErrors.username = 'Username is required';
        if (!credentials.name.trim()) newErrors.name = 'Full Name is required';

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!credentials.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(credentials.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else {
            if (credentials.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            else if (!/[A-Z]/.test(credentials.password)) newErrors.password = 'Password must contain at least one uppercase letter';
            else if (!/[0-9]/.test(credentials.password)) newErrors.password = 'Password must contain at least one number';
            else if (!/[!@#$%^&*]/.test(credentials.password)) newErrors.password = 'Password must contain at least one special character (!@#$%^&*)';
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
            // Prepare data for registration
            const userData = {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email,
                name: credentials.name,
                course: credentials.course,
                subjectsOfInterest: credentials.subjectsOfInterest.split(',').map(s => s.trim()).filter(s => s)
            };

            // Use the register method from AuthContext
            const result = await register(userData);

            if (result.success) {
                toast.success("Account created successfully! 🎉");
                router.push("/login")
            } else {
                toast.error(result.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Something went wrong. Please try again.");
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
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                    <input type="text" name="name" value={credentials.name} onChange={onchange} disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white ${errors.name ? 'border-red-500' : 'border-gray-600'}`} placeholder="John Doe" />
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username *</label>
                    <input type="text" name="username" value={credentials.username} onChange={onchange} disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white ${errors.username ? 'border-red-500' : 'border-gray-600'}`} placeholder="johndoe123" />
                    {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                <input type="email" name="email" value={credentials.email} onChange={onchange} disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`} placeholder="john@example.com" />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Course</label>
                    <input type="text" name="course" value={credentials.course} onChange={onchange} disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white" placeholder="B.Tech, B.Sc, etc." />
                </div>

                {/* Subjects of Interest */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Interests</label>
                    <input type="text" name="subjectsOfInterest" value={credentials.subjectsOfInterest} onChange={onchange} disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white" placeholder="Coding, Design (comma separated)" />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={credentials.password} onChange={onchange} disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white pr-10 ${errors.password ? 'border-red-500' : 'border-gray-600'}`} placeholder="Create a password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                {!errors.password && <p className="mt-1 text-xs text-gray-400">Min 8 chars, uppercase, number, special char.</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password *</label>
                <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={credentials.confirmPassword} onChange={onchange} disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-gray-700 text-white pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`} placeholder="Confirm your password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading || isAuthenticated}
                className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center mt-6">
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </>
                ) : (isAuthenticated ? 'Redirecting...' : 'Create Account')}
            </button>

            {/* Login link */}
            <div className="text-center mt-4">
                <span className="text-sm text-gray-300">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-green-400 hover:text-green-300">Login</Link>
                </span>
            </div>
        </form>
    );
}

// Signup Skeleton Component for loading state
const SignupFormSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
    );
};

// Main component
export default function Signup() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700"><SignupFormSkeleton /></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="mt-2 text-gray-300">Join us and get started</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}