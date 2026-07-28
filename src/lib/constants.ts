export const ALLOWED_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "s.amity.edu";

export const SCHOOLS = ["ASET", "ABS", "ALS", "ASCO", "AIPS", "ASFA"];
export const COURSES = [
  "B.Tech CSE",
  "B.Tech IT",
  "B.Tech ECE",
  "BBA",
  "B.Com",
  "B.A. LLB",
  "B.Pharm",
  "BFA",
];
export const SEMESTERS = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
export const CONDITIONS = ["LIKE_NEW", "GOOD", "OKAY", "WORN"] as const;
export const CONDITION_LABELS: Record<string, string> = {
  LIKE_NEW: "Like new",
  GOOD: "Good",
  OKAY: "Okay",
  WORN: "Worn but usable",
};
export const USEFUL_FOR = ["Internals", "End-sem", "Assignments", "Lab work", "PYQs", "Revision"];

export const CATEGORIES = [
  { key: "notes", label: "Notes", subtext: "Handwritten notes, class notes, revision notes.", iconKey: "notes" },
  { key: "books", label: "Books", subtext: "Textbooks, reference books, guides.", iconKey: "book" },
  { key: "lab", label: "Lab material", subtext: "Lab files, manuals, records.", iconKey: "lab" },
  { key: "tools", label: "Tools", subtext: "Calculators, drafters, lab coats.", iconKey: "tools" },
  { key: "stationery", label: "Stationery", subtext: "Notebooks, folders, registers.", iconKey: "stationery" },
] as const;

export const STATUS_META: Record<string, { label: string; color: string; tint: string }> = {
  AVAILABLE: { label: "Available", color: "#2F6F5E", tint: "#EAF1EC" },
  RESERVED: { label: "Reserved", color: "#8A6D1E", tint: "#F7F0DE" },
  PASSED: { label: "Passed on", color: "#6B6659", tint: "#EDEBE3" },
};
