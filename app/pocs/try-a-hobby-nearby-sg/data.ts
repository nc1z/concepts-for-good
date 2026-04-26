export type ComfortLevel = 1 | 2 | 3 | 4 | 5;

export type HobbyMeetup = {
  id: string;
  title: string;
  hobby: string;
  area: string;
  place: string;
  travel: string;
  duration: string;
  groupSize: string;
  comfort: ComfortLevel;
  x: number;
  y: number;
  colour: string;
  firstStep: string;
  whatToSay: string;
  goodFit: string;
  nextMove: string;
};

export type HobbyState = {
  comfort: ComfortLevel;
  selectedId: string;
  savedIds: string[];
};

export const STORAGE_KEY = "good-sg-try-a-hobby-nearby";

export const defaultState: HobbyState = {
  comfort: 2,
  selectedId: "library-sketch",
  savedIds: [],
};

export const comfortLabels: Record<ComfortLevel, string> = {
  1: "One other person",
  2: "Tiny table",
  3: "Small group",
  4: "Busy room",
  5: "Big gathering",
};

export const meetups: HobbyMeetup[] = [
  {
    id: "library-sketch",
    title: "Sketch at the library",
    hobby: "Drawing",
    area: "Tampines",
    place: "Tampines Regional Library",
    travel: "6 min from MRT",
    duration: "30 min",
    groupSize: "2 to 3 people",
    comfort: 1,
    x: -18,
    y: -12,
    colour: "#f6d365",
    firstStep: "Bring any pen and copy one object from the magazine shelf.",
    whatToSay: "I am just warming up today. Can I sit here and sketch quietly?",
    goodFit: "Good when you want company nearby without needing to talk much.",
    nextMove: "Save the 30-minute slot and leave after one page if that feels enough.",
  },
  {
    id: "board-game-two",
    title: "Board game table for two",
    hobby: "Board games",
    area: "Queenstown",
    place: "CC activity room",
    travel: "One bus from home",
    duration: "45 min",
    groupSize: "2 people",
    comfort: 2,
    x: 20,
    y: 8,
    colour: "#7be0ad",
    firstStep: "Start with a short tile game and keep the first round casual.",
    whatToSay: "I am new to this one. Can we play a practice round first?",
    goodFit: "Good when you can manage light conversation around a clear activity.",
    nextMove: "Message the host for the beginner table before you go.",
  },
  {
    id: "plant-cuttings",
    title: "Swap plant cuttings",
    hobby: "Plants",
    area: "Jurong East",
    place: "Void deck garden corner",
    travel: "8 min walk",
    duration: "20 min",
    groupSize: "3 to 4 people",
    comfort: 2,
    x: -8,
    y: 22,
    colour: "#a8ff78",
    firstStep: "Take one hardy cutting and ask where it grows best at home.",
    whatToSay: "I have a bright window. Which plant is easiest to keep alive?",
    goodFit: "Good when you want a short chat with something practical to hold.",
    nextMove: "Pack a small plastic bag and label the plant name before leaving.",
  },
  {
    id: "photowalk",
    title: "Sunset photowalk",
    hobby: "Photography",
    area: "Kallang Riverside",
    place: "Stadium promenade",
    travel: "3 min from MRT",
    duration: "60 min",
    groupSize: "5 to 6 people",
    comfort: 3,
    x: 36,
    y: -26,
    colour: "#7cc7ff",
    firstStep: "Take three photos of reflections and compare one favourite shot.",
    whatToSay: "I am trying to notice light better. Which angle would you try?",
    goodFit: "Good when walking helps you feel less stuck in a group.",
    nextMove: "Arrive at the meeting point, then choose whether to walk beside someone.",
  },
  {
    id: "ukulele-corner",
    title: "Easy ukulele corner",
    hobby: "Music",
    area: "Serangoon",
    place: "Neighbourhood cafe",
    travel: "10 min by bus",
    duration: "50 min",
    groupSize: "4 to 5 people",
    comfort: 3,
    x: -42,
    y: 18,
    colour: "#ff9f80",
    firstStep: "Learn two chords and join only the chorus if you want to.",
    whatToSay: "I know almost nothing. Can I follow the chord sheet first?",
    goodFit: "Good when shared sound makes pauses feel less awkward.",
    nextMove: "Ask if spare ukuleles are available before committing.",
  },
  {
    id: "badminton-hit",
    title: "Casual badminton hit",
    hobby: "Sport",
    area: "Bukit Batok",
    place: "Outdoor court",
    travel: "Beside the block",
    duration: "40 min",
    groupSize: "6 to 8 people",
    comfort: 4,
    x: 48,
    y: 26,
    colour: "#ff7ab6",
    firstStep: "Join doubles for one short game and rest between rounds.",
    whatToSay: "I am rusty. Can I start with the easier side?",
    goodFit: "Good when movement feels easier than sitting face to face.",
    nextMove: "Bring water and set a leaving time before the first game starts.",
  },
  {
    id: "makers-open-table",
    title: "Makers open table",
    hobby: "Craft",
    area: "Punggol",
    place: "Makerspace open night",
    travel: "12 min from LRT",
    duration: "90 min",
    groupSize: "10 to 14 people",
    comfort: 5,
    x: -54,
    y: -34,
    colour: "#c99cff",
    firstStep: "Pick one simple repair or keychain kit and ask for the starter tools.",
    whatToSay: "I want to try one small thing today. Which table should I start at?",
    goodFit: "Good when you are ready for a livelier room with many possible chats.",
    nextMove: "Go during the first half hour while helpers are still free.",
  },
];
