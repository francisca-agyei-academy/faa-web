// Site-wide names and navigation. Change the brand here.
export const site = {
  name: "Gradvane Global",
  shortName: "Gradvane",
  tagline: ["Learn", "Prepare", "Progress"] as const,
  description:
    "Online courses and guidance for scholarships, funded Master's and PhDs, research, academic publishing and international opportunities.",
  /** Shown on the Privacy Policy and Terms pages. Leave empty until there is a public contact address. */
  contactEmail: "",
  copyrightYear: 2026,
};

export const legalNav = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
];

export const websiteNav = [
  { href: "/courses", label: "Courses" },
  { href: "/toolkit", label: "Student Toolkit" },
  { href: "/#about", label: "About us" },
];

export const studentNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/my-courses", label: "My courses" },
  { href: "/courses", label: "Browse courses" },
  { href: "/account", label: "Account settings" },
];

export const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/orders", label: "Orders" },
];
