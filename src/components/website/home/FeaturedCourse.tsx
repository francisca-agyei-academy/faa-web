import Image from "next/image";
import Link from "next/link";
import laptopClassroom from "@/assets/images/student-laptop-classroom.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Layers, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { featuredOf, getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import type { CatalogModule } from "@/types/catalog";
import { SectionHeading } from "../SectionHeading";

/** One module as a card, in the same style as the course cards further down the page. */
function ModuleCard({ module, number, href }: { module: CatalogModule; number: number; href: string }) {
  const label = String(number).padStart(2, "0");
  const hasPrice = module.price !== null && module.price > 0;
  return (
    <Link
      href={href}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10"
    >
      <div className="relative flex h-36 items-end justify-between overflow-hidden bg-brand px-6 pb-5">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-12 size-44 rounded-full bg-accent/25 blur-2xl transition-transform duration-700 group-hover:scale-125"
        />
        <span className="relative rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/20">
          Module {number}
        </span>
        <span aria-hidden="true" className="relative font-display text-7xl font-semibold leading-none text-accent">
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-brand">{module.title}</h3>
        {module.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{module.description}</p>
        ) : (
          module.topics.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {module.topics.slice(0, 4).map((topic) => (
                <li key={topic} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
                  {topic}
                </li>
              ))}
              {module.topics.length > 4 && (
                <li className="rounded-full px-1 py-1 text-xs font-medium text-subtle">+{module.topics.length - 4} more</li>
              )}
            </ul>
          )
        )}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5 text-subtle">
            <Layers className="size-4" />
            {module.topics.length} {module.topics.length === 1 ? "topic" : "topics"}
          </span>
          {hasPrice ? (
            <span className="font-semibold text-ink">{formatPrice(module.price!)}</span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-brand">
              View <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export async function FeaturedCourse() {
  const courses = await getCatalog();
  if (!courses?.length) return null;
  const course = featuredOf(courses)!;
  const href = `/courses/${course.slug}`;
  const outcome = course.outcomeFrom && course.outcomeTo ? { from: course.outcomeFrom, to: course.outcomeTo } : null;
  const modules = [...course.modules].sort((a, b) => a.order - b.order);
  // Four across when the modules fill whole rows of four (e.g. 8), otherwise three.
  const columns = modules.length % 4 === 0 ? 4 : 3;
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Start with our flagship course">
          <p>{course.description}</p>
        </SectionHeading>

        <Reveal className="mt-12">
          <div className="group grid overflow-hidden rounded-4xl border border-line bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-80 overflow-hidden">
              {/* A different photo from the hero, so the graduation image isn't shown twice */}
              <Image
                src={laptopClassroom}
                alt="Students from different backgrounds talking in a lecture hall"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                placeholder="blur"
                className="object-cover object-[60%_center] transition-transform duration-[1.2s] [transition-timing-function:var(--ease-premium)] group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col p-8 sm:p-12">
              <h3 className="font-display text-3xl font-semibold leading-tight text-ink">{course.title}</h3>
              {outcome && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-surface p-5">
                    <p className="text-sm font-medium text-subtle">Before</p>
                    <p className="mt-2 text-sm italic leading-relaxed text-muted">&ldquo;{outcome.from}&rdquo;</p>
                  </div>
                  <div className="rounded-xl border border-accent/40 bg-accent-soft p-5">
                    <p className="text-sm font-medium text-accent-strong">After</p>
                    <p className="mt-2 text-sm italic leading-relaxed text-ink">&ldquo;{outcome.to}&rdquo;</p>
                  </div>
                </div>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-10">
                <ButtonLink href={href} size="lg">
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

        {modules.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {modules.length} {modules.length === 1 ? "module" : "modules"} in this course
              </h3>
              <p className="text-sm text-muted">Buy the ones you need, when you need them.</p>
            </div>
            <div className={`mt-8 grid gap-6 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {modules.map((module, index) => (
                <Reveal key={module.id} delay={(index % columns) * 120} className="flex">
                  <ModuleCard module={module} number={index + 1} href={href} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
