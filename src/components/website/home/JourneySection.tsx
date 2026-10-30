import { Shield } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { signatureBonus } from "@/content/academy";

const ROUTE = "M20 70 C 120 -10, 280 -10, 380 70";

/** Dashed flight arc with a plane travelling along it (SVG animateMotion scales with the viewBox). */
function FlightPath() {
  return (
    <div className="mt-10 max-w-md">
      <svg viewBox="0 0 400 90" className="w-full overflow-visible" aria-hidden="true">
        <path d={ROUTE} fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-dash" />
        <circle cx="20" cy="70" r="5" className="fill-accent" />
        <circle cx="380" cy="70" r="5" className="fill-accent" />
        <circle cx="380" cy="70" r="5" className="animate-ping-slow fill-accent/50" />
        <g className="motion-reduce:hidden">
          <path d="M-9 -7 L11 0 L-9 7 L-5 0 Z" className="fill-white" />
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={ROUTE} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
        </g>
      </svg>
      <div className="mt-2 flex justify-between font-display text-lg text-white">
        <span>Ghana</span>
        <span>Australia</span>
      </div>
    </div>
  );
}

export function JourneySection() {
  return (
    <section className="relative overflow-hidden bg-brand py-20 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="animate-drift pointer-events-none absolute -bottom-32 -left-32 size-[480px] rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{signatureBonus.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{signatureBonus.body}</p>
          <FlightPath />
        </Reveal>
        <Reveal delay={200}>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur">
            <div className="flex items-center gap-3">
              <Shield className="size-6 text-accent" />
              <h3 className="font-display text-lg font-semibold">Honest by design</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              We clearly separate personal experience from official university and government requirements, and teach
              only from official sources. Rules such as immigration requirements change, so always confirm the latest
              guidance.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
