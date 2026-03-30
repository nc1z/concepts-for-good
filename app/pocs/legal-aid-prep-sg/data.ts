export type AnswerOption = {
  id: string;
  label: string;
  shortLabel: string;
};

export type IntakeStep = {
  id: "issue" | "urgency" | "income" | "residency" | "papers";
  prompt: string;
  helper: string;
  options: AnswerOption[];
};

export type HelpRoute = {
  id: string;
  name: string;
  summary: string;
  fit: string[];
  caution?: string[];
  papers: string[];
  nextStep: string;
};

export const intakeSteps: IntakeStep[] = [
  {
    id: "issue",
    prompt: "What do you need help with first?",
    helper: "Pick the closest match and I'll point you to the right place.",
    options: [
      { id: "housing", label: "Housing or rent trouble", shortLabel: "Housing" },
      { id: "family", label: "Family, divorce, or care matters", shortLabel: "Family" },
      { id: "debt", label: "Debt, loans, or money claims", shortLabel: "Debt" },
      { id: "work", label: "Job, salary, or dismissal issue", shortLabel: "Work" },
    ],
  },
  {
    id: "urgency",
    prompt: "Is there a court date, deadline, or hearing within the next two weeks?",
    helper: "Urgent deadlines can change where you should call first.",
    options: [
      { id: "urgent", label: "Yes, something is coming up soon", shortLabel: "Urgent" },
      { id: "steady", label: "No, I still have some time", shortLabel: "No deadline yet" },
    ],
  },
  {
    id: "income",
    prompt: "Roughly how much does your household bring in each month?",
    helper: "A broad range is enough here.",
    options: [
      { id: "lower", label: "Below S$3,000", shortLabel: "Below S$3,000" },
      { id: "middle", label: "Around S$3,000 to S$6,000", shortLabel: "S$3,000 to S$6,000" },
      { id: "higher", label: "Above S$6,000", shortLabel: "Above S$6,000" },
    ],
  },
  {
    id: "residency",
    prompt: "What best describes your residency status?",
    helper: "This helps narrow the schemes most likely to fit.",
    options: [
      { id: "citizen", label: "Singapore citizen", shortLabel: "Citizen" },
      { id: "pr", label: "Permanent resident", shortLabel: "PR" },
      { id: "other", label: "Other pass or status", shortLabel: "Other status" },
    ],
  },
  {
    id: "papers",
    prompt: "How much paperwork do you already have with you?",
    helper: "Even partial papers are useful. We can show what to bring next.",
    options: [
      { id: "ready", label: "IC and letters are mostly ready", shortLabel: "Mostly ready" },
      { id: "partial", label: "I have a few papers but not everything", shortLabel: "Some papers" },
      { id: "none", label: "I need help gathering them", shortLabel: "Need help gathering" },
    ],
  },
];

export const helpRoutes: HelpRoute[] = [
  {
    id: "lab",
    name: "Legal Aid Bureau",
    summary: "A good option if your household income is lower and you need formal legal help.",
    fit: ["lower", "citizen", "pr", "housing", "family", "debt"],
    caution: ["other"],
    papers: [
      "NRIC or other photo ID",
      "Letters from court, landlord, bank, or employer",
      "Recent income proof for everyone in the household",
    ],
    nextStep: "Call them to check if you qualify and book your first appointment.",
  },
  {
    id: "clc",
    name: "Community legal clinic",
    summary: "A good first step if you want quick advice before deciding what to do next.",
    fit: ["steady", "middle", "housing", "family", "debt", "work"],
    papers: [
      "A short timeline of what happened",
      "Any letters, notices, or screenshots tied to the issue",
      "Questions you want answered at the session",
    ],
    nextStep: "Book a slot and bring a short written summary of what happened.",
  },
  {
    id: "tripartite",
    name: "Workplace dispute help",
    summary: "The right place if your issue is about pay, dismissal, or problems at work.",
    fit: ["work", "urgent", "steady"],
    papers: [
      "Employment contract or offer letter",
      "Payslips, rosters, or leave records",
      "Messages or emails linked to the dispute",
    ],
    nextStep: "Write down your timeline and ask about mediation or how to file a claim.",
  },
];

export const paperGuides: Record<string, string> = {
  ready: "You're nearly there. Keep everything in one folder so you don't have to retell the story from scratch.",
  partial: "Bring what you have. The list below shows what else to gather before your appointment.",
  none: "Start with your ID and anything related to the issue — a message, photo, or letter is enough for a first call.",
};

export const routeOrder = ["lab", "clc", "tripartite"] as const;
