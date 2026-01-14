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
import HeroSlider from "@/components/common/HeroSlider";

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
      {/* Hero Section - Full Screen */}
      <HeroSlider />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-start py-10">

          {/* Tagline logic - kept for context below slider if needed, or we can rely on slider text */}
          <div className="max-w-4xl mx-auto text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {isAuthenticated && user
                  ? `Welcome back, ${user.username}!`
                  : "Your Digital Notebook"}
              </span>
            </div>

            <div className="space-y-6 mb-12">
              <div className="max-w-3xl mx-auto text-left bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  SaveBook is a high-performance, modern web application designed for note-taking and knowledge management.
                  Built leveraging the latest <span className="font-semibold text-blue-600 dark:text-blue-400">Next.js</span> features, it provides a fast,
                  intuitive, and clutter-free environment for organizing your digital life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}