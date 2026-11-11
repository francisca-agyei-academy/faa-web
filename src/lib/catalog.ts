import { cacheLife, cacheTag } from "next/cache";
import type { CatalogCourse } from "@/types/catalog";

const API_URL = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

// Results are cached for a few minutes, so admin edits appear on the website shortly after
// saving. A failed request is cached for only 30 seconds, so pages recover soon after the API
// does (for example when the build ran while the API was asleep). 5 minutes is the shortest
// expiry that still lets the page be prerendered.
const keepBriefly = () => cacheLife({ stale: 30, revalidate: 30, expire: 300 });

/** Published courses from the API, or null when the API can't be reached. */
export async function getCatalog(): Promise<CatalogCourse[] | null> {
  "use cache";
  cacheTag("catalog");
  try {
    const res = await fetch(`${API_URL}/api/v1/courses`, { signal: AbortSignal.timeout(10_000) });
    if (res.ok) {
      cacheLife("minutes");
      return ((await res.json()) as { courses: CatalogCourse[] }).courses;
    }
  } catch {}
  keepBriefly();
  return null;
}

/** One course by slug: the course, "missing" when it doesn't exist, or null when the API can't be reached. */
export async function getCatalogCourse(slug: string): Promise<CatalogCourse | "missing" | null> {
  "use cache";
  cacheTag("catalog");
  try {
    const res = await fetch(`${API_URL}/api/v1/courses/${encodeURIComponent(slug)}`, { signal: AbortSignal.timeout(10_000) });
    if (res.ok || res.status === 404) {
      cacheLife("minutes");
      return res.ok ? ((await res.json()) as { course: CatalogCourse }).course : "missing";
    }
  } catch {}
  keepBriefly();
  return null;
}

export const featuredOf = (courses: CatalogCourse[]) => courses.find((c) => c.isFeatured) ?? courses[0];
