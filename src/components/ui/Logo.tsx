import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", tone = "dark" }: { href?: string; tone?: "dark" | "light" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label={`${site.fullName} home`}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand font-display text-sm font-semibold tracking-wide text-accent ring-1 ring-accent/40">
        {site.name}
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[15px] font-semibold", tone === "light" ? "text-white" : "text-ink")}>
          Francisca Agyei
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium uppercase tracking-[0.2em]",
            tone === "light" ? "text-white/60" : "text-subtle",
          )}
        >
          Academy
        </span>
      </span>
    </Link>
  );
}
