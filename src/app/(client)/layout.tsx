import { Suspense } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardShell } from "@/components/client/DashboardShell";
import { PageSpinner } from "@/components/ui/Spinner";
import { studentNav } from "@/lib/site";

// Any logged-in user; admins can see the student view too. The guard and sidebar read
// the current URL, which Cache Components requires to sit inside <Suspense>.
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AuthGuard>
        <DashboardShell nav={studentNav} homeHref="/dashboard">
          {children}
        </DashboardShell>
      </AuthGuard>
    </Suspense>
  );
}
