import { featuredOf, getCatalog } from "@/lib/catalog";
import { CourseSpotlight } from "./FeaturedCourse";

/** Every course after the flagship, each shown in full with its modules. */
export async function CoursesSection() {
  const courses = await getCatalog();
  if (!courses?.length) return null;
  const featured = featuredOf(courses);
  const more = courses.filter((course) => course.slug !== featured?.slug);
  return more.map((course, index) => (
    <CourseSpotlight
      key={course.slug}
      course={course}
      heading={index === 0 ? "Then, for life after your offer letter" : course.title}
      // Alternate backgrounds; the flagship section above uses the surface colour.
      onSurface={index % 2 === 1}
    />
  ));
}
