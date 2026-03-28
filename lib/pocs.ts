export type PocCard = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  impact: string;
  theme: "ops" | "civic" | "editorial";
  tags: string[];
};

export const pocCards: PocCard[] = [
  {
    slug: "food-donation-route-sg",
    title: "Food Donation Route",
    category: "Food security",
    summary:
      "Plan your pickup and dropoff route for tonight's food rescue run, stop by stop.",
    impact:
      "A visual route planner with reorderable stops for volunteer drivers.",
    theme: "ops",
    tags: ["Food rescue", "Volunteer logistics", "Route planning"],
  },
  {
    slug: "medication-reminder-sg",
    title: "Medication Reminder",
    category: "Health & ageing",
    summary:
      "A calm daily medication schedule built around a 24-hour clock face — see what's next and mark each dose as taken.",
    impact:
      "A clock-face medication guide for seniors and caregivers to follow through the day.",
    theme: "editorial",
    tags: ["Medication", "Caregiving", "Daily routine"],
  },
  {
    slug: "senior-check-in-sg",
    title: "Senior Check-In",
    category: "Community care",
    summary:
      "A warm check-in board for volunteers and families to track daily contact with seniors living alone.",
    impact:
      "A warm daily check-in flow for volunteers and families supporting seniors living alone.",
    theme: "civic",
    tags: ["Senior support", "Volunteer care", "Community check-ins"],
  },
  {
    slug: "digital-help-for-seniors",
    title: "Digital Help for Seniors",
    category: "Digital confidence",
    summary:
      "A step-by-step phone helper for common tasks like paying a bill, opening an appointment, or scanning a QR code.",
    impact:
      "A large-step phone guide for older adults doing everyday digital tasks.",
    theme: "civic",
    tags: ["Digital literacy", "Seniors", "Phone help"],
  },
  {
    slug: "elder-visit-planner-sg",
    title: "Elder Visit Planner",
    category: "Community care",
    summary:
      "A weekly planner for organising volunteer visits for seniors across the neighbourhood.",
    impact:
      "A weekly calendar planner that makes open visit days easy to spot and fill.",
    theme: "civic",
    tags: ["Visit planning", "Volunteers", "Senior care"],
  },
  {
    slug: "accessible-mall-route-sg",
    title: "Accessible Mall Route",
    category: "Accessibility",
    summary:
      "A mall route guide for lifts, ramps, and stairs-free entrances before you head out.",
    impact:
      "An animated floor-plan route guide for wheelchair users, families, and caregivers.",
    theme: "editorial",
    tags: ["Accessibility", "Mall navigation", "Wheelchair access"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
