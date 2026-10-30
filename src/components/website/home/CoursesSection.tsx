import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { courses } from "@/content/courses";
import { CourseCard } from "../CourseCard";
import { SectionHeading } from "../SectionHeading";

export function CoursesSection() {
  const more = courses.filter((course) => course.status === "coming-soon").slice(0, 3);
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title="Courses for life after your offer letter">
            <p>From your first 30 days abroad to academic writing, publishing and AI for research.</p>
          </SectionHeading>
          <ButtonLink href="/courses" variant="secondary">
            View all courses <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((course, index) => (
            <Reveal key={course.slug} delay={index * 140} className="flex">
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
