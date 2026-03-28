export type Senior = {
  id: string;
  name: string;
  age: number;
  neighbourhood: string;
  address: string;
  contact: string;
  contactName: string;
  notes: string;
  history: boolean[]; // last 14 days, index 0 = oldest, index 13 = yesterday
  checkedInToday: boolean;
  streak: number;
};

export const seniors: Senior[] = [
  {
    id: "s1",
    name: "Mdm Rosaline Tan",
    age: 78,
    neighbourhood: "Toa Payoh",
    address: "Blk 123 Toa Payoh Lorong 1, #08-45",
    contact: "+65 9123 4567",
    contactName: "Jenny (daughter)",
    notes: "Prefers morning calls. Hard of hearing.",
    history: [true, true, true, true, true, true, true, true, true, true, true, true, false, true],
    checkedInToday: false,
    streak: 12,
  },
  {
    id: "s2",
    name: "Mr Ahmad bin Salleh",
    age: 82,
    neighbourhood: "Bedok",
    address: "Blk 44 Bedok North Ave 4, #03-12",
    contact: "+65 9234 5678",
    contactName: "Farouk (son)",
    notes: "Active, visits RC most mornings.",
    history: [false, false, false, false, false, false, false, false, false, true, true, true, true, true],
    checkedInToday: true,
    streak: 5,
  },
  {
    id: "s3",
    name: "Mrs Lim Siew Eng",
    age: 74,
    neighbourhood: "Clementi",
    address: "Blk 351 Clementi Ave 2, #12-88",
    contact: "Volunteer Priya",
    contactName: "Priya (volunteer)",
    notes: "Diabetic. Monitor carefully.",
    history: [false, true, true, true, true, true, true, true, true, true, true, true, true, true],
    checkedInToday: false,
    streak: 28,
  },
  {
    id: "s4",
    name: "Mr S. Rajan",
    age: 79,
    neighbourhood: "Jurong West",
    address: "Blk 667 Jurong West St 65, #05-22",
    contact: "Neighbour helpline",
    contactName: "Community helpline",
    notes: "Lives alone. Appreciates visits.",
    history: [false, false, false, false, false, false, false, false, false, false, false, true, true, false],
    checkedInToday: false,
    streak: 3,
  },
  {
    id: "s5",
    name: "Mdm Halimah Bte Yusof",
    age: 81,
    neighbourhood: "Geylang",
    address: "Blk 9 Geylang Bahru, #02-33",
    contact: "+65 9345 6789",
    contactName: "Nurul (daughter)",
    notes: "Recently discharged. Check daily.",
    history: [false, false, false, false, false, false, false, true, true, true, true, true, true, true],
    checkedInToday: true,
    streak: 7,
  },
  {
    id: "s6",
    name: "Mr Tan Boon Keat",
    age: 76,
    neighbourhood: "Tampines",
    address: "Blk 824 Tampines St 81, #10-05",
    contact: "Community volunteer",
    contactName: "Community volunteer",
    notes: "Missed last few days. Needs follow-up.",
    history: [false, false, false, false, false, false, false, false, false, false, true, false, false, false],
    checkedInToday: false,
    streak: 0,
  },
];
