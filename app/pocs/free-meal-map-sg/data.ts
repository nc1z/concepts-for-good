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
  hoursLabel: string;
  contact: string;
  updated: string;
  savedHint: string;
};

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  blurb: string;
  focus: string;
};

export const personas: Persona[] = [
  {
    id: "resident",
    name: "Resident",
    role: "Looking for nearby support",
    blurb:
      "Quickly find meal support points, fridge locations, and clear next steps.",
    focus: "Closest open options with simple directions.",
  },
  {
    id: "volunteer",
    name: "Volunteer",
    role: "Checking what needs topping up",
    blurb:
      "Scan locations, note low stock, and add quick updates after a visit.",
    focus: "Open items that need a refresh today.",
  },
  {
    id: "coordinator",
    name: "Coordinator",
    role: "Keeping the map current",
    blurb:
      "Review the directory, save high-priority stops, and prepare follow-ups.",
    focus: "Routes with pending updates and simple checklists.",
  },
];

export const filterOptions = [
  "All",
  "Meal support point",
  "Community fridge",
  "Community kitchen",
  "Open now",
];

export const places: MealSupportPlace[] = [
  {
    id: "bukit-merah-pantry",
    name: "Bukit Merah Pantry Point",
    kind: "Meal support point",
    area: "Bukit Merah",
    address: "Tiong Bahru Community Hub, Redhill Close",
    hours: "Daily, 8:00 am to 8:00 pm",
    tags: ["Open now", "Family-friendly", "Walk-in"],
    summary:
      "A simple pickup point with ready-to-share meals and clear volunteer handoff notes.",
    stock: "Mostly steady, light evening demand",
    nextStep: "Confirm dinner packs before 6:30 pm",
    hoursLabel: "Open now",
    contact: "Managed by nearby volunteers",
    updated: "Updated 18 minutes ago",
    savedHint: "Good first stop for resident support runs.",
  },
  {
    id: "woodlands-fridge",
    name: "Woodlands Community Fridge",
    kind: "Community fridge",
    area: "Woodlands",
    address: "Residents' corner near Woodlands Drive 71",
    hours: "24 hours",
    tags: ["Open now", "Self-service", "North"],
    summary:
      "A low-friction fridge for fresh items, with a clean handoff flow for volunteers.",
    stock: "Fresh bread and produce; protein low",
    nextStep: "Mark protein gap for the next route",
    hoursLabel: "Open now",
    contact: "Neighbourhood volunteers",
    updated: "Updated 41 minutes ago",
    savedHint: "Useful for quick top-up visits.",
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
      "A small kitchen partner that shares portions for nearby families and seniors.",
    stock: "Strong lunch flow, lighter after 5:00 pm",
    nextStep: "Reserve extra trays for Saturday",
    hoursLabel: "Closes at 7:00 pm",
    contact: "Kitchen lead on weekly rota",
    updated: "Updated 1 hour ago",
    savedHint: "Best matched with a planned route.",
  },
  {
    id: "jurong-fridge",
    name: "Jurong West Fridge Stop",
    kind: "Community fridge",
    area: "Jurong West",
    address: "Community noticeboard at Block 492",
    hours: "Daily, 7:00 am to 10:00 pm",
    tags: ["West", "Refill needed", "Family-friendly"],
    summary:
      "A community fridge that works well for short check-ins and fast replenishment loops.",
    stock: "Fruit shelf empty; drinks okay",
    nextStep: "Flag fruit supply for next donation run",
    hoursLabel: "Open now",
    contact: "Block volunteers",
    updated: "Updated 27 minutes ago",
    savedHint: "A good candidate for an alert after visits.",
  },
  {
    id: "tampines-meal-hub",
    name: "Tampines Meal Hub",
    kind: "Meal support point",
    area: "Tampines",
    address: "Neighbourhood centre near Tampines Street 81",
    hours: "Mon to Sat, 9:00 am to 6:00 pm",
    tags: ["East", "Registration desk", "Same-day support"],
    summary:
      "A calmer support point for residents who want direct guidance and a discreet handoff.",
    stock: "Stable with a few urgent referrals",
    nextStep: "Check guidance cards at reception",
    hoursLabel: "Open now",
    contact: "Front desk volunteers",
    updated: "Updated 9 minutes ago",
    savedHint: "Helpful for coordinator review.",
  },
  {
    id: "queenstown-fridge",
    name: "Queenstown Fridge Corner",
    kind: "Community fridge",
    area: "Queenstown",
    address: "Community node near Dawson Road",
    hours: "Daily, 24 hours",
    tags: ["Central", "No-contact", "Quiet access"],
    summary:
      "A discreet fridge stop where volunteers can refresh stock without a long handover.",
    stock: "Light vegetables, low prepared meals",
    nextStep: "Schedule a top-up before the weekend",
    hoursLabel: "Open now",
    contact: "Volunteer rota only",
    updated: "Updated 2 hours ago",
    savedHint: "Good for route planning and follow-up.",
  },
];
