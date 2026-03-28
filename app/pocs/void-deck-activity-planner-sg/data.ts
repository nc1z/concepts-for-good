export const STORAGE_KEY = "cfg-void-deck-activity-planner-sg";

export const weekDays = ["Tuesday", "Thursday", "Saturday"] as const;

export type WeekDay = (typeof weekDays)[number];

export type Zone = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Slot = {
  id: string;
  day: WeekDay;
  zoneId: string;
  label: string;
  timeRange: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ActivityOption = {
  id: string;
  name: string;
  host: string;
  note: string;
  bring: string;
  tone: string;
};

export type Booking = {
  id: string;
  slotId: string;
  activityId: string;
};

export const zones: Zone[] = [
  { id: "court", label: "Open court", x: 70, y: 70, width: 360, height: 208 },
  { id: "tables", label: "Seating edge", x: 470, y: 94, width: 210, height: 160 },
  { id: "corner", label: "Lift lobby corner", x: 192, y: 310, width: 220, height: 112 },
];

export const slots: Slot[] = [
  {
    id: "tue-court-am",
    day: "Tuesday",
    zoneId: "court",
    label: "Morning",
    timeRange: "9:00 am to 11:00 am",
    x: 102,
    y: 102,
    width: 132,
    height: 62,
  },
  {
    id: "tue-tables-pm",
    day: "Tuesday",
    zoneId: "tables",
    label: "After school",
    timeRange: "4:00 pm to 6:00 pm",
    x: 498,
    y: 124,
    width: 154,
    height: 62,
  },
  {
    id: "thu-corner-am",
    day: "Thursday",
    zoneId: "corner",
    label: "Mid-morning",
    timeRange: "10:00 am to 12:00 pm",
    x: 222,
    y: 332,
    width: 160,
    height: 58,
  },
  {
    id: "thu-court-pm",
    day: "Thursday",
    zoneId: "court",
    label: "Evening",
    timeRange: "6:30 pm to 8:30 pm",
    x: 262,
    y: 194,
    width: 136,
    height: 62,
  },
  {
    id: "sat-court-am",
    day: "Saturday",
    zoneId: "court",
    label: "Breakfast",
    timeRange: "8:30 am to 10:30 am",
    x: 98,
    y: 190,
    width: 144,
    height: 62,
  },
  {
    id: "sat-tables-mid",
    day: "Saturday",
    zoneId: "tables",
    label: "Lunch hour",
    timeRange: "12:00 pm to 2:00 pm",
    x: 498,
    y: 194,
    width: 154,
    height: 62,
  },
  {
    id: "sat-corner-pm",
    day: "Saturday",
    zoneId: "corner",
    label: "Late afternoon",
    timeRange: "3:30 pm to 5:30 pm",
    x: 232,
    y: 256,
    width: 148,
    height: 58,
  },
];

export const activityOptions: ActivityOption[] = [
  {
    id: "tea-chat",
    name: "Tea and kueh catch-up",
    host: "Block 221 residents' group",
    note: "Light setup with folding tables and a bring-one-share-one snack spread.",
    bring: "Thermos flasks and small plates",
    tone: "#c96f3b",
  },
  {
    id: "chair-move",
    name: "Chair stretch circle",
    host: "Thursday health buddies",
    note: "Gentle seated stretches with a rest corner kept open for slower pacing.",
    bring: "Stackable chairs and a speaker",
    tone: "#4d7b65",
  },
  {
    id: "craft-hour",
    name: "Holiday craft table",
    host: "Parents from Block 223",
    note: "Paper lanterns, sticker sheets, and colouring mats for younger children.",
    bring: "Craft tubs and cleanup bags",
    tone: "#9e5cb5",
  },
  {
    id: "repair-club",
    name: "Fix-it corner",
    host: "Neighbourhood repair volunteers",
    note: "Small appliance checks and loose-button repairs at one shared workbench.",
    bring: "Extension cords and label cards",
    tone: "#2b5f9e",
  },
];

export const initialBookings: Booking[] = [
  { id: "booking-1", slotId: "tue-tables-pm", activityId: "craft-hour" },
  { id: "booking-2", slotId: "sat-court-am", activityId: "tea-chat" },
];
