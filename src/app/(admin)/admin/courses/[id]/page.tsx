import type { Metadata } from "next";
import { CourseEditor } from "@/components/admin/courses/CourseEditor";

export const metadata: Metadata = { title: "Edit course" };

// The editor reads the id with useParams(); the admin layout's <Suspense> covers it.
export default function EditCoursePage() {
  return <CourseEditor />;
}
