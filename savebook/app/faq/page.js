"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Search,
  Star,
  ShieldCheck,
  Clock3,
  Smartphone,
  Mail,
  MessageCircle,
  ExternalLink,
  BookOpen,
  LifeBuoy,
  Sparkles,
  FolderKanban,
  Github,
} from "lucide-react";

const faqGroups = [
  {
    title: "Getting Started",
    icon: <BookOpen className="w-5 h-5" />,
    faqs: [
      {
        question: "What is SaveBook?",
        answer:
          "SaveBook is a modern note-taking and knowledge management platform built for speed, productivity, and simplicity. It helps you capture, organize, and access notes from anywhere.",
        popular: true,
      },
      {
        question: "Do I need an account to use SaveBook?",
        answer:
          "You can browse and explore SaveBook without an account, but creating one unlocks cloud sync, backups, and cross-device access.",
      },
      {
        question: "How do I create a new note?",
        answer:
          "After signing in, go to your dashboard and click the 'Add Note' button. You can instantly start typing and formatting your content.",
      },
    ],
  },
  {
    title: "Features & Usage",
    icon: <Sparkles className="w-5 h-5" />,
    faqs: [
      {
        question: "Is my data saved automatically?",
        answer:
          "Yes. SaveBook automatically saves your notes in real time so your progress is never lost.",
        popular: true,
      },
      {
        question: "Can I access my notes on mobile devices?",
        answer:
          "Absolutely. SaveBook is fully responsive and optimized for phones, tablets, and desktops.",
      },
      {
        question: "How do I organize my notes?",
        answer:
          "You can use folders, tags, categories, and search filters to keep your workspace clean and easy to navigate.",
      },
      {
        question: "Does SaveBook support dark mode?",
        answer:
          "Yes. SaveBook includes a beautiful dark mode and automatically adapts to your device preferences.",
      },
    ],
  },
  {
    title: "Security & Pricing",
    icon: <ShieldCheck className="w-5 h-5" />,
    faqs: [
      {
        question: "Is SaveBook free to use?",
        answer:
          "Yes. SaveBook is completely free for core note-taking features and cloud sync.",
        popular: true,
      },
      {
        question: "How secure is my data?",
        answer:
          "Your notes are stored securely using encrypted cloud infrastructure and protected authentication systems.",
      },
      {
        question: "Can I export my notes?",
        answer:
          "Yes. You can export your notes anytime for backups or offline access.",
      },
    ],
  },
  {
    title: "Support",
    icon: <LifeBuoy className="w-5 h-5" />,
    faqs: [
      {
        question: "How do I report bugs or suggest features?",
        answer:
          "You can open issues and submit feature requests through our GitHub repository. Community feedback helps us improve SaveBook.",
      },
      {
        question: "How can I contact support?",
        answer:
          "You can reach our support team through email or community channels listed below.",
      },
    ],
  },
];

const quickLinks = [
  {
    title: "Documentation",
    icon: <BookOpen className="w-5 h-5" />,
    href: "#",
  },
  {
    title: "Community",
    icon: <MessageCircle className="w-5 h-5" />,
    href: "#",
  },
  {
    title: "GitHub",
    icon: <Github className="w-5 h-5" />,
    href: "https://github.com/HarshYadav152/SaveBook",
  },
  {
    title: "Dashboard",
    icon: <FolderKanban className="w-5 h-5" />,
    href: "#",
  },
];

const stats = [
  {
    title: "Active Users",
    value: "25K+",
    icon: <UsersIcon />,
  },
  {
    title: "Notes Created",
    value: "1M+",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: "Auto Saves",
    value: "99.9%",
    icon: <Clock3 className="w-6 h-6" />,
  },
  {
    title: "Platforms",
    value: "All Devices",
    icon: <Smartphone className="w-6 h-6" />,
  },
];

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5V18a4 4 0 00-4-4h-1M9 20H4V18a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0zM6 12a3 3 0 100-6 3 3 0 000 6z"
      />
    </svg>
  );
}

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group border border-gray-200/80 dark:border-gray-700 rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <HelpCircle className="w-5 h-5 text-blue-500" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">
                {faq.question}
              </h3>

              {faq.popular && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
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
            <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40">
              <p className="leading-8 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SupportCard({ icon, title, text, buttonText, href }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm leading-7 mb-5">
        {text}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all"
      >
        {buttonText}
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    return faqGroups
      .map((group) => ({
        ...group,
        faqs: group.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((group) => group.faqs.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16 lg:py-20 max-w-7xl">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20 mb-6">
            <HelpCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-8">
            Find answers, explore features, and learn everything about
            SaveBook in one place.
          </p>

          {/* SEARCH */}
          <div className="relative mt-10 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search questions, topics, features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-12 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                {stat.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div className="mt-14">
          <div className="flex flex-wrap gap-3 justify-center">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md"
              >
                {link.icon}
                {link.title}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ GROUPS */}
        <div className="mt-16 space-y-12">
          {filteredGroups.map((group, groupIndex) => (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {group.icon}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {group.title}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Browse answers related to {group.title.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {group.faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* SUPPORT SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Still Need Help?
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-8">
              Can’t find the answer you’re looking for? Reach out to our team
              or explore additional support resources below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SupportCard
              icon={<Mail className="w-6 h-6" />}
              title="Email Support"
              text="Get direct help from our support team for technical or account-related issues."
              buttonText="Contact Support"
              href="mailto:support@savebook.app"
            />

            <SupportCard
              icon={<Github className="w-6 h-6" />}
              title="GitHub Issues"
              text="Report bugs, request features, and contribute to SaveBook development."
              buttonText="Open Repository"
              href="https://github.com/HarshYadav152/SaveBook/issues"
            />

            <SupportCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="Community Help"
              text="Join discussions, share feedback, and connect with other SaveBook users."
              buttonText="Join Community"
              href="#"
            />
          </div>
        </motion.section>

        {/* FOOTER CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600" />

          <div className="relative z-10 px-8 py-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to organize your digital life?
            </h2>

            <p className="max-w-2xl mx-auto text-blue-100 leading-8 mb-8">
              Start using SaveBook today and experience modern note-taking with
              lightning-fast performance and beautiful design.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:scale-105 transition-transform shadow-lg">
                Get Started
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}