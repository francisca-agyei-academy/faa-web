import type { Metadata } from "next";
import { DashboardOverview } from "@/components/client/DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardOverview />;
}
