import { motion } from "framer-motion";
import { AudioLines, Link2, NotebookTabs, PencilRuler, Share2, Sparkles } from "lucide-react";

const features = [
  {
    icon: NotebookTabs,
    title: "Organize notes around real life",
    description: "Separate quick capture, planning, and long-form notes without making the product feel like a project manager.",
  },
  {
    icon: Link2,
    title: "Keep supporting references visible",
    description: "Link previews and attachments help notes stay useful after the initial writing moment is gone.",
  },
  {
    icon: Share2,
    title: "Share when a note becomes useful",
    description: "Turn an internal note into something public-facing without copying everything into a different tool.",
  },
  {
    icon: AudioLines,
    title: "Capture in more than one format",
    description: "Text, media, and recorded audio fit a notebook workflow better when they live together.",
  },
  {
    icon: PencilRuler,
    title: "A calmer writing space",
    description: "The experience stays focused so you can think, write, and review without feeling buried under clutter.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="site-container px-4 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-[2.5rem] p-7 md:p-10">
            <p className="section-kicker">Features</p>
            <h2 className="section-heading mt-5 max-w-4xl">Everything in SaveBook is built around capturing, shaping, and reusing what matters.</h2>
            <p className="section-copy mt-6">
              SaveBook is not just a place to type text. It helps you collect context, enrich notes with links and media, and keep useful information ready for later.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {features.slice(0, 4).map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="rounded-[2rem] border border-[var(--border)] bg-[color:var(--background-strong)]/80 p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-sky-500/10 text-[color:var(--accent-2)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[color:var(--foreground)]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{feature.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75 }}
            className="glass-panel relative overflow-hidden rounded-[2.5rem] p-7 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%)]" aria-hidden="true" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">
                <Sparkles className="h-3.5 w-3.5" />
                Everyday value
              </div>
              <h3 className="mt-6 text-3xl font-semibold text-[color:var(--foreground)]">A better note becomes a better resource.</h3>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                SaveBook helps you move from rough capture to organized insight. Instead of losing ideas in random tabs and files, you can keep them in a place built for return visits.
              </p>

              <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[color:var(--background)]/70 p-5">
                <div className="grid gap-4">
                  {[
                    "Capture thoughts before they disappear.",
                    "Expand notes with context, links, and media.",
                    "Come back later and still find what matters.",
                  ].map((point) => (
                    <div key={point} className="rounded-[1.4rem] border border-[var(--border)] bg-[color:var(--background-strong)]/70 px-4 py-4 text-sm text-[color:var(--foreground)]">
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border border-dashed border-[var(--border)] px-5 py-4 text-sm text-[color:var(--muted)]">
                SaveBook fits both quick daily use and slower long-form thinking, which makes it useful for students, creators, and professionals alike.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
