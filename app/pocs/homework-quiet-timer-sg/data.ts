export type TimerSession = {
  id: string;
  duration: number; // in minutes
  type: "focus" | "break";
  completed: boolean;
  completedAt?: string;
};

export type ChildProfile = {
  id: string;
  name: string;
  color: string;
  defaultFocusDuration: number;
  defaultBreakDuration: number;
};

export const defaultProfiles: ChildProfile[] = [
  {
    id: "primary",
    name: "Your session",
    color: "#E8B4B8",
    defaultFocusDuration: 20,
    defaultBreakDuration: 5,
  },
];

export const sessionHistory: TimerSession[] = [
  {
    id: "demo-1",
    duration: 20,
    type: "focus",
    completed: true,
    completedAt: "2026-03-30T10:00:00+08:00",
  },
  {
    id: "demo-2",
    duration: 5,
    type: "break",
    completed: true,
    completedAt: "2026-03-30T10:25:00+08:00",
  },
];

export const focusDurationOptions = [
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 20, label: "20 min" },
  { value: 25, label: "25 min" },
  { value: 30, label: "30 min" },
];

export const breakDurationOptions = [
  { value: 3, label: "3 min" },
  { value: 5, label: "5 min" },
  { value: 7, label: "7 min" },
  { value: 10, label: "10 min" },
];
