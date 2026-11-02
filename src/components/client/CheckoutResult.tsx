"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, Clock } from "@/components/ui/Icons";
import { PageSpinner } from "@/components/ui/Spinner";
import { api, ApiError } from "@/lib/api";

interface VerifyResponse {
  status: "SUCCESS" | "PENDING" | "FAILED";
  module: { id: string; title: string; course: { slug: string; title: string } | null } | null;
}

type State = { kind: "checking" } | { kind: "done"; result: VerifyResponse } | { kind: "error"; message: string };

const MAX_POLLS = 6;

/** Paystack sends the buyer back here with ?reference=…; this asks the API to confirm the payment. */
export function CheckoutResult() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const [state, setState] = useState<State>(reference ? { kind: "checking" } : { kind: "error", message: "No payment reference was found." });
  const started = useRef(false);

  useEffect(() => {
    if (!reference || started.current) return;
    started.current = true;
    let cancelled = false;

    // Bank and mobile money payments can take a few seconds to settle, so keep asking briefly.
    (async () => {
      for (let attempt = 1; attempt <= MAX_POLLS && !cancelled; attempt++) {
        try {
          const result = await api<VerifyResponse>(`/payments/verify/${encodeURIComponent(reference)}`);
          if (result.status !== "PENDING" || attempt === MAX_POLLS) {
            if (cancelled) return;
            setState({ kind: "done", result });
            if (result.status === "SUCCESS") toast.success("Payment confirmed. Your module is unlocked!");
            if (result.status === "FAILED") toast.error("The payment didn't go through.");
            return;
          }
        } catch (err) {
          if (cancelled) return;
          setState({ kind: "error", message: err instanceof ApiError ? err.message : "We couldn't confirm the payment." });
          return;
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (state.kind === "checking") return <PageSpinner label="Confirming your payment with Paystack…" />;

  if (state.kind === "error") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-xl font-semibold text-ink">We couldn&apos;t confirm this payment</h1>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
        <p className="mt-2 text-sm text-muted">If you were charged, your module unlocks automatically within a few minutes.</p>
        <ButtonLink href="/my-courses" className="mt-6">
          Go to My courses
        </ButtonLink>
      </Card>
    );
  }

  const { status, module } = state.result;
  const courseHref = module?.course ? `/courses/${module.course.slug}` : "/courses";

  if (status === "SUCCESS") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <Check className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">You&apos;re in!</h1>
        <p className="mt-2 text-sm text-muted">
          {module ? (
            <>
              <strong className="text-ink">{module.title}</strong> is unlocked
              {module.course ? <> from {module.course.title}</> : null}.
            </>
          ) : (
            "Your module is unlocked."
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {module && <ButtonLink href={`/course/${module.id}`}>Start learning</ButtonLink>}
          <ButtonLink href="/my-courses" variant="secondary">
            My courses
          </ButtonLink>
        </div>
      </Card>
    );
  }

  if (status === "PENDING") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-warning-soft text-warning">
          <Clock className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Payment still processing</h1>
        <p className="mt-2 text-sm text-muted">
          Paystack hasn&apos;t confirmed it yet. Your module unlocks automatically as soon as it does; check My courses
          in a few minutes.
        </p>
        <ButtonLink href="/my-courses" className="mt-6">
          Go to My courses
        </ButtonLink>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Payment not completed</h1>
      <p className="mt-2 text-sm text-muted">No money was taken. You can try again whenever you&apos;re ready.</p>
      <div className="mt-6 flex justify-center gap-2">
        <ButtonLink href={courseHref}>Try again</ButtonLink>
        <Link href="/courses" className="self-center text-sm text-muted hover:text-ink">
          Browse courses
        </Link>
      </div>
    </Card>
  );
}
