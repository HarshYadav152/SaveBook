"use client"
import React from 'react'
import Link from 'next/link'
import { BookOpen, Github, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const links = {
        Product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Integrations", href: "#integrations" },
            { name: "Changelog", href: "#changelog" },
        ],
        Resources: [
            { name: "Documentation", href: "/docs" },
            { name: "Tutorials", href: "#tutorials" },
            { name: "Blog", href: "#blog" },
            { name: "Support", href: "#support" },
        ],
        Company: [
            { name: "About", href: "#about" },
            { name: "Careers", href: "#careers" },
            { name: "Contact", href: "#contact" },
            { name: "Partners", href: "#partners" },
        ],
    };

    return (
        <footer className="border-t border-black/10 bg-white py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display text-xl font-semibold text-black">
                                SaveBook
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            SaveBook empowers teams to transform raw data into clear, compelling visuals — making insights easier to share, understand, and act on.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-black transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-black transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-black transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/HarshYadav152/SaveBook"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-black transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="font-display font-semibold text-black mb-4 text-sm">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-600 hover:text-black transition-colors text-sm"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/10">
                    <p className="text-gray-600 text-sm mb-4 md:mb-0">
                        © {currentYear} SaveBook. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-gray-600 hover:text-black transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-600 hover:text-black transition-colors text-sm">
                            Terms of Service
                        </Link>
                        <Link href="#cookies" className="text-gray-600 hover:text-black transition-colors text-sm">
                            Cookies Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}