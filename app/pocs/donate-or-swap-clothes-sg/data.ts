export type ConditionLevel = "Like new" | "Gently used" | "Well loved";

export type ClothingPost = {
  id: string;
  title: string;
  type: "Donate" | "Swap";
  neighbourhood: string;
  size: string;
  condition: ConditionLevel;
  pickupWindow: string;
  note: string;
  wants: string;
  wearAreas: Array<"Collar" | "Sleeves" | "Hem" | "Fabric">;
  hearts: number;
  chats: number;
};

export const typeFilters = ["All", "Donate", "Swap"] as const;
export const sizeFilters = ["All sizes", "XS-S", "M-L", "XL+"] as const;
export const conditionFilters = ["All conditions", "Like new", "Gently used", "Well loved"] as const;

export const clothingPosts: ClothingPost[] = [
  {
    id: "post-01",
    title: "Office blouse set (3 pieces)",
    type: "Donate",
    neighbourhood: "Bukit Merah",
    size: "M-L",
    condition: "Gently used",
    pickupWindow: "Today, 7:00 pm to 9:00 pm",
    note: "Clean and ready. Good for office wear or interviews.",
    wants: "No swap needed",
    wearAreas: ["Collar"],
    hearts: 24,
    chats: 6,
  },
  {
    id: "post-02",
    title: "Kids PE shorts and tees",
    type: "Swap",
    neighbourhood: "Tampines",
    size: "XS-S",
    condition: "Well loved",
    pickupWindow: "Tomorrow, 10:00 am to 1:00 pm",
    note: "Still useful for play or extra school sets.",
    wants: "Looking for age 11 sizes",
    wearAreas: ["Hem", "Fabric"],
    hearts: 31,
    chats: 12,
  },
  {
    id: "post-03",
    title: "Baju kurung set with shawl",
    type: "Donate",
    neighbourhood: "Woodlands",
    size: "M-L",
    condition: "Like new",
    pickupWindow: "Saturday, 2:00 pm to 5:00 pm",
    note: "Worn once for Hari Raya. No stains.",
    wants: "No swap needed",
    wearAreas: [],
    hearts: 18,
    chats: 4,
  },
  {
    id: "post-04",
    title: "Men&apos;s work pants bundle",
    type: "Swap",
    neighbourhood: "Jurong West",
    size: "XL+",
    condition: "Gently used",
    pickupWindow: "Today, 8:30 pm to 10:00 pm",
    note: "Straight cuts, office-friendly colours.",
    wants: "Would swap for XL polo shirts",
    wearAreas: ["Hem"],
    hearts: 15,
    chats: 7,
  },
  {
    id: "post-05",
    title: "Baby onesies (0-6 months)",
    type: "Donate",
    neighbourhood: "Punggol",
    size: "XS-S",
    condition: "Like new",
    pickupWindow: "Sunday, 9:00 am to 12:00 pm",
    note: "Soft cotton, mostly unworn gifts.",
    wants: "No swap needed",
    wearAreas: [],
    hearts: 39,
    chats: 14,
  },
];
