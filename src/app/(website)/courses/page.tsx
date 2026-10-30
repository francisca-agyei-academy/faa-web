import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Layers, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { CourseCard, StatusBadge } from "@/components/website/CourseCard";
import { courses, featuredCourse } from "@/content/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses on scholarships, funded Master's and PhDs, studying abroad, academic writing, publishing and AI for research.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function CoursesPage() {
  const others = courses.filter((course) => course.slug !== featuredCourse.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-strong text-white">
        <div
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -right-32 -top-48 size-[520px] rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1
            className="animate-rise max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl"
            style={delay(100)}
          >
            Learn the path to <span className="text-shimmer italic">global</span> academic opportunities
          </h1>
          <p className="animate-rise mt-5 max-w-2xl text-lg text-white/70" style={delay(250)}>
            Practical courses for every stage, from your first scholarship search to publishing and building an
            international career. Buy only the modules you need.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href={`/courses/${featuredCourse.slug}`}
            className="group grid overflow-hidden rounded-4xl border border-line bg-surface shadow-sm transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 md:grid-cols-[1fr_1.2fr]"
          >
            <div className="relative min-h-64 overflow-hidden">
              <Image
                src={featuredCourse.image}
                alt={featuredCourse.imageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                placeholder="blur"
                loading="eager"
                className="object-cover object-top transition-transform duration-1000 ease-(--ease-premium) group-hover:scale-105"
              />
              <div className="absolute left-5 top-5">
                <StatusBadge status={featuredCourse.status} />
              </div>
            </div>
            <div className="flex flex-col p-8 sm:p-10">
              <h2 className="font-display text-3xl font-semibold leading-tight text-ink group-hover:text-brand">
                {featuredCourse.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{featuredCourse.summary}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-8 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <Layers className="size-4" /> {featuredCourse.modules?.length} modules
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkle className="size-4" /> Student Toolkit + signature bonus
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand">
                  View course <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((course, index) => (
            <Reveal key={course.slug} delay={(index % 3) * 120} className="flex">
              <CourseCard course={course} />
            </Reveal>
          ))}
          <Reveal delay={240} className="flex">
            <article className="flex w-full flex-col justify-between rounded-2xl border border-dashed border-accent/50 bg-accent-soft p-7">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">Premium class</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  One-to-one premium support is in development. Application documents and personal information shared
                  in the premium package will be kept protected.
                </p>
              </div>
              <p className="mt-6 text-sm font-medium text-accent-strong">In development</p>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
