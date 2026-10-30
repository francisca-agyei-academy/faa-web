"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import { homeFor, updateUser } from "@/lib/auth";
import type { User } from "@/types";

type State = { kind: "verifying" } | { kind: "done" } | { kind: "error"; message: string };

export function VerifyEmail() {
  const token = useSearchParams().get("token");
  const { user } = useAuth();
  const [state, setState] = useState<State>(
    token ? { kind: "verifying" } : { kind: "error", message: "This verification link is incomplete." },
  );
  // Links are single-use, so the request must not run twice (React re-runs effects in development).
  const sent = useRef(false);

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    api<{ user: User }>("/auth/verify-email", { method: "POST", body: { token }, auth: false })
      .then(({ user }) => {
        updateUser(user); // if logged in on this browser, drop the "verify your email" banner
        setState({ kind: "done" });
      })
      .catch((err: unknown) => {
        setState({
          kind: "error",
          message: err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
        });
      });
  }, [token]);

  if (state.kind === "verifying") return <PageSpinner label="Confirming your email…" />;

  if (state.kind === "done") {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="success">Your email address is confirmed. You&apos;re all set.</Alert>
        <ButtonLink href={user ? homeFor(user.role) : "/login"} size="lg">
          {user ? "Go to my dashboard" : "Log in"}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert tone="error">{state.message}</Alert>
      <p className="text-sm text-muted">
        You can request a new link from your dashboard. Links expire after 24 hours and work once.
      </p>
      <ButtonLink href={user ? homeFor(user.role) : "/login"} variant="secondary">
        {user ? "Go to my dashboard" : "Log in"}
      </ButtonLink>
    </div>
  );
}
