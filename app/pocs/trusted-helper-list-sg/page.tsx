"use client";

import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import styles from "./page.module.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-trusted-helper",
  weight: ["400", "500", "600", "700"],
});

type RoleId = "medication" | "transport" | "meals" | "home";

type Helper = {
  id: string;
  name: string;
  role: RoleId;
  relationship: string;
  phone: string;
  routine: string;
  keyPhrase: string;
  note: string;
  initials: string;
  nextTask: string;
  accent: string;
};

type HandoffNote = {
  id: string;
  text: string;
  time: string;
  role: RoleId;
};

const roleMeta: Record<
  RoleId,
  { label: string; prompt: string; accent: string; bg: string }
> = {
  medication: {
    label: "Medication",
    prompt: "Who handles the medicine routine?",
    accent: "#e85d3f",
    bg: "#fef3f0",
  },
  transport: {
    label: "Transport",
    prompt: "Who drives to appointments?",
    accent: "#3b6edb",
    bg: "#f0f5fe",
  },
  meals: {
    label: "Meals",
    prompt: "Who cooks and brings food?",
    accent: "#2d9d5a",
    bg: "#f0fef5",
  },
  home: {
    label: "Home",
    prompt: "Who helps around the house?",
    accent: "#7c4dff",
    bg: "#f5f0fe",
  },
};

const helpers: Helper[] = [
  {
    id: "mei-lin",
    name: "Mei Lin",
    role: "medication",
    relationship: "Evening helper",
    phone: "+65 9123 8841",
    routine: "6:30pm to 10pm daily",
    keyPhrase: "Keeps dosage chart in blue folder",
    note: "Always bring the refill tray when she visits.",
    initials: "ML",
    nextTask: "Evening tablets at 7pm",
    accent: "#e85d3f",
  },
  {
    id: "adrian",
    name: "Adrian",
    role: "transport",
    relationship: "Neighbour driver",
    phone: "+65 9338 1024",
    routine: "Weekday mornings",
    keyPhrase: "Leaves 15 min early for sheltered lane",
    note: "Prefers pickup at side gate, not main entrance.",
    initials: "AD",
    nextTask: "Clinic run tomorrow 8:40am",
    accent: "#3b6edb",
  },
  {
    id: "nora",
    name: "Nora",
    role: "meals",
    relationship: "Auntie Block 217",
    phone: "+65 9780 4472",
    routine: "Mon, Wed, Fri dinners",
    keyPhrase: "Message before 5pm if less salt",
    note: "Brings porridge after maghrib on cooking days.",
    initials: "NO",
    nextTask: "Dinner tonight after prayers",
    accent: "#2d9d5a",
  },
  {
    id: "fazil",
    name: "Fazil",
    role: "home",
    relationship: "Cousin with keys",
    phone: "+65 9641 5530",
    routine: "Flexible after work",
    keyPhrase: "Knows where gate remote is kept",
    note: "Can cover laundry and lock-up after physio.",
    initials: "FZ",
    nextTask: "Collect laundry before 5pm",
    accent: "#7c4dff",
  },
  {
    id: "siti",
    name: "Siti",
    role: "medication",
    relationship: "Day helper",
    phone: "+65 9001 3388",
    routine: "8am to 2pm",
    keyPhrase: "Sends photo of morning chart",
    note: "Updates glucose log before lunch daily.",
    initials: "ST",
    nextTask: "Morning check at 9am",
    accent: "#e85d3f",
  },
  {
    id: "jon",
    name: "Jon",
    role: "transport",
    relationship: "Backup driver",
    phone: "+65 8891 2240",
    routine: "On-call",
    keyPhrase: "Needs clinic level in the message",
    note: "Stands by if Adrian held up by traffic.",
    initials: "JN",
    nextTask: "Standby for clinic tomorrow",
    accent: "#3b6edb",
  },
];

const initialNotes: HandoffNote[] = [
  { id: "n1", text: "Night medicine tray ready — blue folder on dining table", time: "4:40pm", role: "medication" },
  { id: "n2", text: "Bring pink referral letter for clinic — park at sheltered side", time: "2:15pm", role: "transport" },
  { id: "n3", text: "Keep rice soft tonight — tea flask on counter", time: "11:05am", role: "meals" },
];

export default function TrustedHelperListPage() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("medication");
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [handoffNotes, setHandoffNotes] = useState<HandoffNote[]>(initialNotes);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

  const roleHelpers = helpers.filter((h) => h.role === selectedRole);

  const onRoleSelect = useCallback(
    (role: RoleId) => {
      setSelectedRole(role);
      setSelectedHelper(null);
      setShowSheet(false);
      const index = ["medication", "transport", "meals", "home"].indexOf(role);
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      const roles: RoleId[] = ["medication", "transport", "meals", "home"];
      setSelectedRole(roles[index]);
      setSelectedHelper(null);
      setShowSheet(false);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const openSheet = (helper: Helper) => {
    setSelectedHelper(helper);
    setShowSheet(true);
  };

  const closeSheet = () => {
    setShowSheet(false);
    setTimeout(() => setSelectedHelper(null), 300);
  };

  const sendHandoff = () => {
    if (!selectedHelper) return;
    const newNote: HandoffNote = {
      id: `n${Date.now()}`,
      text: `Handed off to ${selectedHelper.name} — ${selectedHelper.nextTask}`,
      time: "Just now",
      role: selectedHelper.role,
    };
    setHandoffNotes([newNote, ...handoffNotes].slice(0, 5));
    setFlashMessage(`Handoff sent to ${selectedHelper.name}`);
    setTimeout(() => setFlashMessage(null), 2000);
    closeSheet();
  };

  const simulateCall = () => {
    if (!selectedHelper) return;
    setFlashMessage(`Calling ${selectedHelper.name}...`);
    setTimeout(() => setFlashMessage(null), 2000);
  };

  const simulateMessage = () => {
    if (!selectedHelper) return;
    setFlashMessage(`Opening message for ${selectedHelper.name}...`);
    setTimeout(() => setFlashMessage(null), 2000);
  };

  return (
    <main className={`${styles.page} ${dmSans.variable}`}>
      <Link href="/" className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        <span>Back to gallery</span>
      </Link>

      <div className={styles.kiosk}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Family caregiving</p>
          <h1 className={styles.title}>Find the right helper before someone needs to step in.</h1>
          <p className={styles.lede}>Tap a role, then tap the person you need.</p>
        </header>

        <div className={styles.roleCarousel}>
          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer}>
              {(Object.keys(roleMeta) as RoleId[]).map((role) => {
                const meta = roleMeta[role];
                const count = helpers.filter((h) => h.role === role).length;
                const active = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className={`${styles.roleSlide} ${active ? styles.roleSlideActive : ""}`}
                    onClick={() => onRoleSelect(role)}
                    style={
                      {
                        "--role-accent": meta.accent,
                        "--role-bg": meta.bg,
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.roleLabel}>{meta.label}</span>
                    <span className={styles.roleCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.promptBar}>
          <p>{roleMeta[selectedRole].prompt}</p>
        </div>

        <div className={styles.helperGrid}>
          {roleHelpers.map((helper, i) => (
            <motion.button
              key={helper.id}
              type="button"
              className={styles.helperCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              onClick={() => openSheet(helper)}
              style={{ "--card-accent": helper.accent } as React.CSSProperties}
            >
              <div className={styles.cardTop}>
                <span className={styles.initials}>{helper.initials}</span>
                <span className={styles.relationship}>{helper.relationship}</span>
              </div>
              <div className={styles.cardName}>{helper.name}</div>
              <div className={styles.cardTask}>{helper.nextTask}</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showSheet && selectedHelper && (
            <motion.div
              className={styles.sheetOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSheet}
            >
              <motion.div
                className={styles.handoffSheet}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                style={{ "--sheet-accent": selectedHelper.accent } as React.CSSProperties}
              >
                <div className={styles.sheetHandle} />

                <div className={styles.sheetHeader}>
                  <div className={styles.sheetIdentity}>
                    <span className={styles.sheetInitials}>{selectedHelper.initials}</span>
                    <div>
                      <h2 className={styles.sheetName}>{selectedHelper.name}</h2>
                      <p className={styles.sheetRole}>{selectedHelper.relationship}</p>
                    </div>
                  </div>
                  <span className={styles.sheetRoutine}>{selectedHelper.routine}</span>
                </div>

                <div className={styles.sheetBody}>
                  <div className={styles.sheetBlock}>
                    <p className={styles.sheetLabel}>Key thing to remember</p>
                    <p className={styles.sheetText}>{selectedHelper.keyPhrase}</p>
                  </div>

                  <div className={styles.sheetBlock}>
                    <p className={styles.sheetLabel}>Today&apos;s task</p>
                    <p className={styles.sheetText}>{selectedHelper.nextTask}</p>
                  </div>

                  <div className={styles.sheetBlock}>
                    <p className={styles.sheetLabel}>Quick note</p>
                    <p className={styles.sheetText}>{selectedHelper.note}</p>
                  </div>
                </div>

                <div className={styles.sheetActions}>
                  <button type="button" className={styles.actionBtn} onClick={simulateCall}>
                    <span>Call</span>
                  </button>
                  <button type="button" className={styles.actionBtn} onClick={simulateMessage}>
                    <span>Message</span>
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtnPrimary}
                    onClick={sendHandoff}
                  >
                    <span>Send handoff</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.notesRail}>
          <h3 className={styles.notesTitle}>Recent handoffs</h3>
          <div className={styles.notesList}>
            {handoffNotes.map((note) => (
              <div key={note.id} className={styles.noteItem}>
                <span
                  className={styles.noteDot}
                  style={{ background: roleMeta[note.role].accent }}
                />
                <span className={styles.noteText}>{note.text}</span>
                <span className={styles.noteTime}>{note.time}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {flashMessage && (
            <motion.div
              className={styles.flashBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {flashMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
