"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Chivo, Azeret_Mono } from "next/font/google";
import { useMemo, useState } from "react";

import { renewalSteps } from "./data";
import styles from "./page.module.css";

const display = Chivo({
  subsets: ["latin"],
  variable: "--font-comcare-display",
  weight: ["400", "600", "700", "800"],
});

const mono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-comcare-mono",
  weight: ["400", "600"],
});

function getTrackPosition(daysLeft: number, focusWeek: boolean) {
  const clamped = Math.max(0, Math.min(20, daysLeft));

  if (focusWeek) {
    if (clamped <= 7) {
      return 12 + (7 - clamped) * 8;
    }
    return 70 + (20 - clamped) * 2;
  }

  return 12 + (1 - Math.pow(clamped / 20, 1.65)) * 78;
}

export default function ComcareRenewalCalendarPage() {
  const [selectedId, setSelectedId] = useState(renewalSteps[0].id);
  const [focusWeek, setFocusWeek] = useState(true);

  const selectedStep = useMemo(
    () => renewalSteps.find((step) => step.id === selectedId) ?? renewalSteps[0],
    [selectedId],
  );

  return (
    <main className={`${styles.page} ${display.variable} ${mono.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
      </header>

      <section className={styles.firstScreen}>
        <h1>Track your ComCare renewal dates and papers in one view, so you always know what comes next.</h1>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => setFocusWeek((current) => !current)}
        >
          {focusWeek ? "Show full timeline" : "Focus on this week"}
        </button>
      </section>

      <section className={styles.shell}>
        <div className={styles.ruler}>
          <span className={styles.todayFlag}>Today</span>
          <span className={styles.deadlineFlag}>Later dates</span>
        </div>

        <div className={styles.timelineSurface}>
          <div className={styles.trackLine} aria-hidden="true" />

          {renewalSteps.map((step, index) => {
            const x = getTrackPosition(step.daysLeft, focusWeek);
            const active = selectedId === step.id;

            return (
              <motion.button
                key={step.id}
                type="button"
                className={`${styles.deadlineNode} ${active ? styles.deadlineNodeActive : ""}`}
                style={
                  {
                    left: `${x}%`,
                    top: index % 2 === 0 ? "0.8rem" : "9rem",
                  } as React.CSSProperties
                }
                animate={{
                  left: `${x}%`,
                  y: active ? -8 : 0,
                }}
                transition={{ type: "spring", stiffness: 140, damping: 24 }}
                onClick={() => setSelectedId(step.id)}
              >
                <span className={styles.deadlineDay}>{step.daysLeft}d</span>
                <strong>{step.title}</strong>
                <em>{step.dateLabel}</em>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={selectedStep.id}
            className={styles.detailPanel}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className={styles.detailMeta}>
              {selectedStep.dateLabel} · {selectedStep.place}
            </p>
            <h2>{selectedStep.title}</h2>
            <p className={styles.detailAction}>{selectedStep.action}</p>

            <ul className={styles.documentList}>
              {selectedStep.documents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className={styles.detailNote}>{selectedStep.note}</p>
          </motion.article>
        </AnimatePresence>
      </section>
    </main>
  );
}

