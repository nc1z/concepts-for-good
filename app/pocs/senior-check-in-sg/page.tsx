"use client";

import Link from "next/link";
import { Nunito } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { seniors as seedSeniors, type Senior } from "./data";
import styles from "./page.module.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
});

const STORAGE_KEY = "cfg-senior-check-in-sg-v1";

type AppState = {
  seniors: Senior[];
};

// ── SVG Streak Ring ────────────────────────────────────────────────────────────
// 14 arc segments around a circle (r=36, cx=44, cy=44, viewBox 0 0 88 88)
// Each segment = 360/14 ≈ 25.71°. A 2° gap between segments.
const SEGMENTS = 14;
const CX = 44;
const CY = 44;
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FULL_ARC = CIRCUMFERENCE / SEGMENTS; // arc length per day
const GAP = 1.8; // gap in px between segments
const SEGMENT_LENGTH = FULL_ARC - GAP;
const STROKE_WIDTH_FILLED = 7;
const STROKE_WIDTH_EMPTY = 3;
const ROTATION_OFFSET = -90; // start from 12 o'clock

function getSegmentOffset(index: number): number {
  // offset so segment i starts at the right angle
  // dashoffset positions the drawn dash so only our segment is visible
  // We rotate via transform on the SVG instead; here just use dashoffset trick
  return CIRCUMFERENCE - (index / SEGMENTS) * CIRCUMFERENCE;
}

type RingSegmentProps = {
  index: number;
  filled: boolean;
  isNew?: boolean;
};

function RingSegment({ index, filled, isNew }: RingSegmentProps) {
  const dashOffset = getSegmentOffset(index);
  const strokeColor = filled ? "#c4622d" : "#e8d8cc";
  const strokeWidth = filled ? STROKE_WIDTH_FILLED : STROKE_WIDTH_EMPTY;

  if (filled && isNew) {
    return (
      <motion.circle
        cx={CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${SEGMENT_LENGTH} ${CIRCUMFERENCE}`}
        strokeDashoffset={dashOffset}
        transform={`rotate(${ROTATION_OFFSET}, ${CX}, ${CY})`}
        initial={{ stroke: "#e8d8cc", strokeWidth: STROKE_WIDTH_EMPTY }}
        animate={{ stroke: "#c4622d", strokeWidth: STROKE_WIDTH_FILLED }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
    );
  }

  return (
    <circle
      cx={CX}
      cy={CY}
      r={RADIUS}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${SEGMENT_LENGTH} ${CIRCUMFERENCE}`}
      strokeDashoffset={dashOffset}
      transform={`rotate(${ROTATION_OFFSET}, ${CX}, ${CY})`}
    />
  );
}

type StreakRingProps = {
  history: boolean[];
  streak: number;
  checkedInToday: boolean;
  newlyChecked?: boolean;
  milestone?: boolean;
};

function StreakRing({ history, streak, checkedInToday, newlyChecked, milestone }: StreakRingProps) {
  // history[0] = oldest day (14 days ago), history[13] = yesterday
  // We show 14 segments: 0-13 = history, "today" segment added after check-in
  const segments = [...history];

  return (
    <div className={styles.ringWrap}>
      <motion.svg
        viewBox="0 0 88 88"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          milestone
            ? {
                scale: [1, 1.12, 0.95, 1.05, 1],
                filter: [
                  "drop-shadow(0 0 0px #c4622d)",
                  "drop-shadow(0 0 12px #d4793a)",
                  "drop-shadow(0 0 6px #d4793a)",
                  "drop-shadow(0 0 10px #c4622d)",
                  "drop-shadow(0 0 0px #c4622d)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {segments.map((filled, i) => (
          <RingSegment
            key={i}
            index={i}
            filled={filled}
            isNew={newlyChecked && i === segments.length - 1 && filled}
          />
        ))}
        {checkedInToday && (
          <RingSegment
            key="today"
            index={segments.length}
            filled={true}
            isNew={newlyChecked}
          />
        )}
      </motion.svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringStreakNum}>{streak}</span>
        <span className={styles.ringStreakLabel}>days</span>
      </div>
    </div>
  );
}

// ── Last check-in label ────────────────────────────────────────────────────────
function lastCheckinLabel(history: boolean[], checkedInToday: boolean): string {
  if (checkedInToday) return "Today";
  // history[13] = yesterday
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]) {
      const daysAgo = history.length - i;
      if (daysAgo === 1) return "Yesterday";
      if (daysAgo >= 4) return `${daysAgo} days ago — follow up`;
      return `${daysAgo} days ago`;
    }
  }
  return "No recent check-in — follow up";
}

function needsFollowUp(history: boolean[], checkedInToday: boolean): boolean {
  if (checkedInToday) return false;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]) {
      const daysAgo = history.length - i;
      return daysAgo >= 4;
    }
  }
  return true;
}

// ── History list (last 7 entries) ─────────────────────────────────────────────
function buildHistoryEntries(history: boolean[], checkedInToday: boolean) {
  const entries: { label: string; checked: boolean }[] = [];
  if (checkedInToday) {
    entries.push({ label: "Today", checked: true });
  }
  for (let i = history.length - 1; i >= 0 && entries.length < 7; i--) {
    const daysAgo = history.length - i;
    let label: string;
    if (daysAgo === 1) label = "Yesterday";
    else if (daysAgo === 7) label = "1 week ago";
    else label = `${daysAgo} days ago`;
    entries.push({ label, checked: history[i] });
  }
  return entries;
}

// ── Senior Card ───────────────────────────────────────────────────────────────
type CardProps = {
  senior: Senior;
  newlyChecked: boolean;
  celebrationActive: boolean;
  onCheckIn: () => void;
  onOpen: () => void;
};

function SeniorCard({ senior, newlyChecked, celebrationActive, onCheckIn, onOpen }: CardProps) {
  const label = lastCheckinLabel(senior.history, senior.checkedInToday);
  const followUp = needsFollowUp(senior.history, senior.checkedInToday);
  const isMilestone = senior.streak === 7 || senior.streak === 30;

  const cardClass = [
    styles.card,
    senior.checkedInToday ? styles.cardCheckedIn : "",
    followUp ? styles.cardNeedsFollowUp : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClass} onClick={onOpen}>
      <div className={styles.cardTop}>
        <StreakRing
          history={senior.history}
          streak={senior.streak}
          checkedInToday={senior.checkedInToday}
          newlyChecked={newlyChecked}
          milestone={celebrationActive && isMilestone}
        />
        <div className={styles.cardNameBlock}>
          <h2 className={styles.cardName}>{senior.name}</h2>
          <p className={styles.cardNeighbourhood}>{senior.neighbourhood}</p>
          <span
            className={`${styles.lastCheckin} ${followUp ? styles.lastCheckinNeedsAttention : ""}`}
          >
            {label}
          </span>
        </div>
      </div>

      <div
        className={`${styles.streakLabel} ${isMilestone ? styles.streakLabelMilestone : ""}`}
      >
        {senior.streak === 0
          ? "No streak yet"
          : senior.streak === 1
            ? "1-day streak"
            : `${senior.streak}-day streak`}
      </div>

      {senior.checkedInToday ? (
        <div className={styles.checkedBadge} onClick={(e) => e.stopPropagation()}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" fill="rgba(56,142,60,0.15)" />
            <path d="M5 9l3 3 5-5" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Checked in today
        </div>
      ) : (
        <button
          type="button"
          className={styles.checkInBtn}
          onClick={(e) => {
            e.stopPropagation();
            onCheckIn();
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <path d="M9 5v4l3 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Check in today
        </button>
      )}
    </article>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
type ModalProps = {
  senior: Senior;
  onCheckIn: () => void;
  onClose: () => void;
};

function SeniorModal({ senior, onCheckIn, onClose }: ModalProps) {
  const historyEntries = buildHistoryEntries(senior.history, senior.checkedInToday);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalCloseRow}>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar}>
            {senior.name.charAt(0)}
          </div>
          <div className={styles.modalHeaderText}>
            <h2 className={styles.modalName}>{senior.name}</h2>
            <p className={styles.modalMeta}>
              {senior.age} years old · {senior.neighbourhood}
            </p>
          </div>
        </div>

        <div className={styles.modalSection}>
          <span className={styles.modalSectionLabel}>Address</span>
          <span className={styles.modalSectionValue}>{senior.address}</span>
        </div>

        <div className={styles.modalSection}>
          <span className={styles.modalSectionLabel}>Emergency contact</span>
          <span className={styles.modalSectionValue}>
            {senior.contactName}
            {senior.contact !== senior.contactName ? ` · ${senior.contact}` : ""}
          </span>
        </div>

        <div className={styles.modalSection}>
          <span className={styles.modalSectionLabel}>Care notes</span>
          <span className={styles.modalSectionValue}>{senior.notes}</span>
        </div>

        <div className={styles.modalSection}>
          <span className={styles.modalSectionLabel}>Recent check-ins</span>
          <ul className={styles.modalHistoryList}>
            {historyEntries.map((entry, i) => (
              <li key={i} className={styles.modalHistoryItem}>
                <span
                  className={`${styles.historyDot} ${
                    entry.checked ? styles.historyDotChecked : styles.historyDotMissed
                  }`}
                />
                <span>{entry.label}</span>
                <span style={{ color: entry.checked ? "#c4622d" : "#b0a097", marginLeft: "auto", fontSize: "0.8rem" }}>
                  {entry.checked ? "Checked in" : "Missed"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {senior.checkedInToday ? (
          <div className={styles.modalCheckedBadge}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="rgba(56,142,60,0.15)" />
              <path d="M6 10l3 3 5-5" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Checked in today
          </div>
        ) : (
          <button
            type="button"
            className={styles.modalCheckInBtn}
            onClick={onCheckIn}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              <path d="M10 6v5l3 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Mark as checked in
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Celebration overlay ───────────────────────────────────────────────────────
type CelebrationProps = {
  streak: number;
  name: string;
};

function CelebrationOverlay({ streak, name }: CelebrationProps) {
  return (
    <motion.div
      className={styles.celebrationOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.celebrationBox}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <div className={styles.celebrationEmoji}>
          {streak >= 30 ? "🌟" : "🤗"}
        </div>
        <h2 className={styles.celebrationTitle}>
          {streak} days — wonderful care!
        </h2>
        <p className={styles.celebrationSub}>
          {streak >= 30
            ? `${name.split(" ")[0]} has been checked in every day for a whole month. Thank you.`
            : `${name.split(" ")[0]} has been checked in every day this week. That means the world.`}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SeniorCheckInSgPage() {
  const [appState, setAppState] = useState<AppState>({ seniors: seedSeniors });
  const [hydrated, setHydrated] = useState(false);
  const [openSeniorId, setOpenSeniorId] = useState<string | null>(null);
  const [newlyCheckedId, setNewlyCheckedId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ id: string; streak: number; name: string } | null>(null);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setAppState(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [hydrated, appState]);

  function handleCheckIn(seniorId: string) {
    setAppState((prev) => {
      const updated = prev.seniors.map((s) => {
        if (s.id !== seniorId) return s;
        if (s.checkedInToday) return s;
        const newStreak = s.streak + 1;
        // Shift history: drop oldest day, add "true" for today (history represents last 14 days up to and including yesterday after check-in)
        const newHistory = [...s.history.slice(1), true];
        return { ...s, checkedInToday: true, streak: newStreak, history: newHistory };
      });
      return { seniors: updated };
    });

    // Mark as newly checked for animation
    setNewlyCheckedId(seniorId);
    setTimeout(() => setNewlyCheckedId(null), 1200);

    // Check for milestone celebration
    const senior = appState.seniors.find((s) => s.id === seniorId);
    if (senior && !senior.checkedInToday) {
      const newStreak = senior.streak + 1;
      if (newStreak === 7 || newStreak === 30) {
        if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
        setCelebration({ id: seniorId, streak: newStreak, name: senior.name });
        celebrationTimer.current = setTimeout(() => setCelebration(null), 3600);
      }
    }
  }

  const openSenior = appState.seniors.find((s) => s.id === openSeniorId) ?? null;

  if (!hydrated) {
    return (
      <main className={`${nunito.variable} ${styles.page}`} style={{ fontFamily: "var(--font-nunito, sans-serif)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#8a5a3a" }}>
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${nunito.variable} ${styles.page}`}
      style={{ fontFamily: "var(--font-nunito, sans-serif)" }}
    >
      {/* Top bar */}
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>
        <span className={styles.appLabel}>Senior Check-In</span>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroKicker}>
          <span className={styles.heroKickerDot} />
          Community care
        </div>
        <h1 className={styles.heroTitle}>
          Keep the people you care for close.
        </h1>
        <p className={styles.heroLede}>
          Mark today&apos;s check-ins for seniors in your care and keep their streak going.
        </p>
        <img
          src="/undraw/undraw_love_9mug.svg"
          alt=""
          aria-hidden="true"
          className={styles.heroIllustration}
        />
      </section>

      {/* Senior roster */}
      <section className={styles.rosterSection}>
        <div className={styles.rosterGrid}>
          {appState.seniors.map((senior) => (
            <SeniorCard
              key={senior.id}
              senior={senior}
              newlyChecked={newlyCheckedId === senior.id}
              celebrationActive={celebration?.id === senior.id}
              onCheckIn={() => handleCheckIn(senior.id)}
              onOpen={() => setOpenSeniorId(senior.id)}
            />
          ))}
        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {openSenior && (
          <SeniorModal
            key={openSenior.id}
            senior={openSenior}
            onCheckIn={() => {
              handleCheckIn(openSenior.id);
            }}
            onClose={() => setOpenSeniorId(null)}
          />
        )}
      </AnimatePresence>

      {/* Milestone celebration */}
      <AnimatePresence>
        {celebration && (
          <CelebrationOverlay
            key={`celebration-${celebration.id}`}
            streak={celebration.streak}
            name={celebration.name}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
