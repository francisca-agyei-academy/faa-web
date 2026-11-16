import type { StaticImageData } from "next/image";
import graduate from "@/assets/images/graduate-cap-toss.jpg";
import laptopCampus from "@/assets/images/student-laptop-campus.jpg";
import laptopClassroom from "@/assets/images/student-laptop-classroom.jpg";
import readingDesk from "@/assets/images/student-reading-desk.jpg";
import groupSteps from "@/assets/images/students-group-steps.jpg";
import writing from "@/assets/images/student-writing-headphones.jpg";

/**
 * Photos a course can use, keyed by the `imageKey` stored on each course.
 * Keep the keys in sync with COURSE_IMAGE_KEYS in api/src/types/admin.types.ts.
 */
export const courseImages: Record<string, { src: StaticImageData; alt: string; label: string }> = {
  graduate: { src: graduate, alt: "A diverse group of graduates tossing their caps", label: "Graduates" },
  "laptop-campus": { src: laptopCampus, alt: "A student working on a laptop on a campus bench", label: "Laptop on campus" },
  "laptop-classroom": { src: laptopClassroom, alt: "A diverse group of students cheering around a laptop", label: "Group at a laptop" },
  "reading-desk": { src: readingDesk, alt: "Three students studying together with laptops", label: "Studying together" },
  "group-steps": { src: groupSteps, alt: "A diverse group of students walking and laughing together", label: "Student group" },
  writing: { src: writing, alt: "A student writing notes beside a laptop", label: "Writing notes" },
};

export const courseImageFor = (key: string) => courseImages[key] ?? courseImages.graduate!;
