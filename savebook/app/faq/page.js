"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Search,
  Star,
  ShieldCheck,
  Smartphone,
  Mail,
  MessageCircle,
  ExternalLink,
  BookOpen,
  LifeBuoy,
  Sparkles,
  FolderKanban,
  Github,
  Clock3,
} from "lucide-react";

const faqGroups = [
  {
    title: "Getting Started",
    icon: <BookOpen className="w-5 h-5" />,
    faqs: [
      {
        question: "What is SaveBook?",
        answer:
          "SaveBook is a modern note-taking and knowledge management platform built for speed, productivity, and simplicity.",
        popular: true,
      },
      {
        question: "Do I need an account to use SaveBook?",
        answer:
          "You can browse without an account, but signing in enables sync and backups.",
      },
    ],
  },
  {
    title: "Features",
    icon: <Sparkles className="w-5 h-5" />,
    faqs: [
      {
        question: "Is my data saved automatically?",
        answer:
          "Yes, SaveBook auto-saves everything in real time.",
        popular: true,
      },
      {
        question: "Does SaveBook support dark mode?",
        answer:
          "Yes, it fully supports system-based dark mode.",
      },
    ],
  },
  {
    title: "Security",
    icon: <ShieldCheck className="w-5 h-5" />,
    faqs: [
      {
        question: "Is SaveBook free?",
        answer: "Yes, core features are completely free.",
        popular: true,
      },
      {
        question: "How secure is my data?",
        answer:
          "All data is encrypted and stored securely.",
      },
    ],
  },
];

const quickLinks = [
  {
    title: "Documentation",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/docs",
  },
  {
    title: "Community",
    icon: <MessageCircle className="w-5 h-5" />,
    href: "/community",
  },
  {
    title: "GitHub",
    icon: <Github className="w-5 h-5" />,
    href: "https://github.com/HarshYadav152/SaveBook",
  },
  {
    title: "Dashboard",
    icon: <FolderKanban className="w-5 h-5" />,
    href: "/notes",
  },
];

const stats = [
  {
    title: "Auto Save Time",
    value: "Real-time",
    icon: <Clock3 className="w-6 h-6" />,
  },
  {
    title: "Platforms",
    value: "All Devices",
    icon: <Smartphone className="w-6 h-6" />,
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-border rounded-2xl bg-card shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-muted transition"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground">
              {faq.question}
            </h3>

            {faq.popular && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                <Star className="w-3 h-3" />
                Popular
              </span>
            )}
          </div>
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-5 border-t border-border bg-muted/40"
          >
            <p className="text-muted-foreground leading-7">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SupportCard({ icon, title, text, buttonText, href }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 leading-6">
        {text}
      </p>

      <a
        href={href}
        className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition"
      >
        {buttonText}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    return faqGroups
      .map((group) => ({
        ...group,
        faqs: group.faqs.filter(
          (f) =>
            f.question.toLowerCase().includes(search.toLowerCase()) ||
            f.answer.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((g) => g.faqs.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* HERO */}
        <div className="text-center">
          <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />

          <h1 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h1>

          <p className="text-muted-foreground mt-4">
            Everything you need to know about SaveBook
          </p>

          {/* SEARCH */}
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="text-primary mb-2">{s.icon}</div>
              <h3 className="text-xl font-bold">{s.value}</h3>
              <p className="text-muted-foreground text-sm">{s.title}</p>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-wrap gap-3 justify-center mt-10">
          {quickLinks.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted transition"
            >
              {l.icon}
              {l.title}
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12 space-y-10">
          {filteredGroups.map((g, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {g.icon}
                {g.title}
              </h2>

              <div className="space-y-4">
                {g.faqs.map((f, idx) => (
                  <FAQItem key={idx} faq={f} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SUPPORT */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <SupportCard
            icon={<Mail className="w-6 h-6" />}
            title="Email Support"
            text="Get help from our support team."
            buttonText="Contact"
            href="mailto:support@savebook.app"
          />

          <SupportCard
            icon={<Github className="w-6 h-6" />}
            title="GitHub Issues"
            text="Report bugs or request features."
            buttonText="Open"
            href="https://github.com/HarshYadav152/SaveBook/issues"
          />

          <SupportCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Community"
            text="Connect with other users."
            buttonText="Join"
            href="/community"
          />
        </div>
      </div>
    </div>
  );
}