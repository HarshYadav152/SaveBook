"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const comparisonData = [
  { feature: "Offline-first architecture", savebook: "check", others: "partial" },
  { feature: "End-to-end encryption", savebook: "check", others: "cross" },
  { feature: "Real-time collaboration", savebook: "check", others: "check" },
  { feature: "AI-powered features", savebook: "check", others: "partial" },
  { feature: "Open source", savebook: "check", others: "cross" },
  { feature: "Self-hostable", savebook: "check", others: "cross" },
  { feature: "Unlimited devices", savebook: "check", others: "partial" },
  { feature: "API access", savebook: "check", others: "partial" },
  { feature: "Free tier available", savebook: "check", others: "check" },
];

const Icon = ({ type }) => {
  if (type === "check") {
    return (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="w-5 h-5 text-green-600" />
      </div>
    );
  }
  if (type === "cross") {
    return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <X className="w-5 h-5 text-red-600" />
      </div>
    );
  }
  if (type === "partial") {
    return (
      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
        <Minus className="w-5 h-5 text-yellow-600" />
      </div>
    );
  }
  return null;
};

const Comparison = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-black">Comparison</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            Why choose <span className="text-gray-400">SaveBook?</span>
          </h2>
          <p className="text-gray-600 text-lg">
            See how we stack up against the competition.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-2 border-black rounded-3xl overflow-hidden bg-white"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b-2 border-black bg-gray-50">
            <div className="p-6 font-display font-bold text-black">Feature</div>
            <div className="p-6 text-center border-l-2 border-black">
              <div className="inline-block bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
                SaveBook
              </div>
            </div>
            <div className="p-6 text-center border-l-2 border-black">
              <div className="text-sm font-medium text-gray-500">Others</div>
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className={`grid grid-cols-3 ${
                index !== comparisonData.length - 1 ? "border-b border-gray-200" : ""
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="p-6 font-medium text-black">{row.feature}</div>
              <div className="p-6 flex items-center justify-center border-l border-gray-200">
                <Icon type={row.savebook} />
              </div>
              <div className="p-6 flex items-center justify-center border-l border-gray-200">
                <Icon type={row.others} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;
