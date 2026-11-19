import type { Metadata } from "next";
import { LegalPage } from "@/components/website/LegalPage";
import { legalUpdated, privacyIntro, privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Gradvane Global collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" intro={privacyIntro} lastUpdated={legalUpdated} sections={privacySections} />;
}
