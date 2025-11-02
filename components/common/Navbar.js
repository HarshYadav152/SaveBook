"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Menu, 
  X, 
  Home, 
  FileText, 
  User,
  LogIn,
  UserPlus,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const { userId } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when changing routes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navigationItems = [
        ...(pathname !== '/' ? [{ href: "/", label: "Home", icon: FileText }] : []),
        // Only show My Notes when not on /book
    ...(pathname !== '/book' ? [{ href: "/book", label: "My Notes", icon: FileText }] : [])
    ];

    if (!isMounted) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg'
                    : 'bg-transparent dark:bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Brand */}
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center group"
                        >
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-900/5 dark:ring-white/10">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    <BookOpen className="h-5 w-5 text-purple-500" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        SaveBook
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {/* Navigation Links */}
                            <div className="flex items-center gap-6">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Authentication Components */}
                            <div className="flex items-center gap-3">
                                <SignedOut>
                                    <div className="flex items-center gap-3">
                                        <SignInButton mode="modal" afterSignInUrl="/book">
                                            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                                                <LogIn className="h-4 w-4" />
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton mode="modal" afterSignUpUrl="/book">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                                                <UserPlus className="h-4 w-4" />
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </div>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center gap-4">
                                        <UserButton
                                            signOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-9 h-9 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200",
                                                    userButtonPopoverCard: "dark:bg-gray-900 dark:border-gray-700 shadow-xl",
                                                    userButtonPopoverText: "dark:text-gray-300",
                                                    userButtonPopoverActionButton: "dark:hover:bg-gray-800 transition-colors duration-200",
                                                }
                                            }}
                                        />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all duration-200"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden fixed inset-0 z-40 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-full opacity-0 pointer-events-none'
                }`}>
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Menu Panel */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Sparkles className="h-5 w-5 text-blue-500" />
                                <BookOpen className="h-5 w-5 text-purple-500" />
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SaveBook
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div className="p-6 space-y-4">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Authentication Section */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <SignedOut>
                                <div className="space-y-3">
                                    <SignInButton mode="modal" afterSignInUrl="/book">
                                        <button 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal" afterSignUpUrl="/book">
                                        <button 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
                                        >
                                            <UserPlus className="h-5 w-5" />
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Signed in as</p>
                                        <UserButton
                                            signOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-12 h-12 border-2 border-gray-300 dark:border-gray-600",
                                                    userButtonPopoverCard: "dark:bg-gray-900 dark:border-gray-700",
                                                }
                                            }}
                                        />
                                    </div>
                                    <Link
                                        href="/book"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                    >
                                        <FileText className="h-5 w-5" />
                                        My Notes
                                    </Link>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Prevent body scroll when menu is open */}
            <style jsx global>{`
                body {
                    overflow: ${isMenuOpen ? 'hidden' : 'unset'};
                }
            `}</style>
        </>
    )
}