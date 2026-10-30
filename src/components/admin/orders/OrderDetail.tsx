"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatDate, formatPrice, fullName } from "@/lib/utils";
import type { OrderDetail as Order } from "@/types/admin";
import { Badge, OrderStatusBadge, QueryBoundary, Table, Td, Th } from "../ui";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useApiQuery<{ order: Order }>(`/admin/orders/${id}`);
  const order = data?.order;

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-block text-sm text-muted hover:text-ink">
        ← All orders
      </Link>
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {order && (
          <div className="flex flex-col gap-6">
            <Card className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="font-mono text-sm text-muted">{order.reference}</p>
                <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{formatPrice(order.amount)}</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <OrderStatusBadge status={order.status} />
                  Created {formatDate(order.createdAt)}
                  {order.paidAt && ` · Paid ${formatDate(order.paidAt)}`}
                </div>
              </div>
              {order.user && (
                <Link href={`/admin/students/${order.user.id}`} className="rounded-xl border border-line px-5 py-4 hover:border-brand">
                  <span className="block text-xs text-subtle">Buyer</span>
                  <span className="block font-medium text-ink">{fullName(order.user)}</span>
                  <span className="block text-sm text-muted">{order.user.email}</span>
                </Link>
              )}
            </Card>

            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">Modules</h2>
              {order.purchases.length === 0 ? (
                <Card className="py-8 text-center text-sm text-muted">
                  No modules granted yet. Access is given once the payment succeeds.
                </Card>
              ) : (
                <Table>
                  <thead><tr><Th>Module</Th><Th>Price</Th><Th>Access until</Th></tr></thead>
                  <tbody>
                    {order.purchases.map((p) => (
                      <tr key={p.id}>
                        <Td>{p.module?.title ?? "Deleted module"}</Td>
                        <Td>{p.module?.price != null ? formatPrice(p.module.price) : "—"}</Td>
                        <Td>{formatDate(p.expiresAt)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">Paystack transactions</h2>
              {order.transactions.length === 0 ? (
                <Card className="py-8 text-center text-sm text-muted">No payment attempts recorded.</Card>
              ) : (
                <Table>
                  <thead><tr><Th>Reference</Th><Th>Amount</Th><Th>Status</Th><Th>Channel</Th><Th>Gateway response</Th><Th>Date</Th></tr></thead>
                  <tbody>
                    {order.transactions.map((t) => (
                      <tr key={t.id}>
                        <Td className="font-mono text-xs">{t.reference}</Td>
                        <Td>{formatPrice(t.amount)}</Td>
                        <Td><Badge tone={t.status === "success" ? "success" : t.status === "failed" ? "danger" : "neutral"}>{t.status}</Badge></Td>
                        <Td className="text-muted">{t.channel ?? "—"}</Td>
                        <Td className="text-muted">{t.gatewayResponse ?? "—"}</Td>
                        <Td className="text-muted">{formatDate(t.paidAt ?? t.createdAt)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </section>
          </div>
        )}
      </QueryBoundary>
    </>
  );
}
