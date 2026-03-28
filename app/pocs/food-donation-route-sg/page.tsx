"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { motion, Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { defaultState, type AppState, type Stop } from "./data";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
});

const STORAGE_KEY = "cfg-food-donation-route-sg-v1";

// ─── SVG path helpers ──────────────────────────────────────────────────────

type Point = { x: number; y: number };

function buildPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cy = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${cy}, ${cur.x} ${cy}, ${cur.x} ${cur.y}`;
  }
  return d;
}

// ─── Stop card (uses Reorder.Item) ────────────────────────────────────────

function StopCard({
  stop,
  sequenceNumber,
  isActive,
  isDone,
  nodeRef,
  onToggleActive,
  onToggleDone,
}: {
  stop: Stop;
  sequenceNumber: number;
  isActive: boolean;
  isDone: boolean;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  onToggleActive: () => void;
  onToggleDone: () => void;
}) {
  const isDropoff = stop.type === "Dropoff";
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const cardClass = [
    styles.stopCard,
    !isActive && styles.stopCardInactive,
    isDone && styles.stopCardDone,
    isDropoff && styles.stopCardDropoff,
  ]
    .filter(Boolean)
    .join(" ");

  const nodeClass = [
    styles.stopNode,
    isDropoff && styles.stopNodeDropoff,
    !isActive && styles.stopNodeInactive,
    isDone && !isDropoff && styles.stopNodeDone,
    isDone && isDropoff && styles.stopNodeDoneDropoff,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Reorder.Item
      value={stop}
      id={stop.id}
      style={{ y }}
      as="li"
      className={styles.stopItem}
      dragControls={dragControls}
    >
      {/* Drag handle */}
      <div
        className={styles.dragHandle}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <svg
          width="12"
          height="20"
          viewBox="0 0 12 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="3" cy="4" r="1.5" />
          <circle cx="9" cy="4" r="1.5" />
          <circle cx="3" cy="10" r="1.5" />
          <circle cx="9" cy="10" r="1.5" />
          <circle cx="3" cy="16" r="1.5" />
          <circle cx="9" cy="16" r="1.5" />
        </svg>
      </div>

      {/* Node dot — used for SVG path measurement */}
      <div className={styles.stopConnector}>
        <div ref={nodeRef} className={nodeClass} />
      </div>

      {/* Card body */}
      <div className={cardClass}>
        <div className={styles.stopCardTop}>
          <div className={styles.stopMeta}>
            <span className={styles.stopNumber}>
              {String(sequenceNumber).padStart(2, "0")}
            </span>
            <span
              className={`${styles.stopTypeBadge} ${isDropoff ? styles.badgeDropoff : styles.badgePickup}`}
            >
              {stop.type}
            </span>
          </div>

          <div className={styles.stopActions}>
            <button
              type="button"
              title={isDone ? "Mark as pending" : "Mark as done"}
              className={`${styles.actionBtn} ${isDone ? styles.actionBtnActive : ""}`}
              onClick={onToggleDone}
              aria-pressed={isDone}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </button>

            <button
              type="button"
              title={isActive ? "Skip this stop" : "Include this stop"}
              className={`${styles.actionBtn} ${!isActive ? styles.actionBtnToggleOff : ""}`}
              onClick={onToggleActive}
              aria-pressed={isActive}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {isActive ? (
                  <path d="M6 1v10M1 6h10" />
                ) : (
                  <path d="M2 2l8 8M10 2l-8 8" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <h3 className={`${styles.stopName} ${isDone ? styles.stopNameDone : ""}`}>
          {stop.name}
        </h3>

        <div className={styles.stopDetails}>
          <span className={styles.stopDetail}>
            <strong>{stop.area}</strong>
          </span>
          <span className={styles.stopDetail}>{stop.portionsLabel}</span>
          <span className={styles.stopDetail}>{stop.window}</span>
        </div>

        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.stopDoneLabel}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="5" cy="5" r="5" />
            </svg>
            Done
          </motion.div>
        )}
      </div>
    </Reorder.Item>
  );
}

// ─── SVG connector overlay ─────────────────────────────────────────────────

function RoutePathSvg({
  nodeRefs,
  stops,
  activeIds,
  containerRef,
}: {
  nodeRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement | null>>>;
  stops: Stop[];
  activeIds: string[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [paths, setPaths] = useState<
    { d: string; id: string; isDropoff: boolean; isActive: boolean }[]
  >([]);
  const [dashOffset, setDashOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const activeStops = stops.filter((s) => activeIds.includes(s.id));
    const newPaths: typeof paths = [];

    for (let i = 0; i < activeStops.length - 1; i++) {
      const from = activeStops[i];
      const to = activeStops[i + 1];
      const fromRef = nodeRefs.current[from.id]?.current;
      const toRef = nodeRefs.current[to.id]?.current;
      if (!fromRef || !toRef) continue;

      const fromRect = fromRef.getBoundingClientRect();
      const toRect = toRef.getBoundingClientRect();

      const fx = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fy = fromRect.top + fromRect.height / 2 - containerRect.top;
      const tx = toRect.left + toRect.width / 2 - containerRect.left;
      const ty = toRect.top + toRect.height / 2 - containerRect.top;

      const d = buildPath([
        { x: fx, y: fy },
        { x: tx, y: ty },
      ]);

      const isDropoff = to.type === "Dropoff";
      const isActive = activeIds.includes(from.id) && activeIds.includes(to.id);
      newPaths.push({ d, id: `${from.id}-${to.id}`, isDropoff, isActive });
    }

    setPaths(newPaths);
  }, [stops, activeIds, containerRef, nodeRefs]);

  // Recalculate on every animation frame while mounted so reorders animate
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      recalculate();
      frame++;
      // After initial burst, slow down to every 4 frames
      rafRef.current = requestAnimationFrame(frame < 20 ? loop : slowLoop);
    };
    const slowLoop = () => {
      recalculate();
      rafRef.current = requestAnimationFrame(slowLoop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [recalculate]);

  // Animate dashoffset for flowing effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDashOffset((v) => (v - 1) % 22);
    }, 40);
    return () => clearInterval(intervalId);
  }, []);

  if (paths.length === 0) return null;

  return (
    <svg className={styles.svgCanvas} aria-hidden="true">
      {paths.map(({ d, id, isDropoff }) => (
        <path
          key={id}
          d={d}
          className={`${styles.routePath} ${isDropoff ? styles.routePathDropoff : ""}`}
          strokeDashoffset={dashOffset}
        />
      ))}
    </svg>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function FoodDonationRouteSGPage() {
  const [appState, setAppState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // One ref per stop, keyed by stop id
  const nodeRefsMap = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Ensure a ref exists for every stop id
  const ensureRef = useCallback(
    (id: string): React.RefObject<HTMLDivElement | null> => {
      if (!nodeRefsMap.current[id]) {
        nodeRefsMap.current[id] = { current: null };
      }
      return nodeRefsMap.current[id];
    },
    [],
  );

  // Hydrate from localStorage
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setAppState(JSON.parse(raw) as AppState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [hydrated, appState]);

  // Derived
  const activeStops = appState.stops.filter((s) =>
    appState.activeIds.includes(s.id),
  );
  const pickups = activeStops.filter((s) => s.type === "Pickup");
  const totalPortions = pickups.reduce((acc, s) => {
    const match = s.portionsLabel.match(/(\d+)/);
    return acc + (match ? parseInt(match[1], 10) : 0);
  }, 0);
  const doneCount = appState.doneIds.length;

  function handleReorder(newStops: Stop[]) {
    setAppState((prev) => ({ ...prev, stops: newStops }));
  }

  function toggleActive(id: string) {
    setAppState((prev) => ({
      ...prev,
      activeIds: prev.activeIds.includes(id)
        ? prev.activeIds.filter((x) => x !== id)
        : [...prev.activeIds, id],
    }));
  }

  function toggleDone(id: string) {
    setAppState((prev) => ({
      ...prev,
      doneIds: prev.doneIds.includes(id)
        ? prev.doneIds.filter((x) => x !== id)
        : [...prev.doneIds, id],
    }));
  }

  return (
    <main
      className={`${styles.page} ${spaceGrotesk.variable}`}
      style={{ fontFamily: "var(--font-space), var(--font-sans), sans-serif" }}
    >
      {/* Nav */}
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 2L4 7l5 5" />
          </svg>
          Back to gallery
        </Link>
        <span className={styles.topbarMeta}>Food rescue — Sat night run</span>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>
          <span className={styles.heroDot} aria-hidden="true" />
          Food Donation Route
        </p>
        <h1 className={styles.heroHeadline}>
          Plan your pickup stops for tonight and see your route take shape before you leave.
        </h1>
        <p className={styles.heroLede}>
          Add or skip stops, drag to change the order, and mark each one done as you go.
        </p>
      </section>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeStops.length}</span>
          <span className={styles.statLabel}>Active stops</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{pickups.length}</span>
          <span className={styles.statLabel}>Pickups</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalPortions}</span>
          <span className={styles.statLabel}>Portions tonight</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{doneCount}/{appState.stops.length}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
      </div>

      {/* Main layout */}
      <div className={styles.main}>
        {/* Route diagram */}
        <div className={styles.routeDiagram}>
          <div className={styles.routeDiagramInner} ref={containerRef}>
            {/* SVG path overlay */}
            <RoutePathSvg
              nodeRefs={nodeRefsMap}
              stops={appState.stops}
              activeIds={appState.activeIds}
              containerRef={containerRef}
            />

            {/* Reorderable stop list */}
            <Reorder.Group
              axis="y"
              values={appState.stops}
              onReorder={handleReorder}
              as="ol"
              className={styles.stopList}
            >
              {appState.stops.map((stop, index) => {
                const ref = ensureRef(stop.id);
                return (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    sequenceNumber={index + 1}
                    isActive={appState.activeIds.includes(stop.id)}
                    isDone={appState.doneIds.includes(stop.id)}
                    nodeRef={ref}
                    onToggleActive={() => toggleActive(stop.id)}
                    onToggleDone={() => toggleDone(stop.id)}
                  />
                );
              })}
            </Reorder.Group>
          </div>
        </div>

        {/* Sidebar — collection summary */}
        <aside className={styles.sidebar}>
          <section className={styles.sideSection}>
            <p className={styles.sideSectionLabel}>Tonight&apos;s collection</p>
            <h2 className={styles.sideSectionTitle}>What you&apos;re picking up</h2>
            <ul className={styles.collectionList}>
              {appState.stops
                .filter((s) => s.type === "Pickup" && appState.activeIds.includes(s.id))
                .map((s) => (
                  <li
                    key={s.id}
                    className={`${styles.collectionItem} ${appState.doneIds.includes(s.id) ? styles.done : ""}`}
                  >
                    <span className={styles.collectionItemName}>{s.name}</span>
                    <span className={styles.collectionItemPortions}>
                      {s.portionsLabel}
                    </span>
                  </li>
                ))}
            </ul>
            {totalPortions > 0 && (
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total portions</span>
                <span className={styles.totalValue}>{totalPortions}</span>
              </div>
            )}
          </section>

          <hr className={styles.divider} />

          <section className={styles.sideSection}>
            <p className={styles.sideSectionLabel}>Drop-off points</p>
            <h2 className={styles.sideSectionTitle}>Where it goes</h2>
            <ul className={styles.collectionList}>
              {appState.stops
                .filter((s) => s.type === "Dropoff" && appState.activeIds.includes(s.id))
                .map((s) => (
                  <li
                    key={s.id}
                    className={`${styles.collectionItem} ${appState.doneIds.includes(s.id) ? styles.done : ""}`}
                  >
                    <span className={styles.collectionItemName}>{s.name}</span>
                    <span className={styles.collectionItemPortions}>{s.window}</span>
                  </li>
                ))}
            </ul>
          </section>

          <hr className={styles.divider} />

          <p className={styles.routeHint}>
            Drag stops up or down to change the order. The route updates as you move them.
            Tap the tick to mark a stop done, or the cross to skip it tonight.
          </p>
        </aside>
      </div>
    </main>
  );
}
