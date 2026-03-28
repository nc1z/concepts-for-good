"use client";

import Link from "next/link";
import { IBM_Plex_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useMemo, useState } from "react";

import {
  anchorPoints,
  filterOptions,
  haversineDistanceKm,
  singaporeOutline,
  toiletSpots,
  type FilterKey,
} from "./data";
import styles from "./page.module.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
});

type GeographyItem = { rsmKey: string } & Record<string, unknown>;

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.max(0.2, distanceKm).toFixed(1)} km away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

function markerTone(score: number) {
  if (score >= 90) return styles.markerStrong;
  if (score >= 80) return styles.markerGood;
  return styles.markerFair;
}

export default function AccessibleToiletNotesPage() {
  const [anchorId, setAnchorId] = useState(anchorPoints[0].id);
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>(["clean", "changing"]);
  const [selectedId, setSelectedId] = useState(toiletSpots[0].id);

  const anchor = useMemo(
    () => anchorPoints.find((item) => item.id === anchorId) ?? anchorPoints[0],
    [anchorId],
  );

  const mappedSpots = useMemo(() => {
    return toiletSpots
      .map((spot) => {
        const distanceKm = haversineDistanceKm(anchor.coordinates, spot.coordinates);
        const passesFilters = activeFilters.every((filter) => {
          if (filter === "clean") return spot.cleanliness >= 80;
          if (filter === "changing") return spot.changing >= 75;
          if (filter === "wide") return spot.access >= 80;
          if (filter === "open") return spot.openNow;
          return true;
        });

        return { ...spot, distanceKm, passesFilters };
      })
      .sort((left, right) => left.distanceKm - right.distanceKm || right.overall - left.overall);
  }, [activeFilters, anchor.coordinates]);

  const visibleSpots = mappedSpots.filter((spot) => spot.passesFilters);
  const selected = visibleSpots.find((spot) => spot.id === selectedId) ?? visibleSpots[0] ?? null;

  return (
    <main className={`${styles.page} ${ibmPlexSans.variable}`}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <div className={styles.anchorRow}>
            {anchorPoints.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.anchorButton} ${item.id === anchorId ? styles.anchorButtonActive : ""}`}
                onClick={() => setAnchorId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Accessible Toilet Notes</p>
          <h1>Find the right stop before you leave home.</h1>
          <p className={styles.lede}>
            Use the map to check which nearby places are clean, open, and roomy enough for the
            visit you need to make.
          </p>
        </section>

        <section className={styles.stage}>
          <div className={styles.mapSurface}>
            <div className={styles.filterRail}>
              {filterOptions.map((item) => {
                const active = activeFilters.includes(item.key);

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`${styles.filterToggle} ${active ? styles.filterToggleActive : ""}`}
                    aria-pressed={active}
                    onClick={() =>
                      setActiveFilters((current) =>
                        active
                          ? current.filter((filter) => filter !== item.key)
                          : [...current, item.key],
                      )
                    }
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </button>
                );
              })}
            </div>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [103.82, 1.35], scale: 52000 }}
              className={styles.map}
            >
              <Geographies geography={singaporeOutline}>
                {({ geographies }: { geographies: GeographyItem[] }) =>
                  geographies.map((geo: GeographyItem) => (
                    <Geography key={geo.rsmKey} geography={geo} className={styles.island} />
                  ))
                }
              </Geographies>

              <Marker coordinates={anchor.coordinates}>
                <g className={styles.anchorMarker}>
                  <circle r={22} className={styles.anchorHalo} />
                  <circle r={8} className={styles.anchorDot} />
                </g>
              </Marker>

              {mappedSpots.map((spot) => {
                const isSelected = spot.id === selected?.id;
                return (
                  <Marker key={spot.id} coordinates={spot.coordinates}>
                    <g
                      className={[
                        styles.marker,
                        markerTone(spot.overall),
                        isSelected ? styles.markerSelected : "",
                        spot.passesFilters ? "" : styles.markerMuted,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setSelectedId(spot.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          setSelectedId(spot.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${spot.name}, ${formatDistance(spot.distanceKm)}`}
                    >
                      <circle r={isSelected ? 13 : 10} />
                      <text y="4" textAnchor="middle">
                        {spot.changing >= 80 ? "+" : "•"}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>

            <div className={styles.mapCaption}>
              <span>{visibleSpots.length} places match this view</span>
              <strong>{anchor.label}</strong>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={selected?.id ?? "empty"}
              className={styles.sheet}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.24 }}
            >
              {selected ? (
                <>
                  <div className={styles.sheetTopline}>
                    <span>{selected.area}</span>
                    <span>{formatDistance(selected.distanceKm)}</span>
                  </div>
                  <h2>{selected.name}</h2>
                  <p className={styles.sheetSummary}>
                    Open score {selected.overall}. {selected.hours}
                  </p>

                  <div className={styles.metricStrip}>
                    <div>
                      <span>Cleanliness</span>
                      <strong>{selected.cleanliness}</strong>
                    </div>
                    <div>
                      <span>Access</span>
                      <strong>{selected.access}</strong>
                    </div>
                    <div>
                      <span>Changing</span>
                      <strong>{selected.changing}</strong>
                    </div>
                  </div>

                  <div className={styles.bestFor}>
                    {selected.bestFor.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className={styles.notes}>
                    {selected.notes.map((note) => (
                      <p key={note}>{note}</p>
                    ))}
                  </div>

                  <p className={styles.checked}>Last checked: {selected.lastChecked}</p>
                </>
              ) : (
                <p className={styles.emptyState}>
                  Nothing matches this view right now. Drop one filter to bring nearby options back.
                </p>
              )}
            </motion.section>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
