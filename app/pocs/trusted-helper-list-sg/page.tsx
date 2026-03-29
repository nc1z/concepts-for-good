"use client";

import Link from "next/link";
import { Sora } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import styles from "./page.module.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-trusted-helper-list",
  weight: ["400", "500", "600", "700"],
});

type TabId = "today" | "helpers" | "notes";
type RoleId = "medication" | "transport" | "meals" | "home";

type Helper = {
  id: string;
  name: string;
  role: RoleId;
  relationship: string;
  phone: string;
  shift: string;
  nextTask: string;
  note: string;
  initials: string;
  availability: string;
  accent: string;
};

type HandoffNote = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

type AppState = {
  selectedRole: RoleId;
  selectedHelperId: string;
  selectedTab: TabId;
  notes: HandoffNote[];
};

const roleMeta: Record<
  RoleId,
  { label: string; prompt: string; accent: string; summary: string; urgency: string }
> = {
  medication: {
    label: "Medication",
    prompt: "Who can handle the next medicine check?",
    accent: "#ff8a5b",
    summary: "7pm tablets and refill notes",
    urgency: "Next handoff in 28 min",
  },
  transport: {
    label: "Transport",
    prompt: "Who is closest to the clinic run?",
    accent: "#4d88ff",
    summary: "Pickup and escort coverage",
    urgency: "Hospital trip tomorrow 8:40am",
  },
  meals: {
    label: "Meals",
    prompt: "Who can cover dinner and shopping?",
    accent: "#3cb38b",
    summary: "Dinner prep and groceries",
    urgency: "Soup prep starts at 6:15pm",
  },
  home: {
    label: "Home",
    prompt: "Who can step in for the flat today?",
    accent: "#9a6cff",
    summary: "Laundry, keys, and lock-up",
    urgency: "Laundry collection before 5pm",
  },
};

const seedHelpers: Helper[] = [
  {
    id: "mei-lin",
    name: "Mei Lin",
    role: "medication",
    relationship: "Evening caregiver",
    phone: "+65 9123 8841",
    shift: "6:30pm to 10:00pm",
    nextTask: "Bring 7pm tablets and check the refill tray.",
    note: "Keeps the dosage chart in the blue folder by the dining table.",
    initials: "ML",
    availability: "Already nearby in Bedok",
    accent: "#ff8a5b",
  },
  {
    id: "adrian",
    name: "Adrian",
    role: "transport",
    relationship: "Neighbour driver",
    phone: "+65 9338 1024",
    shift: "Weekday mornings",
    nextTask: "Take Uncle Harun to the clinic and wait for the pharmacy queue.",
    note: "Prefers to leave 15 minutes early for the sheltered drop-off lane.",
    initials: "AD",
    availability: "Free before 9:30am",
    accent: "#4d88ff",
  },
  {
    id: "nora",
    name: "Nora",
    role: "meals",
    relationship: "Auntie from Block 217",
    phone: "+65 9780 4472",
    shift: "Dinner rotation on Mon, Wed, Fri",
    nextTask: "Drop porridge and soft fruit after maghrib prayers.",
    note: "Message before 5pm if the soup should be less salty.",
    initials: "NO",
    availability: "Cooking tonight",
    accent: "#3cb38b",
  },
  {
    id: "fazil",
    name: "Fazil",
    role: "home",
    relationship: "Cousin with spare keys",
    phone: "+65 9641 5530",
    shift: "Flexible after work",
    nextTask: "Collect laundry and lock up after the physio visit.",
    note: "Knows where the gate remote and spare charger are kept.",
    initials: "FZ",
    availability: "Can cover after 7:45pm",
    accent: "#9a6cff",
  },
  {
    id: "siti",
    name: "Siti",
    role: "medication",
    relationship: "Day helper",
    phone: "+65 9001 3388",
    shift: "8:00am to 2:00pm",
    nextTask: "Update the glucose log and note appetite before lunch.",
    note: "Usually sends a photo of the chart after the morning round.",
    initials: "SI",
    availability: "Hands over at 2pm",
    accent: "#ff8a5b",
  },
  {
    id: "jon",
    name: "Jon",
    role: "transport",
    relationship: "Grab fallback",
    phone: "+65 8891 2240",
    shift: "On-call backup",
    nextTask: "Stand by if Adrian gets delayed by school traffic.",
    note: "Needs the clinic level and patient wheel-chair note in the message.",
    initials: "JN",
    availability: "Reply before 15 minutes",
    accent: "#4d88ff",
  },
];

const seedNotes: HandoffNote[] = [
  {
    id: "n1",
    title: "Night medicine tray",
    detail: "Refill is already labelled for Monday to Wednesday. Blue tray stays on the right shelf.",
    time: "4:40pm",
  },
  {
    id: "n2",
    title: "Clinic pickup",
    detail: "Bring the pink referral letter and park at the sheltered side entrance near Lobby B.",
    time: "2:15pm",
  },
  {
    id: "n3",
    title: "Dinner preference",
    detail: "Keep rice soft tonight and leave tea in the small flask on the counter.",
    time: "11:05am",
  },
];

const defaultState: AppState = {
  selectedRole: "medication",
  selectedHelperId: "mei-lin",
  selectedTab: "today",
  notes: seedNotes,
};

export default function TrustedHelperListPage() {
  const [appState, setAppState] = useState<AppState>(defaultState);
  const [dialState, setDialState] = useState<{
    helperId: string;
    mode: "call" | "message" | "handoff";
  } | null>(null);

  useEffect(() => {
    if (!dialState) return;

    const timeout = window.setTimeout(() => setDialState(null), 1400);
    return () => window.clearTimeout(timeout);
  }, [dialState]);

  const roleHelpers = useMemo(
    () => seedHelpers.filter((helper) => helper.role === appState.selectedRole),
    [appState.selectedRole],
  );

  const selectedHelper =
    seedHelpers.find((helper) => helper.id === appState.selectedHelperId) ?? roleHelpers[0] ?? seedHelpers[0];

  useEffect(() => {
    if (!selectedHelper || roleHelpers.some((helper) => helper.id === selectedHelper.id)) return;

    setAppState((current) => ({
      ...current,
      selectedHelperId: roleHelpers[0]?.id ?? current.selectedHelperId,
    }));
  }, [roleHelpers, selectedHelper]);

  function chooseRole(role: RoleId) {
    const firstHelper = seedHelpers.find((helper) => helper.role === role);
    setAppState((current) => ({
      ...current,
      selectedRole: role,
      selectedHelperId: firstHelper?.id ?? current.selectedHelperId,
    }));
  }

  function runAction(mode: "call" | "message" | "handoff") {
    if (!selectedHelper) return;

    setDialState({ helperId: selectedHelper.id, mode });

    if (mode !== "handoff") return;

    const role = roleMeta[selectedHelper.role];
    const nextNote: HandoffNote = {
      id: `${selectedHelper.id}-${appState.notes.length + 1}`,
      title: `${role.label} handoff shared`,
      detail: `Sent ${selectedHelper.name} the latest note: ${selectedHelper.nextTask}`,
      time: "Just now",
    };

    setAppState((current) => ({
      ...current,
      notes: [nextNote, ...current.notes].slice(0, 5),
      selectedTab: "notes",
    }));
  }

  const currentRole = roleMeta[appState.selectedRole];

  return (
    <main
      className={`${styles.page} ${sora.variable}`}
      style={{ fontFamily: "var(--font-trusted-helper-list), sans-serif" }}
    >
      <Link href="/" className={styles.backLink}>
        ← Back to gallery
      </Link>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Care shifts</p>
        <h1 className={styles.title}>Find the right helper before the next handoff.</h1>
        <p className={styles.lede}>
          Keep family support contacts, routines, and notes ready for the moment someone needs to step in.
        </p>
      </section>

      <div className={styles.stage}>
        <div className={styles.phone}>
          <div className={styles.notch} />
          <div className={styles.screen}>
            <header className={styles.statusBar}>
              <span>9:41</span>
              <span>Care list</span>
              <span>5G</span>
            </header>

            <section className={styles.topCard}>
              <div>
                <p className={styles.topLabel}>Tonight&apos;s focus</p>
                <h2 className={styles.topTitle}>{currentRole.summary}</h2>
                <p className={styles.topMeta}>{currentRole.urgency}</p>
              </div>
              <button
                type="button"
                className={styles.tapButton}
                onClick={() => chooseRole(appState.selectedRole)}
              >
                Open
              </button>
            </section>

            <section className={styles.roleChooser}>
              <p className={styles.sectionPrompt}>{currentRole.prompt}</p>
              <div className={styles.roleRow}>
                {(Object.keys(roleMeta) as RoleId[]).map((role) => {
                  const helperCount = seedHelpers.filter((helper) => helper.role === role).length;
                  const meta = roleMeta[role];
                  const active = appState.selectedRole === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      className={`${styles.roleChip} ${active ? styles.roleChipActive : ""}`}
                      style={{
                        borderColor: active ? meta.accent : "rgba(255,255,255,0.08)",
                        background: active ? `${meta.accent}22` : "rgba(8, 16, 30, 0.72)",
                      }}
                      onClick={() => chooseRole(role)}
                    >
                      <span>{meta.label}</span>
                      <strong>{helperCount}</strong>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.tabRow}>
              {([
                ["today", "Today"],
                ["helpers", "Helpers"],
                ["notes", "Notes"],
              ] as [TabId, string][]).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.tabButton} ${appState.selectedTab === tab ? styles.tabButtonActive : ""}`}
                  onClick={() => setAppState((current) => ({ ...current, selectedTab: tab }))}
                >
                  {label}
                </button>
              ))}
            </section>

            <div className={styles.contentArea}>
              {appState.selectedTab === "notes" ? (
                <div className={styles.notesList}>
                  {appState.notes.map((note) => (
                    <article key={note.id} className={styles.noteCard}>
                      <p className={styles.noteTime}>{note.time}</p>
                      <h3>{note.title}</h3>
                      <p>{note.detail}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.helperStack}>
                  {roleHelpers.map((helper, index) => {
                    const active = selectedHelper?.id === helper.id;

                    return (
                      <motion.button
                        key={helper.id}
                        type="button"
                        className={`${styles.helperCard} ${active ? styles.helperCardActive : ""}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.28, ease: "easeOut" }}
                        onClick={() =>
                          setAppState((current) => ({
                            ...current,
                            selectedHelperId: helper.id,
                            selectedTab: "helpers",
                          }))
                        }
                        style={{
                          borderColor: active ? helper.accent : "rgba(255,255,255,0.08)",
                          boxShadow: active ? `0 18px 40px ${helper.accent}22` : "none",
                        }}
                      >
                        <span className={styles.helperAvatar} style={{ background: helper.accent }}>
                          {helper.initials}
                        </span>
                        <span className={styles.helperBody}>
                          <span className={styles.helperTopLine}>
                            <strong>{helper.name}</strong>
                            <em>{helper.availability}</em>
                          </span>
                          <span className={styles.helperMeta}>{helper.relationship}</span>
                          <span className={styles.helperTask}>{helper.nextTask}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedHelper ? (
                <motion.section
                  key={selectedHelper.id}
                  className={styles.helperSheet}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className={styles.sheetHeader}>
                    <div>
                      <p className={styles.sheetLabel}>{selectedHelper.relationship}</p>
                      <h3>{selectedHelper.name}</h3>
                    </div>
                    <span className={styles.sheetBadge}>{selectedHelper.shift}</span>
                  </div>

                  <p className={styles.sheetTask}>{selectedHelper.note}</p>

                  <div className={styles.actionRow}>
                    <button type="button" className={styles.actionButton} onClick={() => runAction("call")}>
                      Call
                    </button>
                    <button type="button" className={styles.actionButton} onClick={() => runAction("message")}>
                      Message
                    </button>
                    <button type="button" className={styles.actionButtonPrimary} onClick={() => runAction("handoff")}>
                      Share handoff
                    </button>
                  </div>

                  <AnimatePresence>
                    {dialState?.helperId === selectedHelper.id ? (
                      <motion.div
                        className={styles.dialBanner}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                      >
                        {dialState.mode === "call" && `Calling ${selectedHelper.name}...`}
                        {dialState.mode === "message" && `Opening message for ${selectedHelper.name}...`}
                        {dialState.mode === "handoff" && `Handoff note sent to ${selectedHelper.name}.`}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.section>
              ) : null}
            </AnimatePresence>

            <footer className={styles.bottomNav}>
              <span className={styles.navActive}>Today</span>
              <span>Helpers</span>
              <span>Notes</span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
