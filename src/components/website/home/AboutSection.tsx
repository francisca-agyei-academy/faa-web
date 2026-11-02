import Image from "next/image";
import readingDesk from "@/assets/images/student-reading-desk.jpg";
import { Reveal } from "@/components/ui/Reveal";
import { about, philosophy, pillars } from "@/content/academy";
import { SectionHeading } from "../SectionHeading";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal className="relative">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-4xl">
            <Image
              src={readingDesk}
              alt="A student reading thoughtfully at a desk beside a laptop"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              placeholder="blur"
              className="object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-premium)] group-hover:scale-105"
            />
          </div>
          <Reveal delay={250} className="relative -mt-16 ml-auto w-[88%] sm:w-[75%]">
            <figure className="rounded-2xl bg-brand p-7 text-white shadow-xl">
              <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="-mt-3 font-display text-base font-medium leading-relaxed sm:text-lg">{philosophy}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-lavender">Our philosophy</figcaption>
            </figure>
          </Reveal>
        </Reveal>

        <div>
          <SectionHeading title="What is Gradvane Global?">
            <p>{about}</p>
          </SectionHeading>
          <div className="mt-10 flex flex-col gap-6">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={150 + index * 120}>
                <div className="border-l-2 border-accent pl-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
