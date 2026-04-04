export type RenewalStep = {
  id: string;
  title: string;
  dateLabel: string;
  daysLeft: number;
  place: string;
  action: string;
  documents: string[];
  note: string;
};

export const renewalSteps: RenewalStep[] = [
  {
    id: "letter-check",
    title: "Check your renewal letter",
    dateLabel: "Mon, 6 Apr",
    daysLeft: 2,
    place: "At home",
    action: "Read the due date and document list first.",
    documents: ["ComCare letter", "Any notice from MSF"],
    note: "If any page is missing, call your Social Service Office today.",
  },
  {
    id: "income-proof",
    title: "Prepare income papers",
    dateLabel: "Wed, 8 Apr",
    daysLeft: 4,
    place: "At home",
    action: "Take photos or copies of payslips and account credits.",
    documents: ["Last 3 months payslips", "CPF contribution page", "Bank statement"],
    note: "Put all pages in one folder so you can show them quickly.",
  },
  {
    id: "household-check",
    title: "Update household details",
    dateLabel: "Fri, 10 Apr",
    daysLeft: 6,
    place: "At home",
    action: "Confirm who is living with you and current contact numbers.",
    documents: ["NRIC details for household members", "Latest utility bill"],
    note: "Use the same address and phone number on every form.",
  },
  {
    id: "appointment-day",
    title: "Attend ComCare appointment",
    dateLabel: "Mon, 13 Apr",
    daysLeft: 9,
    place: "Social Service Office",
    action: "Bring originals and copies to the counter.",
    documents: ["Document folder", "Appointment message", "Any medical memo"],
    note: "Arrive 15 minutes early to avoid losing your queue slot.",
  },
  {
    id: "follow-up",
    title: "Send any follow-up papers",
    dateLabel: "Thu, 16 Apr",
    daysLeft: 12,
    place: "Online or at SSO",
    action: "Submit missing papers from the officer request.",
    documents: ["Requested documents list", "Newly requested proofs"],
    note: "Send all requested pages in one go so review is faster.",
  },
  {
    id: "result-watch",
    title: "Check renewal result",
    dateLabel: "Mon, 20 Apr",
    daysLeft: 16,
    place: "SMS or letterbox",
    action: "Watch for the outcome message and next payout date.",
    documents: ["Your submission receipt"],
    note: "If no update arrives by this date, call your SSO officer.",
  },
];
