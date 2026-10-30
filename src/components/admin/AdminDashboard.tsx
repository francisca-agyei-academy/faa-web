"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatDate, formatPrice, fullName } from "@/lib/utils";
import type { AdminStats } from "@/types/admin";
import { StatCard } from "./StatCard";
import { Badge, OrderStatusBadge, QueryBoundary } from "./ui";

export function AdminDashboard() {
  const { data, loading, error, reload } = useApiQuery<AdminStats>("/admin/stats");

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Students, courses and sales at a glance."
        action={<ButtonLink href="/admin/courses/new">New course</ButtonLink>}
      />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Students" value={String(data.students)} note={`${data.unverifiedStudents} not yet verified`} />
              <StatCard label="Published courses" value={`${data.publishedCourses} / ${data.courses}`} note="Visible on the website" />
              <StatCard label="Paid orders this month" value={String(data.ordersThisMonth)} note={`${data.pendingOrders} pending`} />
              <StatCard label="Revenue this month" value={formatPrice(data.revenueThisMonth)} note="Successful payments only" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card className="p-0">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
                  <Link href="/admin/orders" className="text-sm font-medium text-brand hover:underline">
                    View all
                  </Link>
                </div>
                {data.recentOrders.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted">No orders yet. They appear here once checkout is live.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {data.recentOrders.map((order) => (
                      <li key={order.id}>
                        <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-canvas">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">
                              {order.user ? fullName(order.user) : "Deleted user"}
                            </span>
                            <span className="text-xs text-subtle">
                              {order.reference} · {formatDate(order.createdAt)}
                            </span>
                          </span>
                          <span className="flex items-center gap-3 text-sm">
                            {formatPrice(order.amount)}
                            <OrderStatusBadge status={order.status} />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="p-0">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <h2 className="font-display text-lg font-semibold text-ink">New students</h2>
                  <Link href="/admin/students" className="text-sm font-medium text-brand hover:underline">
                    View all
                  </Link>
                </div>
                {data.recentStudents.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted">No students yet.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {data.recentStudents.map((student) => (
                      <li key={student.id}>
                        <Link href={`/admin/students/${student.id}`} className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-canvas">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">{fullName(student)}</span>
                            <span className="block truncate text-xs text-subtle">{student.email}</span>
                          </span>
                          <span className="flex items-center gap-3 text-xs text-subtle">
                            {formatDate(student.createdAt)}
                            {!student.isEmailVerified && <Badge tone="warning">Unverified</Badge>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </>
        )}
      </QueryBoundary>
    </>
  );
}
