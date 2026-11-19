"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

/**
 * Starts a Paystack checkout for one module, or for a whole course when `courseId` is given. Logged-out visitors are sent to log in first and
 * brought back here; Paystack then returns the buyer to /checkout/callback.
 */
export function BuyModuleButton({
  moduleId,
  courseId,
  price,
  canBuy,
  size = "md",
  label,
}: {
  moduleId?: string;
  /** Buy every module of this course in one payment (used instead of moduleId). */
  courseId?: string;
  /** Overrides the default "Buy for GH₵…" text. */
  label?: string;
  price: number | null;
  /** Enrolment is open and the module has a price and access period. */
  canBuy: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  if (!canBuy || price === null) {
    return (
      <Button size={size} variant="secondary" disabled>
        Enrolment opens soon
      </Button>
    );
  }

  async function buy() {
    if (!user) {
      toast.info(`Log in or create an account to buy this ${courseId ? "course" : "module"}.`);
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user.isEmailVerified) {
      toast.error("Confirm your email address first", {
        description: "Open the link we emailed you, or resend it from your dashboard.",
      });
      return;
    }
    setBusy(true);
    try {
      const { authorizationUrl } = await api<{ authorizationUrl: string }>("/payments/checkout", {
        method: "POST",
        body: courseId ? { courseId } : { moduleId },
      });
      toast.loading("Taking you to Paystack…");
      window.location.assign(authorizationUrl);
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError && err.code === "CONFLICT") {
        toast.success(courseId ? "You already have every module in this course" : "You already have this module", {
          description: "Open it from My courses.",
          action: { label: "My courses", onClick: () => router.push("/my-courses") },
        });
      } else {
        toast.error(err instanceof ApiError ? err.message : "Couldn't start the payment. Please try again.");
      }
    }
  }

  return (
    <Button size={size} onClick={buy} loading={busy} disabled={status === "loading"}>
      {label ?? `Buy for ${formatPrice(price)}`}
    </Button>
  );
}
