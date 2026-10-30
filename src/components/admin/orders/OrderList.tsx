"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/Card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn, formatDate, formatPrice, fullName } from "@/lib/utils";
import type { OrderRow, OrderStatus, Paginated } from "@/types/admin";
import { OrderStatusBadge, Pagination, QueryBoundary, Table, Td, Th } from "../ui";

const tabs: Array<{ value: OrderStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "SUCCESS", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

export function OrderList() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (status) params.set("status", status);
  if (debounced) params.set("search", debounced);
  const { data, loading, error, reload } = useApiQuery<Paginated<OrderRow>>(`/admin/orders?${params}`);

  return (
    <>
      <PageHeader title="Orders" description="Every checkout and its Paystack payment status." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-line bg-surface p-1" role="tablist" aria-label="Order status">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === tab.value ? "bg-brand text-white" : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by reference or buyer email"
          aria-label="Search orders"
          className="h-10 min-w-64 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <QueryBoundary loading={loading && !data} error={error} onRetry={reload}>
        {data && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Buyer</Th>
                  <Th>Modules</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className={loading ? "opacity-50" : undefined}>
                {data.items.length === 0 && (
                  <tr>
                    <Td colSpan={6} className="py-10 text-center text-muted">
                      No orders yet. They appear here once checkout is live.
                    </Td>
                  </tr>
                )}
                {data.items.map((order) => (
                  <tr key={order.id} className="hover:bg-canvas">
                    <Td>
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs hover:text-brand">
                        {order.reference}
                      </Link>
                    </Td>
                    <Td>
                      {order.user ? (
                        <Link href={`/admin/students/${order.user.id}`} className="hover:text-brand">
                          <span className="block">{fullName(order.user)}</span>
                          <span className="block text-xs text-subtle">{order.user.email}</span>
                        </Link>
                      ) : (
                        <span className="text-subtle">Deleted user</span>
                      )}
                    </Td>
                    <Td>{order.purchases}</Td>
                    <Td>{formatPrice(order.amount)}</Td>
                    <Td><OrderStatusBadge status={order.status} /></Td>
                    <Td className="text-muted">{formatDate(order.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onPage={setPage} />
          </>
        )}
      </QueryBoundary>
    </>
  );
}
