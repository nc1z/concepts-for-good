export type StopKind = "pickup" | "dropoff";

export type Stop = {
  id: string;
  name: string;
  area: string;
  kind: StopKind;
  meals: number;
  closingInMin: number;
  travelFromPreviousMin: number;
  laneShift: number;
  windowLabel: string;
  note: string;
};

export const missionConfig = {
  targetMeals: 118,
  targetScore: 260,
  maxStrikes: 3,
  startClock: "7:40 pm",
};

export const seedStops: Stop[] = [
  {
    id: "toa-payoh-bakery",
    name: "Toa Payoh Bakery Lane",
    area: "Toa Payoh",
    kind: "pickup",
    meals: 24,
    closingInMin: 22,
    travelFromPreviousMin: 8,
    laneShift: -18,
    windowLabel: "Shutters in 22 min",
    note: "Soft buns and loaves packed near the back roller door.",
  },
  {
    id: "bukit-merah-rice",
    name: "Bukit Merah Rice Pots",
    area: "Bukit Merah",
    kind: "pickup",
    meals: 36,
    closingInMin: 38,
    travelFromPreviousMin: 11,
    laneShift: 34,
    windowLabel: "Closing in 38 min",
    note: "Tray count changes fast once the supper queue thins out.",
  },
  {
    id: "geylang-fruit",
    name: "Geylang Fruit Rescue",
    area: "Geylang",
    kind: "pickup",
    meals: 18,
    closingInMin: 31,
    travelFromPreviousMin: 7,
    laneShift: -42,
    windowLabel: "Crates held for 31 min",
    note: "Take the bruised fruit first and leave the sealed cartons.",
  },
  {
    id: "bedok-soup",
    name: "Bedok Soup Queue",
    area: "Bedok",
    kind: "pickup",
    meals: 44,
    closingInMin: 54,
    travelFromPreviousMin: 14,
    laneShift: 46,
    windowLabel: "Kitchen wraps in 54 min",
    note: "Pick up the insulated tubs from the side alley loading spot.",
  },
  {
    id: "marine-parade-drop",
    name: "Marine Parade Lift Lobby",
    area: "Marine Parade",
    kind: "dropoff",
    meals: 0,
    closingInMin: 70,
    travelFromPreviousMin: 9,
    laneShift: -10,
    windowLabel: "Residents waiting by 8:50 pm",
    note: "Stack the family packs nearest the community fridge first.",
  },
  {
    id: "tampines-hub-drop",
    name: "Tampines Pantry Hub",
    area: "Tampines",
    kind: "dropoff",
    meals: 0,
    closingInMin: 86,
    travelFromPreviousMin: 13,
    laneShift: 18,
    windowLabel: "Last handoff at 9:06 pm",
    note: "Hand the remaining warm packs to the youth pantry desk.",
  },
];

export const stopLookup = Object.fromEntries(seedStops.map((stop) => [stop.id, stop])) as Record<
  string,
  Stop
>;

export const defaultOrder = seedStops.map((stop) => stop.id);

export const announcerSeed = [
  "Route radar is live. Drag the stops into the best rescue order before you roll out.",
  "Pickups earn meals and score. Miss too many closing windows and the round is over.",
];
