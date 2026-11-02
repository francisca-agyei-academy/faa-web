import { cacheLife, cacheTag } from "next/cache";
import type { CatalogCourse } from "@/types/catalog";

const API_URL = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

/**
 * Published courses from the API. Cached for a few minutes, so admin edits appear on the
 * website shortly after saving. Returns null when the API can't be reached (for example
 * during a build without the API running), so pages show a friendly message instead of failing.
 */
export async function getCatalog(): Promise<CatalogCourse[] | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  try {
    const res = await fetch(`${API_URL}/api/v1/courses`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    return ((await res.json()) as { courses: CatalogCourse[] }).courses;
  } catch {
    return null;
  }
}

/** One course by slug: the course, "missing" when it doesn't exist, or null when the API is unreachable. */
export async function getCatalogCourse(slug: string): Promise<CatalogCourse | "missing" | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  try {
    const res = await fetch(`${API_URL}/api/v1/courses/${encodeURIComponent(slug)}`, { signal: AbortSignal.timeout(10_000) });
    if (res.status === 404) return "missing";
    if (!res.ok) return null;
    return ((await res.json()) as { course: CatalogCourse }).course;
  } catch {
    return null;
  }
}

export const featuredOf = (courses: CatalogCourse[]) => courses.find((c) => c.isFeatured) ?? courses[0];
