"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api, ApiError } from "@/lib/api";
import { formatDate, formatPrice, fullName } from "@/lib/utils";
import type { StudentDetail as Student } from "@/types/admin";
import { Badge, ConfirmDialog, OrderStatusBadge, QueryBoundary, Table, Td, Th } from "../ui";

type Action = { kind: "disable" } | { kind: "enable" } | { kind: "make-admin" } | { kind: "make-student" };

const actionCopy: Record<Action["kind"], { title: string; confirm: string; body: string; danger?: boolean }> = {
  disable: {
    title: "Disable this account?",
    confirm: "Disable account",
    body: "They will be signed out on every device and won't be able to log in until you enable the account again.",
    danger: true,
  },
  enable: { title: "Enable this account?", confirm: "Enable account", body: "They will be able to log in again." },
  "make-admin": {
    title: "Give admin access?",
    confirm: "Make admin",
    body: "Admins can see every student and order and edit all courses. Only do this for people you trust.",
    danger: true,
  },
  "make-student": { title: "Remove admin access?", confirm: "Remove admin access", body: "They will keep their account as a regular student." },
};

const actionDone: Record<Action["kind"], string> = {
  disable: "Account disabled and signed out everywhere.",
  enable: "Account enabled.",
  "make-admin": "Admin access granted.",
  "make-student": "Admin access removed.",
};

export function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();
  const { data, loading, error, reload } = useApiQuery<{ student: Student }>(`/admin/students/${id}`);
  const [action, setAction] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function apply() {
    if (!action) return;
    const body =
      action.kind === "disable" ? { isActive: false }
      : action.kind === "enable" ? { isActive: true }
      : action.kind === "make-admin" ? { role: "ADMIN" }
      : { role: "STUDENT" };
    setBusy(true);
    setActionError(null);
    try {
      await api(`/admin/students/${id}`, { method: "PATCH", body });
      toast.success(actionDone[action.kind]);
      setAction(null);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Couldn't update the account.");
    } finally {
      setBusy(false);
    }
  }

  const student = data?.student;
  const isMe = student?.id === me?.id;

  return (
    <>
      <Link href="/admin/students" className="mb-4 inline-block text-sm text-muted hover:text-ink">
        ← All students
      </Link>
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {student && (
          <div className="flex flex-col gap-6">
            <Card className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink">{fullName(student)}</h1>
                <p className="mt-1 text-sm text-muted">{student.email}{student.phone && ` · ${student.phone}`}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {student.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Disabled</Badge>}
                  {student.isEmailVerified ? <Badge tone="brand">Email verified</Badge> : <Badge tone="warning">Email not verified</Badge>}
                  {student.role === "ADMIN" && <Badge tone="accent">Admin</Badge>}
                </div>
              </div>
              {isMe ? (
                <p className="text-sm text-subtle">This is your account.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {student.role === "ADMIN" ? (
                    <Button variant="secondary" onClick={() => setAction({ kind: "make-student" })}>Remove admin access</Button>
                  ) : (
                    <Button variant="secondary" onClick={() => setAction({ kind: "make-admin" })}>Make admin</Button>
                  )}
                  {student.isActive ? (
                    <Button variant="danger" onClick={() => setAction({ kind: "disable" })}>Disable account</Button>
                  ) : (
                    <Button onClick={() => setAction({ kind: "enable" })}>Enable account</Button>
                  )}
                </div>
              )}
            </Card>

            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Joined", formatDate(student.createdAt)],
                ["Email verified", student.emailVerifiedAt ? formatDate(student.emailVerifiedAt) : "Not yet"],
                ["Last login", student.lastLoginAt ? `${formatDate(student.lastLoginAt)}${student.lastLoginIp ? ` · ${student.lastLoginIp}` : ""}` : "Never"],
                ["Signed-in devices", String(student.sessions)],
              ].map(([label, value]) => (
                <Card key={label} className="p-5">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
                </Card>
              ))}
            </dl>

            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">Purchased modules</h2>
              {student.purchases.length === 0 ? (
                <Card className="py-8 text-center text-sm text-muted">No purchases yet.</Card>
              ) : (
                <Table>
                  <thead><tr><Th>Module</Th><Th>Bought</Th><Th>Access until</Th></tr></thead>
                  <tbody>
                    {student.purchases.map((p) => (
                      <tr key={p.id}>
                        <Td>{p.module ? <Link href={`/admin/courses/${p.module.courseId}`} className="hover:text-brand">{p.module.title}</Link> : "Deleted module"}</Td>
                        <Td className="text-muted">{formatDate(p.createdAt)}</Td>
                        <Td>
                          {formatDate(p.expiresAt)}{" "}
                          {new Date(p.expiresAt) < new Date() && <Badge tone="neutral">Expired</Badge>}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">Orders</h2>
              {student.orders.length === 0 ? (
                <Card className="py-8 text-center text-sm text-muted">No orders yet.</Card>
              ) : (
                <Table>
                  <thead><tr><Th>Reference</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                  <tbody>
                    {student.orders.map((o) => (
                      <tr key={o.id} className="hover:bg-canvas">
                        <Td><Link href={`/admin/orders/${o.id}`} className="font-mono text-xs hover:text-brand">{o.reference}</Link></Td>
                        <Td>{formatPrice(o.amount)}</Td>
                        <Td><OrderStatusBadge status={o.status} /></Td>
                        <Td className="text-muted">{formatDate(o.createdAt)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </section>

            {action && (
              <ConfirmDialog
                open
                title={actionCopy[action.kind].title}
                message={<><strong className="text-ink">{fullName(student)}</strong>: {actionCopy[action.kind].body}</>}
                confirmLabel={actionCopy[action.kind].confirm}
                danger={actionCopy[action.kind].danger}
                busy={busy}
                error={actionError}
                onConfirm={apply}
                onClose={() => { setAction(null); setActionError(null); }}
              />
            )}
          </div>
        )}
      </QueryBoundary>
    </>
  );
}
