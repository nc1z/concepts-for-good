export type ZoneId = "central" | "east" | "north" | "west";

export type ZoneOption = {
  id: ZoneId;
  label: string;
  multiplier: number;
  color: string;
};

export const ZONES: ZoneOption[] = [
  { id: "central", label: "Central", multiplier: 1.08, color: "#ffd166" },
  { id: "east", label: "East", multiplier: 0.97, color: "#79c8ff" },
  { id: "north", label: "North", multiplier: 0.9, color: "#9effbc" },
  { id: "west", label: "West", multiplier: 0.95, color: "#f6a6ff" },
];

export type TaxiWindow = {
  id: string;
  label: string;
  minutesFromNow: number;
  count: number;
  trend: "rising" | "steady" | "thinning";
};

function trendFromChange(change: number): TaxiWindow["trend"] {
  if (change > 45) return "rising";
  if (change < -45) return "thinning";
  return "steady";
}

export function buildRoundWindows(
  baselineCount: number,
  zoneMultiplier: number,
  round: number
): TaxiWindow[] {
  const adjusted = Math.max(900, Math.round(baselineCount * zoneMultiplier));
  const rhythm = Math.sin((round + 1) * 1.22) * 120;
  const pressure = Math.cos((round + 2) * 0.85) * 85;

  const windows = [
    { id: "now", label: "Leave now", minutesFromNow: 0, shift: rhythm - 60 + pressure * 0.4 },
    { id: "soon", label: "Wait 20 min", minutesFromNow: 20, shift: rhythm + 70 - pressure * 0.25 },
    { id: "later", label: "Wait 40 min", minutesFromNow: 40, shift: rhythm - 20 + pressure * 0.9 },
  ];

  return windows.map((window) => {
    const count = Math.max(120, Math.round(adjusted + window.shift));
    return {
      id: window.id,
      label: window.label,
      minutesFromNow: window.minutesFromNow,
      count,
      trend: trendFromChange(window.shift),
    };
  });
}

export type ScorePoint = {
  round: number;
  chosen: number;
  best: number;
};
