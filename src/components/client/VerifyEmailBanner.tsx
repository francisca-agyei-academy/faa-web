"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

/** Shown until the student confirms their email; buying modules requires it. */
export function VerifyEmailBanner() {
  const { user, resendVerification, reloadUser } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  if (!user || user.isEmailVerified) return null;

  async function resend() {
    setState("sending");
    try {
      await resendVerification();
      setState("sent");
      toast.success(`Confirmation link sent to ${user?.email}. Check your inbox.`);
    } catch (err) {
      setState("idle");
      toast.error(err instanceof ApiError ? err.message : "Couldn't send the email. Please try again.");
    }
  }

  async function checkAgain() {
    try {
      const fresh = await reloadUser();
      if (fresh?.isEmailVerified) toast.success("Email confirmed. You can buy modules now.");
      else toast.info("We haven't seen the confirmation yet. Open the link in the email, then try again.");
    } catch {
      toast.error("Couldn't check right now. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-warning/20 bg-warning-soft px-4 py-3 text-sm text-warning sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>
        {state === "sent"
          ? `We've sent a new link to ${user.email}.`
          : `Confirm your email address (${user.email}) to buy modules.`}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={checkAgain}>
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
