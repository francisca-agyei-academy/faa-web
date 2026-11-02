"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { CourseImage } from "@/components/website/CourseImage";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { AdminCourseRow } from "@/types/admin";
import { Badge, QueryBoundary, Table, Td, Th } from "../ui";

export function CourseList() {
  const { data, loading, error, reload } = useApiQuery<{ courses: AdminCourseRow[] }>("/admin/courses");

  return (
    <>
      <PageHeader
        title="Courses"
        description="Create courses, add modules and set prices. Lower sort numbers appear first on the website."
        action={<ButtonLink href="/admin/courses/new">New course</ButtonLink>}
      />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {data && data.courses.length === 0 && (
          <EmptyState title="No courses yet" action={<ButtonLink href="/admin/courses/new">Create the first course</ButtonLink>}>
            Run <code className="font-mono text-xs">pnpm seed:courses</code> in the api folder to load the starting catalog.
          </EmptyState>
        )}
        {data && data.courses.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th className="w-14">#</Th>
                <Th>Course</Th>
                <Th>Modules</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((course) => (
                <tr key={course.id} className="hover:bg-canvas">
                  <Td className="text-subtle">{course.sortOrder}</Td>
                  <Td>
                    <Link href={`/admin/courses/${course.id}`} className="flex items-center gap-3">
                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                        <CourseImage course={course} sizes="56px" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink hover:text-brand">{course.title}</span>
                        <span className="block text-xs text-subtle">{course.track || "No track"} · /{course.slug}</span>
                      </span>
                    </Link>
                  </Td>
                  <Td>{course.modules > 0 ? course.modules : <span className="text-subtle">{course.topics.length} topics</span>}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {course.isPublished ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                      {course.isFeatured && <Badge tone="accent">Flagship</Badge>}
                      {course.enrollmentOpen ? <Badge tone="brand">Enrolment open</Badge> : <Badge tone="warning">Coming soon</Badge>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </QueryBoundary>
    </>
  );
}
