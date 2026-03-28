export type Destination = {
  id: string;
  label: string;
  shortLabel: string;
};

export type Carpark = {
  id: string;
  name: string;
  address: string;
  totalLots: number;
  freeLots: number;
  walkMinutes: number;
  destinationId: string;
  x: number; // SVG canvas position 0–100
  y: number;
};

export const destinations: Destination[] = [
  { id: "ttsh", label: "Tan Tock Seng Hospital", shortLabel: "TTSH" },
  { id: "sgh", label: "SGH / Outram", shortLabel: "SGH" },
  { id: "amk", label: "Ang Mo Kio Polyclinic", shortLabel: "AMK Hub" },
  { id: "bedok", label: "Bedok Interchange", shortLabel: "Bedok" },
];

export const carparks: Carpark[] = [
  // --- TTSH / Novena area ---
  {
    id: "TTSH-CP1",
    name: "Tan Tock Seng CP 13A",
    address: "11 Jln Tan Tock Seng, S308433",
    totalLots: 240,
    freeLots: 52,
    walkMinutes: 3,
    destinationId: "ttsh",
    x: 38,
    y: 42,
  },
  {
    id: "TTSH-CP2",
    name: "Novena Square Carpark B",
    address: "238 Thomson Rd, S307683",
    totalLots: 180,
    freeLots: 18,
    walkMinutes: 6,
    destinationId: "ttsh",
    x: 62,
    y: 30,
  },
  {
    id: "TTSH-CP3",
    name: "Velocity @ Novena Square CP",
    address: "201 Thomson Rd, S307640",
    totalLots: 300,
    freeLots: 7,
    walkMinutes: 8,
    destinationId: "ttsh",
    x: 72,
    y: 60,
  },
  // --- SGH / Outram ---
  {
    id: "SGH-CP1",
    name: "SGH Block 6 Carpark",
    address: "1 Hospital Dr, S169608",
    totalLots: 200,
    freeLots: 43,
    walkMinutes: 2,
    destinationId: "sgh",
    x: 35,
    y: 38,
  },
  {
    id: "SGH-CP2",
    name: "Outram Park CP A",
    address: "3 Outram Rd, S169644",
    totalLots: 120,
    freeLots: 15,
    walkMinutes: 5,
    destinationId: "sgh",
    x: 65,
    y: 55,
  },
  // --- Ang Mo Kio Hub ---
  {
    id: "AMK-CP1",
    name: "AMK Hub Carpark Level 4",
    address: "53 Ang Mo Kio Ave 3, S569933",
    totalLots: 250,
    freeLots: 64,
    walkMinutes: 2,
    destinationId: "amk",
    x: 42,
    y: 35,
  },
  {
    id: "AMK-CP2",
    name: "Ang Mo Kio Polyclinic CP",
    address: "21 Ang Mo Kio Central 2, S569666",
    totalLots: 80,
    freeLots: 11,
    walkMinutes: 4,
    destinationId: "amk",
    x: 58,
    y: 52,
  },
  {
    id: "AMK-CP3",
    name: "Kebun Baru Carpark 14",
    address: "Ang Mo Kio Ave 10, S569750",
    totalLots: 140,
    freeLots: 38,
    walkMinutes: 7,
    destinationId: "amk",
    x: 25,
    y: 62,
  },
  // --- Bedok Interchange ---
  {
    id: "BDK-CP1",
    name: "Bedok North CP 72A",
    address: "216 Bedok North St 1, S460216",
    totalLots: 160,
    freeLots: 5,
    walkMinutes: 4,
    destinationId: "bedok",
    x: 40,
    y: 40,
  },
  {
    id: "BDK-CP2",
    name: "Bedok Interchange CP B",
    address: "311 New Upper Changi Rd, S467360",
    totalLots: 200,
    freeLots: 29,
    walkMinutes: 3,
    destinationId: "bedok",
    x: 68,
    y: 48,
  },
];

export function getAvailabilityTier(freeLots: number): "green" | "amber" | "red" {
  if (freeLots >= 30) return "green";
  if (freeLots >= 10) return "amber";
  return "red";
}

export function refreshCarparks(current: Carpark[]): Carpark[] {
  return current.map((cp) => {
    const delta = Math.floor(Math.random() * 11) - 5;
    const next = Math.max(0, Math.min(cp.totalLots, cp.freeLots + delta));
    return { ...cp, freeLots: next };
  });
}
