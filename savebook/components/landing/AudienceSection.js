import { BriefcaseBusiness, GraduationCap, Lightbulb, PenSquare } from "lucide-react";
import SectionHeading from "./SectionHeading";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students and learners",
    description: "Keep course notes, reading highlights, and revision material organized in one accessible space.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Professionals",
    description: "Capture meeting notes, project context, and daily planning without juggling scattered tools.",
  },
  {
    icon: PenSquare,
    title: "Writers and creators",
    description: "Use SaveBook as a quick drafting area for ideas, outlines, references, and rough content fragments.",
  },
  {
    icon: Lightbulb,
    title: "Curious builders",
    description: "Anyone who collects thoughts, experiments, and research can use it as a lightweight thinking system.",
  },
];

export default function AudienceSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeading
          eyebrow="Best for"
          title="Built for people who need clarity more than complexity."
          description="Instead of trying to be everything for everyone, SaveBook works best for people who want a reliable place to capture and shape everyday knowledge."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <article key={audience.title} className="landing-panel p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{audience.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{audience.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
