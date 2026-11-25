"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { toast } from "sonner";
import { AccountDropdown } from "@/components/AccountMenu";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Check, Clock, Close, Document, Menu } from "@/components/ui/Icons";
import { LogoMark } from "@/components/ui/Logo";
import { PageSpinner } from "@/components/ui/Spinner";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
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
  completedLessonIds: string[];
}

const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
/** Whether the side panel (lg and up) or the drawer (smaller screens) is in use. */
const useIsDesktop = () => useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => true);

/** About 200 words a minute, never less than a minute. */
const readingMinutes = (body: string) => Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

/** A bought module, read one lesson at a time in a full-screen reader. */
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
      <ReaderShell>
        <div className="px-4 py-16">
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
        </div>
      </ReaderShell>
    );
  }

  const item = data?.module;
  if (!item) return null;
  return item.lessons?.length ? (
    <LessonReader item={item} />
  ) : (
    <ReaderShell crumb={item.course?.title} title={item.title}>
      <ModuleOverview item={item} />
    </ReaderShell>
  );
}

/** The reader's top bar: menu button, where you are, progress and the way out. */
function ReaderShell({
  crumb,
  title,
  menu,
  progress,
  children,
}: {
  crumb?: string;
  title?: string;
  menu?: { open: boolean; onToggle: () => void };
  progress?: { completed: number; total: number };
  children: ReactNode;
}) {
  const { user } = useAuth();
  const percent = progress && progress.total ? Math.round((progress.completed / progress.total) * 100) : 0;
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-2 sm:gap-3 sm:px-4">
        {menu && (
          <button
            type="button"
            onClick={menu.onToggle}
            aria-label={menu.open ? "Hide course menu" : "Show course menu"}
            aria-expanded={menu.open}
            aria-controls="lesson-menu"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-canvas"
          >
            <Menu className="size-5" />
          </button>
        )}
        <Link href="/my-courses" aria-label="My courses" className="shrink-0">
          <LogoMark className="size-8" />
        </Link>
        <div className="min-w-0 flex-1 leading-tight">
          {crumb && <p className="hidden truncate text-xs text-subtle sm:block">{crumb}</p>}
          {title && <p className="truncate text-sm font-semibold text-ink">{title}</p>}
        </div>
        {progress && progress.total > 0 && (
          <div className="hidden items-center gap-2 md:flex" aria-label={`${progress.completed} of ${progress.total} lessons completed`}>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-canvas">
              <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-xs font-medium text-muted">{percent}%</span>
          </div>
        )}
        {user && (
          <AccountDropdown
            user={user}
            links={[
              { href: "/my-courses", label: "My courses" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/account", label: "Account settings" },
            ]}
            logoutRedirect="/login"
          />
        )}
        <Link
          href="/my-courses"
          className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted hover:bg-canvas hover:text-ink sm:inline-flex"
        >
          <Close className="size-4" /> Exit
        </Link>
      </header>
      {children}
    </div>
  );
}

/**
 * The lessons, Coursera-style: the module outline on the left with a check for each completed
 * lesson, the reading in the middle, and "Mark as completed" / "Go to next item" at the end.
 * The open lesson is in the address (?lesson=3); without one, it opens the first unfinished lesson.
 */
function LessonReader({ item }: { item: ModuleContent }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [completed, setCompleted] = useState(() => new Set(item.completedLessonIds ?? []));
  const [saving, setSaving] = useState(false);
  // Desktop: the outline is shown unless hidden. Phones: it's a drawer, closed until asked for.
  const [desktopMenu, setDesktopMenu] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const isDesktop = useIsDesktop();

  const total = item.lessons.length;
  const requested = Number(searchParams.get("lesson"));
  // Where an address without ?lesson starts: fixed at load, so marking it completed doesn't jump away.
  const [startAt] = useState(() => item.lessons.findIndex((l) => !item.completedLessonIds?.includes(l.id)) + 1 || 1);
  const number = Number.isInteger(requested) && requested >= 1 && requested <= total ? requested : startAt;
  const lesson = item.lessons[number - 1]!;
  const next = item.lessons[number] ?? null;
  const isDone = completed.has(lesson.id);
  const allDone = completed.size >= total;
  const hrefFor = (n: number) => `${pathname}?lesson=${n}`;

  // A lesson change closes the phone drawer.
  const [drawerFor, setDrawerFor] = useState(number);
  if (drawerFor !== number) {
    setDrawerFor(number);
    setMobileMenu(false);
  }

  useEffect(() => {
    if (!mobileMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenu]);

  async function setLessonDone(id: string, done: boolean) {
    const before = completed;
    const optimistic = new Set(completed);
    if (done) optimistic.add(id);
    else optimistic.delete(id);
    setCompleted(optimistic);
    try {
      const res = await api<{ completedLessonIds: string[] }>(`/me/lessons/${id}/completed`, { method: done ? "PUT" : "DELETE" });
      setCompleted(new Set(res.completedLessonIds));
      return true;
    } catch (err) {
      setCompleted(before);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save your progress. Please try again.");
      return false;
    }
  }

  async function toggleDone() {
    setSaving(true);
    await setLessonDone(lesson.id, !isDone);
    setSaving(false);
  }

  /** "Go to next item" also marks this lesson completed, as finishing it is why you'd move on. */
  async function goNext() {
    if (!next) return;
    if (!isDone) void setLessonDone(lesson.id, true);
    router.push(hrefFor(number + 1));
  }

  const outline = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Module</p>
        <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-ink">{item.title}</h2>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-success transition-[width] duration-500"
            style={{ width: `${Math.round((completed.size / total) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          {completed.size} of {total} lessons completed
        </p>
      </div>
      <nav aria-label="Lessons" className="flex-1 overflow-y-auto py-2">
        <ol>
          {item.lessons.map((l, index) => {
            const n = index + 1;
            const current = n === number;
            const done = completed.has(l.id);
            return (
              <li key={l.id}>
                <Link
                  href={hrefFor(n)}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex gap-3 border-l-4 py-3 pl-4 pr-5 transition-colors",
                    current ? "border-brand bg-brand-soft" : "border-transparent hover:bg-canvas",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      done ? "bg-success text-white" : current ? "border-2 border-brand" : "border-2 border-line",
                    )}
                    aria-label={done ? "Completed" : undefined}
                  >
                    {done && <Check className="size-3" />}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-sm leading-snug", current ? "font-semibold text-ink" : "text-ink/90")}>
                      {l.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                      <Document className="size-3.5" /> Reading · {readingMinutes(l.body)} min
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
      {item.expiresAt && (
        <p className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-muted">
          <Clock className="size-3.5" /> Access until {formatDate(item.expiresAt)}
        </p>
      )}
    </div>
  );

  return (
    <ReaderShell
      crumb={item.course?.title}
      title={item.title}
      progress={{ completed: completed.size, total }}
      // One button: on desktop it shows or hides the side panel, on smaller screens it opens the drawer.
      menu={{
        open: isDesktop ? desktopMenu : mobileMenu,
        onToggle: () => (isDesktop ? setDesktopMenu((v) => !v) : setMobileMenu((v) => !v)),
      }}
    >
      <div className="flex flex-1">
        {/* Desktop outline */}
        {desktopMenu && (
          <aside id={isDesktop ? "lesson-menu" : undefined} className="hidden w-80 shrink-0 border-r border-line bg-surface lg:block">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)]">{outline}</div>
          </aside>
        )}

        {/* Phone and tablet drawer */}
        <div className={cn("fixed inset-0 z-50 lg:hidden", !mobileMenu && "pointer-events-none")} aria-hidden={!mobileMenu}>
          <div
            onClick={() => setMobileMenu(false)}
            className={cn("absolute inset-0 bg-ink/50 transition-opacity duration-300", mobileMenu ? "opacity-100" : "opacity-0")}
          />
          <aside
            id={isDesktop ? undefined : "lesson-menu"}
            role="dialog"
            aria-modal="true"
            aria-label="Course menu"
            inert={!mobileMenu}
            className={cn(
              "absolute inset-y-0 left-0 w-[22rem] max-w-[88vw] bg-surface shadow-2xl transition-transform duration-300 ease-(--ease-premium)",
              mobileMenu ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <button
              type="button"
              onClick={() => setMobileMenu(false)}
              aria-label="Close course menu"
              className="absolute right-3 top-4 flex size-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
            >
              <Close className="size-5" />
            </button>
            {outline}
          </aside>
        </div>

        <main className="min-w-0 flex-1 bg-canvas/40">
          <div className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Document className="size-4" /> Reading · {readingMinutes(lesson.body)} min
              </span>
              <span className="text-subtle">
                Lesson {number} of {total}
              </span>
              {isDone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
                  <Check className="size-3.5" /> Completed
                </span>
              )}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{lesson.title}</h1>
            {number === 1 && item.description && (
              <p className="mt-6 rounded-xl border border-line bg-surface px-5 py-4 text-[15px] leading-relaxed text-muted">
                {item.description}
              </p>
            )}

            <LessonMarkdown className="mt-8">{lesson.body}</LessonMarkdown>

            {/* The end of the lesson: what Coursera calls the item footer. */}
            <div className="mt-14 rounded-2xl border border-line bg-surface p-5 sm:p-6">
              {allDone && !next ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">You&apos;ve completed this module</p>
                    <p className="mt-1 text-sm text-muted">Well done. All {total} lessons are marked as completed.</p>
                  </div>
                  <ButtonLink href="/my-courses">Back to My courses</ButtonLink>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {isDone ? (
                    <button
                      type="button"
                      onClick={toggleDone}
                      disabled={saving}
                      className="inline-flex items-center gap-2 self-start text-sm font-medium text-success disabled:opacity-60"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-success text-white">
                        <Check className="size-3.5" />
                      </span>
                      Completed
                      <span className="font-normal text-subtle underline-offset-2 hover:underline">· Undo</span>
                    </button>
                  ) : (
                    <Button variant="secondary" onClick={toggleDone} loading={saving} className="sm:w-auto">
                      Mark as completed
                    </Button>
                  )}
                  {next ? (
                    <Button onClick={goNext} className="sm:w-auto">
                      Go to next item <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <ButtonLink href="/my-courses" variant="secondary">
                      Back to My courses
                    </ButtonLink>
                  )}
                </div>
              )}
              {next && (
                <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
                  <span className="text-subtle">Up next:</span> {next.title}
                </p>
              )}
            </div>

            {number > 1 && (
              <Link href={hrefFor(number - 1)} className="mt-6 inline-block text-sm text-muted hover:text-ink">
                ← Previous: {item.lessons[number - 2]!.title}
              </Link>
            )}
          </div>
        </main>
      </div>
    </ReaderShell>
  );
}

/** A module whose lessons aren't on the site yet: its outline, and the external link if there is one. */
function ModuleOverview({ item }: { item: ModuleContent }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
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
    </div>
  );
}
