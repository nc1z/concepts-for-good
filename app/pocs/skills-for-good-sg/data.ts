export type Person = {
  name: string;
  role: string;
  org: string;
  note: string;
  availability: string[];
  skills: string[];
  accent: string;
  level: number;
};

export const people: Person[] = [
  {
    name: "Amina Rahman",
    role: "Brand designer",
    org: "Good Cause Studio",
    note: "Shapes volunteer packs, newsletters, and decks that feel clear at a glance.",
    availability: ["Tue nights", "Sat mornings"],
    skills: ["Copywriting", "Design systems", "Presentation decks"],
    accent: "#b46b3d",
    level: 3,
  },
  {
    name: "Daniel Lim",
    role: "Operations lead",
    org: "Little Steps Food Bank",
    note: "Keeps signups tidy, follow-ups on time, and the whole run moving.",
    availability: ["Mon nights", "Thu nights"],
    skills: ["Event ops", "Spreadsheets", "Community outreach"],
    accent: "#3f6f76",
    level: 4,
  },
  {
    name: "Siti Nur",
    role: "Frontend developer",
    org: "Open Health Lab",
    note: "Turns rough ideas into clear pages with a focus on accessibility.",
    availability: ["Wed nights", "Sun mornings"],
    skills: ["Frontend", "Accessibility", "Design systems"],
    accent: "#2f5f9a",
    level: 3,
  },
  {
    name: "Marcus Goh",
    role: "Data analyst",
    org: "Southside Family Service",
    note: "Good with messy lists, reporting, and making the numbers behave.",
    availability: ["Mon lunch", "Fri evenings"],
    skills: ["Data cleanup", "Spreadsheets", "Research"],
    accent: "#66705a",
    level: 2,
  },
  {
    name: "Priya Nair",
    role: "Tutor",
    org: "Bright Steps",
    note: "Helps shape workshops, lesson plans, and simple learning journeys.",
    availability: ["Tue afternoons", "Thu afternoons"],
    skills: ["Tutoring", "Lesson planning", "Workshop facilitation"],
    accent: "#8a5d86",
    level: 2,
  },
  {
    name: "Ben Wong",
    role: "Illustrator",
    org: "Good Cause Studio",
    note: "Makes plain briefs feel worth opening with strong visual ideas.",
    availability: ["Fridays", "Weekends"],
    skills: ["Illustration", "Presentation decks", "Copywriting"],
    accent: "#c26a62",
    level: 3,
  },
  {
    name: "Farah Ismail",
    role: "Community organiser",
    org: "HDB Block Club",
    note: "Knows how to bring people in and keep a project visible locally.",
    availability: ["Most evenings"],
    skills: ["Community outreach", "Event ops", "Grant writing"],
    accent: "#547a4a",
    level: 4,
  },
  {
    name: "Eugene Chia",
    role: "Product writer",
    org: "Civic Stories",
    note: "Keeps the wording clear and useful without sounding stiff.",
    availability: ["Wed nights", "Thu nights"],
    skills: ["Copywriting", "Research", "Workshop facilitation"],
    accent: "#6c7cb8",
    level: 3,
  },
  {
    name: "Nadia Tan",
    role: "Grants specialist",
    org: "Harbour NGO",
    note: "Shapes reports and funding notes with a steady hand.",
    availability: ["Mornings"],
    skills: ["Grant writing", "Reporting", "Research"],
    accent: "#8e6d3b",
    level: 2,
  },
  {
    name: "Hafiz Rahman",
    role: "Web developer",
    org: "SG Open Source",
    note: "Fixes rough edges and accessibility gaps before they slow everyone down.",
    availability: ["Sundays"],
    skills: ["Frontend", "Accessibility", "Data cleanup"],
    accent: "#325a73",
    level: 1,
  },
];

