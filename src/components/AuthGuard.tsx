"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { homeFor } from "@/lib/auth";
import type { Role } from "@/types";

/**
 * Renders children only for a confirmed session (and role, if given). The proxy already
 * redirected visitors without the session hint cookie; this catches stale cookies and
 * sessions revoked elsewhere. The API still checks every request on its own.
 */
export function AuthGuard({ role, children }: { role?: Role; children: ReactNode }) {
  const { status, user, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const wrongRole = user && role && user.role !== role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (wrongRole) {
      router.replace(homeFor(user.role));
    }
  }, [status, wrongRole, user, pathname, router]);

  if (status === "offline") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm text-muted">We can&apos;t reach the server right now.</p>
        <Button variant="secondary" onClick={() => refresh().catch(() => {})}>
          Try again
        </Button>
      </div>
    );
  }

  if (status !== "authenticated" || wrongRole) return <PageSpinner />;
  return <>{children}</>;
}
