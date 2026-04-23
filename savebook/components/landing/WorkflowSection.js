import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Capture the thought",
    description: "Start with a reminder, meeting note, research point, or passing idea before it slips away.",
  },
  {
    number: "02",
    title: "Shape it into something useful",
    description: "Add detail, links, media, and structure so a quick note can become something you can really use again.",
  },
  {
    number: "03",
    title: "Return whenever you need it",
    description: "Open SaveBook later and still have your context, ideas, and personal knowledge ready when you need them.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="site-container px-4 md:px-8">
        <div className="max-w-4xl">
          <p className="section-kicker">Flow</p>
          <h2 className="section-heading mt-5">SaveBook follows a simple note-taking rhythm that fits real everyday use.</h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass-panel rounded-[2.25rem] p-6 md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent-2)]">{step.number}</p>
              <h3 className="mt-6 text-2xl font-semibold text-[color:var(--foreground)]">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
