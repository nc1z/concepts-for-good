export const STORAGE_KEY = "cfg-rest-day-planner-sg-v1";

export type NeighbourhoodId =
  | "orchard"
  | "city-hall"
  | "little-india"
  | "harbourfront"
  | "geylang";

export type Activity = {
  id: string;
  name: string;
  neighbourhoodId: NeighbourhoodId;
  neighbourhood: string;
  timeLabel: string;
  slot: "Morning" | "Midday" | "Afternoon" | "Evening";
  costLabel: string;
  costValue: number;
  duration: string;
  summary: string;
  bring: string;
  badge: string;
  accent: string;
  mapX: number;
  mapY: number;
};

export type PlannerState = {
  selectedNeighbourhoodId: NeighbourhoodId;
  plannedActivityIds: string[];
};

export const neighbourhoods: Array<{
  id: NeighbourhoodId;
  name: string;
  line1: string;
  line2: string;
  accent: string;
  mapX: number;
  mapY: number;
}> = [
  {
    id: "orchard",
    name: "Orchard",
    line1: "Churches, remittance stops, Lucky Plaza food picks",
    line2: "Easy first stop for shopping and calls home",
    accent: "#f68f6f",
    mapX: 188,
    mapY: 118,
  },
  {
    id: "city-hall",
    name: "City Hall",
    line1: "Libraries, museums, open lawns, quiet seats",
    line2: "Good for a slower late morning",
    accent: "#5dbdb4",
    mapX: 270,
    mapY: 164,
  },
  {
    id: "little-india",
    name: "Little India",
    line1: "Markets, meals, prayer, and beauty supplies",
    line2: "Best when you want errands with a walk",
    accent: "#f2c45d",
    mapX: 246,
    mapY: 82,
  },
  {
    id: "harbourfront",
    name: "HarbourFront",
    line1: "Waterfront breeze, mall shade, cheaper group meals",
    line2: "Good for a long afternoon reset",
    accent: "#8b8ef9",
    mapX: 116,
    mapY: 226,
  },
  {
    id: "geylang",
    name: "Geylang",
    line1: "Affordable dinners, grocery runs, late buses",
    line2: "Useful final stop before heading back",
    accent: "#7cc36c",
    mapX: 350,
    mapY: 206,
  },
];

export const activities: Activity[] = [
  {
    id: "orchard-call-home",
    name: "Call home after breakfast",
    neighbourhoodId: "orchard",
    neighbourhood: "Orchard",
    timeLabel: "9:00 am",
    slot: "Morning",
    costLabel: "Free",
    costValue: 0,
    duration: "45 min",
    summary: "Start the day with breakfast, Wi-Fi, and a quiet corner for voice notes or a video call.",
    bring: "Earbuds and a power bank",
    badge: "Quiet start",
    accent: "#f68f6f",
    mapX: 188,
    mapY: 118,
  },
  {
    id: "orchard-errands",
    name: "Pick up small care items",
    neighbourhoodId: "orchard",
    neighbourhood: "Orchard",
    timeLabel: "10:30 am",
    slot: "Morning",
    costLabel: "$12",
    costValue: 12,
    duration: "1 hr",
    summary: "Bundle toiletries, snacks, or phone top-ups into one walk before the crowds build.",
    bring: "A foldable tote",
    badge: "Useful stop",
    accent: "#f68f6f",
    mapX: 196,
    mapY: 130,
  },
  {
    id: "city-hall-library",
    name: "Read and recharge at the library",
    neighbourhoodId: "city-hall",
    neighbourhood: "City Hall",
    timeLabel: "12:00 pm",
    slot: "Midday",
    costLabel: "Free",
    costValue: 0,
    duration: "1 hr",
    summary: "Sit down somewhere cool, charge your phone, and rest before the afternoon rush.",
    bring: "A cardigan for the cold air-con",
    badge: "Indoor rest",
    accent: "#5dbdb4",
    mapX: 270,
    mapY: 164,
  },
  {
    id: "city-hall-lawn",
    name: "Picnic chat on the green",
    neighbourhoodId: "city-hall",
    neighbourhood: "City Hall",
    timeLabel: "1:00 pm",
    slot: "Midday",
    costLabel: "$6",
    costValue: 6,
    duration: "1 hr 30 min",
    summary: "Meet friends on the lawn with fruit, buns, and enough space to sit without hurrying.",
    bring: "A mat and cold water",
    badge: "Meet friends",
    accent: "#5dbdb4",
    mapX: 282,
    mapY: 176,
  },
  {
    id: "little-india-lunch",
    name: "Shared lunch and grocery run",
    neighbourhoodId: "little-india",
    neighbourhood: "Little India",
    timeLabel: "1:30 pm",
    slot: "Midday",
    costLabel: "$9",
    costValue: 9,
    duration: "1 hr 15 min",
    summary: "Fit a proper meal and a fast grocery top-up into the same stop.",
    bring: "Cash for the small shops",
    badge: "Food + errands",
    accent: "#f2c45d",
    mapX: 246,
    mapY: 82,
  },
  {
    id: "harbourfront-waterfront",
    name: "Walk by the waterfront",
    neighbourhoodId: "harbourfront",
    neighbourhood: "HarbourFront",
    timeLabel: "3:30 pm",
    slot: "Afternoon",
    costLabel: "Free",
    costValue: 0,
    duration: "1 hr",
    summary: "Take a breezy walk where it feels less crowded and the day slows down for a while.",
    bring: "A hat and water",
    badge: "Fresh air",
    accent: "#8b8ef9",
    mapX: 116,
    mapY: 226,
  },
  {
    id: "harbourfront-group-meal",
    name: "Late lunch with your group",
    neighbourhoodId: "harbourfront",
    neighbourhood: "HarbourFront",
    timeLabel: "4:30 pm",
    slot: "Afternoon",
    costLabel: "$8",
    costValue: 8,
    duration: "1 hr",
    summary: "Sit somewhere shaded, split a meal, and keep the afternoon easy.",
    bring: "Your EZ-Link card for the ride back",
    badge: "Group meal",
    accent: "#8b8ef9",
    mapX: 126,
    mapY: 214,
  },
  {
    id: "geylang-dinner",
    name: "Affordable dinner before heading back",
    neighbourhoodId: "geylang",
    neighbourhood: "Geylang",
    timeLabel: "6:30 pm",
    slot: "Evening",
    costLabel: "$7",
    costValue: 7,
    duration: "1 hr",
    summary: "Finish the day with a reliable, budget-friendly meal near your bus route home.",
    bring: "A light bag for leftovers",
    badge: "Dinner",
    accent: "#7cc36c",
    mapX: 350,
    mapY: 206,
  },
  {
    id: "geylang-market",
    name: "Evening market top-up",
    neighbourhoodId: "geylang",
    neighbourhood: "Geylang",
    timeLabel: "7:30 pm",
    slot: "Evening",
    costLabel: "$10",
    costValue: 10,
    duration: "45 min",
    summary: "Pick up fruit, spices, or small household items before the last bus stretch.",
    bring: "Room in your tote",
    badge: "Final errand",
    accent: "#7cc36c",
    mapX: 338,
    mapY: 216,
  },
];

export const plannerSlots = [
  {
    key: "Morning",
    timeRange: "8 am to 11 am",
    note: "Start gently and keep travel light.",
  },
  {
    key: "Midday",
    timeRange: "11 am to 3 pm",
    note: "Fit lunch, errands, or a longer rest stop here.",
  },
  {
    key: "Afternoon",
    timeRange: "3 pm to 6 pm",
    note: "Keep one stop for fresh air or meeting friends.",
  },
  {
    key: "Evening",
    timeRange: "6 pm onwards",
    note: "Leave enough time for dinner and the trip back.",
  },
] as const;

export const defaultState: PlannerState = {
  selectedNeighbourhoodId: "orchard",
  plannedActivityIds: ["orchard-call-home", "city-hall-library", "harbourfront-waterfront"],
};
