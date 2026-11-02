import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The circular mortarboard mark from the Gradvane Global logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#2b2a6e" />
      <path d="M20 31v9c0 2.6 5.4 5.5 12 5.5s12-2.9 12-5.5v-9z" fill="#b9b6e8" />
      <path d="M32 17 51 27 32 37 13 27z" fill="#ffffff" />
      <path d="M32 27 45.5 30.5V41" fill="none" stroke="#e0457b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="27" r="2.4" fill="#e0457b" />
      <circle cx="45.5" cy="42" r="3" fill="#e0457b" />
    </svg>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  showTagline = true,
}: {
  href?: string;
  tone?: "dark" | "light";
  showTagline?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            tone === "light" ? "text-white" : "text-brand",
          )}
        >
          {site.name}
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.22em]",
              tone === "light" ? "text-white/60" : "text-muted",
            )}
          >
            {site.tagline.map((word, index) => (
              <span key={word} className="flex items-center gap-1.5">
                {index > 0 && <span className="size-1 rounded-full bg-accent" />}
                {word}
              </span>
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}
