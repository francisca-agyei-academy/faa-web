import Link from "next/link";
import { Suspense } from "react";
import { Menu } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { websiteNav } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavbarAuth } from "./NavbarAuth";
import { ScrollHeader } from "./ScrollHeader";

export function Navbar() {
  return (
    <ScrollHeader>
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <ul className="hidden items-center gap-7 lg:flex">
            {websiteNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-sm font-medium text-muted transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          <NavbarAuth />
        </div>
        {/* MobileMenu reads the current path, which is only known at request time. */}
        <Suspense
          fallback={
            <div className="flex size-10 items-center justify-center text-ink lg:hidden" aria-hidden="true">
              <Menu className="size-6" />
            </div>
          }
        >
          <MobileMenu />
        </Suspense>
      </nav>
    </ScrollHeader>
  );
}
