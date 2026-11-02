import type { Metadata } from "next";
import { MyCourses } from "@/components/client/MyCourses";

export const metadata: Metadata = { title: "My courses" };

export default function MyCoursesPage() {
  return <MyCourses />;
}
