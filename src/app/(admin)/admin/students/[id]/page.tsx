import type { Metadata } from "next";
import { StudentDetail } from "@/components/admin/students/StudentDetail";

export const metadata: Metadata = { title: "Student" };

export default function AdminStudentPage() {
  return <StudentDetail />;
}
