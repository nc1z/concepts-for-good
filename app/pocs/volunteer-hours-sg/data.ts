export const STORAGE_KEY = "volunteer-hours-sg";

export const days = [
  { key: 0, label: "Monday", short: "Mon" },
  { key: 1, label: "Tuesday", short: "Tue" },
  { key: 2, label: "Wednesday", short: "Wed" },
  { key: 3, label: "Thursday", short: "Thu" },
  { key: 4, label: "Friday", short: "Fri" },
  { key: 5, label: "Saturday", short: "Sat" },
  { key: 6, label: "Sunday", short: "Sun" },
] as const;

export const categories = [
  {
    key: "food",
    label: "Food rescue",
    short: "Food",
    accent: "#1d4ed8",
    bar: "#60a5fa",
    panel: "#dbeafe",
  },
  {
    key: "care",
    label: "Care visits",
    short: "Care",
    accent: "#0f766e",
    bar: "#2dd4bf",
    panel: "#ccfbf1",
  },
  {
    key: "learning",
    label: "Learning support",
    short: "Learn",
    accent: "#7c3aed",
    bar: "#c084fc",
    panel: "#ede9fe",
  },
  {
    key: "admin",
    label: "Admin support",
    short: "Admin",
    accent: "#ca8a04",
    bar: "#fbbf24",
    panel: "#fef3c7",
  },
] as const;

export type DayKey = (typeof days)[number]["key"];
export type CategoryKey = (typeof categories)[number]["key"];

export type Session = {
  id: string;
  dayKey: DayKey;
  category: CategoryKey;
  hours: number;
  place: string;
  note: string;
  time: string;
  createdAt: number;
};

export type DraftSession = {
  dayKey: DayKey;
  category: CategoryKey;
  hours: number;
  place: string;
  note: string;
  time: string;
};

export const initialSessions: Session[] = [
  {
    id: "session-1",
    dayKey: 0,
    category: "food",
    hours: 2.5,
    place: "Yishun Community Fridge",
    note: "Packed extra portions before the evening pickup.",
    time: "6:30 pm",
    createdAt: 1711888200000,
  },
  {
    id: "session-2",
    dayKey: 1,
    category: "care",
    hours: 1.5,
    place: "Bedok Care Circle",
    note: "Shared tea and helped with the photo album.",
    time: "7:00 pm",
    createdAt: 1711796400000,
  },
  {
    id: "session-3",
    dayKey: 2,
    category: "learning",
    hours: 2,
    place: "Tampines Learning Room",
    note: "One student finished a reading milestone.",
    time: "4:00 pm",
    createdAt: 1711713600000,
  },
  {
    id: "session-4",
    dayKey: 3,
    category: "admin",
    hours: 1,
    place: "Toa Payoh CC",
    note: "Checked sign-up sheets and shared the weekend list.",
    time: "5:30 pm",
    createdAt: 1711625400000,
  },
  {
    id: "session-5",
    dayKey: 4,
    category: "food",
    hours: 3,
    place: "Ghim Moh Hawker Centre",
    note: "Stacked the routes so the late pickup could start on time.",
    time: "3:00 pm",
    createdAt: 1711544400000,
  },
  {
    id: "session-6",
    dayKey: 5,
    category: "care",
    hours: 1.5,
    place: "Jurong West Block 412",
    note: "A short visit that turned into a long chat about the week.",
    time: "10:00 am",
    createdAt: 1711456800000,
  },
  {
    id: "session-7",
    dayKey: 6,
    category: "learning",
    hours: 2,
    place: "Hougang Library",
    note: "Helped two students finish their assignment before lunch.",
    time: "9:00 am",
    createdAt: 1711372800000,
  },
];

export const initialDraft: DraftSession = {
  dayKey: 3,
  category: "food",
  hours: 1.5,
  place: "",
  note: "",
  time: "6:30 pm",
};

export function getDay(dayKey: DayKey) {
  return days.find((day) => day.key === dayKey) ?? days[0];
}

export function getCategory(category: CategoryKey) {
  return categories.find((item) => item.key === category) ?? categories[0];
}

