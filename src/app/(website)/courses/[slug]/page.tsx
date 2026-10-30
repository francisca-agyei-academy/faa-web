import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSpinner } from "@/components/ui/Spinner";
import { CourseDetail } from "@/components/website/course/CourseDetail";
import { courses, getCourse } from "@/content/courses";

// Every course page is prerendered at build time.
export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return course ? { title: course.title, description: course.summary } : { title: "Course not found" };
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
  const course = getCourse((await params).slug);
  if (!course) notFound();
  return <CourseDetail course={course} />;
}
