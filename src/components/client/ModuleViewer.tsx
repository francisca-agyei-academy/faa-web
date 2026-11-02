"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Check, Clock } from "@/components/ui/Icons";
import { PageSpinner } from "@/components/ui/Spinner";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatDate } from "@/lib/utils";

interface ModuleContent {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  contentUrl: string | null;
  previewUrl: string | null;
  expiresAt: string | null;
  course: { slug: string; title: string } | null;
}

/** A bought module. The API refuses it unless the student's access is still active. */
export function ModuleViewer() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { data, loading, error, reload } = useApiQuery<{ module: ModuleContent }>(`/me/modules/${moduleId}`);

  if (loading) return <PageSpinner label="Opening module…" />;

  if (error) {
    const locked = error.code === "NOT_PURCHASED" || error.code === "ACCESS_EXPIRED";
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-xl font-semibold text-ink">
          {error.code === "ACCESS_EXPIRED" ? "Your access has ended" : locked ? "This module is locked" : "Couldn't open this module"}
        </h1>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          {locked ? (
            <ButtonLink href="/courses">Browse courses</ButtonLink>
          ) : (
            <button type="button" onClick={reload} className="text-sm font-medium text-brand hover:underline">
              Try again
            </button>
          )}
          <ButtonLink href="/my-courses" variant="secondary">
            My courses
          </ButtonLink>
        </div>
      </Card>
    );
  }

  const item = data?.module;
  if (!item) return null;

  return (
    <>
      <Link href="/my-courses" className="text-sm text-muted hover:text-ink">
        ← My courses
      </Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          {item.course && <p className="text-sm text-subtle">{item.course.title}</p>}
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{item.title}</h1>
          {item.description && <p className="mt-3 leading-relaxed text-muted">{item.description}</p>}
          {item.topics.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-lg font-semibold text-ink">In this module</h2>
              <ol className="mt-4 flex flex-col divide-y divide-line rounded-xl border border-line">
                {item.topics.map((topic, index) => (
                  <li key={topic} className="flex items-center gap-3 px-4 py-3 text-sm text-ink">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                      {index + 1}
                    </span>
                    {topic}
                  </li>
                ))}
              </ol>
            </>
          )}
        </Card>
        <Card className="h-fit">
          <h2 className="font-display text-lg font-semibold text-ink">Your lessons</h2>
          {item.contentUrl ? (
            <>
              <p className="mt-2 text-sm text-muted">The lessons open in a new tab.</p>
              <a
                href={item.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sheen mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-base font-medium text-white hover:bg-brand-strong"
              >
                Open lessons <ArrowRight className="size-4" />
              </a>
            </>
          ) : (
            <p className="mt-2 inline-flex gap-2 text-sm text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-success" /> You have access. The lessons are being added and
              will appear here shortly.
            </p>
          )}
          {item.expiresAt && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4" /> Access until {formatDate(item.expiresAt)}
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
