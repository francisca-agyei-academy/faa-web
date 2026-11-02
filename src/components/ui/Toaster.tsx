"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Toast notifications for the whole app. Call `toast.success("…")` / `toast.error("…")`
 * from "sonner" anywhere in a client component.
 */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      closeButton
      richColors
      duration={4500}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border !border-line !font-sans !shadow-lg",
          title: "!font-semibold",
        },
      }}
    />
  );
}
