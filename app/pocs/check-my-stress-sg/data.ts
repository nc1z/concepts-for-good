export type StressQuestion = {
  id: string;
  axis: string;
  prompt: string;
  lowLabel: string;
  highLabel: string;
  color: string;
  choices: {
    label: string;
    value: number;
  }[];
};

export const STORAGE_KEY = "cfg-check-my-stress-v1";

export const stressQuestions: StressQuestion[] = [
  {
    id: "sleep",
    axis: "Sleep",
    prompt: "How was your sleep last night?",
    lowLabel: "Rested",
    highLabel: "Very tired",
    color: "#f1c45f",
    choices: [
      { label: "Rested", value: 18 },
      { label: "Somewhat tired", value: 48 },
      { label: "Very tired", value: 82 },
    ],
  },
  {
    id: "load",
    axis: "Load",
    prompt: "How heavy does today feel?",
    lowLabel: "Manageable",
    highLabel: "Too much",
    color: "#ff7f51",
    choices: [
      { label: "Manageable", value: 22 },
      { label: "A lot", value: 58 },
      { label: "Too much", value: 88 },
    ],
  },
  {
    id: "body",
    axis: "Body",
    prompt: "What is your body telling you?",
    lowLabel: "Settled",
    highLabel: "Tense",
    color: "#75d1c3",
    choices: [
      { label: "Settled", value: 20 },
      { label: "Restless", value: 54 },
      { label: "Tense", value: 86 },
    ],
  },
  {
    id: "focus",
    axis: "Focus",
    prompt: "How easy is it to focus?",
    lowLabel: "Clear",
    highLabel: "Scattered",
    color: "#9aa7ff",
    choices: [
      { label: "Clear", value: 16 },
      { label: "Patchy", value: 50 },
      { label: "Scattered", value: 80 },
    ],
  },
  {
    id: "company",
    axis: "Company",
    prompt: "How alone does this feel?",
    lowLabel: "Not alone",
    highLabel: "Alone",
    color: "#ff97bd",
    choices: [
      { label: "Not alone", value: 18 },
      { label: "Unsure", value: 52 },
      { label: "Alone", value: 84 },
    ],
  },
];

export const recentDays = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 55 },
  { day: "Wed", value: 36 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 61 },
  { day: "Sat", value: 44 },
  { day: "Sun", value: 49 },
];

export type SavedStressState = {
  answers: Record<string, number>;
  lastSavedAt?: number;
};

export const emptyStressState: SavedStressState = {
  answers: {},
};
