"use client";

import Link from "next/link";
import { Bebas_Neue, IBM_Plex_Sans, Space_Mono } from "next/font/google";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { defaultState, type AppState, type Stop } from "./data";
import styles from "./page.module.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const STORAGE_KEY = "cfg-food-donation-route-sg-v2";

type Point = { x: number; y: number };

function buildPath(points: Point[]): string {
  if (points.length < 2) return "";

  let route = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const cy = (prev.y + current.y) / 2;
    route += ` C ${prev.x} ${cy}, ${current.x} ${cy}, ${current.x} ${current.y}`;
  }

  return route;
}

function StopRow({
  stop,
  index,
  active,
  done,
  nodeRef,
  onToggleActive,
  onToggleDone,
}: {
  stop: Stop;
  index: number;
  active: boolean;
  done: boolean;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  onToggleActive: () => void;
  onToggleDone: () => void;
}) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const isDropoff = stop.type === "Dropoff";

  return (
    <Reorder.Item value={stop} id={stop.id} style={{ y }} className={styles.stopRow} dragControls={dragControls}>
      <div className={styles.dragGrip} onPointerDown={(event) => dragControls.start(event)}>
        <span />
        <span />
        <span />
      </div>

      <div className={styles.nodeLane}>
        <div
          ref={nodeRef}
          className={`${styles.routeNode} ${isDropoff ? styles.dropoffNode : styles.pickupNode} ${
            !active ? styles.nodeMuted : ""
          } ${done ? styles.nodeDone : ""}`}
        />
      </div>

      <article className={`${styles.stopBody} ${!active ? styles.stopBodyMuted : ""}`}>
        <div className={styles.stopTop}>
          <p className={styles.stopIndex}>{String(index + 1).padStart(2, "0")}</p>
          <p className={`${styles.stopType} ${isDropoff ? styles.dropoffType : styles.pickupType}`}>{stop.type}</p>
        </div>
        <h2 className={styles.stopName}>{stop.name}</h2>
        <p className={styles.stopMeta}>
          {stop.area} • {stop.window} • {stop.portionsLabel}
        </p>
        <div className={styles.stopActions}>
          <button type="button" onClick={onToggleActive} className={styles.flatButton} aria-pressed={active}>
            {active ? "On route" : "Skipped"}
          </button>
          <button type="button" onClick={onToggleDone} className={styles.flatButton} aria-pressed={done}>
            {done ? "Done" : "Pending"}
          </button>
        </div>
      </article>
    </Reorder.Item>
  );
}

function RoutePath({
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
  const [paths, setPaths] = useState<{ id: string; path: string; dropoff: boolean }[]>([]);
  const [dashOffset, setDashOffset] = useState(0);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rootRect = container.getBoundingClientRect();
    const activeStops = stops.filter((stop) => activeIds.includes(stop.id));
    const nextPaths: { id: string; path: string; dropoff: boolean }[] = [];

    for (let i = 0; i < activeStops.length - 1; i++) {
      const from = activeStops[i];
      const to = activeStops[i + 1];
      const fromNode = nodeRefs.current[from.id]?.current;
      const toNode = nodeRefs.current[to.id]?.current;

      if (!fromNode || !toNode) continue;

      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const points = [
        {
          x: fromRect.left + fromRect.width / 2 - rootRect.left,
          y: fromRect.top + fromRect.height / 2 - rootRect.top,
        },
        {
          x: toRect.left + toRect.width / 2 - rootRect.left,
          y: toRect.top + toRect.height / 2 - rootRect.top,
        },
      ];

      nextPaths.push({
        id: `${from.id}-${to.id}`,
        path: buildPath(points),
        dropoff: to.type === "Dropoff",
      });
    }

    setPaths(nextPaths);
  }, [activeIds, containerRef, nodeRefs, stops]);

  useEffect(() => {
    let animationFrame = 0;
    const loop = () => {
      recalculate();
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [recalculate]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDashOffset((value) => (value - 1) % 20);
    }, 45);

    return () => window.clearInterval(interval);
  }, []);

  if (!paths.length) return null;

  return (
    <svg className={styles.pathLayer} aria-hidden="true">
      {paths.map((segment) => (
        <path
          key={segment.id}
          d={segment.path}
          className={`${styles.routePath} ${segment.dropoff ? styles.routePathDropoff : styles.routePathPickup}`}
          strokeDashoffset={dashOffset}
        />
      ))}
    </svg>
  );
}

export default function FoodDonationRouteSGPage() {
  const [appState, setAppState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const routeContainerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  const ensureNodeRef = useCallback((id: string): React.RefObject<HTMLDivElement | null> => {
    if (!nodeRefs.current[id]) {
      nodeRefs.current[id] = { current: null };
    }
    return nodeRefs.current[id];
  }, []);

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

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState, hydrated]);

  const activeStops = appState.stops.filter((stop) => appState.activeIds.includes(stop.id));
  const pickupStops = activeStops.filter((stop) => stop.type === "Pickup");
  const dropoffStops = activeStops.filter((stop) => stop.type === "Dropoff");
  const totalPortions = pickupStops.reduce((total, stop) => {
    const match = stop.portionsLabel.match(/(\d+)/);
    return total + (match ? parseInt(match[1], 10) : 0);
  }, 0);
  const doneCount = appState.doneIds.length;

  const finalWindow = activeStops.at(-1)?.window ?? "No active stop";

  return (
    <main className={`${styles.page} ${bebas.variable} ${plex.variable} ${mono.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <p className={styles.topbarMeta}>Saturday run board</p>
      </header>

      <section className={styles.firstScreen}>
        <p className={styles.kicker}>Food rescue route</p>
        <h1>Volunteer drivers can arrange tonight&apos;s pickup and drop-off sequence in one moving route.</h1>
        <p className={styles.lede}>Start by dragging any stop up or down, then mark each stop as you complete it.</p>
      </section>

      <section className={styles.board}>
        <p className={styles.gridBreakRibbon}>Dotted route redraws live while you drag</p>

        <div className={styles.routeColumn} ref={routeContainerRef}>
          <RoutePath
            nodeRefs={nodeRefs}
            stops={appState.stops}
            activeIds={appState.activeIds}
            containerRef={routeContainerRef}
          />

          <Reorder.Group
            axis="y"
            values={appState.stops}
            onReorder={(nextStops) => setAppState((prev) => ({ ...prev, stops: nextStops }))}
            className={styles.stopList}
            as="ol"
          >
            {appState.stops.map((stop, index) => (
              <StopRow
                key={stop.id}
                stop={stop}
                index={index}
                active={appState.activeIds.includes(stop.id)}
                done={appState.doneIds.includes(stop.id)}
                nodeRef={ensureNodeRef(stop.id)}
                onToggleActive={() =>
                  setAppState((prev) => ({
                    ...prev,
                    activeIds: prev.activeIds.includes(stop.id)
                      ? prev.activeIds.filter((id) => id !== stop.id)
                      : [...prev.activeIds, stop.id],
                  }))
                }
                onToggleDone={() =>
                  setAppState((prev) => ({
                    ...prev,
                    doneIds: prev.doneIds.includes(stop.id)
                      ? prev.doneIds.filter((id) => id !== stop.id)
                      : [...prev.doneIds, stop.id],
                  }))
                }
              />
            ))}
          </Reorder.Group>
        </div>

        <aside className={styles.manifest}>
          <p className={styles.manifestLabel}>Tonight&apos;s manifest</p>
          <p className={styles.manifestNumber}>{activeStops.length} active stops</p>

          <div className={styles.metricRow}>
            <span>Pickup portions</span>
            <strong>{totalPortions}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Drop-off points</span>
            <strong>{dropoffStops.length}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Completed</span>
            <strong>{doneCount}</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Estimated final stop</span>
            <strong>{finalWindow}</strong>
          </div>

          <div className={styles.manifestDivider} />

          <p className={styles.manifestSectionTitle}>Pickup places</p>
          <ul className={styles.flatList}>
            {pickupStops.map((stop) => (
              <li key={stop.id}>
                <span>{stop.name}</span>
                <strong>{stop.portionsLabel}</strong>
              </li>
            ))}
          </ul>

          <p className={styles.manifestSectionTitle}>Drop-off places</p>
          <ul className={styles.flatList}>
            {dropoffStops.map((stop) => (
              <li key={stop.id}>
                <span>{stop.name}</span>
                <strong>{stop.window}</strong>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
