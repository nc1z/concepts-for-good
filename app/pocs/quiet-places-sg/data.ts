export type QuietPlace = {
  id: string;
  name: string;
  area: string;
  type: string;
  summary: string;
  bestTime: string;
  note: string;
  quietness: number;
  noise: number;
  crowd: number;
  light: number;
  tags: string[];
};

export const quietPlaces: QuietPlace[] = [
  {
    id: "botanic-gardens-edge",
    name: "Singapore Botanic Gardens, Learning Forest Edge",
    area: "Tanglin",
    type: "Garden walk",
    summary: "Open paths, soft shade, and enough space to slow down without feeling crowded.",
    bestTime: "Early morning",
    note: "Best for a slow walk or a quiet pause with trees around you.",
    quietness: 88,
    noise: 16,
    crowd: 18,
    light: 20,
    tags: ["Garden", "Walk", "Shaded"],
  },
  {
    id: "bishan-reading-deck",
    name: "Bishan-Ang Mo Kio Park Reading Deck",
    area: "Bishan",
    type: "Park nook",
    summary: "A low-traffic spot with water views and enough stillness to read or wait in peace.",
    bestTime: "Late morning",
    note: "Feels especially calm when the footpaths are quiet and the sun is softer.",
    quietness: 84,
    noise: 20,
    crowd: 22,
    light: 28,
    tags: ["Park", "Reading", "Open"],
  },
  {
    id: "tampines-library",
    name: "Tampines Regional Library",
    area: "Tampines",
    type: "Library",
    summary: "Wide tables, soft corners, and a steady indoor feel for longer stays.",
    bestTime: "Weekday afternoon",
    note: "Good when you want a quieter indoor place with room to settle in.",
    quietness: 80,
    noise: 22,
    crowd: 24,
    light: 24,
    tags: ["Library", "Study", "Indoor"],
  },
  {
    id: "jurong-lake-gardens",
    name: "Jurong Lake Gardens, Lakeside Promenade",
    area: "Jurong East",
    type: "Waterfront walk",
    summary: "A broad path with a gentle pace, light breeze, and space to move without hurry.",
    bestTime: "Before sunset",
    note: "The walkway stays calmest when the evening crowd has not built up yet.",
    quietness: 77,
    noise: 24,
    crowd: 26,
    light: 30,
    tags: ["Waterfront", "Walk", "Outdoor"],
  },
  {
    id: "punggol-shelter",
    name: "Punggol Waterway Park Shelter",
    area: "Punggol",
    type: "Sheltered rest spot",
    summary: "Covered seating with a steady outlook and less sensory load than the nearby paths.",
    bestTime: "After lunch",
    note: "A good stop when you want shade, air, and a place to sit without bustle.",
    quietness: 74,
    noise: 25,
    crowd: 20,
    light: 33,
    tags: ["Shelter", "Rest", "Park"],
  },
  {
    id: "tiong-bahru-backlane",
    name: "Tiong Bahru Estate Back Lane Walk",
    area: "Tiong Bahru",
    type: "Neighbourhood walk",
    summary: "A quieter route behind the main streets, especially before the lunch crowd arrives.",
    bestTime: "Morning",
    note: "Less traffic than the main stretch, with a slower neighbourhood rhythm.",
    quietness: 71,
    noise: 28,
    crowd: 23,
    light: 38,
    tags: ["Neighbourhood", "Walk", "Quiet route"],
  },
  {
    id: "woodlands-community-corner",
    name: "Woodlands Community Centre Quiet Corner",
    area: "Woodlands",
    type: "Indoor corner",
    summary: "A tucked-away corner for waiting, meeting, or taking a break from busy streets.",
    bestTime: "Mid-afternoon",
    note: "Good when you need a soft indoor place with less passing movement.",
    quietness: 68,
    noise: 30,
    crowd: 21,
    light: 34,
    tags: ["Community centre", "Waiting", "Indoor"],
  },
];
