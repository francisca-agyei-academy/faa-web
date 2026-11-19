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

/** Icon names map to components in the dashboard sidebar. */
export type NavIcon = "home" | "book" | "layers" | "users" | "receipt" | "settings" | "globe";

export const studentNav: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/my-courses", label: "My courses", icon: "book" },
  { href: "/courses", label: "Browse courses", icon: "globe" },
  { href: "/account", label: "Account settings", icon: "settings" },
];

export const adminNav: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/courses", label: "Courses", icon: "layers" },
  { href: "/admin/students", label: "Students", icon: "users" },
  { href: "/admin/orders", label: "Orders", icon: "receipt" },
];
