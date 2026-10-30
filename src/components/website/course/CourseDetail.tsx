import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Check, Clock, Document, Globe, Layers, Plane, Shield, Sparkle } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { disclaimer, signatureBonus, toolkit } from "@/content/academy";
import { courses, type Course } from "@/content/courses";
import { CourseCard, StatusBadge } from "../CourseCard";
import { EnrolCard } from "./EnrolCard";
import { ModuleList } from "./ModuleList";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function CourseDetail({ course }: { course: Course }) {
  const available = course.status === "available";
  const related = courses.filter((c) => c.slug !== course.slug).slice(0, 3);

  return (
    <>
      {/* Header band */}
      <section className="bg-brand-strong text-white">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{course.track}</span>
          </nav>
          <div className="mt-8 max-w-3xl lg:max-w-[calc(100%-26rem)]">
            <div className="animate-rise" style={delay(50)}><StatusBadge status={course.status} /></div>
            <h1 style={delay(150)} className="animate-rise mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {course.title}
            </h1>
            <p style={delay(300)} className="animate-rise mt-5 text-lg leading-relaxed text-white/75">{course.summary}</p>
            <ul style={delay(450)} className="animate-rise mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/80">
              <li className="inline-flex items-center gap-2">
                <Layers className="size-4 text-accent" />
                {course.modules ? `${course.modules.length} modules` : `${course.topics?.length ?? 0} topics`}
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="size-4 text-accent" /> Self-paced, online
              </li>
              {available && (
                <li className="inline-flex items-center gap-2">
                  <Sparkle className="size-4 text-accent" /> Buy one module at a time
                </li>
              )}
              <li className="inline-flex items-center gap-2">
                <Globe className="size-4 text-accent" /> Built for African students
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8 lg:py-16">
        <div className="flex min-w-0 flex-col gap-14">
          {course.audience && (
            <Reveal as="section">
              <h2 className="font-display text-2xl font-semibold text-ink">Is this course for you?</h2>
              <p className="mt-3 leading-relaxed text-muted">{course.audience}</p>
            </Reveal>
          )}

          {course.outcome && (
            <Reveal as="section">
              <h2 className="font-display text-2xl font-semibold text-ink">Your transformation</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <p className="text-sm font-medium text-subtle">From</p>
                  <p className="mt-2 font-display text-lg italic leading-snug text-muted">&ldquo;{course.outcome.from}&rdquo;</p>
                </div>
                <span aria-hidden="true" className="hidden font-display text-3xl text-accent md:block">
                  →
                </span>
                <div className="rounded-2xl border border-accent/40 bg-accent-soft p-6">
                  <p className="text-sm font-medium text-accent-strong">To</p>
                  <p className="mt-2 font-display text-lg italic leading-snug text-ink">&ldquo;{course.outcome.to}&rdquo;</p>
                </div>
              </div>
            </Reveal>
          )}

          {course.modules && (
            <Reveal as="section" className="rounded-2xl border border-line bg-surface p-7">
              <h2 className="font-display text-2xl font-semibold text-ink">What you&apos;ll learn</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {course.modules.map((m) => (
                  <li key={m.number} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {m.title}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal as="section">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {course.modules ? "Course modules" : "What this course will cover"}
              </h2>
              {course.modules && (
                <p className="text-sm text-muted">Each module has its own price and access period.</p>
              )}
            </div>
            {course.modules ? (
              <ModuleList modules={course.modules} />
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {course.topics?.map((topic) => (
                  <li key={topic} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                    {topic}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          {course.includesSignatureBonus && (
            <Reveal as="section" className="relative overflow-hidden rounded-2xl bg-brand p-8 text-white">
              <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/20 blur-3xl" />
              <h2 className="relative inline-flex items-center gap-3 font-display text-2xl font-semibold"><Plane className="size-6 text-accent" />{signatureBonus.title}</h2>
              <p className="relative mt-3 leading-relaxed text-white/75">{signatureBonus.body}</p>
            </Reveal>
          )}

          {course.includesToolkit && (
            <Reveal as="section">
              <h2 className="font-display text-2xl font-semibold text-ink">Student Toolkit included</h2>
              <p className="mt-2 text-sm text-muted">Practical resources to use alongside the modules.</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {toolkit.map((item) => (
                  <li key={item.title} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
                    <Document className="size-4 shrink-0 text-brand" />
                    <span className="text-sm text-ink">{item.title}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal as="section" className="rounded-2xl border border-line bg-surface p-7">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Shield className="size-5 text-brand" /> Please note
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted">
              {disclaimer.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-subtle" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Sticky enrol card; on mobile it sits under the content */}
        <aside className="lg:-mt-64">
          <div className="animate-rise lg:sticky lg:top-24" style={delay(350)}>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-brand/10">
              <div className="relative aspect-[16/10]">
                <Image
                  src={course.image}
                  alt={course.imageAlt}
                  fill
                  sizes="352px"
                  placeholder="blur"
                  loading="eager"
                  className="object-cover object-[center_35%]"
                />
              </div>
              <EnrolCard course={course} />
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore more courses</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c, index) => (<Reveal key={c.slug} delay={index * 120} className="flex"><CourseCard course={c} /></Reveal>))}
          </div>
        </div>
      </section>
    </>
  );
}
