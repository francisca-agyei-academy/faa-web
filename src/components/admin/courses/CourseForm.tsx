"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { courseImages } from "@/content/courseImages";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CourseInput } from "@/types/admin";
import { Switch, Textarea, TopicsEditor } from "../ui";

export const emptyCourse: CourseInput = {
  title: "",
  slug: "",
  description: "",
  track: "",
  audience: null,
  outcomeFrom: null,
  outcomeTo: null,
  topics: [],
  imageKey: "graduate",
  isPublished: false,
  isFeatured: false,
  enrollmentOpen: false,
  includesToolkit: false,
  includesSignatureBonus: false,
  sortOrder: 0,
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

/** Create or edit a course. `onSave` gets the form values and should throw ApiError on failure. */
export function CourseForm({
  initial,
  submitLabel,
  onSave,
}: {
  initial: CourseInput;
  submitLabel: string;
  onSave: (values: CourseInput) => Promise<void>;
}) {
  const [values, setValues] = useState<CourseInput>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof CourseInput>(key: K, value: CourseInput[K]) => {
    setSaved(false);
    setValues((v) => ({ ...v, [key]: value }));
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await onSave(values);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        setError(err.code === "VALIDATION_FAILED" ? "Please fix the highlighted fields." : err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <Card className="flex flex-col gap-5">
        <h2 className="font-display text-lg font-semibold text-ink">Basics</h2>
        <Input
          label="Title"
          value={values.title}
          error={fieldErrors.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
        />
        <Input
          label="URL slug"
          value={values.slug}
          error={fieldErrors.slug}
          hint={`The course page will be /courses/${values.slug || "your-slug"}`}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
        />
        <Textarea
          label="Summary"
          value={values.description}
          error={fieldErrors.description}
          hint="One or two sentences, shown on course cards and the course page."
          onChange={(e) => set("description", e.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Track" value={values.track} error={fieldErrors.track} hint="e.g. Scholarships for Masters & PhDs" onChange={(e) => set("track", e.target.value)} />
          <Input
            label="Sort order"
            type="number"
            min={0}
            value={String(values.sortOrder)}
            error={fieldErrors.sortOrder}
            hint="Lower numbers appear first."
            onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="font-display text-lg font-semibold text-ink">Course page</h2>
        <Textarea
          label="Who it's for"
          value={values.audience ?? ""}
          error={fieldErrors.audience}
          hint="Shown under “Is this course for you?”"
          onChange={(e) => set("audience", e.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Textarea label="Outcome: from" value={values.outcomeFrom ?? ""} error={fieldErrors.outcomeFrom} hint="Where the student starts, in their words." onChange={(e) => set("outcomeFrom", e.target.value)} />
          <Textarea label="Outcome: to" value={values.outcomeTo ?? ""} error={fieldErrors.outcomeTo} hint="Where they end up." onChange={(e) => set("outcomeTo", e.target.value)} />
        </div>
        <TopicsEditor
          label="Topics"
          hint="Listed under “What this course will cover” while the course has no modules."
          value={values.topics}
          onChange={(topics) => set("topics", topics)}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink">Photo</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(courseImages).map(([key, image]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("imageKey", key)}
              aria-pressed={values.imageKey === key}
              className={cn(
                "overflow-hidden rounded-xl border-2 text-left transition-all",
                values.imageKey === key ? "border-brand ring-2 ring-brand/20" : "border-transparent hover:border-line",
              )}
            >
              <Image src={image.src} alt={image.alt} placeholder="blur" sizes="200px" className="aspect-[16/10] w-full object-cover" />
              <span className="block bg-surface px-3 py-2 text-xs font-medium text-ink">{image.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">Visibility & extras</h2>
        <Switch label="Published" description="Show this course on the website." checked={values.isPublished} onChange={(v) => set("isPublished", v)} />
        <Switch label="Flagship course" description="Highlight it as the featured course." checked={values.isFeatured} onChange={(v) => set("isFeatured", v)} />
        <Switch label="Enrolment open" description="Students can buy modules. When off, the course shows “Coming soon”." checked={values.enrollmentOpen} onChange={(v) => set("enrollmentOpen", v)} />
        <Switch label="Includes the Student Toolkit" checked={values.includesToolkit} onChange={(v) => set("includesToolkit", v)} />
        <Switch label="Includes the signature bonus" description="Francisca's Journey: Ghana → Australia" checked={values.includesSignatureBonus} onChange={(v) => set("includesSignatureBonus", v)} />
      </Card>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-canvas/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        {error && <Alert tone="error" className="mr-auto py-2">{error}</Alert>}
        {saved && !error && <span className="mr-auto text-sm font-medium text-success">Saved</span>}
        <Button type="submit" size="lg" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
