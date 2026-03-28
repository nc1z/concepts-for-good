"use client";

import Link from "next/link";
import { IBM_Plex_Sans } from "next/font/google";
import { animate } from "animejs";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  defaultStationId,
  lineMeta,
  linePaths,
  stations,
  statusMeta,
  type LiftStatus,
  type LineId,
} from "./data";
import styles from "./page.module.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-rail",
  weight: ["400", "500", "600", "700"],
});

const statusOrder: LiftStatus[] = ["working", "maintenance", "out"];

function getLineStroke(line: LineId) {
  return lineMeta[line].color;
}

function getOverlayPosition(x: number, y: number) {
  return {
    left: `${(x / 820) * 100}%`,
    top: `${(y / 560) * 100}%`,
  };
}

export default function MrtLiftNotePage() {
  const [selectedId, setSelectedId] = useState(defaultStationId);
  const selected = useMemo(
    () => stations.find((station) => station.id === selectedId) ?? stations[0],
    [selectedId],
  );
  const pulseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pulseRef.current) return;

    const animation = animate(pulseRef.current, {
      scale: [0.92, 1.08, 0.92],
      opacity: [0.2, 0.72, 0.2],
      easing: "inOutSine",
      duration: 1800,
      loop: true,
    });

    return () => {
      animation.pause();
    };
  }, [selected.id]);

  return (
    <main className={`${styles.page} ${ibmPlexSans.variable}`}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <div className={styles.statusStrip}>
            {statusOrder.map((status) => (
              <span key={status} className={styles.statusStripItem} data-status={status}>
                <i aria-hidden="true" />
                {statusMeta[status].label}
              </span>
            ))}
          </div>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>MRT Lift Note</p>
          <h1>Check lift access across the line before you travel.</h1>
          <p className={styles.lede}>
            Pick a station on the map to see the quickest accessible path, the latest lift note,
            and where to switch if something is down.
          </p>
        </section>

        <section className={styles.network}>
          <svg
            viewBox="0 0 820 560"
            className={styles.mapSvg}
            role="img"
            aria-label="Schematic MRT network with lift status markers"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(121, 151, 188, 0.08)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="820" height="560" fill="url(#grid)" />
            {(["north-south", "circle"] as LineId[]).map((line) => (
              <path key={`base-${line}`} d={linePaths[line]} className={styles.baseLine} />
            ))}

            {(["north-south", "circle"] as LineId[]).map((line) => {
              const isActive = selected.lines.includes(line);
              return (
                <motion.path
                  key={`${line}-${selected.id}`}
                  d={linePaths[line]}
                  className={isActive ? styles.activeLine : styles.dimLine}
                  style={{ stroke: getLineStroke(line) }}
                  initial={{ pathLength: 0, opacity: 0.24 }}
                  animate={{ pathLength: 1, opacity: isActive ? 1 : 0.26 }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
              );
            })}

            {stations.map((station) => {
              const isSelected = station.id === selected.id;

              return (
                <g key={station.id}>
                  <circle
                    cx={station.x}
                    cy={station.y}
                    className={`${styles.stationShadow} ${isSelected ? styles.stationShadowActive : ""}`}
                    r={isSelected ? 17 : 13}
                  />

                  <text
                    x={station.labelX}
                    y={station.labelY}
                    className={`${styles.stationLabel} ${isSelected ? styles.stationLabelActive : ""}`}
                    textAnchor={station.labelAnchor}
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className={styles.stationLayer}>
            {stations.map((station) => {
              const isSelected = station.id === selected.id;
              const pointClass = [
                styles.stationPoint,
                isSelected ? styles.stationPointSelected : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={station.id}
                  type="button"
                  className={styles.stationButton}
                  style={getOverlayPosition(station.x, station.y)}
                  aria-pressed={isSelected}
                  aria-label={`${station.name}, ${statusMeta[station.status].label}`}
                  onClick={() => setSelectedId(station.id)}
                >
                  <span className={pointClass} data-status={station.status} />
                  {station.status !== "working" ? <span className={styles.stationAlert}>!</span> : null}
                </button>
              );
            })}
          </div>

          <div
            ref={pulseRef}
            className={styles.pulse}
            style={getOverlayPosition(selected.x, selected.y)}
            aria-hidden="true"
          />

          <motion.div
            key={selected.id}
            className={styles.liveNote}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            style={getOverlayPosition(selected.x, selected.y)}
          >
            <p className={styles.liveLine}>{selected.lineLabel}</p>
            <h2>{selected.name}</h2>
            <p className={styles.liveStatus} data-status={selected.status}>
              {statusMeta[selected.status].label}
            </p>
            <p className={styles.liveSummary}>{selected.summary}</p>
            <dl className={styles.liveMeta}>
              <div>
                <dt>Exit</dt>
                <dd>{selected.exit}</dd>
              </div>
              <div>
                <dt>Alternate</dt>
                <dd>{selected.bestAlternative}</dd>
              </div>
              <div>
                <dt>Checked</dt>
                <dd>{selected.lastChecked}</dd>
              </div>
            </dl>
            <div className={styles.liveNotes}>
              {selected.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
