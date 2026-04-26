"use client";

import Link from "next/link";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import {
  emptyStressState,
  recentDays,
  STORAGE_KEY,
  stressQuestions,
  type SavedStressState,
} from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "700"],
});

function loadState(): SavedStressState {
  if (typeof window === "undefined") return emptyStressState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStressState;
    const parsed = JSON.parse(raw) as SavedStressState;
    return parsed && typeof parsed.answers === "object" ? parsed : emptyStressState;
  } catch {
    return emptyStressState;
  }
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getTip(score: number, highestAxis: string) {
  if (score >= 72) {
    return `Keep the next hour smaller. Pick one thing, message someone you trust, and give the ${highestAxis.toLowerCase()} part of the day some room.`;
  }

  if (score >= 48) {
    return `Do one steady thing before the day speeds up again: drink water, step outside, or move the ${highestAxis.toLowerCase()} worry out of your head and onto paper.`;
  }

  return `You look steady enough to continue. Keep one small pause in the day so the ${highestAxis.toLowerCase()} pressure does not build quietly.`;
}

function StressRing({ answers }: { answers: Record<string, number> }) {
  const size = 520;
  const centre = size / 2;
  const answeredCount = Object.keys(answers).length;

  return (
    <svg className={styles.ring} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Your stress shape">
      <defs>
        <filter id="stressGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.circle
        cx={centre}
        cy={centre}
        r="198"
        className={styles.ringHalo}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {stressQuestions.map((question, index) => {
        const angle = -90 + index * (360 / stressQuestions.length);
        const radians = (angle * Math.PI) / 180;
        const endX = centre + Math.cos(radians) * 212;
        const endY = centre + Math.sin(radians) * 212;
        const labelX = centre + Math.cos(radians) * 244;
        const labelY = centre + Math.sin(radians) * 244;
        const answer = answers[question.id] ?? 0;
        const length = 68 + answer * 1.35;

        return (
          <g key={question.id}>
            <line
              x1={centre}
              y1={centre}
              x2={endX}
              y2={endY}
              className={styles.axisLine}
            />
            <motion.line
              x1={centre}
              y1={centre}
              x2={centre + Math.cos(radians) * length}
              y2={centre + Math.sin(radians) * length}
              stroke={question.color}
              className={styles.answerLine}
              initial={false}
              animate={{
                x2: centre + Math.cos(radians) * length,
                y2: centre + Math.sin(radians) * length,
                opacity: answer ? 1 : 0.18,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.circle
              cx={centre + Math.cos(radians) * length}
              cy={centre + Math.sin(radians) * length}
              r={answer ? 7 : 3}
              fill={question.color}
              filter="url(#stressGlow)"
              initial={false}
              animate={{ opacity: answer ? 1 : 0.28 }}
              transition={{ duration: 0.35 }}
            />
            <text x={labelX} y={labelY} className={styles.axisText}>
              {question.axis}
            </text>
          </g>
        );
      })}

      <motion.circle
        cx={centre}
        cy={centre}
        r={52 + answeredCount * 9}
        className={styles.core}
        initial={false}
        animate={{ r: 52 + answeredCount * 9 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <text x={centre} y={centre - 4} className={styles.coreNumber}>
        {answeredCount}/5
      </text>
      <text x={centre} y={centre + 26} className={styles.coreLabel}>
        answered
      </text>
    </svg>
  );
}

export default function CheckMyStressPage() {
  const [state, setState] = useState<SavedStressState>(emptyStressState);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = loadState();
    setState(saved);
    const firstOpen = stressQuestions.findIndex((question) => saved.answers[question.id] === undefined);
    setActiveIndex(firstOpen === -1 ? stressQuestions.length : firstOpen);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastSavedAt: Date.now() }),
    );
  }, [mounted, state]);

  const activeQuestion = stressQuestions[activeIndex];
  const answers = state.answers;
  const answerValues = Object.values(answers);
  const score = average(answerValues);
  const answeredCount = answerValues.length;
  const highestQuestion = stressQuestions.reduce(
    (highest, question) =>
      (answers[question.id] ?? -1) > (answers[highest.id] ?? -1) ? question : highest,
    stressQuestions[0],
  );
  const finished = answeredCount === stressQuestions.length;

  const trendData = useMemo(
    () => [
      ...recentDays.slice(1),
      {
        day: "Now",
        value: score || recentDays[recentDays.length - 1].value,
      },
    ],
    [score],
  );

  function choose(questionId: string, value: number) {
    setState((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [questionId]: value,
      },
    }));
    setActiveIndex((current) => Math.min(current + 1, stressQuestions.length));
  }

  function startAgain() {
    setState(emptyStressState);
    setActiveIndex(0);
  }

  return (
    <main className={`${styles.page} ${fraunces.variable} ${plexMono.variable} ${publicSans.variable}`}>
      <Link href="/" className={styles.backLink}>
        Back to gallery
      </Link>

      <div className={styles.noise} aria-hidden="true" />
      <motion.div
        className={styles.bleedOrb}
        aria-hidden="true"
        animate={{
          scale: finished ? 1.08 : 0.92 + answeredCount * 0.03,
          opacity: 0.24 + answeredCount * 0.05,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <section className={styles.stage}>
        <motion.div
          className={styles.titleBlock}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className={styles.kicker}>Check My Stress</p>
          <h1>Answer five quick questions and see which part of today needs care.</h1>
        </motion.div>

        <motion.div
          className={styles.ringWrap}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.72, ease: "easeOut" }}
        >
          <StressRing answers={answers} />
        </motion.div>

        <div className={styles.trendStrip} aria-label="Recent stress trend">
          <ResponsiveContainer width="100%" height={132}>
            <RadialBarChart
              data={trendData}
              innerRadius="18%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              barSize={7}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={12} background fill="#f1c45f" />
            </RadialBarChart>
          </ResponsiveContainer>
          <span>this week</span>
        </div>
      </section>

      <section className={styles.questionDock} aria-live="polite">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="finished"
              className={styles.result}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
            >
              <div className={styles.resultScore}>
                <span>{score}</span>
                <p>today</p>
              </div>
              <div className={styles.resultCopy}>
                <h2>{highestQuestion.axis} needs the most care today.</h2>
                <p>{getTip(score, highestQuestion.axis)}</p>
              </div>
              <button type="button" className={styles.quietButton} onClick={startAgain}>
                Check again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeQuestion.id}
              className={styles.question}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={styles.questionText}>
                <span>
                  {activeIndex + 1} of {stressQuestions.length}
                </span>
                <h2>{activeQuestion.prompt}</h2>
              </div>
              <div className={styles.choiceRail}>
                {activeQuestion.choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    className={styles.choice}
                    onClick={() => choose(activeQuestion.id, choice.value)}
                    style={{ ["--choice-color" as string]: activeQuestion.color }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
