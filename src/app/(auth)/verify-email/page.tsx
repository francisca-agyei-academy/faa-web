import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { VerifyEmail } from "@/components/auth/VerifyEmail";
import { PageSpinner } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Confirm your email" };

// Target of the link in the verification email: /verify-email?token=...
export default function VerifyEmailPage() {
  return (
    <>
      <AuthHeading title="Confirm your email" />
      <Suspense fallback={<PageSpinner />}>
        <VerifyEmail />
      </Suspense>
    </>
  );
}
