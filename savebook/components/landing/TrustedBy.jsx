"use client";

import { motion } from "framer-motion";

const companies = [
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta",
  "Netflix",
  "Spotify",
  "Slack",
  "Figma",
  "Linear",
  "Notion",
  "Vercel",
  "Google",
];

const TrustedBy = () => {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-gray-900 uppercase tracking-wider">
            Trusted by teams at
          </p>
        </motion.div>

        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee wrapper */}
          <div className="overflow-hidden border-t border-b border-black/10 py-8">
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{
                x: [0, -50 * companies.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              whileHover={{
                animationPlayState: "paused",
              }}
            >
              {/* First set */}
              {companies.map((company, index) => (
                <div
                  key={`first-${index}`}
                  className="inline-flex items-center justify-center px-8 py-4 hover:scale-110 transition-transform duration-300"
                >
                  <span className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-600 transition-colors">
                    {company}
                  </span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {companies.map((company, index) => (
                <div
                  key={`second-${index}`}
                  className="inline-flex items-center justify-center px-8 py-4 hover:scale-110 transition-transform duration-300"
                >
                  <span className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-600 transition-colors">
                    {company}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
