export const STORAGE_KEY = "cfg-taxi-gap-watch-sg";

export type TaxiZone = {
  id: string;
  name: string;
  catchment: string;
  riderNote: string;
  weight: number;
  curve: number[];
};

export type ForecastPoint = {
  label: string;
  offsetMinutes: number;
  count: number;
  density: number;
  risk: "steady" | "watch" | "tight";
};

export type ZoneForecast = TaxiZone & {
  currentCount: number;
  status: "steady" | "watch" | "tight";
  windows: ForecastPoint[];
};

export const zones: TaxiZone[] = [
  {
    id: "central",
    name: "Central hospitals",
    catchment: "Novena, Orchard, Bugis",
    riderNote: "Best for clinic pickups, hospital discharges, and transfers home.",
    weight: 0.27,
    curve: [1, 0.94, 0.82, 0.71, 0.63, 0.58],
  },
  {
    id: "east",
    name: "East shift change",
    catchment: "Bedok, Tampines, Pasir Ris",
    riderNote: "Useful when a late shift is ending and buses are thinning out.",
    weight: 0.21,
    curve: [1, 0.97, 0.88, 0.78, 0.69, 0.6],
  },
  {
    id: "north",
    name: "North estates",
    catchment: "Yishun, Woodlands, Sembawang",
    riderNote: "Often holds a little longer before queues get difficult.",
    weight: 0.18,
    curve: [1, 0.98, 0.9, 0.82, 0.74, 0.67],
  },
  {
    id: "north-east",
    name: "North-East homes",
    catchment: "Hougang, Sengkang, Punggol",
    riderNote: "Watch this lane after 10pm when handover traffic starts stacking up.",
    weight: 0.19,
    curve: [1, 0.91, 0.78, 0.66, 0.58, 0.5],
  },
  {
    id: "west",
    name: "West return trip",
    catchment: "Jurong, Clementi, Bukit Batok",
    riderNote: "Longer rides are still possible, but the safe window closes quickly.",
    weight: 0.15,
    curve: [1, 0.89, 0.76, 0.64, 0.55, 0.47],
  },
];

export function formatTimestamp(isoString: string) {
  return new Date(isoString).toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getHourPressure(date: Date) {
  const hour = date.getHours();

  if (hour >= 22 || hour < 1) return 0.88;
  if (hour >= 19) return 0.98;
  if (hour >= 6 && hour < 9) return 0.95;
  return 1.06;
}

function getRisk(density: number): ForecastPoint["risk"] {
  if (density >= 1.2) return "steady";
  if (density >= 0.82) return "watch";
  return "tight";
}

function getStatus(windows: ForecastPoint[]): ZoneForecast["status"] {
  const first = windows[0];
  const tightCount = windows.filter((window) => window.risk === "tight").length;

  if (first.risk === "tight" || tightCount >= 3) return "tight";
  if (first.risk === "watch" || tightCount >= 1) return "watch";
  return "steady";
}

export function buildZoneForecasts(totalCount: number, timestamp: string): ZoneForecast[] {
  const date = new Date(timestamp);
  const pressure = getHourPressure(date);
  const baseCount = clamp(totalCount, 1800, 4200);

  return zones.map((zone, zoneIndex) => {
    const currentCount = Math.round(baseCount * zone.weight * pressure);
    const windows = zone.curve.map((curvePoint, index) => {
      const nextDate = new Date(date.getTime() + index * 15 * 60 * 1000);
      const count = Math.round(
        currentCount * curvePoint * (1 - zoneIndex * 0.018 + (index % 2 === 0 ? 0.02 : -0.015)),
      );
      const density = Number((count / 180).toFixed(2));

      return {
        label: formatTimestamp(nextDate.toISOString()),
        offsetMinutes: index * 15,
        count,
        density,
        risk: getRisk(density),
      };
    });

    return {
      ...zone,
      currentCount,
      status: getStatus(windows),
      windows,
    };
  });
}

export function getTravelGuidance(zone: ZoneForecast) {
  const [nowWindow, soonWindow, laterWindow] = zone.windows;

  if (laterWindow.risk === "tight") {
    return {
      headline: `Best to leave before ${soonWindow.label}`,
      detail: `Supply around ${zone.catchment} is fading. If you can move in the next ${soonWindow.offsetMinutes} minutes, you avoid the steepest drop.`,
    };
  }

  if (nowWindow.risk === "tight") {
    return {
      headline: "Try a brighter pickup area",
      detail: `This lane is already thin. Ask to be picked up near a main road or choose a closer fallback before waiting starts to grow.`,
    };
  }

  return {
    headline: `The next ${laterWindow.offsetMinutes} minutes still look workable`,
    detail: `Supply is holding for now. Keep this area if you are leaving soon, but watch the strip if your trip slips later.`,
  };
}
