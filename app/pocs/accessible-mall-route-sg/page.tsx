"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { destinations, STORAGE_KEY } from "./data";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export default function AccessibleMallRoutePage() {
  const [selectedId, setSelectedId] = useState(destinations[0].id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && destinations.some((destination) => destination.id === saved)) {
      setSelectedId(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, selectedId);
  }, [selectedId]);

  const selected = useMemo(
    () => destinations.find((destination) => destination.id === selectedId) ?? destinations[0],
    [selectedId],
  );

  return (
    <main className={`${styles.page} ${spaceGrotesk.variable}`}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <div className={styles.helperPill}>Stairs-free route preview</div>
        </div>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Accessibility</p>
          <h1 className={styles.title}>See the stairs-free route before you enter the mall.</h1>
          <p className={styles.lede}>
            Pick where you need to go, then follow the highlighted route for lifts, ramps, and easier entrances.
          </p>
        </section>

        <div className={styles.layout}>
          <section className={styles.diagram}>
            <h2 className={styles.diagramTitle}>Harbour Square Mall</h2>
            <svg viewBox="0 0 520 420" className={styles.svg} role="img" aria-label="Simplified mall floor plan">
              <rect x="56" y="54" width="408" height="312" rx="34" fill="#ffffff" stroke="#dce5ef" strokeWidth="4" />
              <rect x="72" y="72" width="376" height="276" rx="26" fill="#f5f9fd" />

              <rect x="74" y="246" width="116" height="82" rx="20" fill="#e6eef8" />
              <rect x="206" y="92" width="120" height="70" rx="22" fill="#eaf5f6" />
              <rect x="352" y="86" width="72" height="72" rx="18" fill="#fff2db" />
              <rect x="360" y="262" width="74" height="56" rx="18" fill="#e6eef8" />
              <rect x="216" y="210" width="92" height="92" rx="26" fill="#fffaf0" stroke="#d8e2ed" strokeWidth="3" />
              <rect x="84" y="128" width="68" height="88" rx="18" fill="#eef5fb" />

              <text x="108" y="296" className={styles.nodeLabel}>Basement ramp</text>
              <text x="230" y="132" className={styles.nodeLabel}>Family Clinic</text>
              <text x="364" y="126" className={styles.nodeLabel}>Food Court</text>
              <text x="372" y="292" className={styles.nodeLabel}>Supermarket</text>
              <text x="228" y="256" className={styles.nodeLabel}>Lift Lobby A</text>
              <text x="88" y="176" className={styles.nodeLabel}>Taxi Stand</text>

              <path d="M82 278 C100 252 122 232 148 212 C170 194 206 176 236 166 C270 154 302 142 334 126" fill="none" stroke="#c8d6e6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 278 C122 296 154 312 188 322 C230 334 276 334 318 324 C352 316 378 306 392 294" fill="none" stroke="#c8d6e6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 278 C114 246 144 220 182 196 C210 178 248 160 282 150 C322 138 356 130 384 118" fill="none" stroke="#c8d6e6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

              <motion.path
                key={selected.id}
                d={selected.path}
                className={styles.routePath}
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1] }}
              />
              <motion.path
                key={`${selected.id}-dots`}
                d={selected.path}
                className={styles.routeDots}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1], delay: 0.08 }}
              />

              <circle cx="82" cy="278" r="14" fill="#0d6b73" />
              <circle cx={selected.point.x} cy={selected.point.y} r="14" fill="#2f5f9a" />

              {destinations.map((destination) => (
                <g
                  key={destination.id}
                  className={styles.nodeButton}
                  onClick={() => setSelectedId(destination.id)}
                >
                  <circle
                    cx={destination.point.x}
                    cy={destination.point.y}
                    r={destination.id === selected.id ? 18 : 15}
                    fill={destination.id === selected.id ? "#0d6b73" : "#2f5f9a"}
                  />
                  <circle
                    cx={destination.point.x}
                    cy={destination.point.y}
                    r="6"
                    fill="#ffffff"
                  />
                </g>
              ))}
            </svg>
          </section>

          <aside className={styles.panel}>
            <div className={styles.routeBadge}>{selected.routeLabel}</div>
            <h2 className={styles.panelTitle}>{selected.name}</h2>
            <p className={styles.panelLead}>
              {selected.zone}. Follow the highlighted line to preview the easier route before you leave home.
            </p>

            <div className={styles.destinationList}>
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  className={[
                    styles.destinationButton,
                    destination.id === selected.id && styles.destinationButtonActive,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedId(destination.id)}
                >
                  <span className={styles.destinationName}>{destination.name}</span>
                  <span className={styles.destinationZone}>{destination.zone}</span>
                </button>
              ))}
            </div>

            <div className={styles.notes}>
              {selected.notes.map((note) => (
                <p key={note} className={styles.note}>
                  {note}
                </p>
              ))}
            </div>

            <p className={styles.destinationHint}>
              Tap another destination on the map or in the list to redraw the route.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
