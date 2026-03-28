"use client";

import Link from "next/link";
import { Lexend } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { guideTasks, STORAGE_KEY } from "./data";
import styles from "./page.module.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-kiosk",
  weight: ["400", "500", "600", "700", "800"],
});

type ScreenState =
  | { screen: "welcome" }
  | { screen: "tasks" }
  | { screen: "steps"; taskId: string; stepIndex: number }
  | { screen: "done"; taskId: string };

type Direction = 1 | -1;

function loadState(): ScreenState {
  if (typeof window === "undefined") {
    return { screen: "welcome" };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { screen: "welcome" };
    const parsed = JSON.parse(raw) as ScreenState;
    return parsed;
  } catch {
    return { screen: "welcome" };
  }
}

function PhoneScene({ kind }: { kind: "paynow" | "calendar" | "qr" }) {
  const base = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className={styles.sceneWrap}>
      <svg
        viewBox="0 0 420 300"
        className={styles.sceneSvg}
        role="img"
        aria-label="Large phone illustration"
      >
        <rect x="86" y="16" width="248" height="268" rx="34" fill="#1f2e2c" />
        <rect x="102" y="34" width="216" height="232" rx="24" fill="#fffaf2" />
        <rect x="178" y="22" width="64" height="8" rx="999" fill="#66706e" />

        {kind === "paynow" && (
          <g>
            <motion.rect {...base} x="126" y="62" width="168" height="54" rx="20" fill="#d8f0ed" />
            <motion.rect {...base} x="126" y="132" width="168" height="72" rx="24" fill="#0d6a66" />
            <motion.rect {...base} x="150" y="224" width="120" height="18" rx="999" fill="#d7ddd9" />
            <motion.path
              {...base}
              d="M176 164h24v-24h20v24h24v20h-24v24h-20v-24h-24z"
              fill="#fffaf2"
            />
          </g>
        )}

        {kind === "calendar" && (
          <g>
            <motion.rect {...base} x="122" y="58" width="172" height="148" rx="24" fill="#fff" stroke="#d8ddd7" />
            <motion.rect {...base} x="122" y="58" width="172" height="42" rx="24" fill="#d8f0ed" />
            <motion.circle {...base} cx="158" cy="79" r="8" fill="#0d6a66" />
            <motion.circle {...base} cx="258" cy="79" r="8" fill="#0d6a66" />
            <motion.rect {...base} x="146" y="124" width="36" height="32" rx="10" fill="#f4e5c8" />
            <motion.rect {...base} x="192" y="124" width="36" height="32" rx="10" fill="#f4e5c8" />
            <motion.rect {...base} x="238" y="124" width="36" height="32" rx="10" fill="#0d6a66" />
            <motion.rect {...base} x="146" y="168" width="128" height="18" rx="999" fill="#d7ddd9" />
            <motion.rect {...base} x="158" y="222" width="100" height="20" rx="999" fill="#0d6a66" />
          </g>
        )}

        {kind === "qr" && (
          <g>
            <motion.rect {...base} x="124" y="58" width="172" height="172" rx="28" fill="#f7ecda" />
            <motion.rect {...base} x="146" y="82" width="34" height="34" rx="8" fill="#1f2e2c" />
            <motion.rect {...base} x="240" y="82" width="34" height="34" rx="8" fill="#1f2e2c" />
            <motion.rect {...base} x="146" y="174" width="34" height="34" rx="8" fill="#1f2e2c" />
            <motion.rect {...base} x="196" y="122" width="28" height="28" rx="6" fill="#1f2e2c" />
            <motion.rect {...base} x="236" y="138" width="18" height="18" rx="4" fill="#1f2e2c" />
            <motion.rect {...base} x="206" y="172" width="18" height="18" rx="4" fill="#1f2e2c" />
            <motion.path
              {...base}
              d="M112 244l28-28M308 244l-28-28M112 46l28 28M308 46l-28 28"
              stroke="#0d6a66"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

const transition = {
  enter: (direction: Direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: Direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
  }),
};

export default function DigitalHelpForSeniorsPage() {
  const [state, setState] = useState<ScreenState>({ screen: "welcome" });
  const [direction, setDirection] = useState<Direction>(1);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeTask = useMemo(() => {
    if (state.screen === "steps" || state.screen === "done") {
      return guideTasks.find((task) => task.id === state.taskId) ?? null;
    }
    return null;
  }, [state]);

  const goToTasks = () => {
    setDirection(-1);
    setState({ screen: "tasks" });
  };

  const startTask = (taskId: string) => {
    setDirection(1);
    setState({ screen: "steps", taskId, stepIndex: 0 });
  };

  const goBack = () => {
    if (state.screen === "welcome") return;
    setDirection(-1);

    if (state.screen === "tasks") {
      setState({ screen: "welcome" });
      return;
    }

    if (state.screen === "steps") {
      if (state.stepIndex === 0) {
        setState({ screen: "tasks" });
        return;
      }

      setState({
        screen: "steps",
        taskId: state.taskId,
        stepIndex: state.stepIndex - 1,
      });
      return;
    }

    setState({ screen: "tasks" });
  };

  const goNext = () => {
    if (state.screen !== "steps" || !activeTask) return;
    setDirection(1);

    if (state.stepIndex === activeTask.steps.length - 1) {
      setState({ screen: "done", taskId: activeTask.id });
      return;
    }

    setState({
      screen: "steps",
      taskId: activeTask.id,
      stepIndex: state.stepIndex + 1,
    });
  };

  return (
    <main className={`${styles.page} ${lexend.variable}`}>
      <div className={styles.frame}>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          Back to gallery
        </Link>

        <div className={styles.screenWrap}>
          <AnimatePresence custom={direction} mode="wait">
            {state.screen === "welcome" && (
              <motion.section
                key="welcome"
                custom={direction}
                variants={transition}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: "easeOut" }}
                className={styles.screen}
              >
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} />
                  Daily phone help
                </div>
                <h1 className={styles.title}>Follow phone tasks one calm step at a time.</h1>
                <p className={styles.lede}>
                  If using a phone feels confusing, this guide shows one thing to do on each screen.
                </p>
                <img
                  src="/undraw/undraw_continuous-learning_a1ld.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.welcomeIllustration}
                />
                <div className={styles.finishButtons}>
                  <button type="button" className={styles.ghostButton} onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className={styles.startButton} onClick={goToTasks}>
                    Start
                  </button>
                </div>
              </motion.section>
            )}

            {state.screen === "tasks" && (
              <motion.section
                key="tasks"
                custom={direction}
                variants={transition}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: "easeOut" }}
                className={styles.screen}
              >
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} />
                  Choose one task
                </div>
                <h1 className={styles.title}>What do you want help with today?</h1>
                <div className={styles.taskGrid}>
                  {guideTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      className={styles.taskButton}
                      onClick={() => startTask(task.id)}
                    >
                      <span className={styles.taskCategory}>{task.category}</span>
                      <h2 className={styles.taskTitle}>{task.title}</h2>
                      <p className={styles.taskIntro}>{task.intro}</p>
                    </button>
                  ))}
                </div>
                <div className={styles.finishButtons}>
                  <button type="button" className={styles.ghostButton} onClick={goBack}>
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => startTask(guideTasks[0].id)}
                  >
                    Start with {guideTasks[0].shortTitle}
                  </button>
                </div>
              </motion.section>
            )}

            {state.screen === "steps" && activeTask && (
              <motion.section
                key={`${activeTask.id}-${state.stepIndex}`}
                custom={direction}
                variants={transition}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: "easeOut" }}
                className={styles.screen}
              >
                <div className={styles.stepMeta}>
                  {activeTask.shortTitle} · Step {state.stepIndex + 1} of {activeTask.steps.length}
                </div>
                <PhoneScene kind={activeTask.illustration} />
                <h1 className={styles.stepTitle}>{activeTask.steps[state.stepIndex].title}</h1>
                <p className={styles.stepBody}>{activeTask.steps[state.stepIndex].body}</p>
                <p className={styles.stepCue}>{activeTask.steps[state.stepIndex].cue}</p>
                <div className={styles.finishButtons}>
                  <button type="button" className={styles.ghostButton} onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className={styles.navButton} onClick={goNext}>
                    {state.stepIndex === activeTask.steps.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              </motion.section>
            )}

            {state.screen === "done" && activeTask && (
              <motion.section
                key={`done-${activeTask.id}`}
                custom={direction}
                variants={transition}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: "easeOut" }}
                className={styles.screen}
              >
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} />
                  Finished
                </div>
                <PhoneScene kind={activeTask.illustration} />
                <h1 className={styles.title}>{activeTask.finishTitle}</h1>
                <p className={styles.lede}>{activeTask.finishNote}</p>
                <div className={styles.finishButtons}>
                  <button type="button" className={styles.ghostButton} onClick={goToTasks}>
                    Choose another task
                  </button>
                  <button
                    type="button"
                    className={styles.startButton}
                    onClick={() => startTask(activeTask.id)}
                  >
                    Run through this again
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
