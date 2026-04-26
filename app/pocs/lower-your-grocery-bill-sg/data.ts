export type GroceryOption = {
  brand: string;
  price: number;
  label: string;
};

export type GroceryItem = {
  id: string;
  name: string;
  weight: string;
  category: string;
  options: [GroceryOption, GroceryOption]; // [0] = budget, [1] = premium
  defaultPick: 0 | 1;
};

export const groceryItems: GroceryItem[] = [
  {
    id: "rice",
    name: "Jasmine Rice",
    weight: "5 kg",
    category: "Carbs",
    defaultPick: 1,
    options: [
      { brand: "FairPrice Housebrand", price: 6.9, label: "everyday" },
      { brand: "FairPrice Gold", price: 11.5, label: "premium" },
    ],
  },
  {
    id: "bread",
    name: "Whole Wheat Bread",
    weight: "600 g",
    category: "Carbs",
    defaultPick: 1,
    options: [
      { brand: "FairPrice Housebrand", price: 1.9, label: "everyday" },
      { brand: "Gardenia", price: 3.2, label: "popular" },
    ],
  },
  {
    id: "eggs",
    name: "Fresh Eggs",
    weight: "10 pcs",
    category: "Protein",
    defaultPick: 1,
    options: [
      { brand: "Seng Choon Fresh", price: 2.9, label: "everyday" },
      { brand: "Happy Egg Co Organic", price: 5.5, label: "organic" },
    ],
  },
  {
    id: "chicken",
    name: "Minced Chicken",
    weight: "500 g, frozen",
    category: "Protein",
    defaultPick: 1,
    options: [
      { brand: "FairPrice Housebrand", price: 4.5, label: "everyday" },
      { brand: "Ayamas Premium", price: 7.9, label: "premium" },
    ],
  },
  {
    id: "tofu",
    name: "Silken Tofu",
    weight: "300 g",
    category: "Vegetables",
    defaultPick: 1,
    options: [
      { brand: "Unicurd", price: 1.2, label: "everyday" },
      { brand: "Vitasoy", price: 2.1, label: "popular" },
    ],
  },
  {
    id: "kailan",
    name: "Kai Lan",
    weight: "250 g",
    category: "Vegetables",
    defaultPick: 1,
    options: [
      { brand: "Regular, loose", price: 1.2, label: "everyday" },
      { brand: "Packaged organic", price: 3.8, label: "organic" },
    ],
  },
  {
    id: "oil",
    name: "Sunflower Oil",
    weight: "1.8 L",
    category: "Pantry",
    defaultPick: 1,
    options: [
      { brand: "FairPrice Housebrand", price: 4.2, label: "everyday" },
      { brand: "Naturel", price: 7.8, label: "popular" },
    ],
  },
  {
    id: "oats",
    name: "Rolled Oats",
    weight: "800 g",
    category: "Pantry",
    defaultPick: 1,
    options: [
      { brand: "FairPrice Housebrand", price: 3.5, label: "everyday" },
      { brand: "Quaker", price: 5.9, label: "popular" },
    ],
  },
];
