import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  children,
  align = "left",
  tone = "dark",
}: {
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {children && (
        <div className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "light" ? "text-white/70" : "text-muted")}>
          {children}
        </div>
      )}
    </Reveal>
  );
}
