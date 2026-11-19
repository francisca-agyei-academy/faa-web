import { Check, Clock, Layers } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/utils";
import type { CatalogModule } from "@/types/catalog";
import { BuyModuleButton } from "./BuyModuleButton";

export const priceLabel = (price: number | null) => (price === null ? "Price coming soon" : formatPrice(price));
export const accessLabel = (days: number | null) => (days === null ? "Access period to be announced" : `${days} days access`);

/**
 * Every module as a full card, all open at once, joined by a line like a learning path.
 * Matches the module cards on the home page: a brand-coloured number panel, then the details.
 */
export function ModuleList({ modules, enrollmentOpen }: { modules: CatalogModule[]; enrollmentOpen: boolean }) {
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  return (
    <ol className="relative mt-8 flex flex-col gap-6">
      {/* The path line behind the cards, visible in the gaps between them */}
      <span aria-hidden="true" className="absolute bottom-6 left-10 top-6 hidden w-px bg-line sm:block" />
      {ordered.map((m, index) => {
        const number = index + 1;
        const canBuy = enrollmentOpen && m.price !== null && m.price > 0 && m.accessDays !== null;
        return (
          <li key={m.id} id={`module-${number}`} className="relative scroll-mt-24">
            <article className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 sm:grid sm:grid-cols-[5rem_1fr]">
              <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-brand px-6 py-4 text-white sm:flex-col sm:justify-start sm:px-0 sm:py-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-10 size-28 rounded-full bg-accent/25 blur-2xl transition-transform duration-700 group-hover:scale-125"
                />
                <span className="relative text-[11px] font-semibold uppercase tracking-wide text-white/70">Module</span>
                <span className="relative font-display text-4xl font-semibold leading-none text-accent sm:mt-2">
                  {String(number).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">{m.title}</h3>
                {m.description && <p className="mt-2 leading-relaxed text-muted">{m.description}</p>}

                {m.topics.length > 0 && (
                  <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {m.topics.map((topic) => (
                      <li key={topic} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-subtle">
                    <Layers className="size-4" />
                    {m.topics.length} {m.topics.length === 1 ? "lesson" : "lessons"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-subtle">
                    <Clock className="size-4" /> {accessLabel(m.accessDays)}
                  </span>
                  <span className="flex w-full items-center justify-between gap-4 sm:ml-auto sm:w-auto">
                    <span className="font-display text-lg font-semibold text-ink">{priceLabel(m.price)}</span>
                    <BuyModuleButton moduleId={m.id} price={m.price} canBuy={canBuy} size="sm" />
                  </span>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
