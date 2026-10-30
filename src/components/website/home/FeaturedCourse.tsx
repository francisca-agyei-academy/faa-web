import Image from "next/image";
import laptopClassroom from "@/assets/images/student-laptop-classroom.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Layers, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { featuredCourse as course } from "@/content/courses";
import { SectionHeading } from "../SectionHeading";

export function FeaturedCourse() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Start with our flagship course">
          <p>Eight focused modules take you from first search to a strategic, fully funded application.</p>
        </SectionHeading>

        <Reveal className="mt-12">
        <div className="group grid overflow-hidden rounded-4xl border border-line bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-80 overflow-hidden">
            {/* A different photo from the hero, so the graduate image isn't shown twice */}
            <Image
              src={laptopClassroom}
              alt="A student planning applications on a laptop in a seminar room"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              placeholder="blur"
              className="object-cover object-[60%_center] transition-transform duration-[1.2s] [transition-timing-function:var(--ease-premium)] group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col p-8 sm:p-12">
            <h3 className="font-display text-3xl font-semibold leading-tight text-ink">{course.title}</h3>
            {course.outcome && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface p-5">
                  <p className="text-sm font-medium text-subtle">Before</p>
                  <p className="mt-2 text-sm italic leading-relaxed text-muted">&ldquo;{course.outcome.from}&rdquo;</p>
                </div>
                <div className="rounded-xl border border-accent/40 bg-accent-soft p-5">
                  <p className="text-sm font-medium text-accent-strong">After</p>
                  <p className="mt-2 text-sm italic leading-relaxed text-ink">&ldquo;{course.outcome.to}&rdquo;</p>
                </div>
              </div>
            )}
            <ol className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {course.modules?.map((m) => (
                <li key={m.number} className="flex gap-3 text-sm text-ink">
                  <span className="font-display font-semibold text-accent-strong">{String(m.number).padStart(2, "0")}</span>
                  {m.title}
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-10">
              <ButtonLink href={`/courses/${course.slug}`} size="lg">
                See the full course <ArrowRight className="size-4" />
              </ButtonLink>
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Layers className="size-4" /> Buy module by module
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Sparkle className="size-4" /> Includes the Student Toolkit
              </span>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
