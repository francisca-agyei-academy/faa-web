import Image from "next/image";
import { courseImageFor } from "@/content/courseImages";
import { cn } from "@/lib/utils";

/**
 * A course's photo: the uploaded image when there is one, otherwise the chosen built-in photo.
 * Always fills its (relatively positioned) parent.
 */
export function CourseImage({
  course,
  sizes,
  className,
  eager,
}: {
  course: { title: string; imageKey: string; imageUrl: string | null };
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  if (course.imageUrl) {
    return (
      <Image
        src={course.imageUrl}
        alt={course.title}
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        className={cn("object-cover", className)}
      />
    );
  }
  const preset = courseImageFor(course.imageKey);
  return (
    <Image
      src={preset.src}
      alt={preset.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      loading={eager ? "eager" : undefined}
      className={cn("object-cover", className)}
    />
  );
}
