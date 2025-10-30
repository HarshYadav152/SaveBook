"use client"
import React from 'react'
import Link from 'next/link'
import { BookOpen, Github, Twitter, Linkedin, Globe, Heart, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Developer/Company social links
    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://github.com/HarshYadav152',
            icon: Github,
            description: 'View our code'
        },
        {
            name: 'X',
            href: 'https://twitter.com/harshyadav_152',
            icon: Twitter,
            description: 'Follow updates'
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com/in/harshyadav152',
            icon: Linkedin,
            description: 'Connect professionally'
        },
        {
            name: 'Portfolio',
            href: 'https://HarshYadav152.me.com',
            icon: Globe,
            description: 'See our work'
        },
        {
            name: 'Email',
            href: 'mailto:HarshYadav152@outlook.com',
            icon: Mail,
            description: 'Get in touch'
        }
    ];

    const productLinks = [
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
    ];

    const supportLinks = [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact', href: '/contact' },
        { name: 'Status', href: '/status' },
        { name: 'Community', href: '/community' },
    ];

    const legalLinks = [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Cookies', href: '/cookies' },
    ];

    return (
        <footer className="border-t border-gray-800 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                                <div className="relative flex items-center space-x-2">
                                    <BookOpen className="h-8 w-8 text-blue-400" />
                                    <span className="text-2xl font-bold text-white">SaveBook</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Your intelligent note-taking companion. Organize, access, and secure your thoughts 
                            across all devices with seamless synchronization.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative p-2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                                        aria-label={link.name}
                                        title={link.description}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <span className="bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                                {link.name}
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Trust & Security</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Open Source</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm">
                            <p className="flex items-center space-x-1">
                                <span>&copy; {currentYear} SaveBook.</span>
                                <span className="flex items-center">
                                    Built with <Heart className="h-4 w-4 text-red-400 mx-1" /> using
                                </span>
                                <a 
                                    href="https://nextjs.org" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Next.js
                                </a>
                            </p>
                        </div>

                        {/* Additional Credibility Links */}
                        <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
                            <a 
                                href="https://github.com/HarshYadav152/SaveBook" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors flex items-center space-x-1"
                            >
                                <Github className="h-4 w-4" />
                                <span>Star on GitHub</span>
                            </a>
                            <a 
                                href="/changelog" 
                                className="hover:text-white transition-colors"
                            >
                                Changelog
                            </a>
                            <a 
                                href="/api-status" 
                                className="hover:text-white transition-colors"
                            >
                                API Status
                            </a>
                            <div className="flex items-center space-x-1 text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>All systems operational</span>
                            </div>
                        </div>
                    </div>

                    {/* Open Source Love */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-500 text-xs">
                            Proudly open source. 
                            <a 
                                href="https://github.com/HarshYadav152/SaveBook" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 ml-1"
                            >
                                Contribute on GitHub
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}