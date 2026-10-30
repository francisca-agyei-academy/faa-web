import Image from "next/image";
import type { CSSProperties } from "react";
import graduate from "@/assets/images/graduate-cap-toss.jpg";
import laptopCampus from "@/assets/images/student-laptop-campus.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Plane, Sparkle } from "@/components/ui/Icons";
import { coreLessons } from "@/content/academy";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-strong text-white">
      {/* Drifting glows and a fine grid for depth */}
      <div
        aria-hidden="true"
        className="animate-drift pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-drift pointer-events-none absolute -bottom-60 -left-40 size-[520px] rounded-full bg-[#2b4a9a]/30 blur-3xl [animation-delay:-9s]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <h1
            className="animate-rise text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={delay(100)}
          >
            Your path to a <span className="text-shimmer italic">fully&nbsp;funded</span> Master&apos;s or PhD abroad.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-white/75" style={delay(450)}>
            Francisca Agyei Academy helps African students, recent graduates and emerging researchers navigate
            scholarships, postgraduate study, research, publishing and international academic opportunities, with
            practical guidance from someone who has walked the journey.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3" style={delay(600)}>
            <ButtonLink href="/courses" size="lg" variant="accent">
              Explore courses <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/register" size="lg" variant="outline-light">
              Start learning free
            </ButtonLink>
          </div>
        </div>

        <div className="animate-rise relative mx-auto w-full max-w-md lg:max-w-none" style={delay(300)}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-4xl shadow-2xl shadow-black/40 ring-1 ring-white/10 lg:ml-auto lg:w-[85%]">
            <Image
              src={graduate}
              alt="A graduate in a black and red gown celebrating by tossing her cap"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              className="animate-settle object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-strong/40 via-transparent to-transparent" />
          </div>
          <div
            className="animate-float absolute -bottom-6 -left-2 hidden w-44 overflow-hidden rounded-2xl shadow-xl ring-4 ring-brand-strong sm:block lg:-left-4 lg:w-52"
            style={delay(-3000)}
          >
            <Image
              src={laptopCampus}
              alt="A student working on a laptop on campus"
              sizes="208px"
              placeholder="blur"
              className="aspect-[4/5] object-cover"
            />
          </div>
          <div className="animate-float absolute -right-2 top-8 max-w-[220px] rounded-2xl bg-surface p-4 text-ink shadow-xl sm:right-0 lg:-right-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent-strong">
              <Plane className="size-4" /> Ghana → Australia
            </div>
            <p className="mt-1.5 text-sm leading-snug text-muted">Learn from a real journey to a funded PhD.</p>
          </div>
        </div>
      </div>

      {/* Endless ribbon of the core lessons; the list is doubled so the loop is seamless */}
      <div className="marquee relative overflow-hidden border-t border-white/10 bg-black/15 py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="animate-marquee flex w-max items-center" aria-label="Core lessons">
          {[...coreLessons, ...coreLessons].map((lesson, index) => (
            <li
              key={`${lesson}-${index}`}
              aria-hidden={index >= coreLessons.length || undefined}
              className="flex items-center gap-10 pr-10 font-display text-xl text-white/85 sm:text-2xl"
            >
              {lesson}
              <Sparkle className="size-4 text-accent" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
