"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Check, Clock } from "@/components/ui/Icons";
import { PageSpinner } from "@/components/ui/Spinner";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn, formatDate } from "@/lib/utils";
import { LessonMarkdown } from "./LessonMarkdown";

interface Lesson {
  id: string;
  order: number;
  title: string;
  body: string;
}

interface ModuleContent {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  contentUrl: string | null;
  previewUrl: string | null;
  expiresAt: string | null;
  course: { slug: string; title: string } | null;
  lessons: Lesson[];
}

/** A bought module and its lessons. The API refuses it unless the student's access is still active. */
export function ModuleViewer() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { data, loading, error, reload } = useApiQuery<{ module: ModuleContent }>(`/me/modules/${moduleId}`);

  if (loading) return <PageSpinner label="Opening module…" />;

  if (error) {
    const locked = error.code === "NOT_PURCHASED" || error.code === "ACCESS_EXPIRED";
    // The API says where this module can be bought or renewed: its card on the course page.
    const details = error.details as { renewPath?: unknown } | undefined;
    const renewPath = typeof details?.renewPath === "string" ? details.renewPath : null;
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-xl font-semibold text-ink">
          {error.code === "ACCESS_EXPIRED" ? "Your access has ended" : locked ? "This module is locked" : "Couldn't open this module"}
        </h1>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          {locked ? (
            <ButtonLink href={renewPath ?? "/courses"}>
              {!renewPath ? "Browse courses" : error.code === "ACCESS_EXPIRED" ? "Renew this module" : "Buy this module"}
            </ButtonLink>
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
  return item.lessons?.length ? <LessonReader item={item} /> : <ModuleOverview item={item} />;
}

/** The module's lessons, one at a time. The open lesson is in the address (?lesson=3), so it can be bookmarked. */
function LessonReader({ item }: { item: ModuleContent }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const total = item.lessons.length;
  const requested = Number(searchParams.get("lesson"));
  const number = Number.isInteger(requested) && requested >= 1 && requested <= total ? requested : 1;
  const lesson = item.lessons[number - 1]!;
  const hrefFor = (n: number) => `${pathname}?lesson=${n}`;

  const list = (
    <ol className="flex flex-col gap-0.5">
      {item.lessons.map((l, index) => {
        const n = index + 1;
        const current = n === number;
        return (
          <li key={l.id}>
            <Link
              href={hrefFor(n)}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                current ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-canvas hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "mt-px flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  current ? "bg-brand text-white" : "bg-canvas text-subtle",
                )}
              >
                {n}
              </span>
              <span className="leading-snug">{l.title}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <Link href="/my-courses" className="text-sm text-muted hover:text-ink">
        ← My courses
      </Link>
      <header className="mt-4">
        {item.course && <p className="text-sm text-subtle">{item.course.title}</p>}
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">{item.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>{total} lessons</span>
          {item.expiresAt && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" /> Access until {formatDate(item.expiresAt)}
            </span>
          )}
        </p>
      </header>

      {/* minmax(0, 1fr): a wide lesson table scrolls inside its own box instead of widening the page. */}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Phones and tablets: the lesson list folds into one line. Keyed on the lesson so it closes after a pick. */}
        <details key={number} className="group rounded-2xl border border-line bg-surface lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="block text-xs text-subtle">
                Lesson {number} of {total}
              </span>
              <span className="block truncate font-medium text-ink">{lesson.title}</span>
            </span>
            <span className="shrink-0 text-xs font-medium text-brand group-open:hidden">All lessons</span>
            <span className="hidden shrink-0 text-xs font-medium text-brand group-open:inline">Close</span>
          </summary>
          <div className="border-t border-line p-2">{list}</div>
        </details>

        <nav aria-label="Lessons" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-2">
            <p className="px-3 pb-2 pt-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">Lessons</p>
            {list}
          </div>
        </nav>

        <article className="min-w-0 rounded-2xl border border-line bg-surface px-5 py-7 shadow-sm sm:px-10 sm:py-10 lg:px-8 xl:px-10">
          <p className="text-sm font-medium text-accent-strong">
            Lesson {number} of {total}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">{lesson.title}</h2>
          {number === 1 && item.description && (
            <p className="mt-4 rounded-xl bg-canvas px-5 py-4 text-sm leading-relaxed text-muted">{item.description}</p>
          )}
          <LessonMarkdown className="mt-6">{lesson.body}</LessonMarkdown>

          <div className="mt-12 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {number > 1 ? (
              <Link
                href={hrefFor(number - 1)}
                className="group flex min-w-0 flex-col rounded-xl px-1 py-1 text-sm text-muted hover:text-ink"
              >
                <span className="text-xs text-subtle">← Previous</span>
                <span className="truncate font-medium">{item.lessons[number - 2]!.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {number < total ? (
              <ButtonLink href={hrefFor(number + 1)} className="sm:max-w-[60%]">
                <span className="truncate">Next: {item.lessons[number]!.title}</span>
                <ArrowRight className="size-4 shrink-0" />
              </ButtonLink>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-success">
                <Check className="size-4" /> You&apos;ve reached the end of this module.
              </p>
            )}
          </div>
        </article>
      </div>
    </>
  );
}

/** A module whose lessons aren't on the site yet: its outline, and the external link if there is one. */
function ModuleOverview({ item }: { item: ModuleContent }) {
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
