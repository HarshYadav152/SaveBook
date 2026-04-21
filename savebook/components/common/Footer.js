"use client"
import React from 'react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#06152d] border-t border-[#1b2b45] text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-white inline-block mb-4"
                        >
                            SaveBook
                        </Link>

                        <p className="text-[#94a3b8] text-sm mb-5 leading-relaxed max-w-md">
                            A modern, open-source note-taking and knowledge management platform built for developers and creators.
                        </p>

                        <div className="flex space-x-3">
                            {/* GitHub */}
                            <a
                                href="https://github.com/HarshYadav152/SaveBook"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit SaveBook GitHub Repository"
                                className="text-[#94a3b8] hover:text-white transition-colors rounded-md p-1.5"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.685-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>

                            {/* Twitter/X */}
                            <a
                                href="https://twitter.com/savebookapp"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow SaveBook on Twitter"
                                className="text-[#94a3b8] hover:text-white transition-colors rounded-md p-1.5"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Product
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/notes" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Notes
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/share" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Share Notes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/docs" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <a href="https://github.com/HarshYadav152/SaveBook/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Issues
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/HarshYadav152/SaveBook/discussions" target="_blank" rel="noopener noreferrer" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Discussions
                                </a>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Community
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://github.com/HarshYadav152/SaveBook/graphs/contributors" target="_blank" rel="noopener noreferrer" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Contributors
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/HarshYadav152/SaveBook/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Contributing
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/HarshYadav152/SaveBook/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                                    Code of Conduct
                                </a>
                                <Link href="/licence" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                                    MIT License
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-2">
                        <h3 className="text-3xl font-bold text-white mb-3 text-center lg:text-left">
                            Stay Updated
                        </h3>

                        <p className="text-[#94a3b8] text-base mb-6 text-center lg:text-left">
                            Get the latest updates on new features and improvements.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>

                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                className="flex-1 px-5 py-3 rounded-lg border border-[#334155] bg-[#16253d] text-white placeholder:text-[#94a3b8] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-6 border-t border-[#1b2b45]">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-[#94a3b8]">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p>&copy; {currentYear} SaveBook. All rights reserved.</p>

                            <div className="flex items-center gap-2">
                                <span>Built with</span>
                                <span className="text-red-500">❤️</span>
                                <span>by the open source community</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <a
                                href="https://github.com/HarshYadav152/SaveBook"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Contribute on GitHub"
                                className="text-[#94a3b8] hover:text-white transition-colors"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.685-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>

                            <div className="flex items-center gap-2">
                                <span>v1.1.0</span>
                                <span className="text-red-500">❤️</span>
                                <span>Open Source</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

