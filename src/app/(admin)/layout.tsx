import { Suspense } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardShell } from "@/components/client/DashboardShell";
import { PageSpinner } from "@/components/ui/Spinner";
import { adminNav } from "@/lib/site";

// Admins only. The proxy redirects non-admins first; the API enforces the role on every
// admin endpoint. <Suspense> because the guard and sidebar read the current URL.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AuthGuard role="ADMIN">
        <DashboardShell nav={adminNav} homeHref="/admin" badge="Admin" showVerifyBanner={false}>
          {children}
        </DashboardShell>
      </AuthGuard>
    </Suspense>
  );
}
