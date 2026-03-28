export type StopType = "Pickup" | "Dropoff";

export type Stop = {
  id: string;
  order: number;
  name: string;
  area: string;
  type: StopType;
  portionsLabel: string;
  window: string;
};

export const seedStops: Stop[] = [
  {
    id: "stop-1",
    order: 1,
    name: "Nasi Padang Stall",
    area: "Geylang Bahru",
    type: "Pickup",
    portionsLabel: "35 portions",
    window: "8:30 pm",
  },
  {
    id: "stop-2",
    order: 2,
    name: "Bread & Pastry Corner",
    area: "Toa Payoh",
    type: "Pickup",
    portionsLabel: "28 portions",
    window: "8:45 pm",
  },
  {
    id: "stop-3",
    order: 3,
    name: "Bedok Wet Market Vendor",
    area: "Bedok",
    type: "Pickup",
    portionsLabel: "42 portions",
    window: "9:00 pm",
  },
  {
    id: "stop-4",
    order: 4,
    name: "Willing Hearts Kitchen",
    area: "Defu Lane",
    type: "Dropoff",
    portionsLabel: "All collected",
    window: "9:45 pm",
  },
  {
    id: "stop-5",
    order: 5,
    name: "St Andrew's Community Club",
    area: "Tampines",
    type: "Dropoff",
    portionsLabel: "Half load",
    window: "10:00 pm",
  },
  {
    id: "stop-6",
    order: 6,
    name: "Tampines North CC",
    area: "Tampines",
    type: "Dropoff",
    portionsLabel: "Remainder",
    window: "10:15 pm",
  },
];

export type AppState = {
  stops: Stop[];
  activeIds: string[];
  doneIds: string[];
};

export const defaultState: AppState = {
  stops: seedStops,
  activeIds: ["stop-1", "stop-2", "stop-3", "stop-4", "stop-5", "stop-6"],
  doneIds: ["stop-1"],
};
