"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import { getAuthState, setSession, updateUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div>{children}</div>
    </Card>
  );
}

function ProfileForm({ user }: { user: User }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setErrors({});
    try {
      const { user: updated } = await api<{ user: User }>("/me/profile", {
        method: "PATCH",
        body: {
          firstName: String(form.get("firstName") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          phone: String(form.get("phone") ?? ""),
        },
      });
      updateUser(updated);
      toast.success("Profile saved.");
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" defaultValue={user.firstName} required autoComplete="given-name" error={errors.firstName} />
        <Input label="Last name" name="lastName" defaultValue={user.lastName} required autoComplete="family-name" error={errors.lastName} />
      </div>
      <Input label="Email" value={user.email} readOnly disabled hint="Contact us if you need to change your email address." />
      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        defaultValue={user.phone ?? ""}
        autoComplete="tel"
        error={errors.phone}
      />
      <div>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

/** Change the password, or (for an account made with Google) set the first one. */
function PasswordForm({ settingFirst }: { settingFirst: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const newPassword = String(form.get("newPassword") ?? "");
    if (newPassword !== String(form.get("confirmPassword") ?? "")) {
      setErrors({ confirmPassword: "The two new passwords don't match." });
      return;
    }
    setSaving(true);
    setErrors({});
    setError(null);
    try {
      const result = await api<{ accessToken: string; user?: User }>("/auth/change-password", {
        method: "POST",
        body: settingFirst ? { newPassword } : { currentPassword: String(form.get("currentPassword") ?? ""), newPassword },
      });
      // Changing the password revokes older tokens, so keep this session on the new one.
      // The returned user has hasPassword: true, which switches this form to "Change password".
      const user = result.user ?? getAuthState().user;
      if (user) setSession(user, result.accessToken);
      formEl.reset();
      toast.success(
        settingFirst
          ? "Password set. You can now log in with your email and password too."
          : "Password changed. Your other devices have been signed out.",
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ ...err.fieldErrors, ...(err.code === "WRONG_PASSWORD" && { currentPassword: err.message }) });
        if (err.code !== "WRONG_PASSWORD" && err.code !== "VALIDATION_FAILED") setError(err.message);
      } else {
        setError(settingFirst ? "Couldn't set your password." : "Couldn't change your password.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={change} className="flex flex-col gap-4">
      {settingFirst ? (
        <p className="text-sm text-muted">
          You log in with Google. Add a password if you also want to log in with your email address.
        </p>
      ) : (
        <Input
          label="Current password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          error={errors.currentPassword}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="New password"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters."
          error={errors.newPassword}
        />
        <Input
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <div>
        <Button type="submit" loading={saving}>
          {settingFirst ? "Set password" : "Change password"}
        </Button>
      </div>
    </form>
  );
}

function SignOutEverywhere() {
  const { logoutAll } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await logoutAll();
      toast.success("Signed out on every device.");
      router.replace("/login");
    } catch {
      setBusy(false);
      toast.error("Couldn't sign out everywhere. Please try again.");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted">Use this if you logged in on a shared or lost device.</p>
      <Button variant="secondary" onClick={signOut} loading={busy}>
        Sign out on all devices
      </Button>
    </div>
  );
}

export function AccountSettings() {
  const { user } = useAuth();
  if (!user) return null;
  const settingFirst = user.hasPassword === false;
  return (
    <>
      <PageHeader title="Account settings" description={`Member since ${formatDate(user.createdAt)}`} />
      <div className="flex flex-col gap-6">
        <Section title="Profile" description="Your name as it appears on your account and receipts.">
          <ProfileForm user={user} />
        </Section>
        <Section
          title={settingFirst ? "Set a password" : "Password"}
          description={
            settingFirst
              ? "Optional. Google stays connected either way."
              : "Changing it signs you out on your other devices."
          }
        >
          <PasswordForm settingFirst={settingFirst} />
        </Section>
        <Section title="Devices" description="Sign out everywhere, including this device.">
          <SignOutEverywhere />
        </Section>
      </div>
    </>
  );
}
