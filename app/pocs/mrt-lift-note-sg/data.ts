export type LiftStatus = "working" | "maintenance" | "out";

export type LineId = "north-south" | "circle";

export type Station = {
  id: string;
  name: string;
  lines: LineId[];
  lineLabel: string;
  zone: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  labelAnchor: "start" | "middle" | "end";
  status: LiftStatus;
  exit: string;
  bestAlternative: string;
  lastChecked: string;
  summary: string;
  notes: string[];
};

export const lineMeta: Record<LineId, { label: string; color: string; soft: string }> = {
  "north-south": {
    label: "North-South Line",
    color: "#59f0c5",
    soft: "rgba(89, 240, 197, 0.12)",
  },
  circle: {
    label: "Circle Line",
    color: "#ffbf66",
    soft: "rgba(255, 191, 102, 0.12)",
  },
};

export const statusMeta: Record<LiftStatus, { label: string; color: string; soft: string }> = {
  working: {
    label: "Working",
    color: "#59f0c5",
    soft: "rgba(89, 240, 197, 0.12)",
  },
  maintenance: {
    label: "Under maintenance",
    color: "#ffbf66",
    soft: "rgba(255, 191, 102, 0.12)",
  },
  out: {
    label: "Out of service",
    color: "#ff7d73",
    soft: "rgba(255, 125, 115, 0.12)",
  },
};

export const linePaths: Record<LineId, string> = {
  "north-south": "M 260 70 L 260 510",
  circle:
    "M 260 310 C 304 228 366 156 470 130 C 592 98 705 184 726 300 C 745 414 664 484 560 445 C 470 410 380 392 260 310",
};

export const stations: Station[] = [
  {
    id: "woodlands",
    name: "Woodlands",
    lines: ["north-south"],
    lineLabel: "North-South Line",
    zone: "Woodlands",
    x: 260,
    y: 90,
    labelX: 228,
    labelY: 94,
    labelAnchor: "end",
    status: "working",
    exit: "Exit B",
    bestAlternative: "Yishun",
    lastChecked: "8:10 am",
    summary: "Lift access is steady at Exit B.",
    notes: [
      "The sheltered approach from the bus stop stays easy.",
      "Use Exit B for the smoothest boarding route.",
    ],
  },
  {
    id: "yishun",
    name: "Yishun",
    lines: ["north-south"],
    lineLabel: "North-South Line",
    zone: "Yishun",
    x: 260,
    y: 160,
    labelX: 228,
    labelY: 164,
    labelAnchor: "end",
    status: "maintenance",
    exit: "Exit A",
    bestAlternative: "Woodlands",
    lastChecked: "8:25 am",
    summary: "One lift is being checked today.",
    notes: [
      "Exit A remains open, but expect a slower transfer.",
      "If you can reroute, Woodlands is the smoother stop.",
    ],
  },
  {
    id: "newton",
    name: "Newton",
    lines: ["north-south"],
    lineLabel: "North-South Line",
    zone: "Newton",
    x: 260,
    y: 240,
    labelX: 228,
    labelY: 244,
    labelAnchor: "end",
    status: "working",
    exit: "Exit C",
    bestAlternative: "Dhoby Ghaut",
    lastChecked: "8:35 am",
    summary: "Lift access is steady at Exit C.",
    notes: [
      "The lift lands close to the sheltered walkway.",
      "This is a good stop for a direct transfer.",
    ],
  },
  {
    id: "dhoby-ghaut",
    name: "Dhoby Ghaut",
    lines: ["north-south", "circle"],
    lineLabel: "North-South Line / Circle Line",
    zone: "Dhoby Ghaut",
    x: 260,
    y: 310,
    labelX: 288,
    labelY: 314,
    labelAnchor: "start",
    status: "working",
    exit: "Exit E",
    bestAlternative: "Newton",
    lastChecked: "8:40 am",
    summary: "The transfer lift is open and easy to reach.",
    notes: [
      "This is the easiest interchange on the map today.",
      "Exit E keeps the transfer short and sheltered.",
    ],
  },
  {
    id: "marina-bay",
    name: "Marina Bay",
    lines: ["north-south"],
    lineLabel: "North-South Line",
    zone: "Marina Bay",
    x: 260,
    y: 430,
    labelX: 228,
    labelY: 434,
    labelAnchor: "end",
    status: "out",
    exit: "Exit D",
    bestAlternative: "Promenade",
    lastChecked: "8:50 am",
    summary: "A lift is not running right now.",
    notes: [
      "Use the promenade side if your trip can start there instead.",
      "Staff are guiding riders to the working lifts.",
    ],
  },
  {
    id: "promenade",
    name: "Promenade",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "Promenade",
    x: 365,
    y: 190,
    labelX: 393,
    labelY: 194,
    labelAnchor: "start",
    status: "maintenance",
    exit: "Exit A",
    bestAlternative: "Dhoby Ghaut",
    lastChecked: "8:15 am",
    summary: "One lift is being checked today.",
    notes: [
      "The main route still works, but allow extra time.",
      "Dhoby Ghaut is the smoother choice if you want less walking.",
    ],
  },
  {
    id: "botanic-gardens",
    name: "Botanic Gardens",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "Botanic Gardens",
    x: 470,
    y: 130,
    labelX: 498,
    labelY: 134,
    labelAnchor: "start",
    status: "working",
    exit: "Exit B",
    bestAlternative: "Promenade",
    lastChecked: "8:20 am",
    summary: "Lift access is steady at Exit B.",
    notes: [
      "A good stop for the garden gates and sheltered paths.",
      "The lift lands near the quieter exit.",
    ],
  },
  {
    id: "paya-lebar",
    name: "Paya Lebar",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "Paya Lebar",
    x: 610,
    y: 180,
    labelX: 638,
    labelY: 184,
    labelAnchor: "start",
    status: "working",
    exit: "Exit C",
    bestAlternative: "Bishan",
    lastChecked: "8:05 am",
    summary: "Lift access is steady at Exit C.",
    notes: [
      "The transfer route stays smooth through the sheltered concourse.",
      "Use Exit C for the shortest lift run.",
    ],
  },
  {
    id: "bishan",
    name: "Bishan",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "Bishan",
    x: 700,
    y: 300,
    labelX: 728,
    labelY: 304,
    labelAnchor: "start",
    status: "working",
    exit: "Exit C",
    bestAlternative: "Paya Lebar",
    lastChecked: "8:30 am",
    summary: "Lift access is steady at Exit C.",
    notes: [
      "This stop stays reliable for the sheltered connection.",
      "A good option for a direct eastbound transfer.",
    ],
  },
  {
    id: "harbourfront",
    name: "HarbourFront",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "HarbourFront",
    x: 560,
    y: 445,
    labelX: 588,
    labelY: 449,
    labelAnchor: "start",
    status: "working",
    exit: "Exit A",
    bestAlternative: "Buona Vista",
    lastChecked: "8:45 am",
    summary: "Lift access is steady at Exit A.",
    notes: [
      "Good for the ferry link and sheltered walkways.",
      "Exit A gives the clearest route through the concourse.",
    ],
  },
  {
    id: "buona-vista",
    name: "Buona Vista",
    lines: ["circle"],
    lineLabel: "Circle Line",
    zone: "Buona Vista",
    x: 470,
    y: 445,
    labelX: 498,
    labelY: 449,
    labelAnchor: "start",
    status: "out",
    exit: "Exit B",
    bestAlternative: "HarbourFront",
    lastChecked: "8:55 am",
    summary: "One lift is not running right now.",
    notes: [
      "If you can, use HarbourFront for a smoother start.",
      "The working lift still helps, but the route takes longer.",
    ],
  },
];

export const defaultStationId = "promenade";
