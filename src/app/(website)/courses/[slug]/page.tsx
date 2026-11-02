import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { CourseDetail } from "@/components/website/course/CourseDetail";
import { getCatalog, getCatalogCourse } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const course = await getCatalogCourse((await params).slug);
  return course && course !== "missing" ? { title: course.title, description: course.description } : { title: "Course" };
}

// With Cache Components, reading `params` happens inside <Suspense>.
export default function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  return (
    <Suspense fallback={<PageSpinner label="Loading course…" />}>
      <CourseContent params={params} />
    </Suspense>
  );
}

async function CourseContent({ params }: { params: PageProps<"/courses/[slug]">["params"] }) {
  const { slug } = await params;
  const [course, catalog] = await Promise.all([getCatalogCourse(slug), getCatalog()]);
  if (course === "missing") notFound();
  if (!course) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24">
        <EmptyState title="This course couldn't be loaded">Please refresh the page in a moment.</EmptyState>
      </div>
    );
  }
  const related = (catalog ?? []).filter((c) => c.slug !== course.slug);
  return <CourseDetail course={course} related={related} />;
}
