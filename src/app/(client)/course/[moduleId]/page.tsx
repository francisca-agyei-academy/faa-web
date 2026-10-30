import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";

// Reading `params` happens inside <Suspense>, as Cache Components requires.
export default function ModuleViewerPage({ params }: PageProps<"/course/[moduleId]">) {
  return (
    <>
      <Link href="/my-courses" className="text-sm text-muted hover:text-ink">
        ← My courses
      </Link>
      <Suspense fallback={<PageSpinner label="Loading module…" />}>
        <ModuleViewer params={params} />
      </Suspense>
    </>
  );
}

async function ModuleViewer({ params }: { params: PageProps<"/course/[moduleId]">["params"] }) {
  const { moduleId } = await params;

  // Will load the module's content for a student with an active purchase; the API must
  // check the purchase and its expiry, since this page is only a viewer.
  return (
    <div className="mt-6">
      <EmptyState title="Module content coming soon">
        Content for module <code className="font-mono text-xs">{moduleId}</code> will play here once the course
        content API is built.
      </EmptyState>
    </div>
  );
}
