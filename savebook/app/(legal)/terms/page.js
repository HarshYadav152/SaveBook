"use client"
import React, { Suspense } from 'react'
import Link from 'next/link'

// Loading component for the Terms of Service page
const TermsPageLoading = () => {
    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header loading skeleton */}
                <div className="text-center mb-12">
                    <div className="w-28 h-8 bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse"></div>

                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-2xl mx-auto mb-6 animate-pulse"></div>

                    <div className="h-10 bg-gray-800 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-5 bg-gray-800 rounded-lg max-w-md mx-auto animate-pulse"></div>

                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="h-8 w-8 bg-gray-800 rounded-full mx-auto animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-800 rounded mt-1 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Summary loading skeleton */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="h-8 w-8 bg-gray-700 rounded-full mb-2 animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content loading skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                    <div className="space-y-8">
                        {/* Section loading skeletons */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-start mb-6">
                                    <div className="w-2 h-12 bg-gray-700 rounded mr-4 mt-1"></div>
                                    <div>
                                        <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-36"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                                </div>
                                <div className="mt-6 grid md:grid-cols-2 gap-4">
                                    <div className="h-32 bg-gray-700/50 rounded-xl border border-gray-600"></div>
                                    <div className="h-32 bg-gray-700/50 rounded-xl border border-gray-600"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acceptance Section loading skeleton */}
                <div className="bg-green-500/10 rounded-2xl border border-green-500/20 p-6 mt-8 animate-pulse">
                    <div className="h-5 bg-gray-700 rounded-lg w-4/5 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded-lg w-3/5 mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

// Terms of Service content component
const TermsOfServiceContent = () => {
    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to App</span>
                    </Link>

                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Guidelines and rules for using SaveBook
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">📝</div>
                            <div className="text-gray-400 text-sm mt-1">Acceptable Use</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">⚖️</div>
                            <div className="text-gray-400 text-sm mt-1">User Rights</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">🚫</div>
                            <div className="text-gray-400 text-sm mt-1">Prohibited Content</div>
                        </div>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">18+</div>
                            <div className="text-gray-400 text-sm">Minimum Age</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">📱</div>
                            <div className="text-gray-400 text-sm">Personal Use</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">🔒</div>
                            <div className="text-gray-400 text-sm">Content Ownership</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                    <div className="prose prose-invert prose-gray max-w-none">

                        {/* Agreement Section */}
                        <section className="mb-12">
                            <div className="flex items-start mb-6">
                                <div className="w-2 h-12 bg-blue-500 rounded mr-4 mt-1"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1. Agreement to Terms</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Last Updated: October 2025</p>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                By accessing or using SaveBook ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Service.
                            </p>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                                <p className="text-blue-300 text-sm">
                                    <strong>Note:</strong> These terms affect your legal rights and responsibilities. Please read them carefully.
                                </p>
                            </div>
                        </section>

                        {/* User Accounts */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-green-500 rounded mr-3"></div>
                                2. User Accounts
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Account Registration
                                    </h4>
                                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">•</span>
                                            You must be at least 18 years old to use this Service
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">•</span>
                                            Provide accurate and complete registration information
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">•</span>
                                            Maintain the security of your password and account
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">•</span>
                                            You are responsible for all activities under your account
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Account Termination
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        We reserve the right to suspend or terminate your account if:
                                    </p>
                                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">•</span>
                                            You violate these Terms of Service
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">•</span>
                                            You engage in fraudulent or illegal activities
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">•</span>
                                            Your use poses security risks to our Service
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Acceptable Use */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-purple-500 rounded mr-3"></div>
                                3. Acceptable Use
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                                    <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        You May
                                    </h4>
                                    <ul className="text-gray-300 space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Create and manage personal notes
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Use for personal and business organization
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Access your notes across multiple devices
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Export your data for personal use
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                                    <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        You May Not
                                    </h4>
                                    <ul className="text-gray-300 space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">✗</span>
                                            Store illegal or harmful content
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">✗</span>
                                            Share copyrighted material without permission
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">✗</span>
                                            Attempt to hack or disrupt the service
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-400 mr-2">✗</span>
                                            Use for spam or malicious activities
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                                <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Prohibited Content
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center">
                                        <span className="text-red-400 mr-2">•</span>
                                        <span className="text-gray-300">Illegal activities</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-400 mr-2">•</span>
                                        <span className="text-gray-300">Malware or viruses</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-400 mr-2">•</span>
                                        <span className="text-gray-300">Hate speech</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-400 mr-2">•</span>
                                        <span className="text-gray-300">Spam content</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Intellectual Property */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-orange-500 rounded mr-3"></div>
                                4. Intellectual Property
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        Your Content
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        You retain all ownership rights to the content you create and store in Notebook. We claim no intellectual property rights over the material you provide to the Service.
                                    </p>
                                    <div className="bg-blue-500/10 rounded-lg p-3">
                                        <p className="text-blue-300 text-sm">
                                            <strong>You own your notes.</strong> We simply provide the platform for you to create, store, and manage them.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        Our Service
                                    </h4>
                                    <p className="text-gray-300">
                                        The Notebook service, including its features, design, code, and branding, is protected by copyright, trademark, and other laws. You may not copy, modify, or create derivative works without our explicit permission.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Service Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-teal-500 rounded mr-3"></div>
                                5. Service Terms
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Availability
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                        We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform maintenance that temporarily affects availability.
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center">
                                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Modifications
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                        We reserve the right to modify or discontinue the Service at any time. We will provide notice of significant changes.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-red-500 rounded mr-3"></div>
                                6. Limitation of Liability
                            </h2>

                            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                                <p className="text-gray-300 mb-4">
                                    To the fullest extent permitted by law, Notebook shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h5 className="text-white font-semibold mb-2">We Are Not Liable For:</h5>
                                        <ul className="text-gray-300 space-y-1">
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">•</span>
                                                Data loss due to user error
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">•</span>
                                                Service interruptions
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">•</span>
                                                Third-party actions
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-white font-semibold mb-2">Your Responsibility:</h5>
                                        <ul className="text-gray-300 space-y-1">
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                Regular data backups
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                Account security
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                Content compliance
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Termination */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-gray-500 rounded mr-3"></div>
                                7. Termination
                            </h2>

                            <div className="space-y-4">
                                <p className="text-gray-300">
                                    You may stop using our Service at any time. You can delete your account and all associated data through your account settings.
                                </p>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-gray-300 text-sm">
                                        <strong>Note:</strong> Account deletion is permanent and cannot be undone. All your notes and data will be permanently removed from our servers.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Governing Law */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-8 bg-indigo-500 rounded mr-3"></div>
                                8. Governing Law
                            </h2>

                            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                                <p className="text-gray-300 mb-3">
                                    These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of the United States.
                                </p>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                            <h3 className="text-white font-semibold mb-3 flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Us
                            </h3>
                            <p className="text-gray-300 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="flex items-center text-blue-400">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>HarshYadav152@outlook.com</span>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Acceptance Section */}
                <div className="bg-green-500/10 rounded-2xl border border-green-500/20 p-6 mt-8 text-center">
                    <p className="text-green-400 font-semibold mb-2">
                        By using SaveBook, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Continued use of the Service constitutes acceptance of any future updates to these terms.
                    </p>
                </div>
            </div>
        </div>
    )
}

// Main component with Suspense
export default function TermsOfService() {
    return (
        <Suspense fallback={<TermsPageLoading />}>
            <TermsOfServiceContent />
        </Suspense>
    );
}