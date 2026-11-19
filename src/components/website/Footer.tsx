import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { disclaimer, tagline } from "@/content/academy";
import { getCatalog } from "@/lib/catalog";
import { legalNav, site } from "@/lib/site";

export async function Footer() {
  const courses = (await getCatalog()) ?? [];
  return (
    <footer className="bg-brand-strong text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-md">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-white/70">{site.description}</p>
          <p className="mt-6 font-display text-lg text-accent">{tagline}</p>
        </div>
        <nav aria-label="Courses">
          <h2 className="font-display text-base font-semibold text-white">Courses</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {courses.slice(0, 5).map((course) => (
              <li key={course.slug}>
                <Link href={`/courses/${course.slug}`} className="text-white/75 hover:text-white">
                  {course.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/courses" className="font-medium text-accent hover:text-white">
                All courses →
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Gradvane Global">
          <h2 className="font-display text-base font-semibold text-white">Explore</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/#about" className="text-white/75 hover:text-white">
                About us
              </Link>
            </li>
            <li>
              <Link href="/toolkit" className="text-white/75 hover:text-white">
                Student Toolkit
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-white/75 hover:text-white">
                Create an account
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white/75 hover:text-white">
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="font-display text-base font-semibold text-white">Disclaimer</h2>
          <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-xs leading-relaxed text-white/55 md:grid-cols-2">
            {disclaimer.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="text-white/50">
              © {site.copyrightYear} {site.name}. All rights reserved.
            </p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/70 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
