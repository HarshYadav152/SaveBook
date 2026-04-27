import Link from "next/link";
import { ArrowRight, LogIn, NotebookText } from "lucide-react";

export default function CTASection({ isAuthenticated, loading }) {
  const primaryHref = isAuthenticated ? "/notes" : "/register";
  const primaryLabel = loading ? "Loading..." : isAuthenticated ? "Open your notes" : "Start using SaveBook";

  return (
    <section className="pb-24 md:pb-32">
      <div className="site-container px-4 md:px-8">
        <div className="glass-panel overflow-hidden rounded-[2.75rem]">
          <div className="grid gap-8 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%)] px-6 py-8 md:px-10 md:py-10 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="section-kicker">Ready To Go</p>
              <h2 className="section-heading mt-5">Start building a note space you will actually want to return to.</h2>
              <p className="section-copy mt-6">
                SaveBook is ready for personal notes, planning, research capture, and everything in between. Create an account and keep your ideas close.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <Link href={primaryHref} className="site-button w-full md:w-auto">
                <NotebookText className="h-5 w-5" />
                <span>{primaryLabel}</span>
                {!loading && <ArrowRight className="h-5 w-5" />}
              </Link>
              {!isAuthenticated && (
                <Link href="/login" className="site-button-ghost w-full md:w-auto">
                  <LogIn className="h-5 w-5" />
                  <span>Already using SaveBook?</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
