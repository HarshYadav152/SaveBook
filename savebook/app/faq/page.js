"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is SaveBook?",
    answer:
      "SaveBook is a high-performance, modern web application designed for note-taking and knowledge management. It provides a fast, intuitive, and clutter-free environment for organizing your digital life.",
  },
  {
    question: "Do I need an account to use SaveBook?",
    answer:
      "You can explore SaveBook without an account, but creating a free account lets you securely save your notes to the cloud and access them from any device.",
  },
  {
    question: "How do I create a new note?",
    answer:
      "Once logged in, navigate to the Notes section and click the 'Add Note' button. You can then write, format, and save your note instantly.",
  },
  {
    question: "Is my data saved automatically?",
    answer:
      "Yes! SaveBook auto-saves your notes as you type, so you never have to worry about losing your work.",
  },
  {
    question: "Can I access my notes on mobile?",
    answer:
      "Absolutely. SaveBook is fully responsive and works seamlessly across mobile, tablet, and desktop devices.",
  },
  {
    question: "How do I organize my notes?",
    answer:
      "You can organize notes using tags and categories available in your notes dashboard. This makes it easy to find any note quickly.",
  },
  {
    question: "Is SaveBook free to use?",
    answer:
      "Yes, SaveBook is completely free. Create an account and start managing your notes at no cost.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "You can open an issue on our GitHub repository at github.com/HarshYadav152/SaveBook. We welcome all feedback and contributions!",
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-blue-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <HelpCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Everything you need to know about SaveBook
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-center"
        >
          <p className="text-blue-700 dark:text-blue-400 font-medium mb-1">
            Still have questions?
          </p>
          <p className="text-blue-600 dark:text-blue-500 text-sm">
            Open an issue on our{" "}
            <a
              href="https://github.com/HarshYadav152/SaveBook/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              GitHub repository
            </a>
            . We're happy to help!
          </p>
        </motion.div>
      </div>
    </div>
  );
}