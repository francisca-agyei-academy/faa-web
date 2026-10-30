"use client";

import { useEffect } from "react";
import { refreshSession } from "@/lib/api";

/**
 * Restores the session once per page load: the access token is kept in memory only,
 * so after a reload it is fetched again using the httpOnly refresh cookie.
 */
export function AuthBootstrap() {
  useEffect(() => {
    refreshSession().catch(() => {
      // Unreachable API: status becomes "offline" and AuthGuard offers a retry.
    });
  }, []);
  return null;
}
