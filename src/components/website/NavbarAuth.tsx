"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDown } from "@/components/ui/Icons";
import { useAuth } from "@/hooks/useAuth";
import { cn, fullName } from "@/lib/utils";
import type { User } from "@/types";

const menuLinks = (user: User) =>
  user.role === "ADMIN"
    ? [
        { href: "/admin", label: "Admin panel" },
        { href: "/admin/courses", label: "Manage courses" },
        { href: "/admin/orders", label: "Orders" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/my-courses", label: "My courses" },
        { href: "/courses", label: "Browse courses" },
      ];

/** Login/sign-up buttons, or the signed-in user's avatar menu. `inline` lays it out for the mobile drawer. */
export function NavbarAuth({ inline = false, onNavigate }: { inline?: boolean; onNavigate?: () => void }) {
  const { status, user } = useAuth();

  if (status === "loading") return <div className={inline ? "h-10" : "size-10"} aria-hidden="true" />;

  if (user) return inline ? <InlineUserMenu user={user} onNavigate={onNavigate} /> : <UserDropdown user={user} />;

  return (
    <div className="flex items-center gap-2" onClick={onNavigate}>
      <ButtonLink href="/login" variant="ghost">
        Log in
      </ButtonLink>
      <ButtonLink href="/register">Get started</ButtonLink>
    </div>
  );
}

function Avatar({ user, className }: { user: User; className?: string }) {
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

function useLogout(after?: () => void) {
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
      router.replace("/");
      setBusy(false);
    },
  };
}

function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const logout = useLogout(() => setOpen(false));

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
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Avatar user={user} />
        <ChevronDown className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-[menu-in_0.16s_ease-out] motion-reduce:animate-none overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-brand/10"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <Avatar user={user} className="size-9 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{fullName(user)}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <ul className="py-1.5">
            {menuLinks(user).map((link) => (
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

function InlineUserMenu({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const logout = useLogout(onNavigate);
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
