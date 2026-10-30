"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Sticky header that tightens and gains a shadow once the page scrolls. */
export function ScrollHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b backdrop-blur-md transition-all duration-500 [transition-timing-function:var(--ease-premium)]",
        scrolled ? "h-16 border-line bg-surface/85 shadow-lg shadow-brand/5" : "h-[72px] border-transparent bg-surface",
      )}
    >
      {children}
    </header>
  );
}
