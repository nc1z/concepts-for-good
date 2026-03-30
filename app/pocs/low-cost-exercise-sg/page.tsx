"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Alegreya, Bebas_Neue, DM_Sans } from "next/font/google";

import {
  defaultState,
  exerciseCards,
  STORAGE_KEY,
  type SessionState,
} from "./data";
import styles from "./page.module.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-low-cost-exercise-display",
  weight: "400",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-low-cost-exercise-body",
  weight: ["400", "500", "700"],
});

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-low-cost-exercise-accent",
  weight: ["500", "700"],
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

function formatSetLength() {
  const totalSeconds = exerciseCards.reduce(
    (sum, card) => sum + card.durationSeconds,
    0,
  );

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds}s`;
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
  const completedCount = sessionState.completedIds.length;

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
    <main
      className={`${styles.page} ${bebas.variable} ${dmSans.variable} ${alegreya.variable}`}
    >
      <div className={styles.shell}>
        <div className={styles.atmosphere} aria-hidden="true">
          <span className={styles.glowOne} />
          <span className={styles.glowTwo} />
          <span className={styles.gridLines} />
        </div>

        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroBand}>
            <p className={styles.eyebrow}>Low-cost exercise for Singapore residents</p>
            <div className={styles.heroHeadline}>
              <h1>Follow a free routine you can do at home, in the void deck, or by the fitness corner.</h1>
              <p className={styles.lede}>
                Start the first move and keep going until the ring closes. Each card shows what to do next without sending you to a class or a gym.
              </p>
            </div>
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
                  ? "Run the set again"
                  : sessionState.isRunning
                    ? "Keep the timer going"
                    : "Start the first move"}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={restartSet}
              >
                Restart from the top
              </button>
            </div>
          </div>

          <dl className={styles.heroStats}>
            <div>
              <dt>Total set</dt>
              <dd>{formatSetLength()}</dd>
            </div>
            <div>
              <dt>Best spots</dt>
              <dd>HDB corridor, void deck, fitness corner</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd>Free or already around you</dd>
            </div>
          </dl>
        </section>

        <section className={styles.stage}>
          <aside className={styles.progressStrip} aria-label="Routine progress">
            <div className={styles.progressIntro}>
              <p className={styles.progressLabel}>Routine track</p>
              <strong>{sessionState.finished ? "Set complete" : `${completedCount} of ${exerciseCards.length} done`}</strong>
              <span>Swipe sideways or use the controls below the card.</span>
            </div>

            <div className={styles.progressRail}>
              {exerciseCards.map((card, index) => {
                const completed = sessionState.completedIds.includes(card.id);
                const current = index === sessionState.activeIndex && !sessionState.finished;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`${styles.railStop} ${completed ? styles.railStopDone : ""} ${current ? styles.railStopCurrent : ""}`}
                    onClick={() => jumpToCard(index)}
                    style={{ ["--rail-accent" as string]: card.accent }}
                    aria-current={current ? "step" : undefined}
                  >
                    <span className={styles.railIndex}>{completed ? "✓" : `0${index + 1}`.slice(-2)}</span>
                    <span className={styles.railMeta}>
                      <strong>{card.cueWord}</strong>
                      <em>{card.kicker}</em>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className={styles.deckShell}>
            <div className={styles.deckShadow} aria-hidden="true" />

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
                    <p className={styles.cardKicker}>Full set done</p>
                    <h2>You finished a no-cost routine you can repeat on a normal weekday.</h2>
                    <p className={styles.cardSummary}>
                      Save this for mornings before work, evenings downstairs, or the days when you only have a small patch of space.
                    </p>
                    <div className={styles.finishMetrics}>
                      <span>{formatMinutes(exerciseCards.length)}</span>
                      <span>{exerciseCards.filter((card) => card.kind === "move").length} movement cards</span>
                      <span>0 paid classes</span>
                    </div>
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
                      <div className={styles.timerOrbitLabel}>
                        <span>{activeCard.costLabel}</span>
                        <strong>{activeCard.rhythm}</strong>
                      </div>
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
                        <span className={styles.timerCount}>
                          Card {sessionState.activeIndex + 1} of {exerciseCards.length}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <div>
                          <p className={styles.cardKicker}>{activeCard.kicker}</p>
                          <p className={styles.cueWord}>{activeCard.cueWord}</p>
                          <h2>{activeCard.title}</h2>
                        </div>
                        <span className={styles.kindBadge}>
                          {activeCard.kind === "rest" ? "Recovery" : "Move"}
                        </span>
                      </div>

                      <p className={styles.cardSummary}>{activeCard.summary}</p>

                      <ul className={styles.cueList}>
                        {activeCard.cues.map((cue) => (
                          <li key={cue}>{cue}</li>
                        ))}
                      </ul>

                      <div className={styles.cardNotes}>
                        <p>
                          <strong>Why it helps</strong>
                          <span>{activeCard.focus}</span>
                        </p>
                        <p>
                          <strong>Where to do it</strong>
                          <span>{activeCard.place}</span>
                        </p>
                        <p>
                          <strong>What you need</strong>
                          <span>{activeCard.equipment}</span>
                        </p>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.ghostButton}
                          onClick={() => jumpToCard(sessionState.activeIndex - 1)}
                          disabled={sessionState.activeIndex === 0}
                        >
                          Previous card
                        </button>
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
                          Replay this card
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section className={styles.footerNote}>
          <strong>Small-space friendly</strong>
          <p>
            Most of this set fits in a hallway, living room, void deck corner, or beside a bench.
          </p>
        </section>
      </div>
    </main>
  );
}
