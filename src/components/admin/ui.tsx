"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
  type TdHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Close } from "@/components/ui/Icons";
import { PageSpinner } from "@/components/ui/Spinner";
import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/admin";

/* ───────── Badges ───────── */

type Tone = "neutral" | "success" | "warning" | "danger" | "brand" | "accent";
const toneClasses: Record<Tone, string> = {
  neutral: "bg-canvas text-muted ring-line",
  success: "bg-success-soft text-success ring-success/20",
  warning: "bg-warning-soft text-warning ring-warning/20",
  danger: "bg-danger-soft text-danger ring-danger/20",
  brand: "bg-brand-soft text-brand ring-brand/20",
  accent: "bg-accent-soft text-accent-strong ring-accent/30",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", toneClasses[tone])}>
      {children}
    </span>
  );
}

const orderTones: Record<OrderStatus, Tone> = { SUCCESS: "success", PENDING: "warning", FAILED: "danger", REFUNDED: "neutral" };
const orderLabels: Record<OrderStatus, string> = { SUCCESS: "Paid", PENDING: "Pending", FAILED: "Failed", REFUNDED: "Refunded" };
export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge tone={orderTones[status]}>{orderLabels[status]}</Badge>
);

/* ───────── Data states ───────── */

/** Shows a spinner while loading and an error with a retry button on failure. */
export function QueryBoundary({
  loading,
  error,
  onRetry,
  children,
}: {
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  children: ReactNode;
}) {
  if (loading) return <PageSpinner />;
  if (error) {
    return (
      <Alert tone="error" className="flex items-center justify-between gap-4">
        <span>{error.message}</span>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </Alert>
    );
  }
  return <>{children}</>;
}

/* ───────── Table ───────── */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-160 text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("border-b border-line bg-canvas px-4 py-3 font-medium text-muted", className)}>{children}</th>;
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border-b border-line px-4 py-3 align-middle text-ink", className)} {...props} />;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted">
      <span>
        {total} {total === 1 ? "result" : "results"}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

/* ───────── Form controls ───────── */

export function Textarea({
  label,
  error,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-24 rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
          error ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Switch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-brand" : "bg-line",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

/** Editable list of short strings (topics, lessons). */
export function TopicsEditor({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...value, text]);
    setDraft("");
  };
  const move = (index: number, delta: number) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item!);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink">{label}</p>
      {hint && <p className="-mt-1 text-sm text-muted">{hint}</p>}
      {value.length > 0 && (
        <ol className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface">
          {value.map((topic, index) => (
            <li key={`${topic}-${index}`} className="flex items-center gap-2 px-3 py-2 text-sm">
              <span className="w-5 text-subtle">{index + 1}.</span>
              <span className="flex-1 text-ink">{topic}</span>
              <button type="button" className="px-1 text-subtle hover:text-ink disabled:opacity-30" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${topic} up`}>
                ↑
              </button>
              <button type="button" className="px-1 text-subtle hover:text-ink disabled:opacity-30" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${topic} down`}>
                ↓
              </button>
              <button type="button" className="px-1 text-subtle hover:text-danger" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove ${topic}`}>
                <Close className="size-4" />
              </button>
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type and press Enter"
          className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}

/* ───────── Dialog ───────── */

/** Modal built on the native <dialog>, so focus trapping and Esc come from the browser. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-brand-strong/50 backdrop:backdrop-blur-sm",
        wide ? "max-w-2xl" : "max-w-md",
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-subtle hover:bg-canvas hover:text-ink" aria-label="Close">
          <Close className="size-5" />
        </button>
      </div>
      {open && <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  busy,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="text-sm leading-relaxed text-muted">{message}</div>
      {error && (
        <Alert tone="error" className="mt-4">
          {error}
        </Alert>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} loading={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

/* ───────── Money ───────── */

/** "150.00" ↔ 15000 pesewas. Empty means "not set". */
export const pesewasToInput = (value: number | null) => (value === null ? "" : (value / 100).toFixed(2));
export function inputToPesewas(value: string): number | null | "invalid" {
  const text = value.trim();
  if (!text) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return "invalid";
  return Math.round(Number(text) * 100);
}
