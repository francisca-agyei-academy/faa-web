import type { Metadata } from "next";
import { ModuleViewer } from "@/components/client/ModuleViewer";

export const metadata: Metadata = { title: "Module" };

// The viewer reads the id with useParams(); the client layout's <Suspense> covers it.
export default function ModuleViewerPage() {
  return <ModuleViewer />;
}
