export type Volunteer = {
  id: string;
  name: string;
  tone: string;
  accent: string;
};

export type SeniorProfile = {
  id: string;
  name: string;
  area: string;
  visitNeed: string;
  preferredDay: string;
  note: string;
};

export type VisitSlot = {
  id: string;
  day: string;
  seniorId: string;
  volunteerId: string;
  time: string;
};

export const STORAGE_KEY = "cfg-elder-visit-planner-sg-v1";

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const volunteers: Volunteer[] = [
  {
    id: "vol-1",
    name: "Aqilah",
    tone: "#f5d2be",
    accent: "#b66540",
  },
  {
    id: "vol-2",
    name: "Marcus",
    tone: "#d5ead6",
    accent: "#3f7f59",
  },
  {
    id: "vol-3",
    name: "Jia Hui",
    tone: "#d7e4fb",
    accent: "#4b6ea9",
  },
];

export const seniors: SeniorProfile[] = [
  {
    id: "senior-1",
    name: "Mdm Tan",
    area: "Toa Payoh Lorong 2",
    visitNeed: "Medication check and groceries",
    preferredDay: "Monday",
    note: "Likes an afternoon visit and prefers someone to read appointment letters with her.",
  },
  {
    id: "senior-2",
    name: "Mr Rahman",
    area: "Bedok North",
    visitNeed: "Companionship walk downstairs",
    preferredDay: "Wednesday",
    note: "Needs a wheelchair-friendly route from lift lobby to void deck.",
  },
  {
    id: "senior-3",
    name: "Mdm Devi",
    area: "Jurong West",
    visitNeed: "Check fridge and meal supplies",
    preferredDay: "Friday",
    note: "Best visited before dinner so supplies can be topped up the same day.",
  },
  {
    id: "senior-4",
    name: "Mr Lim",
    area: "Ang Mo Kio",
    visitNeed: "Paperwork and bill reminders",
    preferredDay: "Saturday",
    note: "Usually needs help sorting mail and keeping appointment cards together.",
  },
];

export const initialVisits: VisitSlot[] = [
  {
    id: "visit-1",
    day: "Monday",
    seniorId: "senior-1",
    volunteerId: "vol-1",
    time: "2:00 pm",
  },
  {
    id: "visit-2",
    day: "Wednesday",
    seniorId: "senior-2",
    volunteerId: "vol-2",
    time: "10:30 am",
  },
  {
    id: "visit-3",
    day: "Sunday",
    seniorId: "senior-4",
    volunteerId: "vol-3",
    time: "11:00 am",
  },
];

export const visitTimes = [
  "9:30 am",
  "10:30 am",
  "1:30 pm",
  "2:00 pm",
  "3:30 pm",
  "5:00 pm",
] as const;
