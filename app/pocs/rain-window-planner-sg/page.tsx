"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import useSWR from "swr";

import {
  PICKER_AREAS,
  getForecastIntensity,
  haversineKm,
  type AreaInfo,
} from "./data";
import styles from "./page.module.css";

// ---- API types ----

type AreaForecast = {
  area: string;
  forecast: string;
};

type AreaMetadata = {
  name: string;
  label_location: { latitude: number; longitude: number };
};

type ApiResponse = {
  items: Array<{
    update_timestamp: string;
    timestamp: string;
    valid_period: { start: string; end: string };
    forecasts: AreaForecast[];
  }>;
  area_metadata: AreaMetadata[];
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("fetch failed");
    return res.json() as Promise<ApiResponse>;
  });

// ---- helpers ----

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-SG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

function nearbyAreas(
  selected: AreaInfo,
  allMetadata: AreaMetadata[],
  forecasts: AreaForecast[],
  count = 4
): Array<{ name: string; forecast: string; distKm: number }> {
  const forecastMap = new Map(forecasts.map((f) => [f.area, f.forecast]));

  return allMetadata
    .filter((m) => m.name !== selected.name)
    .map((m) => ({
      name: m.name,
      forecast: forecastMap.get(m.name) ?? "",
      distKm: haversineKm(
        selected.latitude,
        selected.longitude,
        m.label_location.latitude,
        m.label_location.longitude
      ),
    }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, count);
}

// ---- tone strip colour for nearby band ----

function toneToStrip(forecast: string): string {
  const intensity = getForecastIntensity(forecast);
  if (intensity.tone === "heavy") return "linear-gradient(90deg, #1e3a5f, #2d4a6e)";
  if (intensity.tone === "light") return "linear-gradient(90deg, #3a5068, #4a6278)";
  if (intensity.tone === "cloudy") return "linear-gradient(90deg, #5a6472, #6b7885)";
  return "linear-gradient(90deg, #f6d860, #fde68a)";
}

// ---- component ----

export default function RainWindowPlannerPage() {
  const [selectedAreaName, setSelectedAreaName] = useState(PICKER_AREAS[0].name);

  const { data, error, isLoading } = useSWR<ApiResponse>(
    "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 } // every 10 minutes
  );

  const selectedArea = PICKER_AREAS.find((a) => a.name === selectedAreaName) ?? PICKER_AREAS[0];

  // Derive current forecast for selected area
  const currentForecast = useMemo(() => {
    if (!data?.items?.[0]) return null;
    const entry = data.items[0].forecasts.find((f) => f.area === selectedAreaName);
    return entry?.forecast ?? null;
  }, [data, selectedAreaName]);

  const intensity = getForecastIntensity(currentForecast ?? "Cloudy");
  const validPeriod = data?.items?.[0]?.valid_period;

  // Nearby areas ring
  const nearby = useMemo(() => {
    if (!data?.area_metadata || !data?.items?.[0]) return [];
    return nearbyAreas(selectedArea, data.area_metadata, data.items[0].forecasts);
  }, [data, selectedArea]);

  const pageStyle = {
    "--bg-from": intensity.bgFrom,
    "--bg-to": intensity.bgTo,
    "--text-color": intensity.textColor,
    "--rain-level": intensity.rainLevel,
  } as CSSProperties;

  const hasData = !isLoading && !error && currentForecast;

  return (
    <main className={styles.page} style={pageStyle}>
      {/* header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to gallery</Link>
        <p className={styles.kicker}>Rain Window Planner</p>
        <h1 className={styles.headline}>Is it dry enough to leave now?</h1>
        <p className={styles.subline}>
          Check the window before heading to your clinic, school run, or errand.
        </p>
      </header>

      {/* area picker */}
      <section className={styles.pickerSection}>
        <p className={styles.pickerLabel}>Where are you?</p>
        <div className={styles.pills} role="group" aria-label="Choose your area">
          {PICKER_AREAS.map((area) => (
            <button
              key={area.name}
              type="button"
              className={`${styles.pill} ${area.name === selectedAreaName ? styles.pillActive : ""}`}
              onClick={() => setSelectedAreaName(area.name)}
              aria-pressed={area.name === selectedAreaName}
            >
              {area.name}
            </button>
          ))}
        </div>
      </section>

      {/* main forecast band */}
      <div className={styles.bandWrapper}>
        <AnimatePresence mode="wait">
          {hasData ? (
            <motion.div
              key={`${selectedAreaName}-${currentForecast}`}
              className={styles.band}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            >
              {/* rain animation layers */}
              <div
                className={`${styles.bandRain} ${
                  intensity.tone === "clear"
                    ? styles.bandClearShimmer
                    : intensity.rainLevel > 0.6
                    ? styles.bandRainHeavy
                    : styles.bandRainLight
                }`}
              />
              {intensity.rainLevel > 0.6 && (
                <div className={`${styles.bandRain} ${styles.bandRainLight}`} />
              )}

              <div className={styles.bandContent}>
                <span className={styles.bandAreaName}>{selectedAreaName}</span>
                <p className={styles.bandForecast}>{currentForecast}</p>
                {validPeriod && (
                  <span className={styles.bandWindow}>
                    Valid until {formatTime(validPeriod.end)}
                  </span>
                )}
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              className={styles.band}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`${styles.bandRain} ${styles.bandRainLight}`} />
              <div className={styles.bandContent}>
                <span className={styles.bandAreaName}>{selectedAreaName}</span>
                <p className={styles.bandForecast} style={{ opacity: 0.4 }}>
                  Checking forecast…
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              className={styles.band}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.bandContent}>
                <p className={styles.bandForecast} style={{ opacity: 0.4, fontSize: "1.6rem" }}>
                  —
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* leave recommendation */}
      <AnimatePresence mode="wait">
        {hasData && (
          <motion.p
            key={`rec-${selectedAreaName}-${currentForecast}`}
            className={styles.recommendation}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {intensity.recommendation}
          </motion.p>
        )}
      </AnimatePresence>

      {/* valid period note */}
      {validPeriod && (
        <p className={styles.validPeriod}>
          Forecast updated {formatTime(data?.items?.[0]?.update_timestamp ?? "")}
        </p>
      )}

      {/* nearby areas */}
      <AnimatePresence>
        {hasData && nearby.length > 0 && (
          <motion.section
            key={`nearby-${selectedAreaName}`}
            className={styles.nearbySection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, delay: 0.18 }}
          >
            <p className={styles.nearbyLabel}>Nearby areas right now</p>
            <div className={styles.nearbyGrid}>
              {nearby.map((area) => (
                <div key={area.name} className={styles.nearbyCard}>
                  <div
                    className={styles.nearbyBand}
                    style={{ background: toneToStrip(area.forecast) }}
                  />
                  <div className={styles.nearbyBody}>
                    <span className={styles.nearbyAreaName}>{area.name}</span>
                    <span className={styles.nearbyForecast}>
                      {area.forecast || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* fallback message */}
      {error && !isLoading && (
        <section className={styles.fallbackSection}>
          <p className={styles.fallbackMsg}>
            Forecast unavailable right now — check back in a few minutes.
          </p>
        </section>
      )}
    </main>
  );
}
