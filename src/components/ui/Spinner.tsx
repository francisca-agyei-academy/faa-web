import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Centered spinner for a whole page or panel while data loads. */
export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-3 py-24 text-muted" role="status">
      <Spinner className="size-5" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
