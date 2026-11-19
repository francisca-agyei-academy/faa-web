"use client";

import Link from "next/link";
import { AccountDropdown, Avatar, useLogout } from "@/components/AccountMenu";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { fullName } from "@/lib/utils";
import type { User } from "@/types";

const menuLinks = (user: User) =>
  user.role === "ADMIN"
    ? [
        { href: "/admin", label: "Admin panel" },
        { href: "/admin/courses", label: "Manage courses" },
        { href: "/admin/orders", label: "Orders" },
        { href: "/account", label: "Account settings" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/my-courses", label: "My courses" },
        { href: "/courses", label: "Browse courses" },
        { href: "/account", label: "Account settings" },
      ];

/** Login/sign-up buttons, or the signed-in user's avatar menu. `inline` lays it out for the mobile drawer. */
export function NavbarAuth({ inline = false, onNavigate }: { inline?: boolean; onNavigate?: () => void }) {
  const { status, user } = useAuth();

  if (status === "loading") return <div className={inline ? "h-10" : "size-10"} aria-hidden="true" />;

  if (user) return inline ? <InlineUserMenu user={user} onNavigate={onNavigate} /> : <AccountDropdown user={user} links={menuLinks(user)} />;

  return (
    <div className="flex items-center gap-2" onClick={onNavigate}>
      <ButtonLink href="/login" variant="ghost">
        Log in
      </ButtonLink>
      <ButtonLink href="/register">Get started</ButtonLink>
    </div>
  );
}

function InlineUserMenu({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const logout = useLogout({ after: onNavigate });
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar user={user} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{fullName(user)}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col">
        {menuLinks(user).map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={onNavigate} className="block py-2.5 text-base font-medium text-ink">
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={logout.run}
            disabled={logout.busy}
            className="block w-full py-2.5 text-left text-base font-medium text-danger disabled:opacity-60"
          >
            {logout.busy ? "Logging out…" : "Log out"}
          </button>
        </li>
      </ul>
    </div>
  );
}
