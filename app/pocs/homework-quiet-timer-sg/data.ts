export const STORAGE_KEY = "cfg-homework-quiet-timer-sg-v1";

export type Subject = {
  id: string;
  label: string;
  benefit: string;
  accent: string;
  glow: string;
  surface: string;
  focusPrompts: [string, string, string];
  breakPrompts: [string, string];
};

export type WaveStep = {
  id: string;
  kind: "focus" | "break";
  label: string;
  title: string;
  prompt: string;
  durationSeconds: number;
};

export type SessionState = {
  subjectId: string;
  activeStep: number;
  secondsLeft: number;
  isRunning: boolean;
  finished: boolean;
  completedFocusSets: number;
};

export const subjects: Subject[] = [
  {
    id: "english",
    label: "English",
    benefit: "Settle into reading or one short writing task.",
    accent: "#ef8d73",
    glow: "rgba(239, 141, 115, 0.34)",
    surface: "linear-gradient(160deg, #fff5ec 0%, #ffe0d3 100%)",
    focusPrompts: [
      "Read the first paragraph out softly, then keep going line by line.",
      "Stay with one question. Finish that before you look up again.",
      "Wrap the last line neatly and stop while the pace still feels good.",
    ],
    breakPrompts: [
      "Look out the window and loosen your fingers.",
      "Take two slow breaths before the next page.",
    ],
  },
  {
    id: "maths",
    label: "Maths",
    benefit: "Work through one manageable problem set without rushing.",
    accent: "#708fee",
    glow: "rgba(112, 143, 238, 0.34)",
    surface: "linear-gradient(160deg, #eef3ff 0%, #dbe5ff 100%)",
    focusPrompts: [
      "Start with the easiest sum so the page feels less heavy.",
      "Keep your eyes on the next working line only.",
      "Check one answer carefully, then close the book for a moment.",
    ],
    breakPrompts: [
      "Stretch your shoulders and blink away the numbers.",
      "Sip water, then come back to the next step.",
    ],
  },
  {
    id: "science",
    label: "Science",
    benefit: "Finish one short review burst before attention drifts.",
    accent: "#75b48d",
    glow: "rgba(117, 180, 141, 0.35)",
    surface: "linear-gradient(160deg, #edf9f1 0%, #d9efe0 100%)",
    focusPrompts: [
      "Read one idea slowly and underline the part that matters most.",
      "Keep your notes to one sentence at a time.",
      "Say the key fact once out loud, then let the set end there.",
    ],
    breakPrompts: [
      "Rest your eyes on something far away for a few seconds.",
      "Shake out your hands and soften your jaw.",
    ],
  },
];

export function buildWaveSteps(subject: Subject): WaveStep[] {
  return [
    {
      id: `${subject.id}-focus-1`,
      kind: "focus",
      label: "First quiet burst",
      title: `${subject.label} starts small`,
      prompt: subject.focusPrompts[0],
      durationSeconds: 75,
    },
    {
      id: `${subject.id}-break-1`,
      kind: "break",
      label: "Short breath",
      title: "Let the room soften",
      prompt: subject.breakPrompts[0],
      durationSeconds: 20,
    },
    {
      id: `${subject.id}-focus-2`,
      kind: "focus",
      label: "Second quiet burst",
      title: `Stay with the next ${subject.label.toLowerCase()} step`,
      prompt: subject.focusPrompts[1],
      durationSeconds: 75,
    },
    {
      id: `${subject.id}-break-2`,
      kind: "break",
      label: "Another short pause",
      title: "Make room for the last stretch",
      prompt: subject.breakPrompts[1],
      durationSeconds: 20,
    },
    {
      id: `${subject.id}-focus-3`,
      kind: "focus",
      label: "Final quiet burst",
      title: "Finish while the pace still feels calm",
      prompt: subject.focusPrompts[2],
      durationSeconds: 60,
    },
  ];
}

const firstSubject = subjects[0];
const firstSteps = buildWaveSteps(firstSubject);

export const defaultState: SessionState = {
  subjectId: firstSubject.id,
  activeStep: 0,
  secondsLeft: firstSteps[0].durationSeconds,
  isRunning: false,
  finished: false,
  completedFocusSets: 0,
};
