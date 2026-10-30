"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import type { Course } from "@/content/courses";
import { useAuth } from "@/hooks/useAuth";
import { homeFor } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

/** Pricing summary and the call to action; adapts to whether the visitor is logged in. */
export function EnrolCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const available = course.status === "available";
  const prices = course.modules?.map((m) => m.price).filter((p): p is number => p !== null) ?? [];
  const from = prices.length ? Math.min(...prices) : null;

  const includes = [
    course.modules ? `${course.modules.length} self-paced modules` : "Self-paced lessons",
    "Learn on any device",
    ...(course.includesToolkit ? ["Student Toolkit: 10 templates and trackers"] : []),
    ...(course.includesSignatureBonus ? ["Signature bonus: Ghana → Australia case study"] : []),
  ];

  return (
    <div className="p-6">
      {available ? (
        <>
          <p className="text-sm font-medium text-subtle">Priced per module</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {from === null ? "Pricing coming soon" : `From ${formatPrice(from)}`}
          </p>
          <p className="mt-1 text-sm text-muted">Buy only the modules you need. Enrolment opens soon.</p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-subtle">Coming soon</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">In development</p>
          <p className="mt-1 text-sm text-muted">Create an account and we&apos;ll let you know when it opens.</p>
        </>
      )}

      <div className="mt-5 flex flex-col gap-2">
        {user ? (
          <ButtonLink href={homeFor(user.role)} size="lg">
            Go to my dashboard
          </ButtonLink>
        ) : (
          <>
            <ButtonLink href="/register" size="lg">
              Create a free account
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">
              Log in
            </ButtonLink>
          </>
        )}
      </div>

      <h3 className="mt-6 text-sm font-semibold text-ink">This course includes</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {includes.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
