export type Persona = "volunteer" | "coordinator";

export type Listing = {
  id: string;
  name: string;
  area: string;
  source: string;
  portions: number;
  readyBy: string;
  notes: string;
  tags: string[];
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
  radiusKm: number;
};

export const personas: Array<{
  id: Persona;
  label: string;
  description: string;
}> = [
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Scan nearby stalls, respond to alerts, and mark pickups as handled.",
  },
  {
    id: "coordinator",
    label: "Coordinator",
    description: "Tune watchlists, watch alerts roll in, and assign runs before closing time.",
  },
];

export const seededListings: Listing[] = [
  {
    id: "listing-1",
    name: "Nasi Lemak and Drinks Stall",
    area: "Tiong Bahru",
    source: "Hawker center",
    portions: 28,
    readyBy: "8:45 pm",
    notes: "Rice sets and packaged drinks after the dinner wave.",
    tags: ["hot food", "pickup soon", "west"],
  },
  {
    id: "listing-2",
    name: "Bakery Counter",
    area: "Bedok",
    source: "Neighbourhood bakery",
    portions: 42,
    readyBy: "9:10 pm",
    notes: "Bread bundles and unsold pastries for same-night collection.",
    tags: ["baked goods", "high volume", "east"],
  },
  {
    id: "listing-3",
    name: "Fruit Juice Stall",
    area: "Jurong East",
    source: "Food court",
    portions: 18,
    readyBy: "8:20 pm",
    notes: "Fresh bottles with a short hold window and simple packing needs.",
    tags: ["chilled", "short window", "west"],
  },
  {
    id: "listing-4",
    name: "Chicken Rice Stall",
    area: "Toa Payoh",
    source: "Hawker center",
    portions: 33,
    readyBy: "8:55 pm",
    notes: "A steady flow of plated meals after peak dinner orders.",
    tags: ["popular", "family packs", "central"],
  },
  {
    id: "listing-5",
    name: "Dessert Cart",
    area: "Punggol",
    source: "Weekend market",
    portions: 24,
    readyBy: "9:30 pm",
    notes: "Chilled dessert cups and fruit bowls with clear handling notes.",
    tags: ["dessert", "weekend", "north-east"],
  },
];

export const seededAlerts: AlertItem[] = [
  {
    id: "alert-1",
    headline: "Tiong Bahru stall marked surplus ready",
    detail: "Volunteer pickup window opened with 28 portions available.",
    time: "2 min ago",
    severity: "ready",
  },
  {
    id: "alert-2",
    headline: "Bedok bakery updated count",
    detail: "Higher volume than expected. Collection can be split across two runs.",
    time: "14 min ago",
    severity: "watching",
  },
  {
    id: "alert-3",
    headline: "Toa Payoh route is nearly full",
    detail: "Coordinator should confirm a driver before the 8:55 pm cutoff.",
    time: "24 min ago",
    severity: "urgent",
  },
];

export const initialWatchlist: Watchlist = {
  areas: ["Tiong Bahru", "Bedok"],
  minimumPortions: 20,
  cadence: "instant",
  radiusKm: 6,
};

