export type OutingOption = {
  id: string;
  name: string;
  area: string;
  bestTime: string;
  summary: string;
  steps: string[];
  energyNeed: number;
  heatExposure: number;
  walkingNeed: number;
};

export const outingOptions: OutingOption[] = [
  {
    id: "garden-loop",
    name: "Bishan Garden Walk",
    area: "Bishan-Ang Mo Kio Park",
    bestTime: "8:30 am",
    summary: "Easy riverside loop with many shaded benches.",
    steps: ["Bring a hat", "Stop at the first bench after 12 minutes", "Finish with kopi nearby"],
    energyNeed: 44,
    heatExposure: 36,
    walkingNeed: 38,
  },
  {
    id: "library-morning",
    name: "Library and Lunch",
    area: "Toa Payoh Regional Library",
    bestTime: "11:00 am",
    summary: "Cool indoor stop with short lifts and quiet seating.",
    steps: ["Pick one reading corner", "Take a 15 minute tea break", "Lunch at level one food court"],
    energyNeed: 28,
    heatExposure: 12,
    walkingNeed: 18,
  },
  {
    id: "void-deck-chat",
    name: "Void Deck Meet-up",
    area: "Tampines Block 266",
    bestTime: "5:30 pm",
    summary: "Neighbourhood chat session with little walking.",
    steps: ["Sit near fan corner", "Keep water nearby", "Head home before evening crowd"],
    energyNeed: 20,
    heatExposure: 24,
    walkingNeed: 14,
  },
  {
    id: "market-breakfast",
    name: "Market Breakfast",
    area: "Tiong Bahru Market",
    bestTime: "7:45 am",
    summary: "Short market stroll with sheltered seating upstairs.",
    steps: ["Use lift near carpark", "Choose a table before ordering", "Rest 10 minutes before heading back"],
    energyNeed: 36,
    heatExposure: 30,
    walkingNeed: 26,
  },
  {
    id: "museum-hour",
    name: "Museum Slow Hour",
    area: "National Museum",
    bestTime: "2:00 pm",
    summary: "Air-conditioned galleries with frequent sitting spots.",
    steps: ["Start on one floor only", "Pause between each room", "Taxi stand right outside exit"],
    energyNeed: 33,
    heatExposure: 10,
    walkingNeed: 30,
  },
];

