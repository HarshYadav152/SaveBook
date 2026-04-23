import { motion } from "framer-motion";
import { BriefcaseBusiness, GraduationCap, PenSquare, Sparkle } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    copy: "Course notes, reading summaries, and revision prep become easier to revisit when they are not buried in random files.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Professionals",
    copy: "Meeting notes, project context, and personal task planning can live together without forcing a heavy workflow tool.",
  },
  {
    icon: PenSquare,
    title: "Writers and creators",
    copy: "SaveBook works well as a draft bench for outlines, fragments, references, and content ideas that are still taking shape.",
  },
  {
    icon: Sparkle,
    title: "Independent thinkers",
    copy: "If you like collecting thoughts and returning later with fresh context, SaveBook gives those ideas a stable place to stay useful.",
  },
];

export default function AudienceSection() {
  return (
    <section id="audiences" className="band py-24 md:py-32">
      <div className="site-container px-4 md:px-8">
        <div className="grid gap-12 xl:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="section-kicker">Who It&apos;s For</p>
            <h2 className="section-heading mt-5">SaveBook works best for people who want a simple place to think, write, and come back later.</h2>
            <p className="section-copy mt-6">
              It is useful for anyone who saves ideas regularly and wants those notes to remain organized, accessible, and worth revisiting over time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;

              return (
                <motion.article
                  key={audience.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="glass-panel rounded-[2rem] p-6 md:p-7"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 to-violet-500/15 text-[color:var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">{audience.title}</h3>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">{audience.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
