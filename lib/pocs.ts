export type PocCard = {
  slug: string;
  title: string;
  category: string;
  createdAt: string;
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
    createdAt: "2026-03-27T09:00:00+08:00",
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
    createdAt: "2026-03-27T09:30:00+08:00",
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
    createdAt: "2026-03-27T10:00:00+08:00",
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
    createdAt: "2026-03-28T09:00:00+08:00",
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
    createdAt: "2026-03-28T09:30:00+08:00",
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
    createdAt: "2026-03-28T10:00:00+08:00",
    summary:
      "A mall route guide for lifts, ramps, and stairs-free entrances before you head out.",
    impact:
      "An animated floor-plan route guide for wheelchair users, families, and caregivers.",
    theme: "editorial",
    tags: ["Accessibility", "Mall navigation", "Wheelchair access"],
  },
  {
    slug: "mrt-lift-note-sg",
    title: "MRT Lift Note",
    category: "Accessibility",
    createdAt: "2026-03-28T11:00:00+08:00",
    summary:
      "Check lift access across key MRT stations before you travel, with alternate stops when something is down.",
    impact:
      "A schematic rail map that helps mobility-impaired commuters spot lift issues at a glance.",
    theme: "ops",
    tags: ["MRT access", "Lift status", "Mobility support"],
  },
  {
    slug: "quiet-places-sg",
    title: "Quiet Places",
    category: "Accessibility",
    createdAt: "2026-03-28T11:10:00+08:00",
    summary:
      "Browse calmer places around Singapore with sensory cues for noise, crowd level, and light.",
    impact:
      "An ambient quietness explorer for neurodivergent residents and caregivers planning an outing.",
    theme: "editorial",
    tags: ["Sensory-friendly", "Quiet spaces", "Neurodivergent support"],
  },
  {
    slug: "accessible-toilet-notes-sg",
    title: "Accessible Toilet Notes",
    category: "Accessibility",
    createdAt: "2026-03-28T11:20:00+08:00",
    summary:
      "See nearby accessible toilets with notes on cleanliness, changing facilities, opening hours, and access.",
    impact:
      "A map-led finder for caregivers, seniors, and disabled users who need the right facilities fast.",
    theme: "civic",
    tags: ["Accessible toilets", "Changing facilities", "Caregiver planning"],
  },
  {
    slug: "volunteer-match-sg",
    title: "Volunteer Match",
    category: "Civic life",
    createdAt: "2026-03-28T12:00:00+08:00",
    summary:
      "Match your skills to volunteer opportunities by cause, neighbourhood, and the kind of help needed.",
    impact:
      "A split-screen matcher that connects busy adults and students to roles they can actually do.",
    theme: "editorial",
    tags: ["Volunteering", "Skills matching", "Community causes"],
  },
  {
    slug: "skills-for-good-sg",
    title: "Skills for Good",
    category: "Civic life",
    createdAt: "2026-03-28T12:10:00+08:00",
    summary:
      "Browse people offering design, admin, tutoring, and tech support for community work across Singapore.",
    impact:
      "A tag-cloud skills marketplace for nonprofits and volunteers looking for the right help this week.",
    theme: "civic",
    tags: ["Professional volunteering", "Nonprofit support", "Skills directory"],
  },
  {
    slug: "volunteer-hours-sg",
    title: "Volunteer Hours",
    category: "Civic life",
    createdAt: "2026-03-28T12:20:00+08:00",
    summary:
      "Log service hours, see your week build, and track recurring community commitments in one place.",
    impact:
      "A live-updating hours log for volunteers and students who want a clear record of their time.",
    theme: "ops",
    tags: ["Volunteer log", "Service hours", "Weekly tracking"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
