import { Suspense } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { PageSpinner } from "@/components/ui/Spinner";

// The lesson reader: logged-in users only, full width with no dashboard sidebar, so the
// reading has the whole screen. The guard reads the URL, which needs <Suspense>.
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
