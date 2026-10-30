"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHydrated } from "@/hooks/useHydrated";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";
import { homeFor, safeNextPath } from "@/lib/auth";

export function LoginForm() {
  const hydrated = useHydrated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const user = await login(String(form.get("email")), String(form.get("password")));
      router.replace(safeNextPath(searchParams.get("next")) ?? homeFor(user.role));
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
      <Input label="Email" name="email" type="email" autoComplete="email" required error={fieldErrors.email} />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={fieldErrors.password}
      />
      <div className="-mt-1 text-right">
        <Link href="/forgot-password" className="text-sm text-brand hover:underline">
          Forgot your password?
        </Link>
      </div>
      <Button type="submit" size="lg" loading={submitting} disabled={!hydrated}>
        Log in
      </Button>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}