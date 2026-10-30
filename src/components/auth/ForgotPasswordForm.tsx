"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHydrated } from "@/hooks/useHydrated";
import { api, ApiError } from "@/lib/api";
import type { MessageResponse } from "@/types";

export function ForgotPasswordForm() {
  const hydrated = useHydrated();
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setSubmitting(true);
    setError(null);
    setFieldError(undefined);
    try {
      const { message } = await api<MessageResponse>("/auth/forgot-password", {
        method: "POST",
        body: { email },
        auth: false,
      });
      setSentMessage(message);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.email) setFieldError(err.fieldErrors.email);
      else setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sentMessage) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="success">{sentMessage}</Alert>
        <p className="text-sm text-muted">The link expires in 30 minutes. Check your spam folder if it doesn&apos;t arrive.</p>
        <Link href="/login" className="text-sm font-medium text-brand hover:underline">
          ← Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert tone="error">{error}</Alert>}
      <Input label="Email" name="email" type="email" autoComplete="email" required error={fieldError} />
      <Button type="submit" size="lg" loading={submitting} disabled={!hydrated}>
        Send reset link
      </Button>
      <Link href="/login" className="text-center text-sm text-muted hover:text-ink">
        ← Back to log in
      </Link>
    </form>
  );
}
