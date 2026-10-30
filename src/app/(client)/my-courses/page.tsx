import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, PageHeader } from "@/components/ui/Card";

export const metadata: Metadata = { title: "My courses" };

// Will list the student's purchases (GET /api/v1/purchases, not built yet) as ModuleCards.
export default function MyCoursesPage() {
  return (
    <>
      <PageHeader title="My courses" description="Modules you've bought and how long you can access them." />
      <EmptyState title="No modules yet" action={<ButtonLink href="/courses">Browse courses</ButtonLink>}>
        Once you buy a module it appears here, ready to open.
      </EmptyState>
    </>
  );
}
