export type Cause = {
  id: string;
  title: string;
  area: string;
  time: string;
  summary: string;
  impact: string;
  needs: string[];
  accent: string;
};

export const causes: Cause[] = [
  {
    id: "dinner-shift",
    title: "Community Dinner Shift",
    area: "Bedok",
    time: "Tue, 6:30 pm",
    summary: "Plate meals, greet guests, and keep the table flow moving after dinner.",
    impact: "A calm shift helps the room feel welcoming from the first tray to the last.",
    needs: ["Serving", "Conversation", "Setup"],
    accent: "#1f7a67",
  },
  {
    id: "digital-help",
    title: "Digital Help Corner",
    area: "Toa Payoh",
    time: "Sat, 10:00 am",
    summary: "Guide older adults through bills, app logins, QR scans, and simple phone tasks.",
    impact: "A few patient minutes can turn a stuck screen into a finished errand.",
    needs: ["Tech support", "Patience", "Writing"],
    accent: "#2d5d9a",
  },
  {
    id: "reading-buddy",
    title: "Reading Buddy",
    area: "Jurong West",
    time: "Wed, 3:00 pm",
    summary: "Read aloud, talk through the pages, and help with a little homework support.",
    impact: "Regular reading time gives children a steady voice and a safe place to ask questions.",
    needs: ["Teaching", "Conversation", "Storytelling"],
    accent: "#9b4e72",
  },
  {
    id: "pantry-sorting",
    title: "Pantry Sorting",
    area: "Ang Mo Kio",
    time: "Fri, 7:00 pm",
    summary: "Sort donations, label shelves, and prepare the next round of take-home packs.",
    impact: "The pantry runs smoother when the most-needed items are ready to reach families quickly.",
    needs: ["Sorting", "Packing", "Coordination"],
    accent: "#8a6a25",
  },
  {
    id: "walk-support",
    title: "Walk Along Support",
    area: "Bishan",
    time: "Sat, 8:00 am",
    summary: "Walk with seniors on a short route and keep the pace comfortable along the way.",
    impact: "A regular walk is easier when someone stays beside the person who needs it.",
    needs: ["Pacing", "Conversation", "First aid"],
    accent: "#576f3e",
  },
  {
    id: "flyer-refresh",
    title: "Flyer Refresh",
    area: "Remote",
    time: "Flexible",
    summary: "Turn a community update into a clearer post, poster, or one-page handout.",
    impact: "A better layout and a sharper headline can bring more people into the same effort.",
    needs: ["Design", "Copywriting", "Layout"],
    accent: "#694fb6",
  },
];

export const skillPool = [
  "Serving",
  "Conversation",
  "Setup",
  "Tech support",
  "Patience",
  "Writing",
  "Teaching",
  "Storytelling",
  "Sorting",
  "Packing",
  "Coordination",
  "Pacing",
  "First aid",
  "Design",
  "Copywriting",
  "Layout",
] as const;

export const startingSkills = ["Serving", "Conversation", "Setup"];
