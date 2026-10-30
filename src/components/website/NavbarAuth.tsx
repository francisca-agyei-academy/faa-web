"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { homeFor } from "@/lib/auth";

/** Login/sign-up buttons, or a link back to the dashboard once the session is known. */
export function NavbarAuth() {
  const { status, user } = useAuth();

  if (status === "loading") return <div className="h-10 w-40" aria-hidden="true" />;

  if (user) {
    return (
      <ButtonLink href={homeFor(user.role)} size="md">
        {user.role === "ADMIN" ? "Admin" : "My dashboard"}
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <ButtonLink href="/login" variant="ghost">
        Log in
      </ButtonLink>
      <ButtonLink href="/register">Get started</ButtonLink>
    </div>
  );
}
