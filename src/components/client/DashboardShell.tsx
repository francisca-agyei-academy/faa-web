import type { ReactNode } from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { UserMenu } from "./UserMenu";
import { VerifyEmailBanner } from "./VerifyEmailBanner";

/** Sidebar + top bar layout shared by the student dashboard and the admin panel. */
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
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <Sidebar items={nav} homeHref={homeHref} badge={badge} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-line bg-surface px-4 sm:px-8">
          <UserMenu />
        </header>
        {showVerifyBanner && <VerifyEmailBanner />}
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
