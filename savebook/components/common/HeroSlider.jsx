"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Book, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth/authContext";

const slides = [
  {
    id: 1,
    image: "/hero-1.png",
    title: "Focus on Your Thoughts",
    subtitle: "A clean, distraction-free environment for your best ideas.",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    image: "/hero-2.png",
    title: "Secure & Synchronized",
    subtitle: "Your notes, available everywhere, protected by industry-standard encryption.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    image: "/hero-3.png",
    title: "Capture Creativity",
    subtitle: "Don't let inspiration slip away. Jot it down instantly.",
    color: "from-orange-500 to-pink-500",
  },
  {
    id: 4,
    image: "/hero-4.png",
    title: "Organize Your Life",
    subtitle: "Structure your knowledge base with powerful tagging and search.",
    color: "from-indigo-500 to-blue-500",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-100 font-medium text-sm tracking-wide">Premium Note Taking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${slides[currentSlide].color} text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1 hover:brightness-110`}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                href="/notes"
                className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${slides[currentSlide].color} text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1 hover:brightness-110`}
              >
                <Book className="w-5 h-5" />
                Go to My Notes
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Loop Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full h-3 ${currentSlide === index ? "w-10 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
