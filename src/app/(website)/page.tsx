import { Hero } from "@/components/website/Hero";
import { AboutSection } from "@/components/website/home/AboutSection";
import { AudienceSection } from "@/components/website/home/AudienceSection";
import { CoursesSection } from "@/components/website/home/CoursesSection";
import { FeaturedCourse } from "@/components/website/home/FeaturedCourse";
import { FinalCta } from "@/components/website/home/FinalCta";
import { JourneySection } from "@/components/website/home/JourneySection";
import { ToolkitSection } from "@/components/website/home/ToolkitSection";

// Order follows the brief: who FAA is, what it offers, who it's for, then how to start.
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <AudienceSection />
      <FeaturedCourse />
      <JourneySection />
      <CoursesSection />
      <ToolkitSection />
      <FinalCta />
    </>
  );
}
