"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Layers3, Sparkles, Stars } from "lucide-react";

const heroCards = [
  { title: "Daily planning", body: "Keep quick priorities, reminders, and thought fragments close at hand.", accent: "from-sky-500/20 to-blue-500/0", delay: 0 },
  { title: "Research capture", body: "Collect links, summaries, and references in one place you will actually revisit.", accent: "from-violet-500/18 to-fuchsia-500/0", delay: 0.12 },
  { title: "Shareable notes", body: "Turn a useful note into a public link without rebuilding the content somewhere else.", accent: "from-emerald-500/18 to-cyan-500/0", delay: 0.24 },
];

export default function HeroSection({ isAuthenticated, user, loading }) {
  const primaryHref = isAuthenticated ? "/notes" : "/register";
  const primaryLabel = loading ? "Checking your space..." : isAuthenticated ? "Open my notes" : "Create an account";

  return (
    <section className="hero-surface relative min-h-screen overflow-hidden pt-28 md:pt-32">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb left-[5%] top-[18%] h-48 w-48 bg-sky-400/20 md:h-72 md:w-72" aria-hidden="true" />
      <div className="hero-orb right-[4%] top-[12%] h-56 w-56 bg-fuchsia-400/16 [animation-delay:-4s]" aria-hidden="true" />
      <div className="hero-orb bottom-[10%] left-[38%] h-52 w-52 bg-emerald-400/16 [animation-delay:-2s]" aria-hidden="true" />
      <div className="hero-ring left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="site-container px-4 pb-18 pt-8 md:px-8 md:pb-24">
        <div className="grid min-h-[calc(100vh-8rem)] gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center py-10 md:py-16"
          >
            <div className="glass-panel inline-flex w-fit items-center gap-3 rounded-full px-4 py-2 text-sm font-medium text-[color:var(--foreground)]">
              <Sparkles className="h-4 w-4 text-[color:var(--accent-2)]" />
              {isAuthenticated && user ? `Welcome back, ${user.username}` : "Your personal notebook for ideas, planning, and knowledge"}
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(3.7rem,7vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.08em] text-[color:var(--foreground)]">
              Make your notes
              <span className="block bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                feel worth returning to.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[color:var(--muted)] md:text-xl">
              SaveBook helps you capture notes quickly, organize what matters, and come back to your thoughts from anywhere.
              From everyday planning to deeper research, it gives your ideas a calm place to live and grow.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href={primaryHref} className="site-button">
                <BookOpenText className="h-5 w-5" />
                <span>{primaryLabel}</span>
                {!loading && <ArrowRight className="h-5 w-5" />}
              </Link>
              <Link href="/#features" className="site-button-ghost">
                <Layers3 className="h-5 w-5" />
                <span>See what SaveBook does</span>
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                { value: "Capture", label: "Write down ideas, tasks, and notes the moment they appear." },
                { value: "Organize", label: "Keep personal writing, research, and planning in one place." },
                { value: "Return", label: "Open your notes again whenever you need context, clarity, or momentum." },
              ].map((item) => (
                <div key={item.value} className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-2)]">{item.value}</p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative flex min-h-[38rem] items-center justify-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="hero-card relative w-full overflow-hidden rounded-[2.25rem] p-5 md:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_26%)]" aria-hidden="true" />
              <div className="relative grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-[1.8rem] bg-[color:var(--background)]/80 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-500">
                    <Stars className="h-3.5 w-3.5" />
                    Why SaveBook
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-[color:var(--foreground)] md:text-3xl">
                    A focused space for notes you actually want to revisit.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    SaveBook is built for writing things down before they disappear, shaping rough thoughts into useful notes,
                    and keeping your knowledge within reach as your work and life keep moving.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {heroCards.map((card) => (
                    <motion.article
                      key={card.title}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 + card.delay }}
                      className={`relative overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-gradient-to-br ${card.accent} p-5 md:p-6`}
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl dark:bg-white/5" aria-hidden="true" />
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-2)]">Use case</p>
                      <h3 className="mt-4 text-xl font-semibold text-[color:var(--foreground)]">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{card.body}</p>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
