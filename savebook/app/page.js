"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/authContext";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  Book,
  Sparkles,
  Loader2,
  Shield,
  Zap,
  Layout,
  Globe,
} from "lucide-react";
import SearchNotes from "@/components/SearchNotes";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: "image",
      src: "/hero-bg-1.png",
      alt: "Futuristic Digital Library"
    },
    {
      type: "image",
      src: "/hero-bg-2.png",
      alt: "Modern Workspace"
    },
    {
      type: "image",
      src: "/hero-bg-3.png",
      alt: "Abstract Tech Data"
    }
  ];

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
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
      <div className="w-full">
        {/* Main Content */}
        <div className="relative w-full">
          {/* Hero Section - Full Screen */}
          <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pb-32 pt-20">
            {/* Background Slider */}
            <div className="absolute inset-0 w-full h-full z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {slides[currentSlide].type === "image" ? (
                    <img
                      src={slides[currentSlide].src}
                      alt={slides[currentSlide].alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${slides[currentSlide].className}`} />
                  )}
                  {/* Dark Overlay for Text Contrast */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-50px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-lg">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium tracking-wide">
                    {isAuthenticated && user ? `Welcome back, ${user.username}!` : "Your Digital Sanctuary"}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg tracking-tight">
                  Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Notes</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                  Search by title, tag, or content instantly.
                  <span className="block mt-2 text-lg text-gray-300">Organize your digital life with SaveBook.</span>
                </p>
              </motion.div>
            </div>
          </div>

          {/* Search Component - Overlapping Hero */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-20">
            <SearchNotes />
          </div>

        </div>

      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Features Section */}
        <div id="features" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to organize your digital life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Cloud Storage",
                description:
                  "Your notes are encrypted and stored securely in the cloud, accessible from anywhere.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Built on Next.js for instant page loads and seamless interactions.",
              },
              {
                icon: Layout,
                title: "Clean Interface",
                description:
                  "Distraction-free writing environment designed to help you focus on your thoughts.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About SaveBook
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  SaveBook was born from a simple idea: note-taking should be effortless.
                  We believe that your tools should get out of the way and let your creativity flow.
                </p>
                <p>
                  Whether you're a student, professional, or creative writer, SaveBook adapts to your workflow.
                  With cross-device synchronization and a beautiful, modern interface, your ideas are always with you.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Open Source & Community Driven
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Our Mission</h4>
                    <p className="text-sm text-gray-500">Simplicity meets Power</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "To provide a digital sanctuary for your thoughts, accessible anywhere, anytime."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

  );
}