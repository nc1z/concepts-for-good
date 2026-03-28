export const STORAGE_KEY = "rent-split-planner-sg";

export type Person = {
  id: string;
  name: string;
  color: string;
  lightColor: string;
};

export type Assignment =
  | { type: "sole"; personId: string }
  | { type: "split"; ratios: Record<string, number> };

export type Bill = {
  id: string;
  name: string;
  amount: number;
  assignment: Assignment;
};

export const defaultPeople: Person[] = [
  { id: "wei-ling", name: "Wei Ling", color: "#6b8cae", lightColor: "#ddeaf5" },
  { id: "priya", name: "Priya", color: "#c4866a", lightColor: "#f7e4da" },
  { id: "marcus", name: "Marcus", color: "#7aab8a", lightColor: "#d9ede0" },
];

export const defaultBills: Bill[] = [
  {
    id: "rent",
    name: "HDB flat rent",
    amount: 1400,
    assignment: {
      type: "split",
      ratios: { "wei-ling": 0.34, priya: 0.33, marcus: 0.33 },
    },
  },
  {
    id: "pub",
    name: "PUB utilities",
    amount: 120,
    assignment: {
      type: "split",
      ratios: { "wei-ling": 0.34, priya: 0.33, marcus: 0.33 },
    },
  },
  {
    id: "wifi",
    name: "StarHub broadband",
    amount: 40,
    assignment: {
      type: "split",
      ratios: { "wei-ling": 0.5, priya: 0.5, marcus: 0 },
    },
  },
  {
    id: "tc",
    name: "S&CC town council",
    amount: 55,
    assignment: { type: "sole", personId: "wei-ling" },
  },
  {
    id: "groceries",
    name: "Groceries pool",
    amount: 200,
    assignment: {
      type: "split",
      ratios: { "wei-ling": 0.34, priya: 0.33, marcus: 0.33 },
    },
  },
];

export function getBillOwnerColor(
  bill: Bill,
  people: Person[]
): string {
  if (bill.assignment.type === "sole") {
    return people.find((p) => p.id === bill.assignment.personId)?.color ?? "#aaa";
  }
  // For split bills, return a neutral
  return "#b0a99a";
}

export function getBillOwnerName(bill: Bill, people: Person[]): string | null {
  if (bill.assignment.type === "sole") {
    return people.find((p) => p.id === bill.assignment.personId)?.name ?? null;
  }
  return null;
}

export function getPersonShare(
  personId: string,
  bills: Bill[]
): number {
  return bills.reduce((sum, bill) => {
    if (bill.assignment.type === "sole") {
      return sum + (bill.assignment.personId === personId ? bill.amount : 0);
    }
    const ratio = bill.assignment.ratios[personId] ?? 0;
    return sum + bill.amount * ratio;
  }, 0);
}

export function getBillShareForPerson(
  personId: string,
  bill: Bill
): number {
  if (bill.assignment.type === "sole") {
    return bill.assignment.personId === personId ? bill.amount : 0;
  }
  const ratio = bill.assignment.ratios[personId] ?? 0;
  return bill.amount * ratio;
}
