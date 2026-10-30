import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <>
      <AuthHeading title="Create your account">
        We&apos;ll email you a link to confirm your address.
      </AuthHeading>
      <RegisterForm />
    </>
  );
}
