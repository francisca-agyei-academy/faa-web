import type { Metadata } from "next";
import { LegalPage } from "@/components/website/LegalPage";
import { legalUpdated, termsIntro, termsSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms for using the Gradvane Global website and buying our courses.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" intro={termsIntro} lastUpdated={legalUpdated} sections={termsSections} />
  );
}
