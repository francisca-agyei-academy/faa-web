import Link from "next/link";
import type { CSSProperties } from "react";
import { legalNav, site } from "@/lib/site";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Paragraphs shown after the list. */
  after?: string[];
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Shared layout for the Privacy Policy and the Terms and Conditions. */
export function LegalPage({
  title,
  intro,
  lastUpdated,
  sections,
}: {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-strong text-white">
        <div
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -right-32 -top-48 size-130 rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="animate-rise font-display text-4xl font-semibold leading-tight sm:text-5xl" style={delay(100)}>
            {title}
          </h1>
          <p className="animate-rise mt-5 text-lg text-white/70" style={delay(250)}>
            {intro}
          </p>
          <p className="animate-rise mt-6 text-sm text-white/50" style={delay(350)}>
            Last updated {lastUpdated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <ol className="flex flex-col gap-10">
          {sections.map((section, index) => (
            <li key={section.heading}>
              <h2 className="font-display text-2xl font-semibold text-ink">
                <span className="mr-3 text-accent-strong">{index + 1}.</span>
                {section.heading}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="mt-3 leading-relaxed text-muted">
                  {text}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted marker:text-accent-strong">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((text) => (
                <p key={text} className="mt-3 leading-relaxed text-muted">
                  {text}
                </p>
              ))}
            </li>
          ))}
          <li>
            <h2 className="font-display text-2xl font-semibold text-ink">
              <span className="mr-3 text-accent-strong">{sections.length + 1}.</span>
              Contact us
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              {site.contactEmail ? (
                <>
                  If you have any questions about this page, email us at{" "}
                  <a href={`mailto:${site.contactEmail}`} className="font-medium text-brand hover:underline">
                    {site.contactEmail}
                  </a>
                  .
                </>
              ) : (
                <>If you have any questions about this page, please contact {site.name}.</>
              )}
            </p>
          </li>
        </ol>

        <nav aria-label="Legal" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-8 text-sm">
          {legalNav.map((item) => (
            <Link key={item.href} href={item.href} className="font-medium text-brand hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
