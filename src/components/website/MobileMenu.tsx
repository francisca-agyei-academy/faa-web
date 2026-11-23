"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/ui/Logo";
import { Close, Menu } from "@/components/ui/Icons";
import { websiteNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { NavbarAuth } from "./NavbarAuth";

/**
 * The website menu on phones and tablets: a sidebar that slides in from the right.
 * It is portalled to <body> because the header's backdrop blur would trap a `fixed` panel inside it.
 */
const noop = () => () => {};

export function MobileMenu() {
  const pathname = usePathname();
  // Remembers the page it was opened on, so moving to another page (e.g. the back button) closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  // The portal needs document.body, which exists only in the browser.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const opener = openRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    // Back to desktop width: the sidebar has no place there.
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpenOn(null);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      opener?.focus();
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="lg:hidden">
      <button
        ref={openRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="flex size-10 items-center justify-center rounded-lg text-ink hover:bg-canvas"
      >
        <Menu className="size-6" />
      </button>

      {mounted &&
        createPortal(
          <div className={cn("fixed inset-0 z-50 lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
            <div
              onClick={close}
              className={cn(
                "absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            <aside
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              inert={!open}
              className={cn(
                "absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-(--ease-premium)",
                open ? "translate-x-0" : "translate-x-full",
              )}
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
                <div onClick={close}>
                  <Logo showTagline={false} />
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="flex size-10 items-center justify-center rounded-lg text-ink hover:bg-canvas"
                >
                  <Close className="size-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
                <ul className="flex flex-col gap-1">
                  {websiteNav.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
                            active ? "bg-brand/8 text-brand" : "text-ink hover:bg-canvas",
                          )}
                        >
                          {item.label}
                          {active && <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="shrink-0 border-t border-line px-5 py-5">
                <NavbarAuth inline onNavigate={close} />
              </div>
            </aside>
          </div>,
          document.body,
        )}
    </div>
  );
}
