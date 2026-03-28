"use client";

import Link from "next/link";
import { DM_Sans, Fredoka } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  defaultState,
  exerciseCards,
  STORAGE_KEY,
  type SessionState,
} from "./data";
import styles from "./page.module.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-low-cost-exercise-display",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-low-cost-exercise-body",
  weight: ["400", "500", "700"],
});

const TIMER_RADIUS = 88;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatMinutes(cardsCount: number) {
  const totalSeconds = exerciseCards.reduce(
    (sum, card) => sum + card.durationSeconds,
    0,
  );

  return `${Math.ceil(totalSeconds / 60)} minutes · ${cardsCount} guided cards`;
}

function clampIndex(value: number) {
  return Math.max(0, Math.min(value, exerciseCards.length - 1));
}

function loadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as SessionState;
    const activeIndex = clampIndex(parsed.activeIndex ?? 0);
    const currentCard = exerciseCards[activeIndex] ?? exerciseCards[0];

    return {
      activeIndex,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      finished: Boolean(parsed.finished),
      isRunning: Boolean(parsed.isRunning),
      secondsLeft:
        typeof parsed.secondsLeft === "number" &&
        parsed.secondsLeft > 0 &&
        parsed.secondsLeft <= currentCard.durationSeconds
          ? parsed.secondsLeft
          : currentCard.durationSeconds,
    } satisfies SessionState;
  } catch {
    return defaultState;
  }
}

export default function LowCostExercisePage() {
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>(defaultState);

  useEffect(() => {
    setSessionState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  }, [hydrated, sessionState]);

  useEffect(() => {
    if (!hydrated || !sessionState.isRunning || sessionState.finished) return;

    const timer = window.setInterval(() => {
      setSessionState((current) => {
        const activeCard = exerciseCards[current.activeIndex] ?? exerciseCards[0];
        if (current.secondsLeft > 1) {
          return { ...current, secondsLeft: current.secondsLeft - 1 };
        }

        const completedIds = current.completedIds.includes(activeCard.id)
          ? current.completedIds
          : [...current.completedIds, activeCard.id];

        if (current.activeIndex === exerciseCards.length - 1) {
          return {
            ...current,
            completedIds,
            finished: true,
            isRunning: false,
            secondsLeft: activeCard.durationSeconds,
          };
        }

        const nextIndex = current.activeIndex + 1;
        const nextCard = exerciseCards[nextIndex] ?? exerciseCards[0];
        setDirection(1);

        return {
          activeIndex: nextIndex,
          completedIds,
          finished: false,
          isRunning: true,
          secondsLeft: nextCard.durationSeconds,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hydrated, sessionState.finished, sessionState.isRunning]);

  const activeCard = exerciseCards[sessionState.activeIndex] ?? exerciseCards[0];
  const progress =
    1 - sessionState.secondsLeft / Math.max(activeCard.durationSeconds, 1);
  const dashOffset = TIMER_CIRCUMFERENCE * (1 - progress);

  function jumpToCard(nextIndex: number) {
    const safeIndex = clampIndex(nextIndex);
    const nextCard = exerciseCards[safeIndex] ?? exerciseCards[0];
    setDirection(safeIndex > sessionState.activeIndex ? 1 : -1);
    setSessionState((current) => ({
      ...current,
      activeIndex: safeIndex,
      finished: false,
      isRunning: false,
      secondsLeft: nextCard.durationSeconds,
    }));
  }

  function completeCurrentCard() {
    setSessionState((current) => {
      const currentCard = exerciseCards[current.activeIndex] ?? exerciseCards[0];
      const completedIds = current.completedIds.includes(currentCard.id)
        ? current.completedIds
        : [...current.completedIds, currentCard.id];

      if (current.activeIndex === exerciseCards.length - 1) {
        return {
          ...current,
          completedIds,
          finished: true,
          isRunning: false,
        };
      }

      const nextIndex = current.activeIndex + 1;
      const nextCard = exerciseCards[nextIndex] ?? exerciseCards[0];
      setDirection(1);

      return {
        activeIndex: nextIndex,
        completedIds,
        finished: false,
        isRunning: false,
        secondsLeft: nextCard.durationSeconds,
      };
    });
  }

  function restartSet() {
    setDirection(-1);
    setSessionState(defaultState);
  }

  return (
    <main className={`${styles.page} ${fredoka.variable} ${dmSans.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Low-Cost Exercise</p>
            <h1>Follow a short routine you can do at home, in the void deck, or at the fitness corner.</h1>
            <p className={styles.lede}>
              Start with one guided card and move until the timer ring closes.
            </p>
            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() =>
                  setSessionState((current) => ({
                    ...current,
                    finished: false,
                    isRunning: true,
                  }))
                }
              >
                {sessionState.finished
                  ? "Start again"
                  : sessionState.isRunning
                    ? "Keep moving"
                    : "Start the first move"}
              </button>
              <span className={styles.heroMeta}>
                {formatMinutes(exerciseCards.length)}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.stage}>
          <div className={styles.deckShell}>
            <div className={styles.cardStack} aria-hidden="true">
              <span className={styles.stackCardOne} />
              <span className={styles.stackCardTwo} />
            </div>

            <AnimatePresence custom={direction} mode="wait">
              <motion.article
                key={sessionState.finished ? "finished" : activeCard.id}
                custom={direction}
                className={styles.activeCard}
                initial={{ opacity: 0, x: direction > 0 ? 120 : -120, rotate: direction > 0 ? 2 : -2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -120 : 120, rotate: direction > 0 ? -2 : 2 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                drag={sessionState.finished ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -90 && sessionState.activeIndex < exerciseCards.length - 1) {
                    jumpToCard(sessionState.activeIndex + 1);
                  }

                  if (info.offset.x > 90 && sessionState.activeIndex > 0) {
                    jumpToCard(sessionState.activeIndex - 1);
                  }
                }}
                style={
                  {
                    ["--card-accent" as string]: activeCard.accent,
                    ["--card-surface" as string]: activeCard.surface,
                  }
                }
              >
                {sessionState.finished ? (
                  <div className={styles.finishCard}>
                    <p className={styles.cardKicker}>You finished the set</p>
                    <h2>You got a full low-cost routine done.</h2>
                    <p className={styles.cardSummary}>
                      Keep this rhythm for busy weekdays when you want movement without paying for a class.
                    </p>
                    <div className={styles.finishActions}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={restartSet}
                      >
                        Run it again
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => jumpToCard(exerciseCards.length - 1)}
                      >
                        Revisit the last stretch
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.cardTimer}>
                      <svg viewBox="0 0 220 220" className={styles.timerRing} aria-hidden="true">
                        <circle
                          cx="110"
                          cy="110"
                          r={TIMER_RADIUS}
                          className={styles.timerTrack}
                        />
                        <circle
                          cx="110"
                          cy="110"
                          r={TIMER_RADIUS}
                          className={styles.timerProgress}
                          strokeDasharray={TIMER_CIRCUMFERENCE}
                          strokeDashoffset={dashOffset}
                        />
                      </svg>
                      <div className={styles.timerCenter}>
                        <span className={styles.timerLabel}>Time left</span>
                        <strong>{formatSeconds(sessionState.secondsLeft)}</strong>
                        <span className={styles.timerCost}>{activeCard.costLabel}</span>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <div>
                          <p className={styles.cardKicker}>{activeCard.kicker}</p>
                          <h2>{activeCard.title}</h2>
                        </div>
                        <span className={styles.kindBadge}>
                          {activeCard.kind === "rest" ? "Recovery" : "Move"}
                        </span>
                      </div>

                      <p className={styles.cardSummary}>{activeCard.summary}</p>

                      <dl className={styles.cardFacts}>
                        <div>
                          <dt>Why it helps</dt>
                          <dd>{activeCard.focus}</dd>
                        </div>
                        <div>
                          <dt>Where to do it</dt>
                          <dd>{activeCard.place}</dd>
                        </div>
                        <div>
                          <dt>What you need</dt>
                          <dd>{activeCard.equipment}</dd>
                        </div>
                      </dl>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() =>
                            setSessionState((current) => ({
                              ...current,
                              isRunning: !current.isRunning,
                            }))
                          }
                        >
                          {sessionState.isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={completeCurrentCard}
                        >
                          {sessionState.activeIndex === exerciseCards.length - 1
                            ? "Finish the set"
                            : "Next move"}
                        </button>
                        <button
                          type="button"
                          className={styles.ghostButton}
                          onClick={() =>
                            setSessionState((current) => ({
                              ...current,
                              isRunning: false,
                              secondsLeft: activeCard.durationSeconds,
                            }))
                          }
                        >
                          Restart this card
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.article>
            </AnimatePresence>
          </div>

          <aside className={styles.progressPanel}>
            <div className={styles.progressHeader}>
              <div>
                <p className={styles.eyebrow}>Your set</p>
                <h2>Move through the routine</h2>
              </div>
              <span className={styles.progressHint}>Swipe sideways or tap a stop below.</span>
            </div>

            <div className={styles.progressRail}>
              {exerciseCards.map((card, index) => {
                const completed = sessionState.completedIds.includes(card.id);
                const current = index === sessionState.activeIndex && !sessionState.finished;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`${styles.railButton} ${completed ? styles.railButtonDone : ""} ${current ? styles.railButtonCurrent : ""}`}
                    onClick={() => jumpToCard(index)}
                    style={{ ["--rail-accent" as string]: card.accent }}
                  >
                    <span className={styles.railIndex}>
                      {completed ? "✓" : index + 1}
                    </span>
                    <span className={styles.railText}>
                      <strong>{card.kicker}</strong>
                      <em>{card.title}</em>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={styles.footerNote}>
              <strong>Works in small spaces</strong>
              <p>
                Every card works without a paid class, and most of them fit into a hallway, void deck corner, or bench stop.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
