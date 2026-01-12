"use client";
import React, { useState } from "react";
import { Search, Tag, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchNotes() {
  const [activeTab, setActiveTab] = useState("title");

  return (
    <div className="w-full relative z-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Search Options
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-gray-50 p-2 rounded-2xl">
          <button
            onClick={() => setActiveTab("title")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition-all font-medium text-sm md:text-base w-full md:w-auto ${activeTab === "title"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
            By Title
          </button>
          <button
            onClick={() => setActiveTab("tag")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition-all font-medium text-sm md:text-base w-full md:w-auto ${activeTab === "tag"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Tag className="w-4 h-4 md:w-5 md:h-5" />
            By Tag
          </button>
          <button
            onClick={() => setActiveTab("date")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition-all font-medium text-sm md:text-base w-full md:w-auto ${activeTab === "date"
              ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30"
              : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            By Date
          </button>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {activeTab === "title" && <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
                {activeTab === "tag" && <Tag className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />}
                {activeTab === "date" && <Calendar className="text-gray-400 group-focus-within:text-pink-500 transition-colors" />}
              </div>
              <input
                type={activeTab === "date" ? "date" : "text"}
                placeholder={
                  activeTab === "title"
                    ? "Enter note title..."
                    : activeTab === "tag"
                      ? "Enter tag (e.g., #work)..."
                      : "Select date..."
                }
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 md:w-auto w-full">
              <span>Search</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
