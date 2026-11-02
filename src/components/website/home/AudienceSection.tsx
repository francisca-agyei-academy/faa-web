import Image from "next/image";
import laptopCampus from "@/assets/images/student-laptop-campus.jpg";
import writing from "@/assets/images/student-writing-headphones.jpg";
import { Check } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { audienceIntro, audiences } from "@/content/academy";
import { SectionHeading } from "../SectionHeading";

const images = [
  { src: laptopCampus, alt: "A student researching opportunities on a laptop", position: "object-top" },
  { src: writing, alt: "A researcher writing notes beside a laptop", position: "object-center" },
];

export function AudienceSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Who Gradvane Global is for" align="center">
          <p>{audienceIntro}</p>
        </SectionHeading>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 140} className="flex">
              <article className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10 sm:flex-row">
                <div className="relative aspect-[5/4] overflow-hidden sm:aspect-auto sm:w-2/5 sm:shrink-0">
                  <Image
                    src={images[index % images.length]!.src}
                    alt={images[index % images.length]!.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 100vw"
                    placeholder="blur"
                    className={`object-cover ${images[index % images.length]!.position} transition-transform duration-700 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-strong/70 via-brand-strong/10 to-transparent" />
                  <span className="absolute bottom-4 left-5 font-display text-sm font-bold text-white">0{index + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-bold text-brand">{audience.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {audience.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
