"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useLogout } from "@/components/AccountMenu";
import { Book, Close, Globe, Home, Layers, LogOut, Receipt, Settings, Users } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import type { NavIcon } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon?: NavIcon;
}

const icons: Record<NavIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  home: Home,
  book: Book,
  layers: Layers,
  users: Users,
  receipt: Receipt,
  settings: Settings,
  globe: Globe,
};

/**
 * Side navigation for the student dashboard and the admin panel. Fixed to the left on desktop,
 * with Log out pinned to the bottom; on small screens it slides in as a drawer.
 */
export function Sidebar({
  items,
  homeHref,
  badge,
  open,
  onClose,
}: {
  items: NavItem[];
  homeHref: string;
  badge?: string;
  /** Mobile drawer state; ignored on desktop, where the sidebar is always shown. */
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const logout = useLogout({ redirectTo: "/login" });
  // The longest matching href wins, so /admin/courses doesn't also highlight /admin.
  const active = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      {/* Dims the page behind the open drawer on small screens */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-brand-strong/40 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-line bg-surface transition-transform duration-300 ease-(--ease-premium)",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          "md:w-68 md:translate-x-0 md:shadow-none",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-5">
          <Logo href={homeHref} />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink md:hidden"
            aria-label="Close menu"
          >
            <Close className="size-5" />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-5">
          {/* Which side of the app this is, e.g. "Admin panel"; kept out of the header so the logo fits */}
          {badge && (
            <p className="mb-3 px-3">
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-strong">
                {badge}
              </span>
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon ? icons[item.icon] : null;
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-canvas hover:text-ink",
                    )}
                  >
                    {Icon && <Icon className="size-5 shrink-0" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <button
            type="button"
            onClick={logout.run}
            disabled={logout.busy}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-60"
          >
            <LogOut className="size-5 shrink-0" />
            {logout.busy ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>
    </>
  );
}
