"use client";

import Link from "next/link";
import { useState } from "react";
import { Close, Menu } from "@/components/ui/Icons";
import { websiteNav } from "@/lib/site";
import { NavbarAuth } from "./NavbarAuth";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-10 items-center justify-center rounded-lg text-ink hover:bg-canvas"
      >
        {open ? <Close className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-[72px] border-b border-line bg-surface px-4 pb-6 pt-2 shadow-lg sm:px-6"
        >
          <ul className="flex flex-col">
            {websiteNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <NavbarAuth inline onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
