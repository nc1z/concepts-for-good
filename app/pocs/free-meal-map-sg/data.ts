export type PersonaId = "resident" | "volunteer" | "coordinator";

export type MealSupportPlace = {
  id: string;
  name: string;
  kind: "Meal support point" | "Community fridge" | "Community kitchen";
  area: string;
  address: string;
  hours: string;
  tags: string[];
  summary: string;
  stock: string;
  nextStep: string;
  contact: string;
  updated: string;
  x: number;
  y: number;
};

export type Persona = {
  id: PersonaId;
  name: string;
  focus: string;
  helper: string;
};

export const personas: Persona[] = [
  {
    id: "resident",
    name: "Resident",
    focus: "Find the calmest nearby support option.",
    helper: "Prioritises simple directions and quieter access points.",
  },
  {
    id: "volunteer",
    name: "Volunteer",
    focus: "See what looks low, open, or worth revisiting today.",
    helper: "Keeps visit notes and refill checklists close at hand.",
  },
  {
    id: "coordinator",
    name: "Coordinator",
    focus: "Review hotspots and prepare the next support route.",
    helper: "Useful for saving locations that need a follow-up sweep.",
  },
];

export const filterOptions = [
  "All",
  "Meal support point",
  "Community fridge",
  "Community kitchen",
];

export const places: MealSupportPlace[] = [
  {
    id: "bukit-merah-pantry",
    name: "Bukit Merah Pantry Point",
    kind: "Meal support point",
    area: "Bukit Merah",
    address: "Tiong Bahru Community Hub, Redhill Close",
    hours: "Daily, 8:00 am to 8:00 pm",
    tags: ["Open now", "Walk-in", "Family-friendly"],
    summary:
      "A steady pickup point with ready meals, simple directions, and low-friction walk-ins.",
    stock: "Meals steady, drinks light",
    nextStep: "Check dinner pack availability before 6:30 pm",
    contact: "Managed by nearby volunteers",
    updated: "Updated 18 minutes ago",
    x: 34,
    y: 56,
  },
  {
    id: "woodlands-fridge",
    name: "Woodlands Community Fridge",
    kind: "Community fridge",
    area: "Woodlands",
    address: "Residents' corner near Woodlands Drive 71",
    hours: "24 hours",
    tags: ["Open now", "Self-service", "Quiet access"],
    summary:
      "A low-friction community fridge that works well for quick top-ups and discreet visits.",
    stock: "Fresh bread and produce, protein low",
    nextStep: "Mark protein gap for the next refill route",
    contact: "Neighbourhood volunteers",
    updated: "Updated 41 minutes ago",
    x: 42,
    y: 18,
  },
  {
    id: "paya-lebar-kitchen",
    name: "Paya Lebar Community Kitchen",
    kind: "Community kitchen",
    area: "Paya Lebar",
    address: "Community space near Sims Avenue",
    hours: "Tue to Sun, 11:00 am to 7:00 pm",
    tags: ["Lunch", "Weekend", "Prepared meals"],
    summary:
      "A small kitchen partner serving nearby families with prepared trays and planned collection slots.",
    stock: "Strong lunch flow, lighter after 5:00 pm",
    nextStep: "Reserve extra trays for Saturday",
    contact: "Kitchen lead on weekly rota",
    updated: "Updated 1 hour ago",
    x: 63,
    y: 52,
  },
  {
    id: "jurong-fridge",
    name: "Jurong West Fridge Stop",
    kind: "Community fridge",
    area: "Jurong West",
    address: "Community noticeboard at Block 492",
    hours: "Daily, 7:00 am to 10:00 pm",
    tags: ["Open now", "Refill needed", "West"],
    summary:
      "A community fridge with a quick check-in rhythm and short visit time for volunteers.",
    stock: "Fruit shelf empty, drinks okay",
    nextStep: "Flag fruit supply for the next donation run",
    contact: "Block volunteers",
    updated: "Updated 27 minutes ago",
    x: 16,
    y: 52,
  },
  {
    id: "tampines-meal-hub",
    name: "Tampines Meal Hub",
    kind: "Meal support point",
    area: "Tampines",
    address: "Neighbourhood centre near Tampines Street 81",
    hours: "Mon to Sat, 9:00 am to 6:00 pm",
    tags: ["Open now", "Same-day support", "East"],
    summary:
      "A calmer support point for residents who want direct guidance and a discreet handoff.",
    stock: "Stable with a few urgent referrals",
    nextStep: "Check guidance cards at reception",
    contact: "Front desk volunteers",
    updated: "Updated 9 minutes ago",
    x: 78,
    y: 45,
  },
  {
    id: "queenstown-fridge",
    name: "Queenstown Fridge Corner",
    kind: "Community fridge",
    area: "Queenstown",
    address: "Community node near Dawson Road",
    hours: "24 hours",
    tags: ["Open now", "No-contact", "Central"],
    summary:
      "A discreet fridge stop where stock can be refreshed without a long handover.",
    stock: "Light vegetables, low prepared meals",
    nextStep: "Schedule a top-up before the weekend",
    contact: "Volunteer rota only",
    updated: "Updated 2 hours ago",
    x: 30,
    y: 60,
  },
];
