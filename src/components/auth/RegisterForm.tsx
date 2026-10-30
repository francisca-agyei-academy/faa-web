"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHydrated } from "@/hooks/useHydrated";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export function RegisterForm() {
  const hydrated = useHydrated();
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      await register({
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        ...(phone && { phone }),
      });
      router.replace("/dashboard");
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        if (err.code !== "VALIDATION_FAILED") setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" autoComplete="given-name" required error={fieldErrors.firstName} />
        <Input label="Last name" name="lastName" autoComplete="family-name" required error={fieldErrors.lastName} />
      </div>
      <Input label="Email" name="email" type="email" autoComplete="email" required error={fieldErrors.email} />
      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        error={fieldErrors.phone}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={fieldErrors.password}
        hint="At least 8 characters."
      />
      <Button type="submit" size="lg" loading={submitting} disabled={!hydrated}>
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}