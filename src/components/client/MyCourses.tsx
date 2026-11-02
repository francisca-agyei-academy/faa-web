"use client";

import Link from "next/link";
import { QueryBoundary } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { Clock } from "@/components/ui/Icons";
import { CourseImage } from "@/components/website/CourseImage";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn, formatDate } from "@/lib/utils";
import type { MyPurchase } from "@/types/catalog";

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));

export function MyCourses() {
  const { data, loading, error, reload } = useApiQuery<{ purchases: MyPurchase[] }>("/me/purchases");
  const purchases = data?.purchases.filter((p) => p.module) ?? [];

  return (
    <>
      <PageHeader title="My courses" description="Modules you've bought and how long you can access them." />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {data && purchases.length === 0 && (
          <EmptyState title="No modules yet" action={<ButtonLink href="/courses">Browse courses</ButtonLink>}>
            Once you buy a module it appears here, ready to open.
          </EmptyState>
        )}
        {purchases.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {purchases.map((p) => {
              const mod = p.module!;
              const course = mod.course;
              const left = daysLeft(p.expiresAt);
              return (
                <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                  <div className="relative aspect-[16/9] bg-brand-soft">
                    {course && <CourseImage course={course} sizes="(min-width: 1280px) 400px, 50vw" />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {course && (
                      <Link href={`/courses/${course.slug}`} className="text-xs font-medium text-subtle hover:text-brand">
                        {course.title}
                      </Link>
                    )}
                    <h2 className="mt-1 font-display text-lg font-semibold text-ink">{mod.title}</h2>
                    <p
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 text-sm",
                        !p.isActive ? "text-danger" : left <= 7 ? "text-warning" : "text-muted",
                      )}
                    >
                      <Clock className="size-4" />
                      {p.isActive
                        ? `Access until ${formatDate(p.expiresAt)} (${left} ${left === 1 ? "day" : "days"} left)`
                        : `Access ended ${formatDate(p.expiresAt)}`}
                    </p>
                    <div className="mt-auto pt-5">
                      {p.isActive ? (
                        <ButtonLink href={`/course/${mod.id}`} className="w-full">
                          Open module
                        </ButtonLink>
                      ) : (
                        <ButtonLink href={course ? `/courses/${course.slug}` : "/courses"} variant="secondary" className="w-full">
                          Buy again
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </QueryBoundary>
    </>
  );
}
