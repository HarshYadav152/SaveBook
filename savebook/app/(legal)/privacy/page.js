"use client"
import React, { Suspense } from 'react'
import Link from 'next/link'

// Loading component specifically styled for privacy page
const PrivacyPageLoading = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header loading state */}
        <div className="text-center mb-12">
          <div className="w-32 h-10 bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse"></div>
          
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-2xl mx-auto mb-6 animate-pulse"></div>
          
          <div className="h-10 bg-gray-800 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-800 rounded max-w-md mx-auto animate-pulse"></div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="w-16 h-10 bg-gray-800 rounded animate-pulse"></div>
            <div className="w-16 h-10 bg-gray-800 rounded animate-pulse"></div>
            <div className="w-16 h-10 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Last Updated loading state */}
        <div className="h-24 bg-gray-800 rounded-2xl border border-gray-700 mb-8 animate-pulse"></div>

        {/* Content loading state */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-8 bg-gray-700 rounded mr-3"></div>
                  <div className="h-8 bg-gray-700 rounded w-40"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main content component
const PrivacyPolicyContent = () => {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How we protect and handle your data in SaveBook
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">🔒</div>
              <div className="text-gray-400 text-sm mt-1">Encrypted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">🔐</div>
              <div className="text-gray-400 text-sm mt-1">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">📝</div>
              <div className="text-gray-400 text-sm mt-1">Private</div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Last Updated</h3>
              <p className="text-gray-400">October 2025</p>
            </div>
            <div className="text-right">
              <h3 className="text-white font-semibold">Version</h3>
              <p className="text-gray-400">1.0</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="prose prose-invert prose-gray max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded mr-3"></div>
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Welcome to SaveBook. We are committed to protecting your privacy and ensuring the security of your personal notes and data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our notebook application.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using SaveBook, you consent to the data practices described in this policy. If you do not agree with the data practices described in this Privacy Policy, you should not use our application.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded mr-3"></div>
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Username and email address
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Account creation date
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Last login information
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Note Content
                  </h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Note titles and descriptions
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Tags and categories
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Creation and modification dates
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Technical Information
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    IP address and browser type
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Device information and operating system
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Usage patterns and app interactions
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-purple-500 rounded mr-3"></div>
                How We Use Your Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Provide Core Services</h4>
                    <p className="text-gray-300">To create, store, and manage your notes, and to provide you with a personalized notebook experience.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Security & Authentication</h4>
                    <p className="text-gray-300">To verify your identity, protect your account, and prevent unauthorized access to your notes.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <span className="text-purple-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Improve Our Service</h4>
                    <p className="text-gray-300">To understand how users interact with our app and make improvements to enhance your experience.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <span className="text-orange-400 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Communication</h4>
                    <p className="text-gray-300">To send you important updates about our service, security notifications, and support responses.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-red-500 rounded mr-3"></div>
                Data Security
              </h2>
              
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Security Measures
                    </h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        End-to-end encryption for note content
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        Secure HTTPS connections
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        Regular security audits
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        Data encryption at rest
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Access Control
                    </h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">✓</span>
                        Only you can access your notes
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">✓</span>
                        No employee access to note content
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">✓</span>
                        Secure authentication tokens
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Retention & Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-teal-500 rounded mr-3"></div>
                Your Rights & Control
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h4 className="text-white font-semibold mb-3">Data Retention</h4>
                  <p className="text-gray-300 mb-4">
                    We retain your notes for as long as your account is active. If you delete your account, all associated notes and personal information will be permanently deleted from our servers within 30 days.
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account data deleted within 30 days of account closure
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <h4 className="text-white font-semibold mb-3">Your Rights</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Access your data</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Correct inaccurate data</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Delete your account</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Export your notes</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded mr-3"></div>
                Contact Us
              </h2>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="flex items-center text-blue-400">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>HarshYadav152@outlook.com</span>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Policy Updates
              </h3>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense
export default function PrivacyPolicy() {
  return (
    <Suspense fallback={<PrivacyPageLoading />}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}