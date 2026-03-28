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
      "Tests whether a visual route planner with reorderable stops reduces the planning friction for volunteer drivers.",
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
      "Tests whether a clock-face visualisation makes it easier for seniors and caregivers to track and confirm daily medications at a glance.",
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
      "Tests whether visible streaks and simple one-tap check-ins can make consistent care coordination easier for grassroots groups.",
    theme: "civic",
    preview: ["Streak rings", "Quick check-in", "Care notes"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
