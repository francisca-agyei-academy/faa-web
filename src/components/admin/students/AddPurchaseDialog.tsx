"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { CatalogCourse } from "@/types/catalog";
import { Dialog, inputToPesewas, pesewasToInput, Select } from "../ui";

const FULL_COURSE = "full";

/**
 * Records a purchase for a student: one module or a whole course, paid offline (cash, bank,
 * mobile money) or given free. Access is granted straight away.
 */
export function AddPurchaseDialog({
  open,
  onClose,
  onDone,
  studentId,
  studentName,
  ownedModuleIds,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  studentId: string;
  studentName: string;
  /** Modules the student can open right now. */
  ownedModuleIds: Set<string>;
}) {
  const { data } = useApiQuery<{ courses: CatalogCourse[] }>(open ? "/courses" : null);
  const courses = data?.courses ?? [];
  const [courseId, setCourseId] = useState("");
  const [item, setItem] = useState(FULL_COURSE);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const course = courses.find((c) => c.id === courseId) ?? null;
  const modules = course ? [...course.modules].sort((a, b) => a.order - b.order) : [];
  const toBuy = modules.filter((m) => !ownedModuleIds.has(m.id));

  // The usual price, used to prefill the amount.
  function suggestedAmount(nextCourse: CatalogCourse | null, nextItem: string) {
    if (!nextCourse) return "";
    if (nextItem === FULL_COURSE) {
      const total = nextCourse.modules.filter((m) => !ownedModuleIds.has(m.id)).reduce((sum, m) => sum + (m.price ?? 0), 0);
      return pesewasToInput(total);
    }
    return pesewasToInput(nextCourse.modules.find((m) => m.id === nextItem)?.price ?? 0);
  }

  function chooseCourse(id: string) {
    const next = courses.find((c) => c.id === id) ?? null;
    setCourseId(id);
    setItem(FULL_COURSE);
    setAmount(suggestedAmount(next, FULL_COURSE));
  }

  function chooseItem(value: string) {
    setItem(value);
    setAmount(suggestedAmount(course, value));
  }

  function close() {
    setCourseId("");
    setItem(FULL_COURSE);
    setAmount("");
    setError(null);
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!course) return setError("Choose a course.");
    const pesewas = inputToPesewas(amount);
    if (pesewas === "invalid" || pesewas === null) return setError("Enter the amount paid, e.g. 150.00. Use 0 for a free place.");
    if (item === FULL_COURSE && toBuy.length === 0) return setError("They already have every module in this course.");
    setSaving(true);
    setError(null);
    try {
      const { order } = await api<{ order: { reference: string } }>(`/admin/students/${studentId}/orders`, {
        method: "POST",
        body: { ...(item === FULL_COURSE ? { courseId: course.id } : { moduleId: item }), amount: pesewas },
      });
      toast.success(`Purchase recorded (${order.reference}). Access is unlocked.`);
      onDone();
      close();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't record the purchase.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={close} title="Add a purchase">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          For <strong className="text-ink">{studentName}</strong>, e.g. paid by cash, bank transfer or mobile money, or
          given free. They get access immediately.
        </p>
        <Select label="Course" value={courseId} onChange={(e) => chooseCourse(e.target.value)} required>
          <option value="">{data ? "Choose a course…" : "Loading courses…"}</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
        {course && (
          <Select label="What are they getting?" value={item} onChange={(e) => chooseItem(e.target.value)}>
            <option value={FULL_COURSE}>
              Full course ({toBuy.length} of {modules.length} modules they don&apos;t have yet)
            </option>
            {modules.map((m, index) => (
              <option key={m.id} value={m.id}>
                {`Module ${index + 1}: ${m.title}${ownedModuleIds.has(m.id) ? " (has access; extends it)" : ""}`}
              </option>
            ))}
          </Select>
        )}
        {course && (
          <Input
            label="Amount paid (GH₵)"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint={`Prefilled with the usual price. Enter 0 for a free place.${
              item === FULL_COURSE ? ` Usual total: ${formatPrice(toBuy.reduce((s, m) => s + (m.price ?? 0), 0))}.` : ""
            }`}
          />
        )}
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!course}>
            Record purchase
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
