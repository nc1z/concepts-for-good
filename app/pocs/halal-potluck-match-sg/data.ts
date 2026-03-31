export type Dish = {
  id: string;
  name: string;
  bringer: string;
  spot: string;
  note: string;
  halal: boolean;
  vegetarian: boolean;
  shellfishFree: boolean;
  nutFree: boolean;
  x: number;
  y: number;
};

export type GuestGroup = {
  id: string;
  label: string;
  headcount: number;
  needs: Array<"halal" | "vegetarian" | "shellfishFree" | "nutFree">;
  guidance: string;
};

export const guestGroups: GuestGroup[] = [
  {
    id: "halal-circle",
    label: "Halal guests",
    headcount: 9,
    needs: ["halal"],
    guidance: "Keep all shared dishes halal-certified or prepared without mixed utensils.",
  },
  {
    id: "vegetarian-circle",
    label: "Vegetarian guests",
    headcount: 5,
    needs: ["vegetarian"],
    guidance: "Offer enough meat-free mains so guests can build a full plate.",
  },
  {
    id: "allergy-circle",
    label: "Guests avoiding shellfish and nuts",
    headcount: 4,
    needs: ["shellfishFree", "nutFree"],
    guidance: "Label sauces and toppings clearly so everyone can eat without guessing.",
  },
];

export const dishes: Dish[] = [
  {
    id: "d1",
    name: "Lemongrass Chicken Rice Tray",
    bringer: "Farid",
    spot: "North side",
    note: "Large tray, serves 10",
    halal: true,
    vegetarian: false,
    shellfishFree: true,
    nutFree: true,
    x: 14,
    y: 30,
  },
  {
    id: "d2",
    name: "Mushroom Bee Hoon",
    bringer: "Shanti",
    spot: "North-east",
    note: "No oyster sauce",
    halal: true,
    vegetarian: true,
    shellfishFree: true,
    nutFree: true,
    x: 30,
    y: 16,
  },
  {
    id: "d3",
    name: "Sambal Prawns",
    bringer: "Jun Kai",
    spot: "East side",
    note: "Contains shellfish",
    halal: true,
    vegetarian: false,
    shellfishFree: false,
    nutFree: true,
    x: 52,
    y: 13,
  },
  {
    id: "d4",
    name: "Paneer Skewers",
    bringer: "Nabila",
    spot: "South-east",
    note: "Yoghurt-based marinade",
    halal: true,
    vegetarian: true,
    shellfishFree: true,
    nutFree: true,
    x: 74,
    y: 22,
  },
  {
    id: "d5",
    name: "Tofu Satay Sticks",
    bringer: "Aisyah",
    spot: "South side",
    note: "Peanut-free sauce",
    halal: true,
    vegetarian: true,
    shellfishFree: true,
    nutFree: true,
    x: 84,
    y: 44,
  },
  {
    id: "d6",
    name: "Fish Otah Parcels",
    bringer: "Dinesh",
    spot: "South-west",
    note: "Contains fish and egg",
    halal: true,
    vegetarian: false,
    shellfishFree: true,
    nutFree: true,
    x: 75,
    y: 66,
  },
  {
    id: "d7",
    name: "Roasted Pumpkin Salad",
    bringer: "Mei Lin",
    spot: "West side",
    note: "No dairy dressing",
    halal: true,
    vegetarian: true,
    shellfishFree: true,
    nutFree: false,
    x: 46,
    y: 79,
  },
  {
    id: "d8",
    name: "Fruit Cooler Bowl",
    bringer: "Hafizah",
    spot: "North-west",
    note: "Fresh fruit with mint syrup",
    halal: true,
    vegetarian: true,
    shellfishFree: true,
    nutFree: true,
    x: 23,
    y: 63,
  },
];
