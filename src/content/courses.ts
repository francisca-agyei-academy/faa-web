import type { StaticImageData } from "next/image";
import graduate from "@/assets/images/graduate-cap-toss.jpg";
import laptopCampus from "@/assets/images/student-laptop-campus.jpg";
import laptopClassroom from "@/assets/images/student-laptop-classroom.jpg";
import readingDesk from "@/assets/images/student-reading-desk.jpg";
import groupSteps from "@/assets/images/students-group-steps.jpg";
import writing from "@/assets/images/student-writing-headphones.jpg";

/**
 * Course catalog content. Edit text, prices and access periods here.
 * When the courses API exists, the same shape can be loaded from it instead.
 */

export interface CourseModule {
  number: number;
  title: string;
  topics: string[];
  /** In pesewas (GH₵1 = 100). null until the price is set. */
  price: number | null;
  /** How many days a buyer can access the module. null until set. */
  accessDays: number | null;
}

export type CourseStatus = "available" | "coming-soon";

export interface Course {
  slug: string;
  /** The track shown on cards and filters, e.g. "Scholarships for Masters & PhDs". */
  track: string;
  title: string;
  summary: string;
  status: CourseStatus;
  image: StaticImageData;
  imageAlt: string;
  /** "Are you…?" — who the course is for. */
  audience?: string;
  outcome?: { from: string; to: string };
  modules?: CourseModule[];
  /** Topics for courses whose modules are not yet broken down. */
  topics?: string[];
  includesToolkit?: boolean;
  includesSignatureBonus?: boolean;
}

const lesson = (number: number, title: string, topics: string[]): CourseModule => ({
  number,
  title,
  topics,
  price: null,
  accessDays: null,
});

export const courses: Course[] = [
  {
    slug: "bachelors-to-funded-masters-and-phd",
    track: "Scholarships for Masters & PhDs",
    title: "From Bachelor's to Fully Funded Master's and PhD",
    summary:
      "A step-by-step path from your first search to a strategic, fully funded postgraduate application abroad.",
    status: "available",
    image: graduate,
    imageAlt: "A graduate in a black and red gown tossing a cap into the air",
    audience:
      "African final-year students, recent graduates and early-career applicants who want a funded postgraduate degree abroad but do not know how to navigate the process.",
    outcome: {
      from: "I want to do a PhD abroad, but I have no idea where to start.",
      to: "I understand the process, know where to search, can identify supervisors, prepare my documents and submit a strategic application.",
    },
    includesToolkit: true,
    includesSignatureBonus: true,
    modules: [
      lesson(1, "Is a PhD Abroad Right for You?", [
        "PhD vs Master's",
        "Funding models",
        "Direct-entry PhDs",
        "Indirect-entry PhDs",
        "Eligibility and expectations",
      ]),
      lesson(2, "Finding Fully Funded Opportunities", [
        "Where to search",
        "Universities and funding databases",
        "Supervisor-led opportunities",
        "Funding tracker",
        "Evaluating opportunities",
      ]),
      lesson(3, "Finding the Right Supervisor", [
        "Research fit",
        "Supervisor search",
        "Shortlisting",
        "Planning worksheet",
        "Red flags and fit checklist",
      ]),
      lesson(4, "Approaching Supervisors", [
        "Email structure",
        "Personalisation",
        "Research-fit message",
        "Follow-up strategy",
        "Common mistakes",
        "Tracking emails",
      ]),
      lesson(5, "Building Your Academic Profile", [
        "Academic CV",
        "Research experience",
        "Publications",
        "Conferences",
        "Online academic profiles",
      ]),
      lesson(6, "Creating the Application", [
        "SOP / personal statement",
        "Research proposal",
        "References and recommendations",
        "Document checklist",
        "Application strategy",
      ]),
      lesson(7, "Interviews, Offers & Funding", [
        "Interview preparation",
        "Common questions",
        "Understanding offers",
        "Funding packages",
        "Decision-making",
      ]),
      lesson(8, "From Acceptance to Moving Abroad", [
        "Visa preparation",
        "Finances",
        "Accommodation",
        "Arrival planning",
        "Academic adjustment",
      ]),
    ],
  },
  {
    slug: "first-30-days-abroad",
    track: "Studying Abroad",
    title: "Your First 30 Days Abroad",
    summary: "Practical orientation for international students, from the airport to your first weeks on campus.",
    status: "coming-soon",
    image: laptopCampus,
    imageAlt: "A student with a colourful African-print bag working on a laptop outdoors",
    topics: [
      "Arrival",
      "Accommodation",
      "Banking",
      "Tax file number (TFN)",
      "Healthcare",
      "Transport",
      "Internet",
      "University setup and adjustment",
    ],
  },
  {
    slug: "working-with-your-supervisor",
    track: "Postgraduate Success",
    title: "Knowing Your Supervisor & Understanding Your Course",
    summary: "Build a strong working relationship with your supervisor and take ownership of your degree.",
    status: "coming-soon",
    image: readingDesk,
    imageAlt: "A student reading a book at a desk beside a laptop",
    topics: [
      "Know your supervisor",
      "Supervisor–student expectations, including the use of AI",
      "How to work with your supervisor",
      "Understanding your academic and research environment",
      "When things don't go as planned",
      "Taking ownership of your degree",
    ],
  },
  {
    slug: "international-academic-career",
    track: "Academic Careers",
    title: "Building an International Academic Career",
    summary: "Grow your network, profile and opportunities beyond your degree.",
    status: "coming-soon",
    image: groupSteps,
    imageAlt: "A group of smiling students standing on campus steps",
    topics: [
      "Networking",
      "Seminars",
      "Conferences",
      "Fellowships",
      "Research collaborations",
      "Academic profiles and international career pathways",
    ],
  },
  {
    slug: "academic-writing-made-simple",
    track: "Academic Writing",
    title: "Academic Writing Made Simple",
    summary: "Write clearly, think critically and reference correctly, with responsible use of AI.",
    status: "coming-soon",
    image: writing,
    imageAlt: "A student wearing headphones writing notes beside a laptop",
    topics: [
      "Academic writing",
      "Critical thinking",
      "Literature reviews",
      "Structure",
      "Referencing",
      "Plagiarism and responsible AI",
    ],
  },
  {
    slug: "research-to-published-paper",
    track: "Research & Publishing",
    title: "From Research Project to Published Paper",
    summary: "Take a research project through manuscript development, submission and peer review.",
    status: "coming-soon",
    image: readingDesk,
    imageAlt: "A student reading a book at a desk beside a laptop",
    topics: [
      "Taking a research project through manuscript development",
      "Journal selection",
      "Submission",
      "Peer review and publication",
    ],
  },
  {
    slug: "ai-for-academic-research",
    track: "AI for Research",
    title: "AI for Academic Research",
    summary: "Use AI responsibly to understand literature, support your writing and speed up research workflows.",
    status: "coming-soon",
    image: laptopClassroom,
    imageAlt: "A student working on a laptop in a classroom with notes on a whiteboard",
    topics: [
      "Responsible AI use for brainstorming",
      "Literature understanding",
      "Writing support",
      "Research workflows",
      "Coding and data assistance, and presentations",
    ],
  },
];

export const featuredCourse = courses[0]!;

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}
