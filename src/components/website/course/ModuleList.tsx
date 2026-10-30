import { Check, ChevronDown, Clock } from "@/components/ui/Icons";
import type { CourseModule } from "@/content/courses";
import { formatPrice } from "@/lib/utils";

export const priceLabel = (price: number | null) => (price === null ? "Price coming soon" : formatPrice(price));
export const accessLabel = (days: number | null) => (days === null ? "Access period to be announced" : `${days} days access`);

/** Accordion of modules; native <details> so it works without JavaScript. */
export function ModuleList({ modules }: { modules: CourseModule[] }) {
  return (
    <div className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {modules.map((m) => (
        <details key={m.number} className="group" open={m.number === 1}>
          <summary className="flex cursor-pointer list-none items-center gap-4 p-5 hover:bg-canvas sm:p-6 [&::-webkit-details-marker]:hidden">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand">
              {String(m.number).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-subtle">Module {m.number}</span>
              <span className="mt-0.5 block font-semibold text-ink">{m.title}</span>
            </span>
            <span className="hidden text-right text-sm sm:block">
              <span className="block font-semibold text-ink">{priceLabel(m.price)}</span>
              <span className="text-xs text-subtle">{m.topics.length} lessons</span>
            </span>
            <ChevronDown className="size-5 shrink-0 text-subtle transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-6 sm:pl-[5.5rem] sm:pr-6">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {m.topics.map((topic) => (
                <li key={topic} className="flex gap-2.5 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                  {topic}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-canvas px-4 py-3 text-sm">
              <span className="font-semibold text-ink sm:hidden">{priceLabel(m.price)}</span>
              <span className="inline-flex items-center gap-2 text-muted">
                <Clock className="size-4" /> {accessLabel(m.accessDays)}
              </span>
              <span className="ml-auto text-xs font-medium text-accent-strong">Enrolment opens soon</span>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
