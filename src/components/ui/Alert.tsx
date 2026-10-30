import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "error" | "success" | "info" | "warning";

const tones: Record<Tone, string> = {
  error: "border-danger/20 bg-danger-soft text-danger",
  success: "border-success/20 bg-success-soft text-success",
  info: "border-brand/20 bg-brand-soft text-brand",
  warning: "border-warning/20 bg-warning-soft text-warning",
};

export function Alert({ tone = "info", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone], className)}
    >
      {children}
    </div>
  );
}
