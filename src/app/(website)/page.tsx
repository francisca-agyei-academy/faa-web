import { Hero } from "@/components/website/Hero";
import { AboutSection } from "@/components/website/home/AboutSection";
import { AudienceSection } from "@/components/website/home/AudienceSection";
import { CoursesSection } from "@/components/website/home/CoursesSection";
import { FeaturedCourse } from "@/components/website/home/FeaturedCourse";
import { FinalCta } from "@/components/website/home/FinalCta";

// Order follows the brief: who Gradvane Global is, what it offers, who it's for, then how to start.
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <AudienceSection />
      <FeaturedCourse />
      <CoursesSection />
      <FinalCta />
    </>
  );
}
