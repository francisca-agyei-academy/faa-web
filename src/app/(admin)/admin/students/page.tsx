import type { Metadata } from "next";
import { StudentList } from "@/components/admin/students/StudentList";

export const metadata: Metadata = { title: "Manage students" };

export default function AdminStudentsPage() {
  return <StudentList />;
}
