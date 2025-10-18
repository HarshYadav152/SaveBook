"use client"
import React from 'react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-gray-800 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-white font-semibold">SaveBook</span>
                        </div>

                        {/* Links */}
                        <div className="flex items-center space-x-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Terms
                            </Link>
                        </div>

                        {/* Copyright */}
                        <div className="text-gray-400 text-sm">
                            © {currentYear} SaveBook
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}