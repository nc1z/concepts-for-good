"use client";

import Link from "next/link";
import { Cormorant_Garamond, Nunito, IBM_Plex_Mono } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { outingOptions } from "./data";
import styles from "./page.module.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

function dialLabel(value: number) {
  if (value <= 33) return "Low";
  if (value <= 66) return "Steady";
  return "High";
}

export default function ElderSocialOutingPage() {
  const [energy, setEnergy] = useState(40);
  const [heat, setHeat] = useState(32);
  const [walking, setWalking] = useState(28);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  const rankedOutings = useMemo(() => {
    return [...outingOptions]
      .map((outing) => {
        const distance =
          Math.abs(energy - outing.energyNeed) +
          Math.abs(heat - outing.heatExposure) +
          Math.abs(walking - outing.walkingNeed);

        const comfortScore = Math.max(8, 100 - Math.round(distance / 2.4));

        return {
          ...outing,
          comfortScore,
        };
      })
      .sort((a, b) => b.comfortScore - a.comfortScore);
  }, [energy, heat, walking]);

  const suggestions = rankedOutings.slice(0, 3);
  const topPick = suggestions[0];

  return (
    <main className={`${styles.page} ${display.variable} ${body.variable} ${mono.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
      </header>

      <section className={styles.firstScreen}>
        <p className={styles.kicker}>For seniors, caregivers, and befrienders</p>
        <h1>Plan a comfortable outing with seniors in minutes.</h1>
        <p className={styles.lede}>Set today&apos;s comfort dials to see where to go, when to leave, and how gently to pace the visit.</p>
        <a href="#planner" className={styles.primaryAction}>
          Set comfort dials
        </a>
      </section>

      <section id="planner" className={styles.chatStage} aria-label="Outing planner">
        <div className={styles.chatLane}>
          <article className={`${styles.bubble} ${styles.assistantBubble}`}>
            <p className={styles.sender}>Outing guide</p>
            <p>Share how today feels, then I will line up outings that match your pace.</p>
          </article>

          <article className={`${styles.bubble} ${styles.userBubble}`}>
            <p className={styles.sender}>You</p>
            <p>
              Energy {dialLabel(energy)}, heat comfort {dialLabel(heat)}, walking comfort {dialLabel(walking)}.
            </p>
          </article>

          <article className={`${styles.bubble} ${styles.assistantBubble}`}>
            <p className={styles.sender}>Outing guide</p>
            <p>These are the easiest options for today.</p>
            <ul className={styles.suggestionList}>
              <AnimatePresence initial={false}>
                {suggestions.map((outing, index) => (
                  <motion.li
                    key={outing.id}
                    className={styles.suggestionRow}
                    style={{ ["--score" as string]: `${outing.comfortScore}` }}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.06 }}
                  >
                    <div className={styles.suggestionHead}>
                      <h2>{outing.name}</h2>
                      <span>{outing.comfortScore}% comfort fit</span>
                    </div>
                    <p className={styles.meta}>
                      {outing.area} · Best at {outing.bestTime}
                    </p>
                    <p>{outing.summary}</p>
                    <ul className={styles.stepList}>
                      {outing.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => setSavedPlanId(outing.id)} className={styles.saveButton}>
                      Save this plan
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </article>

          <AnimatePresence>
            {savedPlanId ? (
              <motion.article
                key={savedPlanId}
                className={`${styles.bubble} ${styles.userBubble} ${styles.confirmationBubble}`}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className={styles.sender}>You</p>
                <p>Saved. We will use this as today&apos;s outing plan.</p>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>

        <aside className={styles.dialDock} aria-label="Comfort dials">
          <h2>Comfort dials</h2>
          <label className={styles.dialRow}>
            <span>Energy today</span>
            <input type="range" min={0} max={100} value={energy} onChange={(event) => setEnergy(Number(event.target.value))} />
            <strong>{dialLabel(energy)}</strong>
          </label>
          <label className={styles.dialRow}>
            <span>Heat comfort</span>
            <input type="range" min={0} max={100} value={heat} onChange={(event) => setHeat(Number(event.target.value))} />
            <strong>{dialLabel(heat)}</strong>
          </label>
          <label className={styles.dialRow}>
            <span>Walking comfort</span>
            <input
              type="range"
              min={0}
              max={100}
              value={walking}
              onChange={(event) => setWalking(Number(event.target.value))}
            />
            <strong>{dialLabel(walking)}</strong>
          </label>

          <div className={styles.topPick}>
            <p className={styles.topPickLabel}>Best match right now</p>
            <strong>{topPick.name}</strong>
            <p>{topPick.bestTime}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

