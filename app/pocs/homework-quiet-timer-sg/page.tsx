"use client";

import Link from "next/link";
import { Merriweather, Quicksand } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import {
  buildWaveSteps,
  defaultState,
  STORAGE_KEY,
  subjects,
  type SessionState,
  type Subject,
} from "./data";
import styles from "./page.module.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-homework-quiet-heading",
  weight: ["400", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-homework-quiet-body",
  weight: ["400", "500", "700"],
});

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getSubject(subjectId: string) {
  return subjects.find((subject) => subject.id === subjectId) ?? subjects[0];
}

function loadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as SessionState;
    const subject = getSubject(parsed.subjectId);
    const steps = buildWaveSteps(subject);
    const activeStep = Math.max(0, Math.min(parsed.activeStep ?? 0, steps.length - 1));

    return {
      subjectId: subject.id,
      activeStep,
      secondsLeft:
        typeof parsed.secondsLeft === "number" &&
        parsed.secondsLeft > 0 &&
        parsed.secondsLeft <= steps[activeStep].durationSeconds
          ? parsed.secondsLeft
          : steps[activeStep].durationSeconds,
      isRunning: Boolean(parsed.isRunning),
      finished: Boolean(parsed.finished),
      completedFocusSets:
        typeof parsed.completedFocusSets === "number" && parsed.completedFocusSets >= 0
          ? parsed.completedFocusSets
          : 0,
    } satisfies SessionState;
  } catch {
    return defaultState;
  }
}

export default function HomeworkQuietTimerPage() {
  const [hydrated, setHydrated] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>(defaultState);

  const currentSubject = useMemo(
    () => getSubject(sessionState.subjectId),
    [sessionState.subjectId],
  );
  const waveSteps = useMemo(
    () => buildWaveSteps(currentSubject),
    [currentSubject],
  );
  const currentStep = waveSteps[sessionState.activeStep] ?? waveSteps[0];

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
        const subject = getSubject(current.subjectId);
        const steps = buildWaveSteps(subject);

        if (current.secondsLeft > 1) {
          return { ...current, secondsLeft: current.secondsLeft - 1 };
        }

        const nextStepIndex = current.activeStep + 1;
        if (nextStepIndex >= steps.length) {
          return {
            ...current,
            finished: true,
            isRunning: false,
            secondsLeft: steps[steps.length - 1].durationSeconds,
            completedFocusSets: current.completedFocusSets + 1,
          };
        }

        return {
          ...current,
          activeStep: nextStepIndex,
          secondsLeft: steps[nextStepIndex].durationSeconds,
          isRunning: true,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hydrated, sessionState.finished, sessionState.isRunning]);

  function switchSubject(subject: Subject) {
    const steps = buildWaveSteps(subject);
    setSessionState((current) => ({
      ...current,
      subjectId: subject.id,
      activeStep: 0,
      secondsLeft: steps[0].durationSeconds,
      isRunning: false,
      finished: false,
    }));
  }

  function toggleRunning() {
    setSessionState((current) => ({
      ...(current.finished
        ? {
            ...current,
            activeStep: 0,
            secondsLeft: buildWaveSteps(getSubject(current.subjectId))[0].durationSeconds,
            finished: false,
            isRunning: true,
          }
        : {
            ...current,
            finished: false,
            isRunning: !current.isRunning,
          }),
    }));
  }

  function moveForward() {
    setSessionState((current) => {
      const subject = getSubject(current.subjectId);
      const steps = buildWaveSteps(subject);
      const nextStepIndex = current.activeStep + 1;

      if (nextStepIndex >= steps.length) {
        return {
          ...current,
          finished: true,
          isRunning: false,
          completedFocusSets: current.completedFocusSets + 1,
        };
      }

      return {
        ...current,
        activeStep: nextStepIndex,
        secondsLeft: steps[nextStepIndex].durationSeconds,
        isRunning: false,
      };
    });
  }

  function restartSession() {
    const steps = buildWaveSteps(currentSubject);
    setSessionState((current) => ({
      ...current,
      activeStep: 0,
      secondsLeft: steps[0].durationSeconds,
      isRunning: false,
      finished: false,
    }));
  }

  const progress =
    1 - sessionState.secondsLeft / Math.max(currentStep.durationSeconds, 1);
  const waveHeight =
    currentStep.kind === "focus"
      ? 26 + progress * 46
      : 70 - progress * 36;
  const completedFocusDots = waveSteps
    .slice(0, sessionState.activeStep + (sessionState.finished ? 1 : 0))
    .filter((step) => step.kind === "focus").length;

  return (
    <main className={`${styles.page} ${merriweather.variable} ${quicksand.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Homework Quiet Timer</p>
            <h1>Start one calm homework stretch when the room around you feels noisy.</h1>
            <p className={styles.lede}>
              Pick the subject that needs attention first, then let the wave keep the pace steady.
            </p>
          </div>

          <div className={styles.subjectSwitch} aria-label="Choose a subject">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                className={`${styles.subjectButton} ${subject.id === currentSubject.id ? styles.subjectButtonActive : ""}`}
                onClick={() => switchSubject(subject)}
                style={
                  {
                    ["--subject-accent" as string]: subject.accent,
                    ["--subject-glow" as string]: subject.glow,
                  } as CSSProperties
                }
              >
                <strong>{subject.label}</strong>
                <span>{subject.benefit}</span>
              </button>
            ))}
          </div>

          <div className={styles.heroActionRow}>
            <button type="button" className={styles.primaryButton} onClick={toggleRunning}>
              {sessionState.finished
                ? "Start another quiet stretch"
                : sessionState.isRunning
                  ? "Pause the wave"
                  : "Start this quiet stretch"}
            </button>
            <span className={styles.heroMeta}>3 quiet bursts with two short pauses</span>
          </div>
        </section>

        <section
          className={styles.stage}
          style={
            {
              ["--board-surface" as string]: currentSubject.surface,
              ["--board-accent" as string]: currentSubject.accent,
              ["--board-glow" as string]: currentSubject.glow,
            } as CSSProperties
          }
        >
          <motion.section
            className={styles.waveBoard}
            animate={{ boxShadow: `0 28px 90px ${currentSubject.glow}` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.boardTopline}>
              <div>
                <p className={styles.boardLabel}>{currentStep.label}</p>
                <h2>{sessionState.finished ? "The page can rest here." : currentStep.title}</h2>
              </div>
              <span className={styles.boardTimer}>
                {sessionState.finished ? "Settled" : formatSeconds(sessionState.secondsLeft)}
              </span>
            </div>

            <div className={styles.pool}>
              <motion.div
                className={styles.waveField}
                animate={{ height: `${waveHeight}%` }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <motion.svg
                  viewBox="0 0 1200 220"
                  className={styles.waveBand}
                  preserveAspectRatio="none"
                  animate={{ x: ["0%", "-18%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    d="M0 116C78 95 147 90 222 104C298 118 367 149 441 150C515 151 592 122 665 112C736 103 811 113 882 127C957 142 1038 162 1109 154C1169 147 1228 124 1280 108V220H0Z"
                    className={styles.waveFront}
                  />
                </motion.svg>
                <motion.svg
                  viewBox="0 0 1200 220"
                  className={`${styles.waveBand} ${styles.waveBandBack}`}
                  preserveAspectRatio="none"
                  animate={{ x: ["-12%", "0%"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    d="M0 138C59 122 116 103 191 108C273 113 332 148 414 156C495 164 554 144 636 129C725 112 800 108 873 124C943 140 1005 170 1087 170C1160 170 1236 146 1280 132V220H0Z"
                    className={styles.waveBack}
                  />
                </motion.svg>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentSubject.id}-${currentStep.id}-${sessionState.finished ? "done" : "live"}`}
                  className={styles.poolContent}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  {sessionState.finished ? (
                    <>
                      <p className={styles.contentKicker}>Quiet stretch finished</p>
                      <h3>{currentSubject.label} got one calm round of attention.</h3>
                      <p className={styles.contentPrompt}>
                        Keep the notebook where it is, take a fuller break, and return later if there is still more to do.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={styles.contentKicker}>
                        {currentStep.kind === "focus" ? currentSubject.label : "Pause"}
                      </p>
                      <h3>{currentStep.prompt}</h3>
                      <p className={styles.contentPrompt}>
                        {currentStep.kind === "focus"
                          ? "Let the wave rise while you stay with this one piece of work."
                          : "Let the wave settle while you rest your hands, shoulders, and eyes."}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.boardFooter}>
              <div className={styles.focusTrack} aria-label="Quiet bursts completed">
                {Array.from({ length: 3 }, (_, index) => (
                  <span
                    key={index}
                    className={`${styles.trackDot} ${index < completedFocusDots ? styles.trackDotFilled : ""}`}
                  />
                ))}
              </div>

              <div className={styles.boardActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={sessionState.finished ? toggleRunning : moveForward}
                >
                  {sessionState.finished
                    ? "Start another quiet stretch"
                    : sessionState.activeStep === waveSteps.length - 1
                      ? "Settle this page"
                      : "Move to the next cue"}
                </button>
                <button type="button" className={styles.ghostButton} onClick={restartSession}>
                  Begin from the first burst
                </button>
              </div>
            </div>
          </motion.section>

          <aside className={styles.sideNotes}>
            <section className={styles.notePanel}>
              <p className={styles.noteLabel}>When the wave changes</p>
              <div className={styles.noteList}>
                {waveSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`${styles.noteStrip} ${index === sessionState.activeStep && !sessionState.finished ? styles.noteStripActive : ""}`}
                  >
                    <strong>{step.label}</strong>
                    <span>{step.prompt}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.settledPanel}>
              <p className={styles.noteLabel}>Today&apos;s settled stones</p>
              <div className={styles.stoneRow}>
                {Array.from({ length: Math.max(sessionState.completedFocusSets, 3) }, (_, index) => (
                  <span
                    key={index}
                    className={`${styles.stone} ${index < sessionState.completedFocusSets ? styles.stoneFilled : ""}`}
                  />
                ))}
              </div>
              <p className={styles.settledCopy}>
                {sessionState.completedFocusSets > 0
                  ? `${sessionState.completedFocusSets} quiet stretch${sessionState.completedFocusSets === 1 ? "" : "es"} finished today.`
                  : "Finish one quiet stretch and the first stone will settle here."}
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
