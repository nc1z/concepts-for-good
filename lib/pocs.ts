export type PocCard = {
  slug: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  impact: string;
  accent: string;
};

export const pocCards: PocCard[] = [
  {
    slug: "hawker-surplus-connect",
    title: "Hawker Surplus Connect",
    category: "Food Security",
    status: "Placeholder concept",
    summary:
      "A rescue-flow demo for matching end-of-day surplus from hawkers with volunteers and coordinators.",
    impact: "Shows how a single-person demo can simulate collection, alerts, and handoff with seeded Singapore data.",
    accent: "Operations demo",
  },
  {
    slug: "senior-check-in-sg",
    title: "Senior Check-In SG",
    category: "Aging",
    status: "Placeholder concept",
    summary:
      "A calm check-in experience for volunteers and families to track simple support routines for seniors living alone.",
    impact: "Highlights trust-building UX, reminders, and history views without introducing real accounts or backend complexity.",
    accent: "Care workflow",
  },
  {
    slug: "budget-meal-basket-sg",
    title: "Budget Meal Basket SG",
    category: "Food Security",
    status: "Browser concept",
    summary:
      "A guided meal-planning concept that builds a weekly basket from common Singapore ingredients and prices.",
    impact:
      "Shows how a simple browser-only flow can shape affordable weekly meals, saved baskets, and shareable summaries.",
    accent: "Meal planning",
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
