"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "@/components/ui/Icons";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatPrice } from "@/lib/utils";
import type { CatalogCourse, MyPurchase } from "@/types/catalog";

/**
 * Modules the student doesn't have (or whose access has ended), grouped by course. Each one links
 * to its card on the course page, where the student buys it.
 */
export function MoreModules({ purchases }: { purchases: MyPurchase[] | undefined }) {
  const { data } = useApiQuery<{ courses: CatalogCourse[] }>("/courses");
  if (!data || !purchases) return null;

  const owned = new Set(purchases.filter((p) => p.isActive && p.module).map((p) => p.module!.id));
  const courses = data.courses
    .map((course) => ({
      course,
      modules: [...course.modules]
        .sort((a, b) => a.order - b.order)
        .map((module, index) => ({ module, number: index + 1 }))
        .filter(({ module }) => !owned.has(module.id)),
    }))
    .filter(({ modules }) => modules.length > 0);

  if (!courses.length) {
    return (
      <Card className="text-center text-sm text-muted">
        You have every module we offer. New courses will appear here when they open.
      </Card>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Get more modules</h2>
          <p className="mt-1 text-sm text-muted">Pick a module to see what it covers and buy it on the course page.</p>
        </div>
        <ButtonLink href="/courses" variant="secondary" size="sm">
          Browse all courses
        </ButtonLink>
      </div>

      <div className="flex flex-col gap-6">
        {courses.map(({ course, modules }) => {
          const href = `/courses/${course.slug}`;
          return (
            <Card key={course.slug} className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{course.title}</h3>
                  <p className="text-xs text-subtle">
                    {modules.length} of {course.modules.length} modules still to get
                  </p>
                </div>
                {course.enrollmentOpen && (
                  <Link href={href} className="text-sm font-medium text-brand hover:underline">
                    Buy the full course →
                  </Link>
                )}
              </div>
              <ul className="divide-y divide-line">
                {modules.map(({ module, number }) => (
                  <li key={module.id}>
                    <Link
                      href={`${href}#module-${number}`}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-canvas"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand font-display text-sm font-semibold text-accent">
                        {String(number).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium text-ink group-hover:text-brand">
                        {module.title}
                      </span>
                      <span className="hidden text-sm font-semibold text-ink sm:block">
                        {course.enrollmentOpen && module.price ? formatPrice(module.price) : "Coming soon"}
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
