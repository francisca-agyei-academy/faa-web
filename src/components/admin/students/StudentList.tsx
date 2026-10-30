"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/Card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatDate, fullName } from "@/lib/utils";
import type { Paginated, StudentRow } from "@/types/admin";
import { Badge, Pagination, QueryBoundary, Select, Table, Td, Th } from "../ui";

export function StudentList() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  // Wait for typing to pause before searching.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (debounced) params.set("search", debounced);
  if (status) params.set("status", status);
  if (role) params.set("role", role);
  const { data, loading, error, reload } = useApiQuery<Paginated<StudentRow>>(`/admin/students?${params}`);

  return (
    <>
      <PageHeader title="Students" description="Everyone with an account. Open a student to see their orders and purchases." />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email"
          aria-label="Search students"
          className="h-10 min-w-64 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="unverified">Email not verified</option>
          <option value="disabled">Disabled</option>
        </Select>
        <Select aria-label="Role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="ADMIN">Admins</option>
        </Select>
      </div>

      <QueryBoundary loading={loading && !data} error={error} onRetry={reload}>
        {data && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>Modules</Th>
                  <Th>Joined</Th>
                  <Th>Last login</Th>
                </tr>
              </thead>
              <tbody className={loading ? "opacity-50" : undefined}>
                {data.items.length === 0 && (
                  <tr>
                    <Td colSpan={5} className="py-10 text-center text-muted">No students match these filters.</Td>
                  </tr>
                )}
                {data.items.map((student) => (
                  <tr key={student.id} className="hover:bg-canvas">
                    <Td>
                      <Link href={`/admin/students/${student.id}`} className="block">
                        <span className="block font-medium text-ink hover:text-brand">{fullName(student)}</span>
                        <span className="block text-xs text-subtle">{student.email}</span>
                      </Link>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {student.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Disabled</Badge>}
                        {!student.isEmailVerified && <Badge tone="warning">Unverified</Badge>}
                        {student.role === "ADMIN" && <Badge tone="accent">Admin</Badge>}
                      </div>
                    </Td>
                    <Td>{student.purchases}</Td>
                    <Td className="text-muted">{formatDate(student.createdAt)}</Td>
                    <Td className="text-muted">{student.lastLoginAt ? formatDate(student.lastLoginAt) : "Never"}</Td>
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
