"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHydrated } from "@/hooks/useHydrated";
import { api, ApiError } from "@/lib/api";
import { clearSession } from "@/lib/auth";

export function ResetPasswordForm() {
  const hydrated = useHydrated();
  const token = useSearchParams().get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="error">This reset link is incomplete. Request a new one below.</Alert>
        <ButtonLink href="/forgot-password" variant="secondary">
          Request a new link
        </ButtonLink>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="success">Your password has been updated. You&apos;ve been signed out on every device.</Alert>
        <ButtonLink href="/login" size="lg">
          Log in
        </ButtonLink>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setFieldErrors({ confirm: "Passwords don't match" });
      return;
    }
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      await api("/auth/reset-password", { method: "POST", body: { token, password }, auth: false });
      clearSession();
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        if (err.code !== "VALIDATION_FAILED") setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && (
        <Alert tone="error">
          {error}{" "}
          <Link href="/forgot-password" className="font-medium underline">
            Request a new link
          </Link>
        </Alert>
      )}
      <Input
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={fieldErrors.password}
        hint="At least 8 characters."
      />
      <Input
        label="Confirm new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        error={fieldErrors.confirm}
      />
      <Button type="submit" size="lg" loading={submitting} disabled={!hydrated}>
        Update password
      </Button>
    </form>
  );
}
