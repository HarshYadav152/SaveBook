import { BookMarked, Cloud, ShieldCheck, WandSparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";

const values = [
  {
    icon: WandSparkles,
    title: "What the app is",
    description:
      "SaveBook is a personal note workspace built to help people think clearly, write quickly, and return to ideas without friction.",
  },
  {
    icon: BookMarked,
    title: "What it does",
    description:
      "It helps you collect notes, organize knowledge, and keep your writing accessible instead of buried across tabs and random documents.",
  },
  {
    icon: Cloud,
    title: "Why it matters",
    description:
      "Your notes stay available across sessions, which makes SaveBook useful for ongoing projects, learning, and everyday planning.",
  },
  {
    icon: ShieldCheck,
    title: "How it feels",
    description:
      "The experience is meant to stay focused and welcoming, with fewer distractions and clearer actions for both new and returning users.",
  },
];

export default function ValueSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Product overview"
        title="A landing page that explains the product before asking people to commit."
        description="These blocks answer the questions new visitors usually have first: what SaveBook is, what it helps with, and why someone would choose it."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {values.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="landing-panel h-full p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
