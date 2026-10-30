import type { Metadata } from "next";
import { CourseList } from "@/components/admin/courses/CourseList";

export const metadata: Metadata = { title: "Manage courses" };

export default function AdminCoursesPage() {
  return <CourseList />;
}
