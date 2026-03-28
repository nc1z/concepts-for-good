export type MedColour = "teal" | "coral" | "amber" | "sage" | "teal-light" | "lavender";

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  /** Hour in 24h format (0–23) */
  hour: number;
  /** Minute (0–59) */
  minute: number;
  instructions: string;
  colour: MedColour;
};

export const COLOUR_MAP: Record<MedColour, { arc: string; arcTaken: string; bg: string; text: string }> = {
  teal:       { arc: "#2d7d6f", arcTaken: "#9ecdc5", bg: "#eaf4f2", text: "#1d5249" },
  coral:      { arc: "#d4614a", arcTaken: "#edbbae", bg: "#fdf0ec", text: "#8c3020" },
  amber:      { arc: "#c8871a", arcTaken: "#e8ceac", bg: "#fdf5e6", text: "#7a4f0a" },
  sage:       { arc: "#5e8f5e", arcTaken: "#b5ceab", bg: "#eef5ec", text: "#2f5a2f" },
  "teal-light": { arc: "#3a9c8a", arcTaken: "#a5d5cc", bg: "#ecf7f5", text: "#246056" },
  lavender:   { arc: "#7a6faa", arcTaken: "#c0bbdd", bg: "#f2f0fa", text: "#48416d" },
};

export const medications: Medication[] = [
  {
    id: "med-1",
    name: "Metformin",
    dosage: "500 mg",
    hour: 7,
    minute: 0,
    instructions: "Take with breakfast. Helps manage blood sugar.",
    colour: "teal",
  },
  {
    id: "med-2",
    name: "Amlodipine",
    dosage: "5 mg",
    hour: 8,
    minute: 0,
    instructions: "Take after breakfast. Keeps your blood pressure steady.",
    colour: "coral",
  },
  {
    id: "med-3",
    name: "Aspirin",
    dosage: "100 mg",
    hour: 12,
    minute: 0,
    instructions: "Take with lunch. Helps your circulation.",
    colour: "amber",
  },
  {
    id: "med-4",
    name: "Vitamin D3",
    dosage: "1000 IU",
    hour: 12,
    minute: 0,
    instructions: "Take with lunch.",
    colour: "sage",
  },
  {
    id: "med-5",
    name: "Metformin",
    dosage: "500 mg",
    hour: 18,
    minute: 0,
    instructions: "Take with dinner. Helps manage blood sugar.",
    colour: "teal-light",
  },
  {
    id: "med-6",
    name: "Losartan",
    dosage: "50 mg",
    hour: 21,
    minute: 0,
    instructions: "Take before bed. Keeps your blood pressure steady overnight.",
    colour: "lavender",
  },
];

/** IDs pre-marked as taken (medications 1–4, representing mid-afternoon state) */
export const DEFAULT_TAKEN: string[] = ["med-1", "med-2", "med-3", "med-4"];

export const STORAGE_KEY = "cfg-medication-reminder-sg-v1";
