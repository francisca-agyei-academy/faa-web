"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminModule, ModuleInput } from "@/types/admin";
import { Badge, ConfirmDialog, Dialog, inputToPesewas, pesewasToInput, Switch, Textarea, TopicsEditor } from "../ui";

const emptyModule: ModuleInput = {
  title: "",
  description: null,
  topics: [],
  price: null,
  accessDays: null,
  contentUrl: null,
  previewUrl: null,
  thumbnailUrl: null,
  isPublished: false,
};

/** Modules of one course: add, edit, reorder and delete. Calls onChange after every write. */
export function ModuleManager({
  courseId,
  modules,
  onChange,
}: {
  courseId: string;
  modules: AdminModule[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<AdminModule | "new" | null>(null);
  const [deleting, setDeleting] = useState<AdminModule | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function move(module: AdminModule, direction: "up" | "down") {
    try {
      await api(`/admin/modules/${module.id}/move`, { method: "POST", body: { direction } });
      onChange();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't move the module.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/admin/modules/${deleting.id}`, { method: "DELETE" });
      toast.success(`“${deleting.title}” deleted.`);
      setDeleting(null);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't delete the module.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Modules</h2>
          <p className="text-sm text-muted">Each module is bought separately, with its own price and access period.</p>
        </div>
        <Button onClick={() => setEditing("new")}>Add module</Button>
      </div>
      {modules.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted">
          No modules yet. Until you add some, the website lists this course&apos;s topics instead.
        </p>
      ) : (
        <ol className="divide-y divide-line">
          {modules.map((module, index) => (
            <li key={module.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{module.title}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {module.topics.length} lessons · {module.price === null ? "No price" : formatPrice(module.price)} ·{" "}
                  {module.accessDays === null ? "No access period" : `${module.accessDays} days`}
                </p>
              </div>
              {module.isPublished ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => move(module, "up")} aria-label={`Move ${module.title} up`}>
                  ↑
                </Button>
                <Button variant="ghost" size="sm" disabled={index === modules.length - 1} onClick={() => move(module, "down")} aria-label={`Move ${module.title} down`}>
                  ↓
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditing(module)}>
                  Edit
                </Button>
                <Button variant="ghost-danger" size="sm" onClick={() => setDeleting(module)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add module" : "Edit module"} wide>
        {editing !== null && (
          <ModuleForm
            courseId={courseId}
            module={editing === "new" ? null : editing}
            onDone={() => {
              setEditing(null);
              onChange();
            }}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete module?"
        message={
          <>
            <strong className="text-ink">{deleting?.title}</strong> will be removed from the course. Modules that students
            have bought can&apos;t be deleted; unpublish them instead.
          </>
        }
        confirmLabel="Delete module"
        danger
        busy={busy}
        error={error}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleting(null);
          setError(null);
        }}
      />
    </Card>
  );
}

function ModuleForm({ courseId, module, onDone }: { courseId: string; module: AdminModule | null; onDone: () => void }) {
  const initial = module ?? emptyModule;
  const [values, setValues] = useState<ModuleInput>({
    title: initial.title,
    description: initial.description,
    topics: initial.topics,
    price: initial.price,
    accessDays: initial.accessDays,
    contentUrl: initial.contentUrl,
    previewUrl: initial.previewUrl,
    thumbnailUrl: initial.thumbnailUrl,
    isPublished: initial.isPublished,
  });
  const [price, setPrice] = useState(pesewasToInput(initial.price));
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof ModuleInput>(key: K, value: ModuleInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const pesewas = inputToPesewas(price);
    if (pesewas === "invalid") {
      setFieldErrors({ price: "Enter an amount like 150 or 150.50" });
      return;
    }
    setSaving(true);
    setFieldErrors({});
    try {
      const body = { ...values, price: pesewas };
      if (module) await api(`/admin/modules/${module.id}`, { method: "PATCH", body });
      else await api(`/admin/courses/${courseId}/modules`, { method: "POST", body });
      toast.success(module ? "Module saved." : "Module added.");
      onDone();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast.error(err.code === "VALIDATION_FAILED" ? "Please fix the highlighted fields." : err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Input label="Title" value={values.title} error={fieldErrors.title} onChange={(e) => set("title", e.target.value)} />
      <Textarea label="Description (optional)" value={values.description ?? ""} error={fieldErrors.description} onChange={(e) => set("description", e.target.value)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Price (GH₵)"
          inputMode="decimal"
          placeholder="Not set"
          value={price}
          error={fieldErrors.price}
          hint="Leave empty to show “Price coming soon”."
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="Access period (days)"
          type="number"
          min={1}
          placeholder="Not set"
          value={values.accessDays === null ? "" : String(values.accessDays)}
          error={fieldErrors.accessDays}
          hint="How long a buyer can open the module."
          onChange={(e) => set("accessDays", e.target.value ? Number(e.target.value) : null)}
        />
      </div>
      <TopicsEditor label="Lessons" value={values.topics} onChange={(topics) => set("topics", topics)} />
      <Input
        label="Content URL (optional)"
        placeholder="https://"
        value={values.contentUrl ?? ""}
        error={fieldErrors.contentUrl}
        hint="Where the module's lessons live, e.g. a private video link. Only buyers will get it."
        onChange={(e) => set("contentUrl", e.target.value)}
      />
      <Input
        label="Preview URL (optional)"
        placeholder="https://"
        value={values.previewUrl ?? ""}
        error={fieldErrors.previewUrl}
        hint="A free sample anyone can watch."
        onChange={(e) => set("previewUrl", e.target.value)}
      />
      <Switch label="Published" description="Show this module on the course page." checked={values.isPublished} onChange={(v) => set("isPublished", v)} />
      <div className="flex justify-end gap-2 border-t border-line pt-5">
        <Button type="submit" loading={saving}>
          {module ? "Save module" : "Add module"}
        </Button>
      </div>
    </form>
  );
}
