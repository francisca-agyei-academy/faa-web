import type { Metadata } from "next";
import { LessonManager } from "@/components/admin/courses/LessonManager";

export const metadata: Metadata = { title: "Lessons" };

// The manager reads the id with useParams(); the admin layout's <Suspense> covers it.
export default function ModuleLessonsPage() {
  return <LessonManager />;
}
