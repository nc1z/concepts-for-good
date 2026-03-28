"use client";

import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  defaultState,
  stageCopy,
  stageOrder,
  STORAGE_KEY,
  type AppState,
  type KitchenStage,
  type RoleSlot,
  type Session,
} from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-cooking-circle-display",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-cooking-circle-body",
  weight: ["400", "500", "700"],
});

function loadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;

    if (!parsed?.selectedSessionId || !Array.isArray(parsed.sessions)) {
      return defaultState;
    }

    return parsed;
  } catch {
    return defaultState;
  }
}

function getSessionStep(session: Session) {
  const prepReady = session.roles
    .filter((role) => role.stage === "prep")
    .every((role) => role.filledBy);
  const cookReady = session.roles
    .filter((role) => role.stage === "cook")
    .every((role) => role.filledBy);
  const shareReady = session.roles
    .filter((role) => role.stage === "share")
    .every((role) => role.filledBy);

  if (prepReady && cookReady && shareReady) return 3;
  if (prepReady && cookReady) return 2;
  if (prepReady) return 1;
  return 0;
}

function flowLabel(step: number) {
  if (step === 3) return "Ready to share";
  if (step === 2) return "Serving table";
  if (step === 1) return "On the stove";
  return "Ingredients on the table";
}

function roleCountLabel(roles: RoleSlot[]) {
  const filled = roles.filter((role) => role.filledBy).length;
  return `${filled} of ${roles.length} roles covered`;
}

function RoleCard({
  role,
  onToggle,
}: {
  role: RoleSlot;
  onToggle: () => void;
}) {
  const isOpen = !role.filledBy;
  const isYou = role.filledBy === "You";
  const isLocked = !!role.filledBy && !isYou;

  return (
    <motion.article
      layout
      className={`${styles.roleCard} ${isOpen ? styles.roleCardOpen : styles.roleCardFilled} ${isYou ? styles.roleCardYou : ""}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className={styles.roleCardTop}>
        <p className={styles.roleTitle}>{role.title}</p>
        <span className={`${styles.roleStatus} ${isOpen ? styles.roleStatusOpen : styles.roleStatusFilled}`}>
          {isOpen ? "Open" : role.filledBy}
        </span>
      </div>

      <p className={styles.roleNote}>{role.note}</p>

      <button
        type="button"
        className={`${styles.roleButton} ${isOpen ? styles.roleButtonOpen : styles.roleButtonFilled}`}
        onClick={onToggle}
        disabled={isLocked}
      >
        {isOpen ? "Take this role" : isYou ? "Leave this role" : "Covered"}
      </button>
    </motion.article>
  );
}

function StageColumn({
  stage,
  roles,
  onToggleRole,
}: {
  stage: KitchenStage;
  roles: RoleSlot[];
  onToggleRole: (roleId: string) => void;
}) {
  const openCount = roles.filter((role) => !role.filledBy).length;
  const copy = stageCopy[stage];

  return (
    <section className={`${styles.stageColumn} ${openCount > 0 ? styles.stageColumnNeedsHelp : ""}`}>
      <div className={styles.stageHeader}>
        <div>
          <p className={styles.stageLabel}>{copy.label}</p>
          <h2 className={styles.stageTitle}>{copy.shortLabel}</h2>
        </div>
        <span className={`${styles.stageBadge} ${openCount > 0 ? styles.stageBadgeOpen : styles.stageBadgeReady}`}>
          {openCount > 0 ? `${openCount} open` : "Set"}
        </span>
      </div>

      <p className={styles.stageNote}>{copy.note}</p>

      <div className={styles.roleList}>
        <AnimatePresence initial={false}>
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onToggle={() => onToggleRole(role.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className={styles.stageFooter}>
        {openCount > 0 ? copy.openLabel : copy.readyLabel}
      </p>
    </section>
  );
}

const flowStations = [
  { key: "ingredients", label: "Ingredients" },
  { key: "stove", label: "Cooking" },
  { key: "table", label: "Serving" },
  { key: "welcome", label: "Shared meal" },
];

function DishFlow({ session }: { session: Session }) {
  const step = getSessionStep(session);
  const activeStation = flowStations[Math.min(step, flowStations.length - 1)]?.key;

  return (
    <section className={styles.flowSection}>
      <div className={styles.flowHeader}>
        <div>
          <p className={styles.flowLabel}>Meal journey</p>
          <h2 className={styles.flowTitle}>{flowLabel(step)}</h2>
        </div>
        <p className={styles.flowSummary}>{roleCountLabel(session.roles)}</p>
      </div>

      <LayoutGroup>
        <div className={styles.flowBoard}>
          {flowStations.map((station, index) => (
            <div
              key={station.key}
              className={`${styles.flowStation} ${station.key === activeStation ? styles.flowStationActive : ""}`}
            >
              <div className={styles.flowStationTop}>
                <span className={styles.flowStationNumber}>0{index + 1}</span>
                <span className={styles.flowStationLabel}>{station.label}</span>
              </div>

              <div className={styles.flowTokenStack}>
                {station.key === activeStation ? (
                  session.dishes.map((dish, dishIndex) => (
                    <motion.div
                      key={dish.id}
                      layoutId={dish.id}
                      className={styles.dishToken}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: dishIndex * 0.04 }}
                    >
                      <span className={styles.dishTokenName}>{dish.name}</span>
                      <span className={styles.dishTokenNote}>{dish.note}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.flowEmpty}>The food moves here once the earlier roles are covered.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
}

function SessionCard({
  session,
  isActive,
  onSelect,
}: {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
}) {
  const openRoles = session.roles.filter((role) => !role.filledBy).length;

  return (
    <button
      type="button"
      className={`${styles.sessionCard} ${isActive ? styles.sessionCardActive : ""}`}
      onClick={onSelect}
    >
      <div className={styles.sessionCardTop}>
        <span className={styles.sessionTime}>{session.timeLabel}</span>
        <span className={styles.sessionNeighbourhood}>{session.neighbourhood}</span>
      </div>
      <h2 className={styles.sessionTitle}>{session.title}</h2>
      <p className={styles.sessionVenue}>{session.venue}</p>
      <div className={styles.sessionMeta}>
        <span>{session.dishes.length} dishes planned</span>
        <span>{openRoles} roles open</span>
      </div>
    </button>
  );
}

export default function CommunityCookingCirclePage() {
  const [appState, setAppState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAppState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState, hydrated]);

  const selectedSession = useMemo(
    () =>
      appState.sessions.find((session) => session.id === appState.selectedSessionId) ??
      appState.sessions[0],
    [appState.selectedSessionId, appState.sessions],
  );

  const openRoles = selectedSession.roles.filter((role) => !role.filledBy).length;
  const filledRoles = selectedSession.roles.length - openRoles;

  function selectSession(sessionId: string) {
    setAppState((current) => ({ ...current, selectedSessionId: sessionId }));
  }

  function toggleRole(roleId: string) {
    setAppState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => {
        if (session.id !== current.selectedSessionId) return session;

        return {
          ...session,
          roles: session.roles.map((role) => {
            if (role.id !== roleId) return role;
            if (!role.filledBy) return { ...role, filledBy: "You" };
            if (role.filledBy === "You") return { ...role, filledBy: null };
            return role;
          }),
        };
      }),
    }));
  }

  return (
    <main
      className={`${styles.page} ${fraunces.variable} ${dmSans.variable}`}
      style={{
        fontFamily:
          "var(--font-cooking-circle-body), var(--font-sans), sans-serif",
      }}
    >
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Community Cooking Circle</p>
            <h1 className={styles.heroTitle}>
              Join this week&apos;s neighbourhood cooking circle and see which prep, cook, and sharing roles still need a hand.
            </h1>
            <p className={styles.heroLede}>
              Pick a circle, claim one small job, and watch the meal move from the pantry table to a shared dinner.
            </p>
          </div>
        </section>

        <section className={styles.sessionStrip} aria-label="Cooking circles this week">
          {appState.sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isActive={session.id === selectedSession.id}
              onSelect={() => selectSession(session.id)}
            />
          ))}
        </section>

        <section className={styles.board}>
          <div className={styles.boardTop}>
            <div>
              <p className={styles.boardLabel}>Tonight&apos;s kitchen</p>
              <h2 className={styles.boardTitle}>{selectedSession.title}</h2>
              <p className={styles.boardVenue}>
                {selectedSession.timeLabel} · {selectedSession.venue}
              </p>
              <p className={styles.hostNote}>{selectedSession.hostNote}</p>
            </div>

            <div className={styles.boardSummary}>
              <div className={styles.summaryPill}>
                <span className={styles.summaryNumber}>{filledRoles}</span>
                <span className={styles.summaryText}>roles covered</span>
              </div>
              <div className={`${styles.summaryPill} ${openRoles > 0 ? styles.summaryPillOpen : ""}`}>
                <span className={styles.summaryNumber}>{openRoles}</span>
                <span className={styles.summaryText}>still open</span>
              </div>
            </div>
          </div>

          <div className={styles.stageGrid}>
            {stageOrder.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                roles={selectedSession.roles.filter((role) => role.stage === stage)}
                onToggleRole={toggleRole}
              />
            ))}
          </div>
        </section>

        <DishFlow session={selectedSession} />

        {hydrated && openRoles === 0 ? (
          <motion.div
            className={styles.readyBanner}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            Every kitchen role is covered. Bring a container if you want to pack a portion home.
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
