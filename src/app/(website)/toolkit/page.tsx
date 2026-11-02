import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import writing from "@/assets/images/student-writing-headphones.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Document } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { toolkit } from "@/content/academy";
import { featuredOf, getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Student Toolkit",
  description: "Templates, checklists and trackers for scholarship, Master's and PhD applications.",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default async function ToolkitPage() {
  const courses = await getCatalog();
  const featured = courses?.length ? featuredOf(courses) : undefined;
  return (
    <>
      <section className="relative overflow-hidden bg-brand-strong text-white">
        <div
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -left-32 -top-48 size-[520px] rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-20">
          <div>
            <h1 className="animate-rise font-display text-4xl font-semibold leading-tight sm:text-5xl" style={delay(100)}>
              The templates behind a <span className="text-shimmer">strong application</span>
            </h1>
            <p className="animate-rise mt-5 max-w-xl text-lg text-white/70" style={delay(250)}>
              Ten practical resources for every stage, from planning your search and contacting supervisors to
              preparing for interviews and moving abroad.
            </p>
            <div className="animate-rise" style={delay(400)}>
              <ButtonLink href={featured ? `/courses/${featured.slug}` : "/courses"} variant="accent" size="lg" className="mt-8">
                Included with the flagship course <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
          <div
            className="animate-rise relative hidden aspect-[4/3] overflow-hidden rounded-4xl ring-1 ring-white/10 lg:block"
            style={delay(300)}
          >
            <Image
              src={writing}
              alt="A student taking notes beside a laptop"
              fill
              sizes="520px"
              placeholder="blur"
              loading="eager"
              className="animate-settle object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {toolkit.map((item, index) => (
            <li key={item.title} className="flex">
              <Reveal delay={(index % 3) * 100} className="flex w-full">
                <div className="group flex w-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-brand/10">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-accent">
                      <Document className="size-5" />
                    </span>
                    <span className="font-display text-sm text-subtle">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-5 font-display text-lg font-semibold text-ink">{item.title}</h2>
                  <p className="mt-1 text-sm text-accent-strong">{item.kind}</p>
                  <p className="mt-auto pt-6 text-sm text-subtle">Download available soon</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
