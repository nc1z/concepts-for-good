export type PocCard = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  impact: string;
  theme: "ops" | "civic" | "editorial";
  preview: string[];
};

export const pocCards: PocCard[] = [
  {
    slug: "food-donation-route-sg",
    title: "Food Donation Route SG",
    category: "Food security",
    summary:
      "Plan your pickup and dropoff route for tonight's food rescue run, stop by stop.",
    impact:
      "A visual route planner with reorderable stops for volunteer drivers.",
    theme: "ops",
    preview: ["Route timeline", "Drag to reorder", "Stop tracker"],
  },
  {
    slug: "medication-reminder-sg",
    title: "Medication Reminder SG",
    category: "Health & ageing",
    summary:
      "A calm daily medication schedule built around a 24-hour clock face — see what's next and mark each dose as taken.",
    impact:
      "A clock-face medication guide for seniors and caregivers to follow through the day.",
    theme: "editorial",
    preview: ["24-hour clock", "Mark as taken", "Daily schedule"],
  },
  {
    slug: "senior-check-in-sg",
    title: "Senior Check-In SG",
    category: "Community care",
    summary:
      "A warm check-in board for volunteers and families to track daily contact with seniors living alone.",
    impact:
      "A warm daily check-in flow for volunteers and families supporting seniors living alone.",
    theme: "civic",
    preview: ["Streak rings", "Quick check-in", "Care notes"],
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
    preview: ["Large steps", "Phone guides", "Simple progress"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
