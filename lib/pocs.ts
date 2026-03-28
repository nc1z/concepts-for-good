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
    slug: "community-cooking-circle-sg",
    title: "Community Cooking Circle",
    category: "Social connection",
    createdAt: "2026-03-28T20:24:00+08:00",
    summary:
      "Join a neighbourhood cooking circle by taking a prep, cook, or welcome role before the meal begins.",
    impact:
      "A kitchen-flow board that shows where a small cooking session still needs hands before neighbours sit down together.",
    theme: "civic",
    tags: ["Community", "Food", "Seniors", "Neighbourhood"],
  },
  {
    slug: "rain-window-planner-sg",
    title: "Rain Window Planner",
    category: "Urban access",
    createdAt: "2026-03-28T19:01:00+08:00",
    summary:
      "Check if it is dry enough to leave now, or how long to wait before heading to your appointment.",
    impact:
      "An ambient forecast board that tells caregivers and wheelchair users whether to leave now or wait for a clearer window.",
    theme: "editorial",
    tags: ["Mobility", "Weather", "Caregiving", "data.gov.sg"],
  },
  {
    slug: "traffic-camera-check-sg",
    title: "Traffic Camera Check",
    category: "Urban access",
    createdAt: "2026-03-28T19:01:00+08:00",
    summary: "Check live traffic camera views along your route before heading out for a volunteer run or caregiver trip.",
    impact: "A route storyboard of live traffic cameras that lets volunteer drivers assess road conditions before leaving.",
    theme: "ops",
    tags: ["Mobility", "Transport", "Volunteering", "data.gov.sg"],
  },
  {
    slug: "carpark-chance-sg",
    title: "Carpark Chance",
    category: "Urban access",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary:
      "Check nearby carpark availability before heading to a clinic, hospital, or errand stop.",
    impact:
      "A pulsing availability board for caregivers and drivers who need a parking plan before they leave.",
    theme: "ops",
    tags: ["Mobility", "Caregiving", "Parking", "Transport"],
  },
  {
    slug: "block-potluck-planner-sg",
    title: "Block Potluck Planner",
    category: "Social connection",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary: "Plan a block potluck where everyone can see what's coming and where the gaps are.",
    impact: "A festive table planner that makes communal gatherings easy to coordinate without duplicates.",
    theme: "civic",
    tags: ["Community", "Food", "Social", "Neighbourhood"],
  },
  {
    slug: "rent-split-planner-sg",
    title: "Rent Split Planner",
    category: "Cost of living",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary: "See exactly what each flatmate owes this month, with bills assigned and split in a glance.",
    impact: "A calm split board that makes shared household costs visible and conflict-free.",
    theme: "editorial",
    tags: ["Housing", "Cost of living", "Budgeting", "Shared expenses"],
  },
  {
    slug: "food-donation-route-sg",
    title: "Food Donation Route",
    category: "Food security",
    createdAt: "2026-03-28T13:52:00+08:00",
    summary:
      "Plan your pickup and dropoff route for tonight's food rescue run, stop by stop.",
    impact:
      "A visual route planner with reorderable stops for volunteer drivers.",
    theme: "ops",
    tags: ["Food", "Volunteering", "Community", "Route planning"],
  },
  {
    slug: "medication-reminder-sg",
    title: "Medication Reminder",
    category: "Health & ageing",
    createdAt: "2026-03-28T13:57:00+08:00",
    summary:
      "A calm daily medication schedule built around a 24-hour clock face — see what's next and mark each dose as taken.",
    impact:
      "A clock-face medication guide for seniors and caregivers to follow through the day.",
    theme: "editorial",
    tags: ["Caregiving", "Health", "Seniors", "Daily routine"],
  },
  {
    slug: "senior-check-in-sg",
    title: "Senior Check-In",
    category: "Community care",
    createdAt: "2026-03-28T14:02:00+08:00",
    summary:
      "A warm check-in board for volunteers and families to track daily contact with seniors living alone.",
    impact:
      "A warm daily check-in flow for volunteers and families supporting seniors living alone.",
    theme: "civic",
    tags: ["Caregiving", "Community", "Volunteering", "Seniors"],
  },
  {
    slug: "digital-help-for-seniors",
    title: "Digital Help for Seniors",
    category: "Digital confidence",
    createdAt: "2026-03-28T14:20:00+08:00",
    summary:
      "A step-by-step phone helper for common tasks like paying a bill, opening an appointment, or scanning a QR code.",
    impact:
      "A large-step phone guide for older adults doing everyday digital tasks.",
    theme: "civic",
    tags: ["Seniors", "Digital inclusion", "Community", "Phone help"],
  },
  {
    slug: "elder-visit-planner-sg",
    title: "Elder Visit Planner",
    category: "Community care",
    createdAt: "2026-03-28T15:05:00+08:00",
    summary:
      "A weekly planner for organising volunteer visits for seniors across the neighbourhood.",
    impact:
      "A weekly calendar planner that makes open visit days easy to spot and fill.",
    theme: "civic",
    tags: ["Caregiving", "Volunteering", "Community", "Seniors"],
  },
  {
    slug: "accessible-mall-route-sg",
    title: "Accessible Mall Route",
    category: "Accessibility",
    createdAt: "2026-03-28T15:11:00+08:00",
    summary:
      "A mall route guide for lifts, ramps, and stairs-free entrances before you head out.",
    impact:
      "An animated floor-plan route guide for wheelchair users, families, and caregivers.",
    theme: "editorial",
    tags: ["Accessibility", "Mobility", "Caregiving", "Wayfinding"],
  },
  {
    slug: "mrt-lift-note-sg",
    title: "MRT Lift Note",
    category: "Accessibility",
    createdAt: "2026-03-28T16:47:00+08:00",
    summary:
      "Check lift access across key MRT stations before you travel, with alternate stops when something is down.",
    impact:
      "A schematic rail map that helps mobility-impaired commuters spot lift issues at a glance.",
    theme: "ops",
    tags: ["Accessibility", "Mobility", "Transport", "Caregiving"],
  },
  {
    slug: "quiet-places-sg",
    title: "Quiet Places",
    category: "Accessibility",
    createdAt: "2026-03-28T16:54:00+08:00",
    summary:
      "Browse calmer places around Singapore with sensory cues for noise, crowd level, and light.",
    impact:
      "An ambient quietness explorer for neurodivergent residents and caregivers planning an outing.",
    theme: "editorial",
    tags: ["Accessibility", "Mental health", "Caregiving", "Sensory-friendly"],
  },
  {
    slug: "accessible-toilet-notes-sg",
    title: "Accessible Toilet Notes",
    category: "Accessibility",
    createdAt: "2026-03-28T17:01:00+08:00",
    summary:
      "See nearby accessible toilets with notes on cleanliness, changing facilities, opening hours, and access.",
    impact:
      "A map-led finder for caregivers, seniors, and disabled users who need the right facilities fast.",
    theme: "civic",
    tags: ["Accessibility", "Caregiving", "Mobility", "Facilities"],
  },
  {
    slug: "volunteer-match-sg",
    title: "Volunteer Match",
    category: "Civic life",
    createdAt: "2026-03-28T17:08:00+08:00",
    summary:
      "Match your skills to volunteer opportunities by cause, neighbourhood, and the kind of help needed.",
    impact:
      "A split-screen matcher that connects busy adults and students to roles they can actually do.",
    theme: "editorial",
    tags: ["Volunteering", "Community", "Skills", "Civic"],
  },
  {
    slug: "skills-for-good-sg",
    title: "Skills for Good",
    category: "Civic life",
    createdAt: "2026-03-28T17:15:00+08:00",
    summary:
      "Browse people offering design, admin, tutoring, and tech support for community work across Singapore.",
    impact:
      "A tag-cloud skills marketplace for nonprofits and volunteers looking for the right help this week.",
    theme: "civic",
    tags: ["Volunteering", "Community", "Skills", "Nonprofits"],
  },
  {
    slug: "volunteer-hours-sg",
    title: "Volunteer Hours",
    category: "Civic life",
    createdAt: "2026-03-28T17:22:00+08:00",
    summary:
      "Log service hours, see your week build, and track recurring community commitments in one place.",
    impact:
      "A live-updating hours log for volunteers and students who want a clear record of their time.",
    theme: "ops",
    tags: ["Volunteering", "Community", "Students", "Tracking"],
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
