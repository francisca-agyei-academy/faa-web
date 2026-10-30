"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { fullName } from "@/lib/utils";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  async function onLogout() {
    setLoggingOut(true);
    await logout().catch(() => {});
    router.replace("/login");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-ink">{fullName(user)}</p>
        <p className="text-xs text-muted">{user.email}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onLogout} loading={loggingOut}>
        Log out
      </Button>
    </div>
  );
}
