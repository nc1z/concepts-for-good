export const STORAGE_KEY = "block-potluck-planner-sg";

export const EVENT_NAME = "Blk 412 CNY Gathering";
export const EVENT_DATE = "8 Feb 2026, Void Deck 4pm";

export type CourseKey = "mains" | "sides" | "drinks" | "desserts";

export type Dish = {
  id: string;
  course: CourseKey;
  dishName: string;
  broughtBy: string;
  dietaryNote: string;
  addedAt: number;
};

export type DraftDish = {
  dishName: string;
  broughtBy: string;
  dietaryNote: string;
};

export const courses: {
  key: CourseKey;
  label: string;
  colour: string;
  emptyMessage: string;
}[] = [
  {
    key: "mains",
    label: "Mains",
    colour: "#e05c2a",
    emptyMessage: "No mains yet — be the first to bring one!",
  },
  {
    key: "sides",
    label: "Sides",
    colour: "#5a8a3c",
    emptyMessage: "No sides yet — bring something to share!",
  },
  {
    key: "drinks",
    label: "Drinks",
    colour: "#2a6fad",
    emptyMessage: "No drinks yet — keep everyone refreshed!",
  },
  {
    key: "desserts",
    label: "Desserts",
    colour: "#b5590f",
    emptyMessage: "No desserts yet — sweeten the table!",
  },
];

export const initialDishes: Dish[] = [
  {
    id: "dish-1",
    course: "mains",
    dishName: "Chicken rice",
    broughtBy: "Mdm Lim",
    dietaryNote: "",
    addedAt: 1000,
  },
  {
    id: "dish-2",
    course: "mains",
    dishName: "Curry chicken",
    broughtBy: "Auntie Rose",
    dietaryNote: "halal",
    addedAt: 1001,
  },
  {
    id: "dish-3",
    course: "mains",
    dishName: "Nasi lemak",
    broughtBy: "Faridah",
    dietaryNote: "halal",
    addedAt: 1002,
  },
  {
    id: "dish-4",
    course: "mains",
    dishName: "Curry chicken",
    broughtBy: "Uncle Ahmad",
    dietaryNote: "halal",
    addedAt: 1003,
  },
  {
    id: "dish-5",
    course: "sides",
    dishName: "Achar",
    broughtBy: "Priya",
    dietaryNote: "vegetarian",
    addedAt: 2000,
  },
  {
    id: "dish-6",
    course: "sides",
    dishName: "Spring rolls",
    broughtBy: "Mdm Tan",
    dietaryNote: "",
    addedAt: 2001,
  },
  {
    id: "dish-7",
    course: "sides",
    dishName: "Spring rolls",
    broughtBy: "Bee Leng",
    dietaryNote: "",
    addedAt: 2002,
  },
  {
    id: "dish-8",
    course: "drinks",
    dishName: "Bandung",
    broughtBy: "Kavitha",
    dietaryNote: "",
    addedAt: 3000,
  },
  {
    id: "dish-9",
    course: "drinks",
    dishName: "Barley water",
    broughtBy: "Wei",
    dietaryNote: "",
    addedAt: 3001,
  },
  {
    id: "dish-10",
    course: "desserts",
    dishName: "Pineapple tarts",
    broughtBy: "Mdm Lim",
    dietaryNote: "",
    addedAt: 4000,
  },
  {
    id: "dish-11",
    course: "desserts",
    dishName: "Tang yuan",
    broughtBy: "Xiao Hui",
    dietaryNote: "vegetarian",
    addedAt: 4001,
  },
];

export const initialDraft: DraftDish = {
  dishName: "",
  broughtBy: "",
  dietaryNote: "",
};

export function normaliseDishName(name: string) {
  return name.toLowerCase().trim();
}

export function findDuplicates(dishes: Dish[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const dish of dishes) {
    const key = normaliseDishName(dish.dishName);
    if (!groups[key]) groups[key] = [];
    groups[key].push(dish.id);
  }
  const duplicates: Record<string, string[]> = {};
  for (const [key, ids] of Object.entries(groups)) {
    if (ids.length > 1) duplicates[key] = ids;
  }
  return duplicates;
}

export function getCourse(key: CourseKey) {
  return courses.find((c) => c.key === key) ?? courses[0];
}
