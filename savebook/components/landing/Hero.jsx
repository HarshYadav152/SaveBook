"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Users, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth/authContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight"
        >
          The note taking app
          <br />
          <span className="text-gray-900">developers</span>{" "}
          <span className="text-black">love</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10"
        >
          Lightning-fast, encrypted, and AI-powered. Built for those who think in code, markdown, and ideas that don't wait.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href={isAuthenticated ? "/notes" : "/register"}>
            <Button size="lg" className="bg-black text-white hover:bg-gray-900 text-base px-8 py-6 rounded-full">
              Start for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-6 py-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-black">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-6 py-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-black">2M+</div>
              <div className="text-sm text-gray-600">Notes Created</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-6 py-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-black">4.9</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border-2 border-black bg-white shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-1 text-sm text-gray-600">
                  savebook.app
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="bg-white p-8 md:p-16 min-h-[400px] flex items-center justify-center">
              <div className="max-w-2xl w-full">
                <div className="border-2 border-gray-200 rounded-xl p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
