"use client"
import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from "framer-motion";
import { BookOpen, LogIn, UserPlus, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth/authContext';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    if (!isClient) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="font-display text-xl font-semibold text-black">
                                SaveBook
                            </span>
                        </div>
                        <div className="h-9 w-20 bg-gray-700/50 rounded-md animate-pulse" />
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-6xl mx-auto">
                <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between md:justify-between">
                    <Link href="/" className="flex items-center gap-2 md:flex-initial absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                        </div>
                        <span className="font-display text-xl font-semibold text-black">
                            SaveBook
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                            <div className="h-9 w-20 bg-gray-700/50 rounded-md animate-pulse" />
                        ) : isAuthenticated ? (
                            <>
                                <Link href="/notes">
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                        My Notes
                                    </Button>
                                </Link>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-semibold hover:bg-amber-500/30 transition-colors"
                                    >
                                        {getInitials(user?.username)}
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800/50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-800/50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-black hover:text-gray-600">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-black z-10"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-2 glass rounded-2xl p-4"
                    >
                        {loading ? (
                            <div className="h-20 bg-gray-700/50 rounded-md animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="flex flex-col gap-2 text-center">
                                <Link
                                    href="/notes"
                                    className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Notes
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg transition-colors text-center"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 text-center">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-center text-black hover:text-gray-600">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full justify-center bg-black text-white hover:bg-gray-800">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}