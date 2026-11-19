"use client";

import { useState, type ReactNode } from "react";
import { AccountDropdown, type MenuLink } from "@/components/AccountMenu";
import { Menu } from "@/components/ui/Icons";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";
import { Sidebar, type NavItem } from "./Sidebar";
import { VerifyEmailBanner } from "./VerifyEmailBanner";

/** The avatar menu's links: account settings first, then the way to the other side of the app. */
const accountLinks = (user: User): MenuLink[] => [
  { href: "/account", label: "Account settings" },
  ...(user.role === "ADMIN"
    ? [
        { href: "/admin", label: "Admin panel" },
        { href: "/dashboard", label: "Student view" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/my-courses", label: "My courses" },
      ]),
  { href: "/", label: "Back to website" },
];

/** Fixed sidebar + sticky top bar, shared by the student dashboard and the admin panel. */
export function DashboardShell({
  nav,
  homeHref,
  badge,
  showVerifyBanner = true,
  children,
}: {
  nav: NavItem[];
  homeHref: string;
  badge?: string;
  /** The "confirm your email to buy modules" banner; pointless in the admin panel. */
  showVerifyBanner?: boolean;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <Sidebar items={nav} homeHref={homeHref} badge={badge} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col md:pl-68">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-1.5 rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="size-6" />
          </button>
          <div className="ml-auto">
            {user && <AccountDropdown user={user} links={accountLinks(user)} logoutRedirect="/login" showName />}
          </div>
        </header>
        {showVerifyBanner && <VerifyEmailBanner />}
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
