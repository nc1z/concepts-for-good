"use client";

import axios from "axios";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { type CSSProperties, useMemo, useState } from "react";
import useSWR from "swr";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buildRoundWindows, type ScorePoint, ZONES, type ZoneId } from "./data";
import styles from "./page.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-taxi-gap",
  weight: ["400", "500", "600", "700", "800"],
});

type TaxiApiResponse = {
  features?: unknown[];
  value?: unknown[];
  items?: Array<{ taxis?: unknown[] }>;
};

type PlayState = "playing" | "won" | "lost";

const TAXI_FEED = "https://api.data.gov.sg/v1/transport/taxi-availability";
const WIN_SCORE = 80;
const START_LIVES = 3;

async function fetchTaxiCount(url: string): Promise<number> {
  const response = await axios.get<TaxiApiResponse>(url, { timeout: 7000 });
  const payload = response.data;

  if (Array.isArray(payload.features)) return payload.features.length;
  if (Array.isArray(payload.value)) return payload.value.length;
  if (Array.isArray(payload.items) && Array.isArray(payload.items[0]?.taxis)) {
    return payload.items[0].taxis.length;
  }
  return 2800;
}

function trendLabel(windowCount: number, maxCount: number): string {
  const delta = maxCount - windowCount;
  if (delta <= 0) return "best window";
  if (delta < 70) return "close";
  return "riskier";
}

export default function TaxiGapWatchPage() {
  const [zone, setZone] = useState<ZoneId>("central");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [playState, setPlayState] = useState<PlayState>("playing");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<ScorePoint[]>([]);
  const [feedback, setFeedback] = useState<string>("Pick the strongest taxi window before supply thins out.");

  const { data: baselineCount } = useSWR<number>(TAXI_FEED, fetchTaxiCount, {
    refreshInterval: 12 * 60 * 1000,
    revalidateOnFocus: false,
    fallbackData: 2800,
  });

  const activeZone = useMemo(() => ZONES.find((item) => item.id === zone) ?? ZONES[0], [zone]);
  const windows = useMemo(
    () => buildRoundWindows(baselineCount ?? 2800, activeZone.multiplier, round),
    [activeZone.multiplier, baselineCount, round]
  );

  const maxCount = useMemo(() => Math.max(...windows.map((window) => window.count)), [windows]);
  const level = Math.floor((round - 1) / 4) + 1;

  function handlePick(windowId: string) {
    if (playState !== "playing") return;
    const chosen = windows.find((window) => window.id === windowId);
    if (!chosen) return;

    setSelectedId(windowId);
    const correct = chosen.count === maxCount;
    const nextScore = score + (correct ? 12 + level : 0);
    const nextLives = correct ? lives : lives - 1;

    setHistory((prev) => [
      ...prev.slice(-7),
      { round, chosen: chosen.count, best: maxCount },
    ]);

    if (correct) {
      setScore(nextScore);
      setFeedback(
        `${chosen.label} was the strongest call. You kept today's trip safer.`
      );
    } else {
      setLives(nextLives);
      setFeedback(
        `${chosen.label} looked tempting, but ${windows.find((window) => window.count === maxCount)?.label.toLowerCase() ?? "another window"} had better supply.`
      );
    }

    if (nextScore >= WIN_SCORE) {
      setPlayState("won");
      return;
    }
    if (nextLives <= 0) {
      setPlayState("lost");
      return;
    }

    window.setTimeout(() => {
      setRound((prev) => prev + 1);
      setSelectedId(null);
    }, 650);
  }

  function restart() {
    setRound(1);
    setScore(0);
    setLives(START_LIVES);
    setPlayState("playing");
    setSelectedId(null);
    setHistory([]);
    setFeedback("Pick the strongest taxi window before supply thins out.");
  }

  return (
    <main className={`${styles.page} ${bricolage.variable}`}>
      <Link href="/" className={styles.backLink}>
        ← Back to gallery
      </Link>

      <div className={styles.bgPulse} />

      <section className={styles.hud}>
        <p className={styles.kicker}>Taxi Gap Watch</p>
        <h1 className={styles.title}>Catch the safest ride window</h1>
        <p className={styles.lede}>
          Shift workers, caregivers, and seniors can play one quick round before leaving.
        </p>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Score</span>
            <strong>{score}</strong>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Lives</span>
            <strong>{Array.from({ length: lives }).map(() => "♥").join(" ") || "0"}</strong>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Level</span>
            <strong>{level}</strong>
          </div>
        </div>
      </section>

      <section className={styles.zoneRow} aria-label="Pick zone">
        {ZONES.map((zoneOption) => (
          <button
            key={zoneOption.id}
            type="button"
            className={`${styles.zoneChip} ${zoneOption.id === zone ? styles.zoneChipActive : ""}`}
            onClick={() => setZone(zoneOption.id)}
            style={{ "--chip-accent": zoneOption.color } as CSSProperties}
          >
            {zoneOption.label}
          </button>
        ))}
      </section>

      <section className={styles.arena}>
        {windows.map((windowOption) => (
          <motion.button
            key={`${round}-${windowOption.id}`}
            type="button"
            className={`${styles.windowTile} ${selectedId === windowOption.id ? styles.windowTileSelected : ""}`}
            onClick={() => handlePick(windowOption.id)}
            disabled={playState !== "playing"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <span className={styles.windowLabel}>{windowOption.label}</span>
            <strong className={styles.windowCount}>{windowOption.count.toLocaleString()}</strong>
            <span className={styles.windowHint}>{trendLabel(windowOption.count, maxCount)}</span>
          </motion.button>
        ))}
      </section>

      <p className={styles.feedback}>{feedback}</p>

      <section className={styles.chartWrap}>
        <h2 className={styles.chartTitle}>Round history</h2>
        <div className={styles.chartShell}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.18)" />
              <XAxis dataKey="round" stroke="rgba(255,255,255,0.72)" />
              <YAxis stroke="rgba(255,255,255,0.72)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 12, 37, 0.9)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "10px",
                  color: "#fff7d6",
                }}
              />
              <Line type="monotone" dataKey="best" stroke="#ffd166" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="chosen" stroke="#79c8ff" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <AnimatePresence>
        {playState !== "playing" && (
          <motion.section
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.overlayCard}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2>{playState === "won" ? "You found safer timing windows." : "Supply thinned too quickly."}</h2>
              <p>
                {playState === "won"
                  ? "Strong calls helped you beat the rush before supply dropped."
                  : "Try again and wait for the stronger window before leaving."}
              </p>
              <button type="button" className={styles.restartBtn} onClick={restart}>
                Play again
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
