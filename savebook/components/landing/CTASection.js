import Link from "next/link";
import { ArrowRight, NotebookText } from "lucide-react";

export default function CTASection({ isAuthenticated, loading }) {
  const href = isAuthenticated ? "/notes" : "/register";
  const label = loading ? "Loading..." : isAuthenticated ? "Go to your notes" : "Create your account";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="landing-cta-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/72">Ready to use</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Give SaveBook a first impression that feels as polished as the product ambition.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/78 sm:text-lg">
            New visitors should understand the app quickly, and returning users should still have a fast path back to their notes.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href={href} className="landing-button bg-white text-slate-950 shadow-[0_18px_45px_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
            <NotebookText className="h-5 w-5" />
            <span>{label}</span>
            {!loading && <ArrowRight className="h-5 w-5" />}
          </Link>
          <Link href="/docs" className="landing-button border border-white/30 bg-white/10 text-white hover:bg-white/20">
            <span>Read the docs</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
