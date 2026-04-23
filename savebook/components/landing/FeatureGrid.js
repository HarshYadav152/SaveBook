import { FileText, Link2, NotebookTabs, PencilLine, Search, Share2 } from "lucide-react";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: PencilLine,
    title: "Write without setup friction",
    description: "Jump into note-taking fast with a cleaner editor flow and less visual clutter.",
  },
  {
    icon: NotebookTabs,
    title: "Organize ideas by context",
    description: "Keep notes structured so personal writing, study material, and work thinking stay easy to revisit.",
  },
  {
    icon: Share2,
    title: "Share when needed",
    description: "Turn selected notes into shareable content without reformatting everything from scratch.",
  },
  {
    icon: Link2,
    title: "Support richer references",
    description: "Link previews and media support make notes feel more like living resources than plain text blocks.",
  },
  {
    icon: Search,
    title: "Return to the right note quickly",
    description: "A better information home is not just about creating notes, but about finding them again.",
  },
  {
    icon: FileText,
    title: "Make everyday thinking visible",
    description: "Use SaveBook for planning, journaling, research capture, meeting notes, and ongoing documentation.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="landing-panel overflow-hidden p-8 sm:p-10">
        <SectionHeading
          eyebrow="What it does"
          title="The product story moves from promise to practical value."
          description="This section gives visitors a quick scan of the actual utility behind SaveBook so the homepage feels credible, not just decorative."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(148,163,184,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
