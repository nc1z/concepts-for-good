export type AnchorPoint = {
  id: string;
  label: string;
  coordinates: [number, number];
};

export type ToiletSpot = {
  id: string;
  name: string;
  area: string;
  coordinates: [number, number];
  overall: number;
  cleanliness: number;
  access: number;
  changing: number;
  openNow: boolean;
  hours: string;
  lastChecked: string;
  bestFor: string[];
  notes: string[];
  tags: string[];
};

export type FilterKey = "clean" | "changing" | "wide" | "open";

export type FilterOption = {
  key: FilterKey;
  label: string;
  description: string;
};

export const singaporeOutline = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Singapore" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.595, 1.298],
            [103.63, 1.22],
            [103.705, 1.18],
            [103.79, 1.152],
            [103.885, 1.166],
            [103.975, 1.198],
            [104.038, 1.25],
            [104.054, 1.325],
            [104.038, 1.39],
            [103.986, 1.444],
            [103.895, 1.484],
            [103.79, 1.478],
            [103.695, 1.446],
            [103.63, 1.39],
            [103.597, 1.33],
            [103.595, 1.298],
          ],
        ],
      },
    },
  ],
} as const;

export const anchorPoints: AnchorPoint[] = [
  {
    id: "city-hall",
    label: "City Hall",
    coordinates: [103.851959, 1.292788],
  },
  {
    id: "jurong-east",
    label: "Jurong East",
    coordinates: [103.743, 1.333],
  },
  {
    id: "tampines",
    label: "Tampines",
    coordinates: [103.945, 1.354],
  },
  {
    id: "woodlands",
    label: "Woodlands",
    coordinates: [103.7865, 1.436],
  },
];

export const filterOptions: FilterOption[] = [
  {
    key: "clean",
    label: "Clean",
    description: "Recently checked and tidy",
  },
  {
    key: "changing",
    label: "Changing table",
    description: "Family-changing facilities available",
  },
  {
    key: "wide",
    label: "Wide cubicle",
    description: "Roomier access for wheelchairs and strollers",
  },
  {
    key: "open",
    label: "Open now",
    description: "Currently available for use",
  },
];

export const toiletSpots: ToiletSpot[] = [
  {
    id: "capitol-place",
    name: "Capitol Place",
    area: "City Hall",
    coordinates: [103.851, 1.2928],
    overall: 96,
    cleanliness: 96,
    access: 94,
    changing: 98,
    openNow: true,
    hours: "Open daily, 7am to 10pm",
    lastChecked: "Checked this morning",
    bestFor: ["Wheelchairs", "Families", "Long visits"],
    notes: [
      "Adult-changing bench on level 2 family toilet.",
      "Wide cubicle near the lift lobby, with a quiet waiting spot outside.",
    ],
    tags: ["City centre", "Family-friendly", "Very reliable"],
  },
  {
    id: "jurong-westgate",
    name: "Westgate Link",
    area: "Jurong East",
    coordinates: [103.7425, 1.3345],
    overall: 91,
    cleanliness: 89,
    access: 92,
    changing: 93,
    openNow: true,
    hours: "Open daily, 8am to 10pm",
    lastChecked: "Checked yesterday",
    bestFor: ["Wheelchairs", "Strollers", "Errands"],
    notes: [
      "Reliable step-free access from the main lift bank.",
      "Family cubicle includes a changing table and grab bars.",
    ],
    tags: ["West side", "Mall access", "Family cubicle"],
  },
  {
    id: "tampines-hub",
    name: "Tampines Hub",
    area: "Tampines",
    coordinates: [103.9445, 1.3541],
    overall: 88,
    cleanliness: 87,
    access: 90,
    changing: 85,
    openNow: true,
    hours: "Open daily, 7am to 11pm",
    lastChecked: "Checked this morning",
    bestFor: ["Wheelchairs", "After school stops", "Group visits"],
    notes: [
      "Clearly signed accessible toilet beside the community plaza.",
      "Plenty of room to turn, even with a stroller or luggage trolley.",
    ],
    tags: ["East side", "Community hub", "Room to move"],
  },
  {
    id: "woodlands-centre",
    name: "Woodlands Civic Centre",
    area: "Woodlands",
    coordinates: [103.786, 1.4362],
    overall: 84,
    cleanliness: 84,
    access: 86,
    changing: 82,
    openNow: true,
    hours: "Open daily, 8am to 9pm",
    lastChecked: "Checked this afternoon",
    bestFor: ["Wheelchairs", "Rail commuters", "Quick stops"],
    notes: [
      "Lift lobby is close to the accessible toilet and easy to spot.",
      "Good grab bars and a steady door closer make it simple to use.",
    ],
    tags: ["North side", "Transit stop", "Easy to reach"],
  },
  {
    id: "paya-lebar-quarter",
    name: "PLQ Shared Facilities",
    area: "Paya Lebar",
    coordinates: [103.8938, 1.3178],
    overall: 80,
    cleanliness: 81,
    access: 79,
    changing: 78,
    openNow: false,
    hours: "Open daily, 10am to 10pm",
    lastChecked: "Checked yesterday",
    bestFor: ["Office hours", "Short visits", "Families"],
    notes: [
      "Best when the mall is quiet; the family toilet can queue at lunch.",
      "Changing table is present, but the cubicle is narrower than the others.",
    ],
    tags: ["East-central", "Office district", "Popular"],
  },
  {
    id: "bukit-merah-point",
    name: "Alexandra Point",
    area: "Bukit Merah",
    coordinates: [103.817, 1.278],
    overall: 73,
    cleanliness: 74,
    access: 72,
    changing: 69,
    openNow: true,
    hours: "Open daily, 9am to 9pm",
    lastChecked: "Checked today",
    bestFor: ["Short errands", "Nearby residents", "Quick visits"],
    notes: [
      "Usable and clean, though the changing corner is smaller than average.",
      "Worth a check if you are already nearby, especially for a short stop.",
    ],
    tags: ["South side", "Neighbourhood stop", "Smaller space"],
  },
];

export function haversineDistanceKm(
  from: [number, number],
  to: [number, number],
): number {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const deltaLat = toRadians(to[1] - from[1]);
  const deltaLon = toRadians(to[0] - from[0]);
  const lat1 = toRadians(from[1]);
  const lat2 = toRadians(to[1]);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

