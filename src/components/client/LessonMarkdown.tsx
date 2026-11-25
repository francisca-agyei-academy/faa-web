"use client";

import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * A lesson body. Markdown with tables (GitHub style); raw HTML is not rendered, so lesson text
 * can't inject markup. External links open in a new tab.
 */
const components: Components = {
  h2: ({ children }) => <h2 className="mt-10 font-display text-xl font-semibold text-ink first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 font-display text-lg font-semibold text-ink">{children}</h3>,
  p: ({ children }) => <p className="mt-4 leading-relaxed text-ink/90">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-accent">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:font-semibold marker:text-brand">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed text-ink/90">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ href, children }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <aside className="mt-6 rounded-xl border-l-4 border-accent bg-accent-soft/60 px-5 py-1 text-sm [&_p]:mt-3 [&_p:last-child]:mb-3">
      {children}
    </aside>
  ),
  // Wide tables scroll sideways on their own, so the page never does.
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-brand text-white">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-3 align-bottom font-semibold">{children}</th>,
  tr: ({ children }) => <tr className="border-t border-line first:border-t-0 even:bg-canvas/60">{children}</tr>,
  // Links in a cell stack, one per line (e.g. "Application procedure" and "Study programmes").
  td: ({ children }) => (
    <td className="px-3 py-3 align-top leading-relaxed text-ink/90 [&_a]:block [&_a+a]:mt-1.5">{children}</td>
  ),
  hr: () => <hr className="my-8 border-line" />,
};

export function LessonMarkdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("text-[15px] sm:text-base", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
