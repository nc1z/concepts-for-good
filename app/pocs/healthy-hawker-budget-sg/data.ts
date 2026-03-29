export const STORAGE_KEY = "cfg-healthy-hawker-budget-sg-v1";

export const mealSlots = [
  {
    id: "breakfast",
    label: "Breakfast",
    timeLabel: "Before work",
    prompt: "Pick a lighter start that keeps you full through the morning.",
    accent: "#cc5a2d",
  },
  {
    id: "lunch",
    label: "Lunch",
    timeLabel: "Midday",
    prompt: "Choose the main plate that does the heavy lifting for the day.",
    accent: "#2f7d59",
  },
  {
    id: "tea",
    label: "Tea",
    timeLabel: "Late afternoon",
    prompt: "Keep the snack steady so dinner does not turn into a splurge.",
    accent: "#d98b2b",
  },
  {
    id: "dinner",
    label: "Dinner",
    timeLabel: "Evening",
    prompt: "Finish with a familiar hawker meal that still leaves room in the budget.",
    accent: "#8f3d2e",
  },
] as const;

export type MealSlotId = (typeof mealSlots)[number]["id"];

export type Dish = {
  id: string;
  meal: MealSlotId;
  name: string;
  stall: string;
  price: number;
  calories: number;
  badge: string;
  summary: string;
  healthNote: string;
  swapTip: string;
  accent: string;
  paper: string;
};

export type PlannerState = {
  activeMeal: MealSlotId;
  selectedByMeal: Partial<Record<MealSlotId, string>>;
};

export const dishes: Dish[] = [
  {
    id: "soy-milk-eggs",
    meal: "breakfast",
    name: "Soy milk with two eggs",
    stall: "Morning drink stall",
    price: 2.4,
    calories: 280,
    badge: "Protein start",
    summary: "Warm soy milk and eggs for a filling start without fried sides.",
    healthNote: "Protein lands early, so you are less likely to hunt for pastries by 10am.",
    swapTip: "If you usually add kaya toast, keep it to one slice and keep the eggs.",
    accent: "#cc5a2d",
    paper: "linear-gradient(145deg, #fff1e7, #f7d6c2)",
  },
  {
    id: "yong-tau-foo-breakfast",
    meal: "breakfast",
    name: "Yong tau foo soup set",
    stall: "Soup corner",
    price: 4.2,
    calories: 360,
    badge: "Soup option",
    summary: "Six pieces in broth with rice for a steadier breakfast on a long day.",
    healthNote: "Soup and tofu keep the morning lighter than fried noodles.",
    swapTip: "Go easy on sweet sauce and choose more tofu than fish cake.",
    accent: "#8f3d2e",
    paper: "linear-gradient(145deg, #f7ebe1, #ead0be)",
  },
  {
    id: "sliced-fish-soup",
    meal: "lunch",
    name: "Sliced fish soup with rice",
    stall: "Fish soup stall",
    price: 5.5,
    calories: 430,
    badge: "Lean lunch",
    summary: "A dependable lunch when you want something warm without the afternoon slump.",
    healthNote: "You still get a proper meal, but with less oil than a fried rice plate.",
    swapTip: "Ask for extra greens and keep the soup clear.",
    accent: "#2f7d59",
    paper: "linear-gradient(145deg, #eef7ef, #d1e7d5)",
  },
  {
    id: "thunder-tea-rice",
    meal: "lunch",
    name: "Thunder tea rice",
    stall: "Lei cha stall",
    price: 5.2,
    calories: 520,
    badge: "Veg-heavy",
    summary: "Rice, peanuts, tofu, and chopped greens when you want a fuller bowl at a fair price.",
    healthNote: "It packs fibre and texture, which helps lunch stay satisfying.",
    swapTip: "Keep the anchovies if you want more savoury bite without adding another dish.",
    accent: "#4f8b45",
    paper: "linear-gradient(145deg, #f1f7e4, #dce8c8)",
  },
  {
    id: "fruit-cup-nuts",
    meal: "tea",
    name: "Fruit cup with nuts",
    stall: "Cut fruit stand",
    price: 2.8,
    calories: 190,
    badge: "Sweet fix",
    summary: "A quick sweet bite that keeps tea light enough for dinner later.",
    healthNote: "You still get crunch and sweetness without sinking the whole day.",
    swapTip: "Choose guava or papaya if you want more fibre for the same spend.",
    accent: "#d98b2b",
    paper: "linear-gradient(145deg, #fff6df, #f2dfb4)",
  },
  {
    id: "tau-huay",
    meal: "tea",
    name: "Tau huay",
    stall: "Bean curd cart",
    price: 1.6,
    calories: 160,
    badge: "Budget snack",
    summary: "Soft bean curd for an afternoon lift when you need something cheap and easy.",
    healthNote: "Keeps the snack affordable enough to leave room for dinner.",
    swapTip: "Skip extra syrup if breakfast already ran sweet.",
    accent: "#b9782c",
    paper: "linear-gradient(145deg, #fff6e6, #eed4ae)",
  },
  {
    id: "chicken-rice-veg",
    meal: "dinner",
    name: "Chicken rice with extra cucumber",
    stall: "Roast meat stall",
    price: 4.5,
    calories: 510,
    badge: "Classic dinner",
    summary: "A familiar dinner that still works when you keep the plate clean and simple.",
    healthNote: "Roasted or poached chicken keeps dinner grounded without feeling punishing.",
    swapTip: "Ask for less rice if lunch was heavier than planned.",
    accent: "#8f3d2e",
    paper: "linear-gradient(145deg, #f8ece4, #e6cdbf)",
  },
  {
    id: "yong-tau-foo-dinner",
    meal: "dinner",
    name: "Yong tau foo dry set",
    stall: "Evening soup stall",
    price: 4.8,
    calories: 440,
    badge: "Flexible dinner",
    summary: "Pick more vegetables and tofu for a dinner that still feels like a proper hawker meal.",
    healthNote: "Easy to adjust up or down depending on how the rest of the day went.",
    swapTip: "Keep one noodle portion instead of adding fried items on the side.",
    accent: "#6f4a3b",
    paper: "linear-gradient(145deg, #f6ede4, #e7d6ca)",
  },
];

export const defaultState: PlannerState = {
  activeMeal: "breakfast",
  selectedByMeal: {},
};

export function getDish(dishId?: string) {
  if (!dishId) return null;
  return dishes.find((dish) => dish.id === dishId) ?? null;
}

export function getMealSlot(mealId: MealSlotId) {
  return mealSlots.find((slot) => slot.id === mealId) ?? mealSlots[0];
}
