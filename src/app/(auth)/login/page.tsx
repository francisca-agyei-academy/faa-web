import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageSpinner } from "@/components/ui/Spinner";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <AuthHeading title="Welcome back">Log in to continue to your courses.</AuthHeading>
      {/* LoginForm reads ?next= from the URL, which needs a Suspense boundary. */}
      <Suspense fallback={<PageSpinner />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
