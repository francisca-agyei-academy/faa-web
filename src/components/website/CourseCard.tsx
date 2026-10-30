import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers } from "@/components/ui/Icons";
import type { Course } from "@/content/courses";

export function StatusBadge({ status }: { status: Course["status"] }) {
  return status === "available" ? (
    <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-strong">
      Flagship course
    </span>
  ) : (
    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
      Coming soon
    </span>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const count = course.modules?.length ?? course.topics?.length ?? 0;
  const unit = course.modules ? "modules" : "topics";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-soft">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          className="object-cover transition-transform duration-1000 ease-(--ease-premium) group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <StatusBadge status={course.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-brand">
          {course.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{course.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5 text-subtle">
            <Layers className="size-4" />
            {count} {unit}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            View course <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
