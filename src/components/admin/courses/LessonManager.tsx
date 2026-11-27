"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LessonMarkdown } from "@/components/client/LessonMarkdown";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ConfirmDialog, QueryBoundary } from "../ui";

interface AdminLesson {
  id: string;
  order: number;
  title: string;
  body: string;
  updatedAt: string;
}

interface LessonsResponse {
  module: { id: string; title: string };
  lessons: AdminLesson[];
}

/** The lessons of one module: add, edit (Markdown with a live preview), reorder and delete. */
export function LessonManager() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { data, loading, error, reload } = useApiQuery<LessonsResponse>(`/admin/modules/${moduleId}/lessons`);
  const [editing, setEditing] = useState<AdminLesson | "new" | null>(null);
  const [deleting, setDeleting] = useState<AdminLesson | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function move(lesson: AdminLesson, direction: "up" | "down") {
    try {
      await api(`/admin/lessons/${lesson.id}/move`, { method: "POST", body: { direction } });
      reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't move the lesson.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api(`/admin/lessons/${deleting.id}`, { method: "DELETE" });
      toast.success(`“${deleting.title}” deleted.`);
      setDeleting(null);
      reload();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Couldn't delete the lesson.");
    } finally {
      setBusy(false);
    }
  }

  if (editing !== null) {
    return (
      <LessonForm
        moduleId={moduleId}
        lesson={editing === "new" ? null : editing}
        onDone={(saved) => {
          setEditing(null);
          if (saved) reload();
        }}
      />
    );
  }

  return (
    <QueryBoundary loading={loading} error={error} onRetry={reload}>
      {data && (
        <>
          <button type="button" onClick={() => history.back()} className="text-sm text-muted hover:text-ink">
            ← Back to the course
          </button>
          <div className="mt-4">
            <PageHeader
              title={data.module.title}
              description="Lessons students read in this module, in order. Only students with active access can open them."
              action={<Button onClick={() => setEditing("new")}>Add lesson</Button>}
            />
          </div>
          <Card className="p-0">
            {data.lessons.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted">
                No lessons yet. Students see the module outline until you add some.
              </p>
            ) : (
              <ol className="divide-y divide-line">
                {data.lessons.map((lesson, index) => (
                  <li key={lesson.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink">{lesson.title}</p>
                      <p className="mt-0.5 text-xs text-subtle">
                        {lesson.body.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} words
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => move(lesson, "up")} aria-label={`Move ${lesson.title} up`}>
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === data.lessons.length - 1}
                        onClick={() => move(lesson, "down")}
                        aria-label={`Move ${lesson.title} down`}
                      >
                        ↓
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditing(lesson)}>
                        Edit
                      </Button>
                      <Button variant="ghost-danger" size="sm" onClick={() => setDeleting(lesson)}>
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
          <ConfirmDialog
            open={deleting !== null}
            title="Delete lesson?"
            message={
              <>
                <strong className="text-ink">{deleting?.title}</strong> will be removed from the module. This can&apos;t be
                undone.
              </>
            }
            confirmLabel="Delete lesson"
            danger
            busy={busy}
            error={deleteError}
            onConfirm={confirmDelete}
            onClose={() => {
              setDeleting(null);
              setDeleteError(null);
            }}
          />
        </>
      )}
    </QueryBoundary>
  );
}

function LessonForm({
  moduleId,
  lesson,
  onDone,
}: {
  moduleId: string;
  lesson: AdminLesson | null;
  onDone: (saved: boolean) => void;
}) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [body, setBody] = useState(lesson?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const changed = title !== (lesson?.title ?? "") || body !== (lesson?.body ?? "");

  // Closing the tab, reloading or the browser's back button would lose unsaved edits: ask first.
  useEffect(() => {
    if (!changed || saving) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed, saving]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      if (lesson) await api(`/admin/lessons/${lesson.id}`, { method: "PATCH", body: { title, body } });
      else await api(`/admin/modules/${moduleId}/lessons`, { method: "POST", body: { title, body } });
      toast.success(lesson ? "Lesson saved." : "Lesson added.");
      onDone(true);
    } catch (err) {
      setSaving(false);
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast.error(err.code === "VALIDATION_FAILED" ? "Please fix the highlighted fields." : err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  function cancel() {
    if (changed && !window.confirm("Discard your changes to this lesson?")) return;
    onDone(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <button type="button" onClick={cancel} className="self-start text-sm text-muted hover:text-ink">
        ← All lessons
      </button>
      <PageHeader title={lesson ? "Edit lesson" : "Add lesson"} />
      <Input label="Title" value={title} error={fieldErrors.title} onChange={(e) => setTitle(e.target.value)} />

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex rounded-lg border border-line bg-canvas p-0.5 text-sm" role="tablist">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-4 py-1.5 font-medium capitalize transition-colors",
                  tab === t ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-subtle">
            Markdown: <code>## Heading</code>, <code>- list item</code>, <code>**bold**</code>,{" "}
            <code>[link text](https://…)</code>, <code>&gt; note</code>, and tables.{" "}
            <Link href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Cheat sheet
            </Link>
          </p>
        </div>
        {tab === "write" ? (
          <textarea
            aria-label="Lesson text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck
            className="mt-2 min-h-[60vh] w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        ) : (
          <Card className="mt-2 min-h-[60vh] sm:px-10">
            <h2 className="font-display text-2xl font-semibold text-ink">{title || "Untitled lesson"}</h2>
            {body.trim() ? <LessonMarkdown className="mt-6">{body}</LessonMarkdown> : <p className="mt-6 text-sm text-subtle">Nothing to preview yet.</p>}
          </Card>
        )}
        {fieldErrors.body && <p className="mt-1.5 text-sm text-danger">{fieldErrors.body}</p>}
      </div>

      <div className="sticky bottom-0 -mx-1 flex justify-end gap-2 border-t border-line bg-canvas/95 px-1 py-4 backdrop-blur">
        <Button type="button" variant="secondary" onClick={cancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={!changed && Boolean(lesson)}>
          {lesson ? "Save lesson" : "Add lesson"}
        </Button>
      </div>
    </form>
  );
}
