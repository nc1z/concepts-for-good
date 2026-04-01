export type VisitType = {
  id: string;
  label: string;
  hint: string;
  clinicTime: string;
  paymentNote: string;
  medicineNote: string;
};

export type PackingItem = {
  id: string;
  label: string;
  detail: string;
  requiredFor: string[];
  lane: "documents" | "payment" | "medicine" | "comfort";
};

export const visitTypes: VisitType[] = [
  {
    id: "polyclinic",
    label: "Polyclinic check-up",
    hint: "Quick visit with regular medicine review.",
    clinicTime: "Leave by 8:10 am",
    paymentNote: "Bring your payment card and CDC voucher screenshot",
    medicineNote: "Bring your current medicine strip or a photo",
  },
  {
    id: "specialist",
    label: "Specialist follow-up",
    hint: "Longer visit with referral and test records.",
    clinicTime: "Leave by 1:30 pm",
    paymentNote: "Bring payment card and referral subsidy letter",
    medicineNote: "Pack current medicine list and allergy note",
  },
  {
    id: "child",
    label: "Child clinic visit",
    hint: "Vaccination or fever check with one caregiver.",
    clinicTime: "Leave by 5:40 pm",
    paymentNote: "Bring payment card and CHAS card if you have it",
    medicineNote: "Bring any recent fever medicine details",
  },
];

export const packingItems: PackingItem[] = [
  {
    id: "nric",
    label: "NRIC or FIN",
    detail: "Needed for registration at the counter.",
    requiredFor: ["polyclinic", "specialist", "child"],
    lane: "documents",
  },
  {
    id: "appointment",
    label: "Appointment message",
    detail: "Show the SMS or letter with time and clinic.",
    requiredFor: ["polyclinic", "specialist", "child"],
    lane: "documents",
  },
  {
    id: "payment",
    label: "Payment card or cash",
    detail: "Use what works for consultation and medicine charges.",
    requiredFor: ["polyclinic", "specialist", "child"],
    lane: "payment",
  },
  {
    id: "medicine-list",
    label: "Current medicine list",
    detail: "Show medicine names, dose, and timing.",
    requiredFor: ["polyclinic", "specialist", "child"],
    lane: "medicine",
  },
  {
    id: "referral",
    label: "Referral letter",
    detail: "Needed for specialist clinic handover.",
    requiredFor: ["specialist"],
    lane: "documents",
  },
  {
    id: "test-results",
    label: "Recent test reports",
    detail: "Bring blood test or scan results from the last visit.",
    requiredFor: ["specialist"],
    lane: "documents",
  },
  {
    id: "health-booklet",
    label: "Child health booklet",
    detail: "Bring growth and vaccine records.",
    requiredFor: ["child"],
    lane: "documents",
  },
  {
    id: "change-clothes",
    label: "Spare clothes",
    detail: "Useful for children after swabs or spills.",
    requiredFor: ["child"],
    lane: "comfort",
  },
  {
    id: "water",
    label: "Water bottle",
    detail: "Useful while waiting at the clinic.",
    requiredFor: ["polyclinic", "specialist", "child"],
    lane: "comfort",
  },
];

