"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import {
  focusDurationOptions,
  breakDurationOptions,
  type TimerSession,
} from "./data";

type TimerPhase = "setup" | "focus" | "break" | "paused";

export default function HomeworkQuietTimer() {
  const [phase, setPhase] = useState<TimerPhase>("setup");
  const [focusDuration, setFocusDuration] = useState(20);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const startFocus = useCallback(() => {
    setTotalTime(focusDuration * 60);
    setTimeRemaining(focusDuration * 60);
    setPhase("focus");
  }, [focusDuration]);

  const startBreak = useCallback(() => {
    setTotalTime(breakDuration * 60);
    setTimeRemaining(breakDuration * 60);
    setPhase("break");
  }, [breakDuration]);

  const completeSession = useCallback(
    (type: "focus" | "break") => {
      const newSession: TimerSession = {
        id: Date.now().toString(),
        duration: type === "focus" ? focusDuration : breakDuration,
        type,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => [...prev, newSession]);

      if (type === "focus") {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        setTimeout(() => startBreak(), 1500);
      } else {
        setPhase("setup");
      }
    },
    [focusDuration, breakDuration, startBreak]
  );

  useEffect(() => {
    if (phase !== "focus" && phase !== "break") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          completeSession(phase);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, completeSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;
  const waveHeight = `${Math.min(progress * 100 + 5, 100)}%`;

  const completedFocusSessions = sessions.filter((s) => s.type === "focus").length;

  return (
    <div className={styles.container}>
      {/* Soft breathing wave background */}
      <div className={styles.waveContainer}>
        <motion.div
          className={styles.wave}
          style={{ height: waveHeight }}
          animate={{
            height: waveHeight,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={styles.waveSecondary}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {phase === "setup" && (
            <motion.div
              key="setup"
              className={styles.setupPanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={styles.title}>Quiet Time</h1>
              <p className={styles.subtitle}>
                Short, calm focus sessions for homework in busy homes
              </p>

              {completedFocusSessions > 0 && (
                <motion.div
                  className={styles.completedBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className={styles.completedCount}>
                    {completedFocusSessions}
                  </span>
                  <span className={styles.completedLabel}>
                    focus
                    {completedFocusSessions === 1 ? "" : "s"} done today
                  </span>
                </motion.div>
              )}

              <div className={styles.durationSelector}>
                <span className={styles.label}>Focus for</span>
                <div className={styles.options}>
                  {focusDurationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.option} ${
                        focusDuration === opt.value ? styles.selected : ""
                      }`}
                      onClick={() => setFocusDuration(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.durationSelector}>
                <span className={styles.label}>Then rest for</span>
                <div className={styles.options}>
                  {breakDurationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.option} ${
                        breakDuration === opt.value ? styles.selected : ""
                      }`}
                      onClick={() => setBreakDuration(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                className={styles.startButton}
                onClick={startFocus}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start quiet time
              </motion.button>
            </motion.div>
          )}

          {(phase === "focus" || phase === "break") && (
            <motion.div
              key="timer"
              className={styles.timerDisplay}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.phaseIndicator}>
                {phase === "focus" ? "Focus time" : "Rest time"}
              </div>

              <motion.div
                className={styles.timeDisplay}
                key={timeRemaining}
                initial={{ opacity: 0.5, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {formatTime(timeRemaining)}
              </motion.div>

              <p className={styles.timeHint}>
                {phase === "focus"
                  ? "The wave rises as you focus"
                  : "Let your mind rest now"}
              </p>

              <div className={styles.timerControls}>
                <motion.button
                  className={styles.stopButton}
                  onClick={() => setPhase("setup")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  End session
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className={styles.celebration}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.celebrationText}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className={styles.celebrationEmoji}>🌊</span>
              <span>Good focus</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle footer with session count */}
      {phase !== "setup" && (
        <motion.div
          className={styles.subtleFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        >
          {sessions.length > 0 && (
            <span>
              {sessions.filter((s) => s.type === "focus").length} focus{" "}
              {sessions.filter((s) => s.type === "break").length} rest
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
