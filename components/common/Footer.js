"use client"
import React from 'react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm order-2 md:order-1">
                            © {currentYear} SaveBook
                        </div>

                        {/* Links */}
                        <div className="flex items-center space-x-6 text-sm order-1 md:order-2">
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}