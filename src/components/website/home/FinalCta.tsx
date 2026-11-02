import Image from "next/image";
import groupSteps from "@/assets/images/students-group-steps.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="group relative overflow-hidden rounded-4xl bg-brand-strong">
          <Image
            src={groupSteps}
            alt="A group of smiling students on campus steps"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            placeholder="blur"
            className="object-cover object-[center_30%] opacity-40 transition-transform duration-[2s] ease-(--ease-premium) group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-strong via-brand-strong/85 to-brand-strong/30" />
          <div className="relative max-w-2xl px-8 py-16 text-white sm:px-14 sm:py-24">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
              You don&apos;t need it all figured out. You need the <span className="text-shimmer">next step.</span>
            </h2>
            <p className="mt-5 text-lg text-white/75">
              Create a free account to save your progress and buy modules when you&apos;re ready.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg" variant="accent">
                Create a free account <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/courses" size="lg" variant="outline-light">
                Browse courses
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
