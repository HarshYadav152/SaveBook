"use client"
import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/auth/authContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { isAuthenticated, user, logout, loading } = useAuth();

    // Handle client-side mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const desktopDropdownRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setIsMenuOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDesktopDropdownClicked = desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target);
            const isMobileDropdownClicked = mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target);

            if (dropdownOpen && !isDesktopDropdownClicked && !isMobileDropdownClicked) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Don't render auth-dependent UI until client-side hydration is complete
    if (!isClient) {
        return (
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-lg'
                    : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                SaveBook
                            </Link>
                        </div>
                        {/* Loading skeleton */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-lg'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            SaveBook
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        {loading ? (
                            // Loading skeleton
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                        ) : isAuthenticated ? (
                            // Authenticated user dropdown
                            <div className="relative" ref={desktopDropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                    aria-label="User menu"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                        ) : (
                                            <span className="cursor-pointer">{getInitials(user?.username)}</span>
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-50 border border-border">
                                        <div className="px-4 py-2 border-b border-border">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {user?.username || "User"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Edit Profile
                                        </Link>
                                        <Link
                                            href="/notes"
                                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Notes
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Not authenticated - show login/signup buttons
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        {loading ? (
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                        ) : isAuthenticated ? (
                            <>
                                {/* Profile dropdown for mobile */}
                                <div className="relative" ref={mobileDropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                        aria-label="User menu"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden cursor-pointer">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover cursor-pointer"
                                                />
                                            ) : (
                                                <span className="cursor-pointer">{getInitials(user?.username)}</span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Dropdown menu for mobile */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-50 border border-border">
                                            <div className="px-4 py-2 border-b border-border">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {user?.username || "User"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user?.email || ""}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Edit Profile
                                            </Link>
                                            <Link
                                                href="/notes"
                                                className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                My Notes
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </>
                        ) : (
                            // Not authenticated - show menu button
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated ? (
                            <div className="space-y-3">
                                {/* User profile section in mobile menu */}
                                <div className="px-3 py-3 rounded-lg bg-muted flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span>{getInitials(user?.username)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-foreground truncate">
                                            {user?.username || "User"}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user?.email || "Signed in"}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/notes"
                                    className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Notes
                                </Link>

                                <Link
                                    href="/profile"
                                    className="block w-full px-4 py-2 bg-muted text-foreground text-base font-medium rounded-lg hover:bg-muted/80 transition-all duration-200 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="block w-full px-4 py-2 bg-muted text-foreground text-base font-medium rounded-lg hover:bg-muted/80 transition-all duration-200 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}