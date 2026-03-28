export type Persona = "volunteer" | "coordinator";

export type Listing = {
  id: string;
  name: string;
  area: string;
  source: string;
  portions: number;
  readyBy: string;
  pickupPoint: string;
  notes: string;
  tags: string[];
  priority: "watch" | "ready" | "urgent";
};

export type AlertItem = {
  id: string;
  headline: string;
  detail: string;
  time: string;
  severity: "ready" | "watching" | "urgent";
};

export type Watchlist = {
  areas: string[];
  minimumPortions: number;
  cadence: "instant" | "hourly" | "digest";
};

export type Volunteer = {
  id: string;
  name: string;
  base: string;
  mode: string;
  capacity: number;
};

export const personas: Array<{
  id: Persona;
  label: string;
  description: string;
}> = [
  {
    id: "volunteer",
    label: "Volunteer view",
    description: "Track nearby pickups, confirm handoff windows, and claim the next run.",
  },
  {
    id: "coordinator",
    label: "Coordinator view",
    description: "Tune watch zones, assign runners, and keep the dispatch lane moving.",
  },
];

export const zoneOptions = [
  "Tiong Bahru",
  "Bedok",
  "Jurong East",
  "Toa Payoh",
  "Punggol",
];

export const volunteers: Volunteer[] = [
  { id: "v1", name: "Afiq", base: "Bukit Merah", mode: "Bike", capacity: 2 },
  { id: "v2", name: "Mei", base: "Kallang", mode: "Car", capacity: 3 },
  { id: "v3", name: "Harish", base: "Bedok", mode: "Van", capacity: 4 },
];

export const seededListings: Listing[] = [
  {
    id: "listing-1",
    name: "Nasi Lemak & Drinks Stall",
    area: "Tiong Bahru",
    source: "Hawker centre",
    portions: 28,
    readyBy: "8:45 pm",
    pickupPoint: "Loading bay beside Seng Poh Road",
    notes: "Packed rice sets with drinks. Best handled in one clean pickup wave.",
    tags: ["Hot food", "Fast handoff"],
    priority: "ready",
  },
  {
    id: "listing-2",
    name: "Bedok Bakery Counter",
    area: "Bedok",
    source: "Neighbourhood bakery",
    portions: 42,
    readyBy: "9:10 pm",
    pickupPoint: "Rear service lane near Block 214",
    notes: "Bread bundles and pastries with room to split across two volunteer stops.",
    tags: ["High volume", "Bread"],
    priority: "urgent",
  },
  {
    id: "listing-3",
    name: "Fruit Juice Stall",
    area: "Jurong East",
    source: "Food court",
    portions: 18,
    readyBy: "8:20 pm",
    pickupPoint: "Mall taxi stand pickup corner",
    notes: "Short shelf life. Best routed to a nearby fridge or same-night handoff.",
    tags: ["Chilled", "Short window"],
    priority: "watch",
  },
  {
    id: "listing-4",
    name: "Chicken Rice Stall",
    area: "Toa Payoh",
    source: "Hawker centre",
    portions: 33,
    readyBy: "8:55 pm",
    pickupPoint: "Drop-off point facing Lorong 5",
    notes: "Consistent evening volume and straightforward packaging for family-sized portions.",
    tags: ["Popular", "Family packs"],
    priority: "ready",
  },
  {
    id: "listing-5",
    name: "Dessert Cart",
    area: "Punggol",
    source: "Weekend market",
    portions: 24,
    readyBy: "9:30 pm",
    pickupPoint: "Waterway Point side entrance",
    notes: "Chilled dessert cups with stable carry boxes and a later pickup window.",
    tags: ["Dessert", "Late window"],
    priority: "watch",
  },
];

export const seededAlerts: AlertItem[] = [
  {
    id: "alert-1",
    headline: "Bedok bakery volume jumped",
    detail: "The next run may need a vehicle with more than two crate slots.",
    time: "2 min ago",
    severity: "urgent",
  },
  {
    id: "alert-2",
    headline: "Tiong Bahru stall confirmed early pack-up",
    detail: "Collection window moved slightly earlier to 8:45 pm.",
    time: "9 min ago",
    severity: "ready",
  },
  {
    id: "alert-3",
    headline: "Punggol dessert cart marked watch only",
    detail: "Worth monitoring, but not the first route to dispatch tonight.",
    time: "16 min ago",
    severity: "watching",
  },
];

export const initialWatchlist: Watchlist = {
  areas: ["Tiong Bahru", "Bedok", "Toa Payoh"],
  minimumPortions: 20,
  cadence: "instant",
};
