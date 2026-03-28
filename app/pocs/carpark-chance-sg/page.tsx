"use client";

import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import {
  carparks,
  destinations,
  getAvailabilityTier,
  refreshCarparks,
  type Carpark,
} from "./data";
import styles from "./page.module.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});

// Animated number that springs to a new value
function AnimatedCount({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  return <>{display}</>;
}

const SVG_W = 600;
const SVG_H = 340;

type PinProps = {
  cp: Carpark;
  isSelected: boolean;
  onClick: () => void;
};

function CarparkPin({ cp, isSelected, onClick }: PinProps) {
  const tier = getAvailabilityTier(cp.freeLots);
  const cx = (cp.x / 100) * SVG_W;
  const cy = (cp.y / 100) * SVG_H;

  const tierClass =
    tier === "green"
      ? styles.pinGreen
      : tier === "amber"
        ? styles.pinAmber
        : styles.pinRed;

  return (
    <g
      className={`${styles.pinGroup} ${tierClass} ${isSelected ? styles.pinSelected : ""}`}
      transform={`translate(${cx}, ${cy})`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${cp.name}, ${cp.freeLots} lots free`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Outer pulse ring — CSS animation only */}
      <circle className={styles.pulseRing} r={isSelected ? 24 : 18} />
      {/* Main pin circle */}
      <circle className={styles.pinCircle} r={isSelected ? 13 : 10} />
      {/* Lot count label */}
      <text
        className={styles.pinLabel}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isSelected ? 9 : 8}
      >
        {cp.freeLots}
      </text>
    </g>
  );
}

function SideRailCard({
  cp,
  rank,
}: {
  cp: Carpark;
  rank: 1 | 2 | 3;
}) {
  const tier = getAvailabilityTier(cp.freeLots);
  const tierClass =
    tier === "green"
      ? styles.railGreen
      : tier === "amber"
        ? styles.railAmber
        : styles.railRed;

  const rankLabel = rank === 1 ? "Best pick" : rank === 2 ? "Backup" : "Reserve";

  return (
    <motion.div
      className={`${styles.railCard} ${tierClass}`}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: rank * 0.07 }}
      layout
    >
      <div className={styles.railCardTop}>
        <span className={styles.railRank}>{rankLabel}</span>
        <span className={styles.railWalk}>{cp.walkMinutes} min walk</span>
      </div>
      <p className={styles.railName}>{cp.name}</p>
      <p className={styles.railAddress}>{cp.address}</p>
      <div className={styles.railBottom}>
        <span className={`${styles.railLots} ${tierClass}`}>
          <AnimatedCount value={cp.freeLots} />
          <span className={styles.railLotsLabel}> lots free</span>
        </span>
        <span className={styles.railTotal}>of {cp.totalLots}</span>
      </div>
    </motion.div>
  );
}

export default function CarparkChancePage() {
  const [activeDestId, setActiveDestId] = useState(destinations[0].id);
  const [data, setData] = useState(carparks);
  const [loaded, setLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeDest = destinations.find((d) => d.id === activeDestId)!;
  const visible = data.filter((cp) => cp.destinationId === activeDestId);
  const sorted = [...visible].sort((a, b) => {
    // Sort by tier priority then walk time
    const tierScore = (t: string) => (t === "green" ? 0 : t === "amber" ? 1 : 2);
    const diff =
      tierScore(getAvailabilityTier(a.freeLots)) -
      tierScore(getAvailabilityTier(b.freeLots));
    return diff !== 0 ? diff : a.walkMinutes - b.walkMinutes;
  });

  const top3 = sorted.slice(0, 3) as [Carpark?, Carpark?, Carpark?];

  const selectedCp = selectedId ? visible.find((cp) => cp.id === selectedId) : null;

  function handleRefresh() {
    setData((prev) => refreshCarparks(prev));
    setRefreshKey((k) => k + 1);
  }

  function handleDestChange(id: string) {
    setActiveDestId(id);
    setSelectedId(null);
    setLoaded(false);
  }

  function handleCheck() {
    setLoaded(true);
  }

  // Auto-select top pick when destination changes or refreshes
  useEffect(() => {
    if (loaded && sorted.length > 0) {
      setSelectedId(sorted[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDestId, loaded, refreshKey]);

  return (
    <main className={`${styles.page} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <div className={styles.shell}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <span className={styles.topbarBadge}>HDB Carpark Availability</span>
        </header>

        {/* Headline */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Check carparks near your destination<br className={styles.heroBreak} /> before you head out.
          </h1>
          <p className={styles.heroSub}>
            Pick a destination to see nearby lots at a glance — so you leave with a plan, not a guess.
          </p>
        </section>

        {/* Destination tabs */}
        <nav className={styles.destTabs} aria-label="Destination">
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`${styles.destTab} ${activeDestId === d.id ? styles.destTabActive : ""}`}
              onClick={() => handleDestChange(d.id)}
            >
              {d.shortLabel}
            </button>
          ))}
        </nav>

        {/* Main board */}
        <div className={styles.board}>
          {/* Left: SVG canvas */}
          <div className={styles.canvasWrap}>
            <div className={styles.canvasHeader}>
              <span className={styles.canvasTitle}>{activeDest.label}</span>
              {loaded && (
                <span className={styles.canvasLive}>
                  <span className={styles.liveDot} /> Live
                </span>
              )}
            </div>

            <div className={styles.svgWrap}>
              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className={styles.mapSvg}
                role="img"
                aria-label={`Carpark map for ${activeDest.label}`}
              >
                {/* Grid lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#ffffff08"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

                {/* Destination label */}
                <text
                  x={SVG_W / 2}
                  y={SVG_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={styles.destWatermark}
                >
                  {activeDest.shortLabel}
                </text>

                {/* Carpark pins */}
                {visible.map((cp) => (
                  <CarparkPin
                    key={cp.id}
                    cp={cp}
                    isSelected={cp.id === selectedId}
                    onClick={() => {
                      if (!loaded) {
                        setLoaded(true);
                      }
                      setSelectedId(cp.id);
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
              <span className={`${styles.legendDot} ${styles.lgGreen}`} />
              <span className={styles.legendLabel}>30+ free</span>
              <span className={`${styles.legendDot} ${styles.lgAmber}`} />
              <span className={styles.legendLabel}>10–29</span>
              <span className={`${styles.legendDot} ${styles.lgRed}`} />
              <span className={styles.legendLabel}>Under 10</span>
            </div>
          </div>

          {/* Right: side rail */}
          <div className={styles.sideRail}>
            {!loaded ? (
              <div className={styles.railPrompt}>
                <p className={styles.railPromptText}>
                  Tap a carpark on the map, or check all nearby lots now.
                </p>
                <button
                  type="button"
                  className={styles.checkBtn}
                  onClick={handleCheck}
                >
                  Check availability
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDestId + refreshKey}
                  className={styles.railInner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.railHeader}>
                    <span className={styles.railHeaderLabel}>
                      {sorted.length} carpark{sorted.length !== 1 ? "s" : ""} nearby
                    </span>
                    <button
                      type="button"
                      className={styles.refreshBtn}
                      onClick={handleRefresh}
                    >
                      Refresh
                    </button>
                  </div>

                  {top3[0] && (
                    <SideRailCard cp={top3[0]} rank={1} />
                  )}
                  {top3[1] && (
                    <SideRailCard cp={top3[1]} rank={2} />
                  )}
                  {top3[2] && (
                    <SideRailCard cp={top3[2]} rank={3} />
                  )}

                  {selectedCp && !top3.find((c) => c?.id === selectedCp.id) && (
                    <motion.div
                      className={styles.selectedExtra}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className={styles.selectedExtraLabel}>Selected</span>
                      <SideRailCard cp={selectedCp} rank={3} />
                    </motion.div>
                  )}

                  <p className={styles.railNote}>
                    Sorted by availability, then walking distance.
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
