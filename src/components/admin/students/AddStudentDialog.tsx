"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api, ApiError } from "@/lib/api";
import type { Role } from "@/types";
import { Dialog, Select, Switch } from "../ui";

interface Created {
  student: { id: string; email: string; firstName: string };
  temporaryPassword: string;
}

/** Creates an account for someone; shows their temporary password once. */
export function AddStudentDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [role, setRole] = useState<Role>("STUDENT");
  const [markVerified, setMarkVerified] = useState(true);
  const [sendSetupEmail, setSendSetupEmail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

  function close() {
    setCreated(null);
    setErrors({});
    setError(null);
    setRole("STUDENT");
    setMarkVerified(true);
    setSendSetupEmail(false);
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    setSaving(true);
    setErrors({});
    setError(null);
    try {
      const result = await api<Created>("/admin/students", {
        method: "POST",
        body: {
          firstName: String(form.get("firstName") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          email: String(form.get("email") ?? ""),
          ...(phone && { phone }),
          role,
          markVerified,
          sendSetupEmail,
        },
      });
      setCreated(result);
      onCreated();
      toast.success("Account created.");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        if (err.code !== "VALIDATION_FAILED") setError(err.message);
      } else {
        setError("Couldn't create the account.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={close} title={created ? "Account created" : "Add a student"} wide>
      {created ? (
        <div className="flex flex-col gap-4 text-sm">
          <p className="text-muted">
            <strong className="text-ink">{created.student.email}</strong> can log in now with this temporary password.
            Share it with them privately; it won&apos;t be shown again.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-canvas px-4 py-3">
            <code className="font-mono text-base text-ink">{created.temporaryPassword}</code>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(created.temporaryPassword).then(() => toast.success("Copied."))}
            >
              Copy
            </Button>
          </div>
          {sendSetupEmail && (
            <Alert tone="info">We also emailed them a link to choose their own password (valid for 3 days).</Alert>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={close}>
              Done
            </Button>
            <ButtonLink href={`/admin/students/${created.student.id}`}>Open their account</ButtonLink>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" name="firstName" required error={errors.firstName} />
            <Input label="Last name" name="lastName" required error={errors.lastName} />
          </div>
          <Input label="Email" name="email" type="email" required error={errors.email} />
          <Input label="Phone (optional)" name="phone" type="tel" error={errors.phone} />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin (full access to the admin panel)</option>
          </Select>
          <Switch
            label="Mark email as confirmed"
            description="They can buy straight away. Turn off to send them the usual confirmation email instead."
            checked={markVerified}
            onChange={setMarkVerified}
          />
          <Switch
            label="Email them a link to set their password"
            description="Otherwise, share the temporary password shown on the next screen."
            checked={sendSetupEmail}
            onChange={setSendSetupEmail}
          />
          {error && <Alert tone="error">{error}</Alert>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create account
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
