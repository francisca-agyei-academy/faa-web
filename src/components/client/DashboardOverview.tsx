"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Card, EmptyState, PageHeader } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

export function DashboardOverview() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <PageHeader title={`Welcome, ${user.firstName}`} description="Here's where you'll find your modules and progress." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Active modules</p>
          <p className="mt-2 text-2xl font-semibold text-ink">0</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Email</p>
          <p className={`mt-2 text-sm font-medium ${user.isEmailVerified ? "text-success" : "text-warning"}`}>
            {user.isEmailVerified ? "Confirmed" : "Not confirmed yet"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Member since</p>
          <p className="mt-2 text-sm font-medium text-ink">{formatDate(user.createdAt)}</p>
        </Card>
      </div>
      <div className="mt-8">
        <EmptyState
          title="You haven't bought any modules yet"
          action={<ButtonLink href="/courses">Browse courses</ButtonLink>}
        >
          Modules you buy will show up here with how long you have access.
        </EmptyState>
      </div>
    </>
  );
}
