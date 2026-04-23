"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-semibold uppercase tracking-[0.18em] text-white"
            >
              SaveBook
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              A calmer note-taking app for people who want one dependable place for ideas, planning, and knowledge capture.
            </p>
            <a
              href="https://github.com/HarshYadav152/SaveBook"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit SaveBook GitHub Repository"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm font-medium text-teal-200 transition hover:bg-teal-400/16"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.685-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub repository
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Platform</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/notes" className="transition hover:text-white">Notes</Link></li>
              <li><Link href="/profile" className="transition hover:text-white">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Resources</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/docs" className="transition hover:text-white">Documentation</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              <li><a href="https://github.com/HarshYadav152/SaveBook/issues" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Contributing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Legal</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-white">Terms of Service</Link></li>
              <li><Link href="/licence" className="transition hover:text-white">MIT License</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} SaveBook. Open source and built for thoughtful work.</p>
          <p>Desktop-ready, phone-friendly, and easier to grow from here.</p>
        </div>
      </div>
    </footer>
  );
}
