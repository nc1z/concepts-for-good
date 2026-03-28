export const STORAGE_KEY = "cfg-community-cooking-circle-sg-v1";

export type KitchenStage = "prep" | "cook" | "share";

export type RoleSlot = {
  id: string;
  stage: KitchenStage;
  title: string;
  note: string;
  filledBy: string | null;
};

export type DishToken = {
  id: string;
  name: string;
  note: string;
};

export type Session = {
  id: string;
  title: string;
  neighbourhood: string;
  timeLabel: string;
  venue: string;
  hostNote: string;
  dishes: DishToken[];
  roles: RoleSlot[];
};

export type AppState = {
  selectedSessionId: string;
  sessions: Session[];
};

export const stageOrder: KitchenStage[] = ["prep", "cook", "share"];

export const stageCopy: Record<
  KitchenStage,
  {
    label: string;
    shortLabel: string;
    note: string;
    readyLabel: string;
    openLabel: string;
  }
> = {
  prep: {
    label: "Prep",
    shortLabel: "Chop and wash",
    note: "Small jobs that help everyone settle in quickly.",
    readyLabel: "Prep team is set",
    openLabel: "Still needs a hand",
  },
  cook: {
    label: "Cook",
    shortLabel: "Stir and season",
    note: "Keep the main pot moving while neighbours rotate in.",
    readyLabel: "Cook team is set",
    openLabel: "Still needs a hand",
  },
  share: {
    label: "Share",
    shortLabel: "Plate and welcome",
    note: "Lay the table, pour drinks, and make room for late arrivals.",
    readyLabel: "Serving team is set",
    openLabel: "Still needs a hand",
  },
};

export const defaultState: AppState = {
  selectedSessionId: "amk-soup-night",
  sessions: [
    {
      id: "amk-soup-night",
      title: "Soup night for Blk 233",
      neighbourhood: "Ang Mo Kio",
      timeLabel: "Tue 6.30pm",
      venue: "Blk 233 void deck pantry",
      hostNote: "A quiet weeknight circle with pumpkin soup, bee hoon, and fruit to share.",
      dishes: [
        { id: "dish-1", name: "Pumpkin soup", note: "Big pot for 14 bowls" },
        { id: "dish-2", name: "Bee hoon", note: "Light dinner side" },
        { id: "dish-3", name: "Cut fruit", note: "After-meal table" },
      ],
      roles: [
        {
          id: "role-1",
          stage: "prep",
          title: "Wash and cut vegetables",
          note: "Start at 6.10pm",
          filledBy: "Mdm Latha",
        },
        {
          id: "role-2",
          stage: "prep",
          title: "Set out bowls and spoons",
          note: "Front table by the pantry door",
          filledBy: null,
        },
        {
          id: "role-3",
          stage: "cook",
          title: "Watch the soup pot",
          note: "Keep it moving for 25 minutes",
          filledBy: "Kelvin",
        },
        {
          id: "role-4",
          stage: "cook",
          title: "Season and taste with the host",
          note: "Final check before serving",
          filledBy: null,
        },
        {
          id: "role-5",
          stage: "share",
          title: "Welcome neighbours at the table",
          note: "Guide late arrivals to spare seats",
          filledBy: "Auntie May",
        },
        {
          id: "role-6",
          stage: "share",
          title: "Pour tea and pack leftovers",
          note: "Bring containers from the pantry shelf",
          filledBy: null,
        },
      ],
    },
    {
      id: "tampines-porridge",
      title: "Saturday porridge circle",
      neighbourhood: "Tampines",
      timeLabel: "Sat 9.00am",
      venue: "Blk 842 RC kitchen corner",
      hostNote: "A slow morning circle for seniors who want company before the market crowds build.",
      dishes: [
        { id: "dish-4", name: "Chicken porridge", note: "Main pot" },
        { id: "dish-5", name: "Braised peanuts", note: "Small topping bowl" },
        { id: "dish-6", name: "Soya milk", note: "Hot flask station" },
      ],
      roles: [
        {
          id: "role-7",
          stage: "prep",
          title: "Rinse rice and shred ginger",
          note: "Meet the host by 8.40am",
          filledBy: "Nurul",
        },
        {
          id: "role-8",
          stage: "prep",
          title: "Arrange stools and table cloths",
          note: "Neighbour table facing the garden",
          filledBy: "Mr Tan",
        },
        {
          id: "role-9",
          stage: "cook",
          title: "Keep the porridge slow and smooth",
          note: "20-minute stove shift",
          filledBy: "Siti",
        },
        {
          id: "role-10",
          stage: "cook",
          title: "Warm the side dishes",
          note: "Second burner",
          filledBy: null,
        },
        {
          id: "role-11",
          stage: "share",
          title: "Serve the first bowls",
          note: "Watch for neighbours with walking aids",
          filledBy: null,
        },
        {
          id: "role-12",
          stage: "share",
          title: "Refill drinks and clear plates",
          note: "Keep the table easy to move through",
          filledBy: null,
        },
      ],
    },
    {
      id: "bukit-batok-noodle",
      title: "After-school noodle circle",
      neighbourhood: "Bukit Batok",
      timeLabel: "Thu 4.30pm",
      venue: "Blk 118 community room pantry",
      hostNote: "Neighbour volunteers cook a simple noodle meal while students finish homework nearby.",
      dishes: [
        { id: "dish-7", name: "Fishball noodles", note: "Shared noodle tray" },
        { id: "dish-8", name: "Sauteed greens", note: "Quick wok side" },
        { id: "dish-9", name: "Orange wedges", note: "Cooling plate" },
      ],
      roles: [
        {
          id: "role-13",
          stage: "prep",
          title: "Wash greens and split the noodles",
          note: "Kitchen bench by the sink",
          filledBy: null,
        },
        {
          id: "role-14",
          stage: "prep",
          title: "Lay out cups and water jugs",
          note: "Long table near the windows",
          filledBy: "Evelyn",
        },
        {
          id: "role-15",
          stage: "cook",
          title: "Boil noodles in batches",
          note: "Main stove for 15 minutes",
          filledBy: null,
        },
        {
          id: "role-16",
          stage: "cook",
          title: "Finish the greens and toppings",
          note: "Wok station",
          filledBy: "Uncle Harun",
        },
        {
          id: "role-17",
          stage: "share",
          title: "Call students over when the first bowls are ready",
          note: "Front table by the noticeboard",
          filledBy: null,
        },
        {
          id: "role-18",
          stage: "share",
          title: "Pack extra portions for take-home",
          note: "Bring labels from the side shelf",
          filledBy: "Jia Hui",
        },
      ],
    },
  ],
};
