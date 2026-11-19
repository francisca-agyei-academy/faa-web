"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "@/components/ui/Icons";
import { useAuth } from "@/hooks/useAuth";
import { cn, fullName } from "@/lib/utils";
import type { User } from "@/types";

export interface MenuLink {
  href: string;
  label: string;
}

/** The signed-in user's initials in a brand-coloured circle. */
export function Avatar({ user, className }: { user: User; className?: string }) {
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-semibold text-white",
        className,
      )}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

/** Logs out, confirms with a toast and sends the user to `redirectTo`. */
export function useLogout({ redirectTo = "/", after }: { redirectTo?: string; after?: () => void } = {}) {
  const { logout } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return {
    busy,
    async run() {
      setBusy(true);
      await logout().catch(() => {});
      after?.();
      toast.success("You've been logged out.");
      router.replace(redirectTo);
      setBusy(false);
    },
  };
}

/** Avatar button with a dropdown: who is signed in, `links`, then Log out. */
export function AccountDropdown({
  user,
  links,
  logoutRedirect = "/",
  showName = false,
}: {
  user: User;
  links: MenuLink[];
  logoutRedirect?: string;
  /** Show the name next to the avatar (dashboard top bar). */
  showName?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const logout = useLogout({ redirectTo: logoutRedirect, after: () => setOpen(false) });

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${fullName(user)}`}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Avatar user={user} className={showName ? "size-9 text-xs" : undefined} />
        {showName && (
          <span className="hidden max-w-40 truncate text-sm font-medium text-ink sm:block">{user.firstName}</span>
        )}
        <ChevronDown className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-[menu-in_0.16s_ease-out] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-brand/10 motion-reduce:animate-none"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <Avatar user={user} className="size-9 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{fullName(user)}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <ul className="py-1.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-brand-soft hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={logout.run}
              disabled={logout.busy}
              className="block w-full px-4 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-soft disabled:opacity-60"
            >
              {logout.busy ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
