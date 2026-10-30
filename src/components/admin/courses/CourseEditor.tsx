"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api, ApiError } from "@/lib/api";
import type { AdminCourse, CourseInput } from "@/types/admin";
import { ConfirmDialog, QueryBoundary } from "../ui";
import { CourseForm, emptyCourse } from "./CourseForm";
import { ModuleManager } from "./ModuleManager";

const toInput = (c: AdminCourse): CourseInput => ({
  title: c.title,
  slug: c.slug,
  description: c.description,
  track: c.track,
  audience: c.audience,
  outcomeFrom: c.outcomeFrom,
  outcomeTo: c.outcomeTo,
  topics: c.topics,
  imageKey: c.imageKey,
  isPublished: c.isPublished,
  isFeatured: c.isFeatured,
  enrollmentOpen: c.enrollmentOpen,
  includesToolkit: c.includesToolkit,
  includesSignatureBonus: c.includesSignatureBonus,
  sortOrder: c.sortOrder,
});

export function NewCourse() {
  const router = useRouter();
  return (
    <>
      <BackLink />
      <PageHeader title="New course" description="You can add modules after saving." />
      <CourseForm
        initial={emptyCourse}
        submitLabel="Create course"
        onSave={async (values) => {
          const { course } = await api<{ course: AdminCourse }>("/admin/courses", { method: "POST", body: values });
          router.replace(`/admin/courses/${course.id}`);
        }}
      />
    </>
  );
}

export function CourseEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, reload } = useApiQuery<{ course: AdminCourse }>(`/admin/courses/${id}`);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function remove() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api(`/admin/courses/${id}`, { method: "DELETE" });
      router.replace("/admin/courses");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete the course.");
      setDeleting(false);
    }
  }

  const course = data?.course;
  return (
    <>
      <BackLink />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {course && (
          <>
            <PageHeader
              title={course.title}
              description={course.isPublished ? `Live at /courses/${course.slug}` : "Draft: not visible on the website"}
            />
            <div className="flex flex-col gap-8">
              {/* key resets the form if the course reloads with different data */}
              <CourseForm
                key={course.updatedAt}
                initial={toInput(course)}
                submitLabel="Save changes"
                onSave={async (values) => {
                  await api(`/admin/courses/${id}`, { method: "PATCH", body: values });
                }}
              />
              <ModuleManager courseId={course.id} modules={course.modules} onChange={reload} />
              <Card className="flex flex-wrap items-center justify-between gap-4 border-danger/30">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">Delete course</h2>
                  <p className="text-sm text-muted">Removes the course and all its modules. To hide it instead, turn off Published.</p>
                </div>
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                  Delete course
                </Button>
              </Card>
            </div>
            <ConfirmDialog
              open={confirmDelete}
              title="Delete this course?"
              message={
                <>
                  <strong className="text-ink">{course.title}</strong> and its {course.modules.length} modules will be
                  deleted permanently. Courses with purchased modules can&apos;t be deleted.
                </>
              }
              confirmLabel="Delete course"
              danger
              busy={deleting}
              error={deleteError}
              onConfirm={remove}
              onClose={() => {
                setConfirmDelete(false);
                setDeleteError(null);
              }}
            />
          </>
        )}
      </QueryBoundary>
    </>
  );
}

function BackLink() {
  return (
    <Link href="/admin/courses" className="mb-4 inline-block text-sm text-muted hover:text-ink">
      ← All courses
    </Link>
  );
}
