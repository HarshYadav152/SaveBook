import { motion } from "framer-motion";
import { BrainCircuit, LibraryBig, MonitorSmartphone, ShieldCheck } from "lucide-react";

const values = [
  {
    icon: BrainCircuit,
    title: "A notebook for clear thinking",
    description: "SaveBook gives you one dependable place to collect thoughts, drafts, reminders, and useful knowledge.",
  },
  {
    icon: MonitorSmartphone,
    title: "Available across devices",
    description: "Use SaveBook on desktop or phone and keep your notes close whether you are planning, studying, or working.",
  },
  {
    icon: LibraryBig,
    title: "More than quick note capture",
    description: "SaveBook helps turn scattered thoughts into an organized personal knowledge space you can return to later.",
  },
  {
    icon: ShieldCheck,
    title: "Built for everyday reliability",
    description: "From secure access to cloud-backed notes, SaveBook is meant to support your routine instead of getting in the way.",
  },
];

export default function ValueSection() {
  return (
    <section id="overview" className="band py-24 md:py-32">
      <div className="site-container px-4 md:px-8">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-2xl">
            <p className="section-kicker">Overview</p>
            <h2 className="section-heading mt-5">SaveBook is designed to help your ideas stay useful after the moment you write them down.</h2>
            <p className="section-copy mt-6">
              Whether you are saving quick reminders, building a study archive, or collecting project notes, SaveBook keeps your thinking organized in one personal workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: index * 0.08 }}
                  className="glass-panel rounded-[2rem] p-6 md:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 via-blue-500/14 to-violet-500/16 text-[color:var(--accent)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[color:var(--foreground)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
