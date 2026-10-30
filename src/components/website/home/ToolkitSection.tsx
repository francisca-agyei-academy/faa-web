import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Document } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { toolkit } from "@/content/academy";
import { SectionHeading } from "../SectionHeading";

export function ToolkitSection() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <SectionHeading title="Templates and trackers that do the heavy lifting">
            <p>
              Ten ready-to-use resources for every stage, from your first supervisor email to your post-acceptance
              checklist.
            </p>
          </SectionHeading>
          <ButtonLink href="/toolkit" variant="secondary" className="mt-8">
            Explore the toolkit <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {toolkit.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 60}>
                <div className="group flex items-start gap-3 rounded-xl border border-line bg-canvas p-4 transition-all duration-300 hover:border-accent/50 hover:bg-surface hover:shadow-md">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-accent">
                    <Document className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="text-xs text-subtle">{item.kind}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
