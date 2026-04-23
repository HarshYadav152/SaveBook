"use client";

import { motion } from "framer-motion";

export default function AuthShell({ eyebrow, title, description, asideTitle, asideCopy, children }) {
  return (
    <div className="auth-shell flex min-h-screen items-center px-4 py-28 md:px-8">
      <div className="site-container">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="auth-panel flex flex-col justify-between rounded-[2.6rem] p-8 md:p-10"
          >
            <div>
              <p className="section-kicker">{eyebrow}</p>
              <h1 className="mt-5 text-[clamp(3rem,5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.07em] text-[color:var(--foreground)]">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--muted)] md:text-lg">{description}</p>
            </div>

            <div className="mt-12 rounded-[2rem] border border-[var(--border)] bg-[color:var(--background)]/72 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-2)]">{asideTitle}</p>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{asideCopy}</p>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.08 }}
            className="auth-panel rounded-[2.6rem] p-6 md:p-8 xl:p-10"
          >
            {children}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
