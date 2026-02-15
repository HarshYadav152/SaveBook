"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth/authContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktop = desktopDropdownRef.current?.contains(event.target);
      const isMobile = mobileDropdownRef.current?.contains(event.target);
      if (dropdownOpen && !isDesktop && !isMobile) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!isClient) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* ✅ LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/savebook.png"
              alt="SaveBook Logo"
              width={140}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* ✅ Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center"
                >
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
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Edit Profile
                    </Link>
                    <Link
                      href="/notes"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Notes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ✅ Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <Link href="/notes" onClick={() => setIsMenuOpen(false)} className="block text-center bg-blue-600 text-white py-2 rounded-lg">
                  My Notes
                </Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block text-center bg-gray-200 dark:bg-gray-700 py-2 rounded-lg">
                  Edit Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-center bg-red-100 text-red-600 py-2 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-center bg-gray-200 dark:bg-gray-700 py-2 rounded-lg">
                  Login
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block text-center bg-blue-600 text-white py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
