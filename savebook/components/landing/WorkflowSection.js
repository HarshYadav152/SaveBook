import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    title: "Start with a thought",
    description: "Open SaveBook and capture ideas before they disappear. The interface stays simple so writing can begin immediately.",
  },
  {
    number: "02",
    title: "Shape it into something useful",
    description: "Add detail, structure, links, and supporting context until the note becomes a resource you can actually return to.",
  },
  {
    number: "03",
    title: "Reuse and revisit",
    description: "Come back later, find what matters, and keep building a knowledge base that grows with your work and life.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="How it works"
        title="A simple flow that makes the product easy to understand in one pass."
        description="This section gives the homepage momentum. Visitors can immediately see how the app fits into a real note-taking habit from capture to reuse."
        align="center"
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.number} className="landing-step-card">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{step.number}</div>
            <h3 className="mt-6 text-2xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
