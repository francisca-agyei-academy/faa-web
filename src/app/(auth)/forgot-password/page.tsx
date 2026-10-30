import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title="Reset your password">
        Enter the email you signed up with and we&apos;ll send you a reset link.
      </AuthHeading>
      <ForgotPasswordForm />
    </>
  );
}
