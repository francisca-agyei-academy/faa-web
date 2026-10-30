import type { Metadata } from "next";
import { NewCourse } from "@/components/admin/courses/CourseEditor";

export const metadata: Metadata = { title: "New course" };

export default function NewCoursePage() {
  return <NewCourse />;
}
