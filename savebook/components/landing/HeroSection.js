"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, LogIn, Sparkles, UserPlus } from "lucide-react";

export default function HeroSection({ isAuthenticated, user, loading }) {
  const primaryHref = isAuthenticated ? "/notes" : "/register";
  const primaryLabel = isAuthenticated ? "Open My Notes" : "Start Free";
  const welcomeLabel =
    isAuthenticated && user ? `Welcome back, ${user.username}` : "Calm note-taking for busy minds";

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36">
      <div className="landing-orb landing-orb-a" aria-hidden="true" />
      <div className="landing-orb landing-orb-b" aria-hidden="true" />
      <div className="landing-grid absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <div className="landing-chip mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{welcomeLabel}</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Capture ideas fast.
            <span className="block text-slate-600">Shape them into something useful.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            SaveBook gives you a focused space to collect notes, organize knowledge, and return to your best ideas
            without the clutter of a bloated workspace.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link href={primaryHref} className="landing-button landing-button-primary">
              <BookOpenText className="h-5 w-5" />
              <span>{loading ? "Checking your session..." : primaryLabel}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </Link>

            {!isAuthenticated && !loading && (
              <>
                <Link href="/login" className="landing-button landing-button-secondary">
                  <LogIn className="h-5 w-5" />
                  <span>Log In</span>
                </Link>
                <Link href="/notes" className="landing-button landing-button-ghost">
                  <UserPlus className="h-5 w-5" />
                  <span>Explore Notes</span>
                </Link>
              </>
            )}

            {isAuthenticated && !loading && (
              <Link href="/profile" className="landing-button landing-button-secondary">
                <span>View Profile</span>
              </Link>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "Fast", label: "Clean writing flow with rich note editing" },
              { value: "Cloud", label: "Access your notes wherever you sign in" },
              { value: "Focused", label: "Built for personal knowledge, not noise" },
            ].map((item) => (
              <div key={item.label} className="landing-stat-card">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">{item.value}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="landing-showcase"
        >
          <div className="landing-showcase-window">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Today&apos;s workspace</p>
                <p className="text-sm text-slate-500">A landing view designed to feel calm and capable.</p>
              </div>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-[28px] bg-slate-950 p-5 text-slate-50 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Notes synced
                </div>
                <h2 className="mt-6 text-2xl font-semibold">Build a system around your thinking, not the other way around.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Draft quickly, return easily, and keep the important details available when you need them.
                </p>
                <div className="mt-6 space-y-3">
                  {["Meeting notes", "Research snippets", "Personal planning"].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_55px_rgba(148,163,184,0.2)]">
                  <p className="text-sm font-semibold text-slate-900">Why it feels easier</p>
                  <div className="mt-4 grid gap-3">
                    {[
                      "Landing page guides new visitors instead of overwhelming them.",
                      "Sections scale from phone screens to large desktops cleanly.",
                      "Action areas stay obvious whether users are signed in or just exploring.",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-amber-100 via-white to-teal-100 p-5 shadow-[0_26px_60px_rgba(20,184,166,0.16)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">Good for teams and solo users</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    A strong first page should explain the product, prove value, and help visitors act fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
