export type HelpType = "Errand" | "Companionship" | "Food" | "Mobility";

export type HelpRequest = {
  id: string;
  area: string;
  type: HelpType;
  title: string;
  details: string;
  window: string;
  postedMinutesAgo: number;
  status: "open" | "matched";
};

export const seedRequests: HelpRequest[] = [
  {
    id: "req-01",
    area: "Jurong West",
    type: "Errand",
    title: "Pick up two items from the pharmacy",
    details: "Need fever patch and oral rehydration salts before 8pm.",
    window: "Today, 6:30pm to 8:00pm",
    postedMinutesAgo: 12,
    status: "open",
  },
  {
    id: "req-02",
    area: "Hougang",
    type: "Companionship",
    title: "Walk with me to the clinic",
    details: "Short walk from block to clinic gate tomorrow morning.",
    window: "Tomorrow, 8:30am",
    postedMinutesAgo: 19,
    status: "open",
  },
  {
    id: "req-03",
    area: "Bukit Merah",
    type: "Food",
    title: "Bring one simple dinner",
    details: "Soft food only. Leave at door if no answer.",
    window: "Today, 7:00pm",
    postedMinutesAgo: 27,
    status: "matched",
  },
  {
    id: "req-04",
    area: "Yishun",
    type: "Mobility",
    title: "Wheelchair push to MRT",
    details: "Need help for one stop trip to Khatib station.",
    window: "Friday, 9:10am",
    postedMinutesAgo: 43,
    status: "open",
  },
];

export const helpTypes: HelpType[] = [
  "Errand",
  "Companionship",
  "Food",
  "Mobility",
];
