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
    slug: "hawker-surplus-connect",
    title: "Hawker Surplus Connect",
    category: "Food security",
    summary:
      "A live rescue board for matching end-of-day surplus with nearby volunteers before closing time.",
    impact:
      "Tests whether clearer watch zones, dispatch timing, and simulated pickup coordination can make small rescue runs easier to act on.",
    theme: "ops",
    preview: ["Dispatch board", "Live alerts", "Volunteer roster"],
  },
  {
    slug: "free-meal-map-sg",
    title: "Free Meal Map SG",
    category: "Community access",
    summary:
      "A calmer way to explore meal support points and community fridges across Singapore.",
    impact:
      "Tests whether a map-led experience can make support options easier to discover, compare, and revisit without friction.",
    theme: "civic",
    preview: ["Map explorer", "Area hotspots", "Visit checklist"],
  },
  {
    slug: "budget-meal-basket-sg",
    title: "Budget Meal Basket SG",
    category: "Household planning",
    summary:
      "A guided weekly basket planner built around local prices, household size, and everyday meal rhythms.",
    impact:
      "Tests whether a more visual planning flow can help households shape affordable weeknight meals with less guesswork.",
    theme: "editorial",
    preview: ["Guided planner", "Budget chart", "Save and share"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
