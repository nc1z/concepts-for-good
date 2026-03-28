export type Destination = {
  id: string;
  name: string;
  zone: string;
  routeLabel: string;
  notes: string[];
  path: string;
  point: { x: number; y: number };
};

export const destinations: Destination[] = [
  {
    id: "clinic",
    name: "Family Clinic",
    zone: "Level 2",
    routeLabel: "Lift lobby A to clinic entrance",
    notes: [
      "Start from Lift Lobby A on Level 1 and take the wide lift to Level 2.",
      "Turn left after the lift. The path stays stairs-free all the way.",
      "Automatic door available at the clinic entrance.",
    ],
    path: "M82 278 C100 252 122 232 148 212 C170 194 206 176 236 166 C270 154 302 142 334 126",
    point: { x: 334, y: 126 },
  },
  {
    id: "food-court",
    name: "Food Court",
    zone: "Level 3",
    routeLabel: "Central lift to dining hall",
    notes: [
      "Use the central lift beside the information counter.",
      "After exiting on Level 3, keep to the broad corridor on the right.",
      "Accessible seating is beside the drink stall near the entrance.",
    ],
    path: "M82 278 C114 246 144 220 182 196 C210 178 248 160 282 150 C322 138 356 130 384 118",
    point: { x: 384, y: 118 },
  },
  {
    id: "supermarket",
    name: "Supermarket",
    zone: "Basement 1",
    routeLabel: "Ramp route from taxi stand",
    notes: [
      "Enter from the taxi stand and follow the gentle ramp down to Basement 1.",
      "The supermarket entrance has a wider gate beside the checkout queue.",
      "Accessible toilet is on the same level near the customer service counter.",
    ],
    path: "M82 278 C122 296 154 312 188 322 C230 334 276 334 318 324 C352 316 378 306 392 294",
    point: { x: 392, y: 294 },
  },
];

export const STORAGE_KEY = "cfg-accessible-mall-route-sg-v1";
