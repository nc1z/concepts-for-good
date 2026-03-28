"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CSSProperties, useEffect, useState } from "react";

import { quietPlaces } from "./data";
import styles from "./page.module.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function QuietPlacesPage() {
  const [quietness, setQuietness] = useState(76);
  const [activeId, setActiveId] = useState(quietPlaces[0].id);

  const filteredPlaces = quietPlaces
    .filter((place) => place.quietness >= quietness)
    .sort((a, b) => b.quietness - a.quietness);

  const activePlace =
    filteredPlaces.find((place) => place.id === activeId) ?? filteredPlaces[0] ?? null;

  useEffect(() => {
    if (!activePlace) return;
    if (activePlace.id !== activeId) {
      setActiveId(activePlace.id);
    }
  }, [activeId, activePlace]);

  const calmness = clamp(1 - filteredPlaces.length / quietPlaces.length, 0, 1);

  const pageStyle = {
    ["--calmness" as string]: calmness,
  } as CSSProperties;

  return (
    <main className={styles.page} style={pageStyle}>
      <div className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Quiet Places</p>
          <h1>Find calmer places for your next outing.</h1>
          <p className={styles.lede}>
            Slide to keep only the places that feel quieter, softer, and easier to settle into.
          </p>
        </div>
        <Image
          src="/undraw/undraw_focused_m9bj.svg"
          alt=""
          width={520}
          height={420}
          className={styles.heroIllustration}
        />
      </section>

      <section className={styles.control}>
        <div className={styles.controlRow}>
          <label htmlFor="quietness">Quietness</label>
          <strong>{quietness}%</strong>
        </div>
        <input
          id="quietness"
          type="range"
          min={66}
          max={90}
          step={1}
          value={quietness}
          onChange={(event) => setQuietness(Number(event.target.value))}
        />
        <p>Move right to narrow the list to softer spots.</p>
      </section>

      <section className={styles.layout}>
        <div className={styles.listPanel}>
          <div className={styles.panelHead}>
            <p>{filteredPlaces.length} places nearby</p>
            <span>{quietness}% quietness</span>
          </div>

          <div className={styles.list}>
            <AnimatePresence initial={false}>
              {filteredPlaces.map((place, index) => {
                const isActive = place.id === activePlace?.id;

                return (
                  <motion.button
                    key={place.id}
                    type="button"
                    className={`${styles.placeRow} ${isActive ? styles.placeRowActive : ""}`}
                    onClick={() => setActiveId(place.id)}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, delay: index * 0.02 }}
                  >
                    <div className={styles.placeTopline}>
                      <span>{place.type}</span>
                      <span>{place.area}</span>
                    </div>

                    <div className={styles.placeHeading}>
                      <h2>{place.name}</h2>
                      <p>{place.summary}</p>
                    </div>

                    <div className={styles.metrics} aria-hidden="true">
                      {[
                        { label: "Noise", value: place.noise },
                        { label: "Crowd", value: place.crowd },
                        { label: "Light", value: place.light },
                      ].map((metric) => (
                        <div key={metric.label} className={styles.metric}>
                          <span>{metric.label}</span>
                          <div className={styles.track}>
                            <motion.div
                              className={styles.fill}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: metric.value / 100 }}
                              transition={{ duration: 0.45, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredPlaces.length === 0 ? (
            <p className={styles.empty}>
              No places meet this setting yet. Ease the slider a little to bring more options in.
            </p>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {activePlace ? (
            <motion.aside
              key={activePlace.id}
              className={styles.detailPanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <p className={styles.detailLabel}>Quiet enough</p>
              <h2>{activePlace.name}</h2>
              <p className={styles.detailSummary}>{activePlace.summary}</p>

              <div className={styles.tags}>
                {activePlace.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>Best time</span>
                  <strong>{activePlace.bestTime}</strong>
                </div>
                <div>
                  <span>Calm score</span>
                  <strong>{activePlace.quietness}%</strong>
                </div>
              </div>

              <p className={styles.detailNote}>{activePlace.note}</p>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
