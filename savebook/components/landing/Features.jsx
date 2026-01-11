"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cloud, Sparkles, FileText, Link2, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Sub-100ms load times with edge-first architecture. Your notes load before you finish clicking.",
    size: "large"
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "AES-256 encryption at rest and in transit.",
    highlight: true
  },
  {
    icon: Cloud,
    title: "Real-time Sync",
    description: "Instant sync across unlimited devices.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Intelligence",
    description: "Smart suggestions, auto-tagging, and intelligent search. Let AI organize your thoughts while you focus on creating.",
    size: "large"
  },
  {
    icon: FileText,
    title: "Rich Formatting",
    description: "Markdown, code blocks, tables, and embeds.",
  },
  {
    icon: Link2,
    title: "Bi-directional Links",
    description: "Create knowledge graphs with linked notes.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your writing habits and productivity patterns.",
  },
  {
    icon: Globe,
    title: "Publish Anywhere",
    description: "Share notes as beautiful web pages with one click.",
  },
];

const Features = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-black">Features</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            Everything you need,
            <br />
            nothing <span className="text-gray-400">you don't</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A thoughtfully crafted toolkit for modern knowledge workers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`
                group border-2 border-black rounded-3xl p-6 transition-all duration-300 hover:shadow-lg bg-white
                ${feature.size === 'large' ? 'md:col-span-2 lg:row-span-1' : ''}
                ${feature.highlight ? 'bg-green-100' : ''}
              `}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display text-xl font-bold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
