import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { PageSpinner } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading title="Choose a new password" />
      {/* Reads ?token= from the URL, which needs a Suspense boundary. */}
      <Suspense fallback={<PageSpinner />}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
