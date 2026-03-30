export const STORAGE_KEY = "cfg-low-cost-exercise-sg-v2";

export type ExerciseCard = {
  id: string;
  kind: "move" | "rest";
  kicker: string;
  cueWord: string;
  title: string;
  summary: string;
  focus: string;
  place: string;
  equipment: string;
  rhythm: string;
  cues: string[];
  durationSeconds: number;
  costLabel: string;
  accent: string;
  surface: string;
};

export type SessionState = {
  activeIndex: number;
  completedIds: string[];
  finished: boolean;
  isRunning: boolean;
  secondsLeft: number;
};

export const exerciseCards: ExerciseCard[] = [
  {
    id: "warm-up-march",
    kind: "move",
    kicker: "Warm up",
    cueWord: "Wake up",
    title: "March in place with loose shoulders",
    summary:
      "Start gently. Keep your feet light, let your arms swing, and settle into a pace you can hold without huffing.",
    focus: "Wake up your legs and get your breathing steady.",
    place: "Works in the void deck, corridor, or living room.",
    equipment: "No equipment needed.",
    rhythm: "Easy pace for 1 minute",
    cues: ["Stand tall", "Swing both arms", "Breathe through your nose"],
    durationSeconds: 60,
    costLabel: "Free",
    accent: "#ff7a59",
    surface: "linear-gradient(145deg, #fff2e3, #ffd8c8)",
  },
  {
    id: "reset-1",
    kind: "rest",
    kicker: "Catch your breath",
    cueWord: "Reset",
    title: "Sip water and roll your shoulders back",
    summary:
      "Take a short pause. Let your shoulders drop and get ready for the next move.",
    focus: "Keep the pace friendly so you can finish the full set.",
    place: "Stay where you are and keep your feet moving lightly if you want.",
    equipment: "A few mouthfuls of water helps.",
    rhythm: "25 second reset",
    cues: ["Drop your shoulders", "Take two slow sips", "Stay loose"],
    durationSeconds: 25,
    costLabel: "Free",
    accent: "#4bb6b0",
    surface: "linear-gradient(145deg, #e7fffa, #c8f2ef)",
  },
  {
    id: "step-up-drive",
    kind: "move",
    kicker: "Leg strength",
    cueWord: "Drive",
    title: "Step up and knee drive",
    summary:
      "Use a low step, kerb, or sturdy stair. Step up, lift one knee, step down, and switch sides on the next round.",
    focus: "Build balance and leg strength without needing a gym session.",
    place: "Best at a fitness corner or the first stair near home.",
    equipment: "Use a rail if you want a little support.",
    rhythm: "Steady switch-sides rhythm",
    cues: ["Lead with one foot", "Lift the other knee", "Swap sides each round"],
    durationSeconds: 75,
    costLabel: "Free",
    accent: "#ffc145",
    surface: "linear-gradient(145deg, #fff9df, #ffe8ae)",
  },
  {
    id: "reset-2",
    kind: "rest",
    kicker: "Short break",
    cueWord: "Loosen",
    title: "Walk one slow circle and loosen your ankles",
    summary:
      "Keep moving a little so the next set does not feel abrupt.",
    focus: "This keeps the routine steady instead of turning into a stop-start chore.",
    place: "A small loop around the bench or corridor is enough.",
    equipment: "No equipment needed.",
    rhythm: "20 seconds only",
    cues: ["Walk one circle", "Roll each ankle", "Shake out your hands"],
    durationSeconds: 20,
    costLabel: "Free",
    accent: "#7b8cff",
    surface: "linear-gradient(145deg, #eef0ff, #d8ddff)",
  },
  {
    id: "bench-push",
    kind: "move",
    kicker: "Upper body",
    cueWord: "Press",
    title: "Bench push-ups or wall pushes",
    summary:
      "Hands on a bench or wall, body straight, then lower and press back up at an easy rhythm.",
    focus: "Strengthen chest, shoulders, and arms with a move that still feels manageable.",
    place: "Use a park bench, corridor rail, or a clean wall at home.",
    equipment: "A stable surface only.",
    rhythm: "Slow down, stronger push up",
    cues: ["Hands shoulder-width apart", "Keep one straight line", "Push the floor away"],
    durationSeconds: 60,
    costLabel: "Free",
    accent: "#ff8fb1",
    surface: "linear-gradient(145deg, #fff0f6, #ffd7e6)",
  },
  {
    id: "side-reach",
    kind: "move",
    kicker: "Core and stretch",
    cueWord: "Reach",
    title: "Side reaches with a slow squat tap",
    summary:
      "Reach one arm overhead, sink into a gentle squat tap, then come up and switch sides.",
    focus: "Open your waist and hips while keeping your legs active.",
    place: "Fits easily in a small room or the covered linkway downstairs.",
    equipment: "No equipment needed.",
    rhythm: "Tall reach, soft dip, switch",
    cues: ["Reach long through one side", "Tap into a light squat", "Rise and change sides"],
    durationSeconds: 70,
    costLabel: "Free",
    accent: "#8e6bff",
    surface: "linear-gradient(145deg, #f1e9ff, #dccfff)",
  },
  {
    id: "cool-down",
    kind: "move",
    kicker: "Cool down",
    cueWord: "Settle",
    title: "Calf stretch, chest open, long breaths",
    summary:
      "Slow the pace all the way down. Stretch your calves, open your chest, and finish with four deep breaths.",
    focus: "Leave the set feeling lighter, not rushed.",
    place: "Anywhere with enough wall space for a calf stretch.",
    equipment: "A wall or pillar if you want support.",
    rhythm: "Hold, open, then breathe out",
    cues: ["Stretch one calf at a time", "Open your chest", "Take four long breaths"],
    durationSeconds: 55,
    costLabel: "Free",
    accent: "#50b46e",
    surface: "linear-gradient(145deg, #ebfff0, #d4f3da)",
  },
];

export const defaultState: SessionState = {
  activeIndex: 0,
  completedIds: [],
  finished: false,
  isRunning: false,
  secondsLeft: exerciseCards[0].durationSeconds,
};
