"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/authContext";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  Book,
  Sparkles,
  Loader2
} from "lucide-react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading skeleton for SSR/hydration
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-center min-h-screen py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 flex items-center justify-center mx-auto">
                  <img src="savebook.png" className="w-20 h-20 text-white" alt="SaveBook" />
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaveBook
              </h1>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse max-w-md mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 flex items-center justify-center mx-auto">
                <img src="savebook.png" className="w-20 h-20 text-white" alt="SaveBook" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SaveBook
            </h1>

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {isAuthenticated && user 
                  ? `Welcome back, ${user.username}!` 
                  : "Your Digital Notebook"}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-6 mb-12">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="font-semibold text-gray-900 dark:text-white">
                  Empowering your thoughts with a seamless, distraction-free note-taking experience.
                </strong>
              </p>
              
              <div className="max-w-3xl mx-auto text-left bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  SaveBook is a high-performance, modern web application designed for note-taking and knowledge management. 
                  Built leveraging the latest <span className="font-semibold text-blue-600 dark:text-blue-400">Next.js</span> features, it provides a fast, 
                  intuitive, and clutter-free environment for organizing your digital life.
                </p>
              </div>
            </div>

            {/* Action Buttons - Dynamic based on auth status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              {loading ? (
                // Loading state
                <div className="flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                // Authenticated user - Show "Go to Notes" button
                <>
                  <Link 
                    href="/notes"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    <Book className="w-6 h-6" />
                    Go to My Notes
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link 
                    href="/profile"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all w-full sm:w-auto justify-center"
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                // Not authenticated - Show "Start Taking Notes", "Login", and "Sign Up"
                <>
                  <Link 
                    href="/notes"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    <Book className="w-6 h-6" />
                    Start Taking Notes
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <div className="flex gap-4 w-full sm:w-auto">
                    <Link 
                      href="/login"
                      className="inline-flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all w-full sm:w-auto justify-center"
                    >
                      <LogIn className="w-5 h-5" />
                      Login
                    </Link>

                    <Link 
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all w-full sm:w-auto justify-center"
                    >
                      <UserPlus className="w-5 h-5" />
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Additional info for authenticated users */}
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
              >
                <p className="text-green-700 dark:text-green-400 text-sm">
                  ✨ You&apos;re all set! Start organizing your thoughts and ideas.
                </p>
              </motion.div>
            )}

            {/* Additional info for non-authenticated users */}
            {!loading && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
              >
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  💡 Create an account to save your notes securely in the cloud
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}