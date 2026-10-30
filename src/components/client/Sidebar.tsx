"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

/** Side navigation for the student dashboard and the admin panel. */
export function Sidebar({ items, homeHref, badge }: { items: NavItem[]; homeHref: string; badge?: string }) {
  const pathname = usePathname();
  // The longest matching href wins, so /admin/courses doesn't also highlight /admin.
  const active = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-line bg-surface p-4 md:w-60 md:border-r md:border-b-0 md:p-6">
      <div className="flex items-center gap-2">
        <Logo href={homeHref} />
        {badge && (
          <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">{badge}</span>
        )}
      </div>
      <nav>
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                  active === item.href ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-canvas hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
