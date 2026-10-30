"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

/** Shown until the student confirms their email; buying modules requires it. */
export function VerifyEmailBanner() {
  const { user, resendVerification, reloadUser } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user || user.isEmailVerified) return null;

  async function resend() {
    setState("sending");
    setError(null);
    try {
      await resendVerification();
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(err instanceof ApiError ? err.message : "Couldn't send the email. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-warning/20 bg-warning-soft px-4 py-3 text-sm text-warning sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>
        {state === "sent"
          ? `We've sent a new link to ${user.email}.`
          : `Confirm your email address (${user.email}) to buy modules.`}
        {error && <span className="ml-1 font-medium">{error}</span>}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => reloadUser().catch(() => {})}>
          I&apos;ve confirmed it
        </Button>
        {state !== "sent" && (
          <Button size="sm" onClick={resend} loading={state === "sending"}>
            Resend email
          </Button>
        )}
      </div>
    </div>
  );
}
