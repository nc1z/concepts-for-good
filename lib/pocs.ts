export type PocCard = {
  slug: string;
  title: string;
  category: string;
  createdAt: string;
  summary: string;
  impact: string;
  theme: "ops" | "civic" | "editorial";
  tags: string[];
  model: string;
};

export const pocCards: PocCard[] = [
  {
    slug: "lower-your-grocery-bill-sg",
    title: "Lower Your Grocery Bill",
    category: "Cost of living",
    createdAt: "2026-04-26T23:37:59+08:00",
    summary:
      "Swap a brand or two in your weekly basket and watch the total drop in real time.",
    impact:
      "A ledger-and-receipt interface where each swap physically updates the running total below.",
    theme: "civic",
    tags: ["Groceries", "Budgeting", "Cost of living", "Families", "Singapore"],
    model: "claude-sonnet-4-6",
  },
  {
    slug: "check-my-stress-sg",
    title: "Check My Stress",
    category: "Mental health",
    createdAt: "2026-04-26T22:58:01+08:00",
    summary:
      "Answer five quick questions and see which part of today needs the most care.",
    impact:
      "A breathing stress ring that turns a short daily check into one clear next step.",
    theme: "editorial",
    tags: ["Mental health", "Stress", "Daily routine", "Singapore"],
    model: "openai/gpt-5",
  },
  {
    slug: "try-a-hobby-nearby-sg",
    title: "Try a Hobby Nearby",
    category: "Social connection",
    createdAt: "2026-04-26T10:00:00+08:00",
    summary:
      "Find a gentle first hobby meetup near home that matches the social energy you have today.",
    impact:
      "A comfort-ring constellation for adults who want company without jumping into a big club.",
    theme: "editorial",
    tags: ["Hobbies", "Belonging", "Meetups", "Social anxiety", "Singapore"],
    model: "openai/gpt-5.5",
  },
  {
    slug: "train-your-eye-sg",
    title: "Train Your Eye",
    category: "Digital confidence",
    createdAt: "2026-04-03T12:00:00+08:00",
    summary:
      "Ten pieces of AI-written Singapore content, each one failing for a reason. Find it, name it, fix it.",
    impact:
      "A dark split-screen critique trainer that builds your rejection vocabulary one challenge at a time.",
    theme: "editorial",
    tags: ["Creative skills", "Writing", "AI literacy", "Content"],
    model: "anthropic/claude-sonnet-4-6",
  },
  {
    slug: "what-to-bring-to-the-clinic-sg",
    title: "What to Bring to the Clinic",
    category: "Health systems",
    createdAt: "2026-04-02T09:18:09+08:00",
    summary:
      "Pick your clinic visit type and pack every required document, payment item, and medicine note before leaving home.",
    impact:
      "A countertop prep board that turns clinic preparation into a quick drag-to-bag flow for caregivers and seniors.",
    theme: "civic",
    tags: ["Health", "Caregiving", "Seniors", "Clinic prep", "Singapore"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "homework-quiet-timer-sg",
    title: "Quiet Study Timer",
    category: "Education equity",
    createdAt: "2026-03-30T13:57:44+08:00",
    summary:
      "A calm focus timer for children doing homework in noisy homes.",
    impact:
      "A breathing wave companion that helps children focus in short bursts with gentle visual cues instead of pressure.",
    theme: "civic",
    tags: ["School", "Children", "Focus support", "Singapore"],
    model: "nvidia/moonshotai/kimi-k2.5",
  },
  {
    slug: "legal-aid-prep-sg",
    title: "Prepare for Legal Help",
    category: "Support",
    createdAt: "2026-03-29T20:27:58+08:00",
    summary:
      "Answer a few questions to see which legal help routes may fit and what papers to bring before you call.",
    impact:
      "A calm intake conversation that turns scattered legal worries into a clearer first step and paper list.",
    theme: "editorial",
    tags: ["Legal aid", "Support", "Documents", "Singapore"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "trusted-helper-list-sg",
    title: "My Care Helpers",
    category: "Caregiving",
    createdAt: "2026-03-29T16:32:51+08:00",
    summary:
      "Keep the right carer one tap away, with routines, handoff notes, and quick contact actions inside a phone-style view.",
    impact:
      "A caregiver phone shell that groups trusted helpers by role so the next call or handoff never turns into a search.",
    theme: "civic",
    tags: ["Caregiving", "Family", "Contacts", "Handoffs"],
    model: "nvidia/moonshotai/kimi-k2-5",
  },
  {
    slug: "healthy-hawker-budget-sg",
    title: "Healthier Hawker Meals",
    category: "Wellness",
    createdAt: "2026-03-29T13:00:00+08:00",
    summary:
      "Build a day of hawker meals that feels familiar, lighter, and still manageable on a weekday budget.",
    impact:
      "An editorial hawker spread that turns everyday dish choices into a visible daily spend plan.",
    theme: "editorial",
    tags: ["Wellness", "Food", "Budget", "Hawker"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "low-cost-exercise-sg",
    title: "Exercise for Free",
    category: "Wellness",
    createdAt: "2026-03-29T10:15:00+08:00",
    summary:
      "Follow a short routine that works in small spaces, with guided cards and a timer that keeps you moving.",
    impact:
      "A playful movement deck for residents who want a no-cost routine without joining a class.",
    theme: "civic",
    tags: ["Wellness", "Exercise", "Budget", "Daily routine"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "rest-day-planner-sg",
    title: "Plan Your Rest Day",
    category: "Inclusion",
    createdAt: "2026-03-28T22:45:00+08:00",
    summary:
      "Build a rest day with affordable stops for calls home, errands, meals, and one proper break.",
    impact:
      "A playful Sunday board that turns useful low-cost stops into a route you can actually follow.",
    theme: "civic",
    tags: ["Inclusion", "Community", "Budget", "Wellbeing"],
    model: "openai/gpt-5.4",
  },
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
    model: "openai/gpt-5.4",
  },
  {
    slug: "rain-window-planner-sg",
    title: "When to Leave in the Rain",
    category: "Urban access",
    createdAt: "2026-03-28T19:01:00+08:00",
    summary:
      "Check if it is dry enough to leave now, or how long to wait before heading to your appointment.",
    impact:
      "An ambient forecast board that tells caregivers and wheelchair users whether to leave now or wait for a drier window.",
    theme: "editorial",
    tags: ["Mobility", "Weather", "Caregiving", "data.gov.sg"],
    model: "anthropic/claude-sonnet-4.6",
  },
  {
    slug: "traffic-camera-check-sg",
    title: "Live Road Cameras",
    category: "Urban access",
    createdAt: "2026-03-28T19:01:00+08:00",
    summary: "Check live traffic camera views along your route before heading out for a volunteer run or caregiver trip.",
    impact: "A route storyboard of live traffic cameras that lets volunteer drivers assess road conditions before leaving.",
    theme: "ops",
    tags: ["Mobility", "Transport", "Volunteering", "data.gov.sg"],
    model: "anthropic/claude-sonnet-4.6",
  },
  {
    slug: "carpark-chance-sg",
    title: "Find a Carpark",
    category: "Urban access",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary:
      "Check nearby carpark availability before heading to a clinic, hospital, or errand stop.",
    impact:
      "A pulsing availability board for caregivers and drivers who need a parking plan before they leave.",
    theme: "ops",
    tags: ["Mobility", "Caregiving", "Parking", "Transport"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "block-potluck-planner-sg",
    title: "Block Potluck",
    category: "Social connection",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary: "Plan a block potluck where everyone can see what's coming and where the gaps are.",
    impact: "A festive table planner that makes communal gatherings easy to coordinate without duplicates.",
    theme: "civic",
    tags: ["Community", "Food", "Social", "Neighbourhood"],
    model: "anthropic/claude-sonnet-4.6",
  },
  {
    slug: "rent-split-planner-sg",
    title: "Split the Rent",
    category: "Cost of living",
    createdAt: "2026-03-28T18:56:00+08:00",
    summary: "See exactly what each flatmate owes this month, with bills assigned and split in a glance.",
    impact: "A calm split board that makes shared household costs visible and conflict-free.",
    theme: "editorial",
    tags: ["Housing", "Cost of living", "Budgeting", "Shared expenses"],
    model: "anthropic/claude-sonnet-4.6",
  },
  {
    slug: "food-donation-route-sg",
    title: "Food Rescue Run",
    category: "Food security",
    createdAt: "2026-03-31T03:14:01+08:00",
    summary:
      "Plan your pickup and drop-off route for tonight's food rescue run, stop by stop.",
    impact:
      "A route lane board with a live dotted path that redraws as volunteers reorder stops.",
    theme: "ops",
    tags: ["Food", "Volunteering", "Community", "Route planning"],
    model: "openai/gpt-5.4",
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
    model: "anthropic/claude-sonnet-4.6",
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
    model: "anthropic/claude-sonnet-4.6",
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
    model: "openai/gpt-5.4",
  },
  {
    slug: "elder-visit-planner-sg",
    title: "Visit a Senior",
    category: "Community care",
    createdAt: "2026-03-28T15:05:00+08:00",
    summary:
      "A weekly board for organising volunteer visits for seniors across the neighbourhood.",
    impact:
      "A weekly calendar planner that makes open visit days easy to spot and fill.",
    theme: "civic",
    tags: ["Caregiving", "Volunteering", "Community", "Seniors"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "accessible-mall-route-sg",
    title: "Wheelchair-Friendly Mall Guide",
    category: "Accessibility",
    createdAt: "2026-03-28T15:11:00+08:00",
    summary:
      "A mall route guide for lifts, ramps, and stairs-free entrances before you head out.",
    impact:
      "An animated floor-plan route guide for wheelchair users, families, and caregivers.",
    theme: "editorial",
    tags: ["Accessibility", "Mobility", "Caregiving", "Wayfinding"],
    model: "openai/gpt-5.4",
  },
  {
    slug: "mrt-lift-note-sg",
    title: "MRT Lift Checker",
    category: "Accessibility",
    createdAt: "2026-03-28T16:47:00+08:00",
    summary:
      "Check lift access across key MRT stations before you travel, with alternate stops when something is down.",
    impact:
      "A schematic rail map that helps mobility-impaired commuters spot lift issues at a glance.",
    theme: "ops",
    tags: ["Accessibility", "Mobility", "Transport", "Caregiving"],
    model: "openai/gpt-5.4",
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
    model: "openai/gpt-5.4",
  },
  {
    slug: "accessible-toilet-notes-sg",
    title: "Accessible Toilets Near You",
    category: "Accessibility",
    createdAt: "2026-03-28T17:01:00+08:00",
    summary:
      "See nearby accessible toilets with notes on cleanliness, changing facilities, opening hours, and access.",
    impact:
      "A map-led finder for caregivers, seniors, and disabled users who need the right facilities fast.",
    theme: "civic",
    tags: ["Accessibility", "Caregiving", "Mobility", "Facilities"],
    model: "openai/gpt-5.4",
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
    model: "openai/gpt-5.4",
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
    model: "openai/gpt-5.4",
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
    model: "openai/gpt-5.4",
  },
];

export function getPocBySlug(slug: string) {
  return pocCards.find((card) => card.slug === slug);
}
