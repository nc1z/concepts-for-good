"use client";

import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { animate } from "animejs";
import { useEffect, useMemo, useRef, useState } from "react";

import { causes, skillPool, startingSkills } from "./data";
import styles from "./page.module.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

const orbitPoints = [
  { x: 50, y: 6 },
  { x: 77, y: 20 },
  { x: 84, y: 50 },
  { x: 70, y: 79 },
  { x: 30, y: 79 },
  { x: 16, y: 50 },
];

export default function VolunteerMatchPage() {
  const [index, setIndex] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(startingSkills);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const cause = causes[index];
  const matchedSkills = selectedSkills.filter((skill) => cause.needs.includes(skill));
  const fit = Math.round((matchedSkills.length / cause.needs.length) * 100);

  useEffect(() => {
    if (!orbitRef.current) return;

    const nodes = orbitRef.current.querySelectorAll("[data-orbit-node]");
    const animation = animate(nodes, {
      scale: [0.88, 1],
      opacity: [0, 1],
      rotate: [-12, 0],
      delay: (_, nodeIndex) => nodeIndex * 65,
      duration: 500,
      easing: "outCubic",
    });

    return () => {
      animation.pause();
    };
  }, [cause.id]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    );
  };

  const orbitSkills = useMemo(() => {
    const needed = cause.needs;
    const extras = skillPool.filter((skill) => !needed.includes(skill)).slice(0, 3);
    return [...needed, ...extras];
  }, [cause.needs]);

  return (
    <main className={`${styles.page} ${cormorant.variable} ${manrope.variable}`}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Volunteer Match</p>
            <h1>See which kind of help fits you best right now.</h1>
            <p className={styles.lede}>
              Move through live opportunities and keep the strengths you can bring close at hand.
            </p>
          </div>
          <img
            src="/undraw/undraw_referral_ihsd.svg"
            alt=""
            aria-hidden="true"
            className={styles.heroIllustration}
          />
        </section>

        <section className={styles.skillBench}>
          <div className={styles.skillBenchCopy}>
            <h3>Your strengths</h3>
            <p>Tap the ones you could bring to the next shift.</p>
          </div>

          <div className={styles.skillTray}>
            {skillPool.map((skill) => {
              const active = selectedSkills.includes(skill);
              const needed = cause.needs.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  className={[
                    styles.skillToken,
                    active ? styles.skillTokenActive : "",
                    active && needed ? styles.skillTokenMatched : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.stage}>
          <div className={styles.stageCopy}>
            <div className={styles.resultHeader}>
              <p className={styles.stageTopline}>
                {cause.area} · {cause.time}
              </p>
              <h2>{cause.title}</h2>
            </div>
            <p>{cause.summary}</p>
            <div className={styles.fitMeter}>
              <span>Fit</span>
              <strong>{fit}%</strong>
            </div>
            <p className={styles.impact}>{cause.impact}</p>
            <div className={styles.navButtons}>
              <button type="button" onClick={() => setIndex((current) => (current - 1 + causes.length) % causes.length)}>
                ← Previous match
              </button>
              <button type="button" onClick={() => setIndex((current) => (current + 1) % causes.length)}>
                Next match →
              </button>
            </div>
          </div>

          <div className={styles.orbit} ref={orbitRef} style={{ ["--accent" as string]: cause.accent }}>
            <div className={styles.core}>
              <span className={styles.coreLabel}>Needed here</span>
              <strong>{matchedSkills.length === 0 ? "Choose your strengths" : `${matchedSkills.length} line up`}</strong>
            </div>

            {orbitSkills.map((skill, orbitIndex) => {
              const isMatched = cause.needs.includes(skill);
              const isSelected = selectedSkills.includes(skill);
              const point = orbitPoints[orbitIndex] ?? orbitPoints[0];

              return (
                <div
                  key={skill}
                  data-orbit-node
                  className={[
                    styles.orbitNode,
                    isMatched ? styles.orbitNodeNeeded : "",
                    isSelected ? styles.orbitNodeSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  {skill}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
