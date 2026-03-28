"use client";

import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

import { useCachedFeed } from "@/lib/api/use-cached-feed";

import {
  buildZoneForecasts,
  formatTimestamp,
  getTravelGuidance,
  STORAGE_KEY,
  type ZoneForecast,
} from "./data";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-taxi-gap-heading",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-taxi-gap-mono",
  weight: ["400", "500"],
});

type TaxiAvailabilityApiResponse = {
  features?: Array<{
    properties?: {
      taxi_count?: number;
      timestamp?: string;
    };
  }>;
  items?: Array<{
    taxi_count?: number;
    timestamp?: string;
  }>;
};

type TaxiSnapshot = {
  totalCount: number;
  timestamp: string;
};

const FALLBACK_TOTAL = 2760;

function getSnapshot(data?: TaxiAvailabilityApiResponse): TaxiSnapshot {
  const feature = data?.features?.[0]?.properties;
  const item = data?.items?.[0];

  return {
    totalCount: feature?.taxi_count ?? item?.taxi_count ?? FALLBACK_TOTAL,
    timestamp: feature?.timestamp ?? item?.timestamp ?? new Date().toISOString(),
  };
}

function getStatusLabel(status: ZoneForecast["status"]) {
  if (status === "steady") return "Holding";
  if (status === "watch") return "Watch";
  return "Tight";
}

function getStatusTone(status: ZoneForecast["status"]) {
  if (status === "steady") return styles.statusSteady;
  if (status === "watch") return styles.statusWatch;
  return styles.statusTight;
}

function TideTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { risk?: string } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;
  const risk = payload[0]?.payload?.risk ?? "steady";

  return (
    <div className={styles.tooltip}>
      <strong>{label}</strong>
      <span>{value.toLocaleString("en-SG")} taxis</span>
      <em>{risk === "tight" ? "Harder pickup window" : risk === "watch" ? "Supply is thinning" : "Safer to leave"}</em>
    </div>
  );
}

export default function TaxiGapWatchPage() {
  const [selectedZoneId, setSelectedZoneId] = useState("central");

  const { data, error, isLoading, mutate } = useCachedFeed<TaxiAvailabilityApiResponse>(
    "https://api.data.gov.sg/v1/transport/taxi-availability",
    {
      swr: {
        refreshInterval: 4 * 60 * 1000,
      },
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedZone = window.localStorage.getItem(STORAGE_KEY);
    if (savedZone) {
      setSelectedZoneId(savedZone);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, selectedZoneId);
  }, [selectedZoneId]);

  const snapshot = getSnapshot(data);
  const zoneForecasts = useMemo(
    () => buildZoneForecasts(snapshot.totalCount, snapshot.timestamp),
    [snapshot],
  );
  const selectedZone =
    zoneForecasts.find((zone) => zone.id === selectedZoneId) ?? zoneForecasts[0];
  const guidance = getTravelGuidance(selectedZone);
  const bestZone = zoneForecasts
    .slice()
    .sort((left, right) => right.windows[2].count - left.windows[2].count)[0];

  return (
    <main className={`${styles.page} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Taxi Gap Watch</p>
            <h1>See when taxis around your route are thinning so you can leave before the hard wait starts.</h1>
            <p className={styles.lede}>
              Pick the area you are heading through. The strip shows whether the next windows are still workable or draining away.
            </p>
          </div>

          <div className={styles.heroMeta}>
            <div className={styles.metaCard}>
              <span>Across Singapore now</span>
              <strong>{snapshot.totalCount.toLocaleString("en-SG")} taxis</strong>
              <em>Updated {formatTimestamp(snapshot.timestamp)}</em>
            </div>
            <div className={styles.metaCard}>
              <span>Best hold in 30 minutes</span>
              <strong>{bestZone.name}</strong>
              <em>{bestZone.catchment}</em>
            </div>
          </div>
        </section>

        <nav className={styles.zoneRail} aria-label="Choose an area">
          {zoneForecasts.map((zone) => (
            <button
              key={zone.id}
              type="button"
              className={`${styles.zoneButton} ${zone.id === selectedZone.id ? styles.zoneButtonActive : ""}`}
              onClick={() => setSelectedZoneId(zone.id)}
            >
              <span className={styles.zoneButtonTop}>
                <strong>{zone.name}</strong>
                <em className={`${styles.zoneStatus} ${getStatusTone(zone.status)}`}>
                  {getStatusLabel(zone.status)}
                </em>
              </span>
              <span className={styles.zoneCatchment}>{zone.catchment}</span>
            </button>
          ))}
        </nav>

        {error ? (
          <div className={styles.feedNotice}>
            Live updates are taking longer than usual. You can still compare the next hour while the feed catches up.
          </div>
        ) : null}

        <section className={styles.stage}>
          <div className={styles.tidePanel}>
            <div className={styles.panelTopline}>
              <div>
                <p className={styles.panelLabel}>{selectedZone.catchment}</p>
                <h2>{selectedZone.name}</h2>
              </div>
              <button
                type="button"
                className={styles.refreshButton}
                onClick={() => mutate()}
              >
                {isLoading ? "Updating…" : "Refresh"}
              </button>
            </div>

            <p className={styles.panelLead}>{selectedZone.riderNote}</p>

            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={264}>
                <AreaChart data={selectedZone.windows} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity={0.85} />
                      <stop offset="60%" stopColor="#58b7d3" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="#081a2d" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(143, 176, 210, 0.14)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9bb5cc", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#7e98b3", fontSize: 12 }}
                    width={42}
                    tickFormatter={(value: number) => `${Math.round(value / 100) / 10}k`}
                  />
                  <Tooltip content={<TideTooltip />} cursor={{ stroke: "rgba(94, 234, 212, 0.24)" }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8ef2db"
                    strokeWidth={3}
                    fill="url(#tideFill)"
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, fill: "#f5f7fb", stroke: "#8ef2db", strokeWidth: 2 }}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.strip} aria-label="Taxi supply over the next windows">
              {selectedZone.windows.map((window) => (
                <motion.div
                  key={window.label}
                  className={`${styles.stripCell} ${styles[`strip${window.risk[0].toUpperCase()}${window.risk.slice(1)}`]}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: window.offsetMinutes / 220 }}
                  style={{
                    height: `${Math.max(88, window.density * 84)}px`,
                  }}
                >
                  <span>{window.label}</span>
                  <strong>{window.count.toLocaleString("en-SG")}</strong>
                  <em>{window.risk === "tight" ? "Hard wait" : window.risk === "watch" ? "Fading" : "Safer"}</em>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.sideRail}>
            <motion.section
              key={selectedZone.id}
              className={styles.guidanceCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              <p className={styles.panelLabel}>Leave-now nudge</p>
              <h2>{guidance.headline}</h2>
              <p>{guidance.detail}</p>
              <div className={styles.guidanceFoot}>
                <span>{selectedZone.windows[0].count.toLocaleString("en-SG")} nearby now</span>
                <span>{selectedZone.windows[selectedZone.windows.length - 1].count.toLocaleString("en-SG")} by the last window</span>
              </div>
            </motion.section>

            <section className={styles.snapshotCard}>
              <p className={styles.panelLabel}>Area snapshot</p>
              <div className={styles.snapshotList}>
                {zoneForecasts.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    className={`${styles.snapshotRow} ${zone.id === selectedZone.id ? styles.snapshotRowActive : ""}`}
                    onClick={() => setSelectedZoneId(zone.id)}
                  >
                    <span>
                      <strong>{zone.name}</strong>
                      <em>{zone.catchment}</em>
                    </span>
                    <span className={styles.snapshotMetric}>
                      {zone.windows[0].count.toLocaleString("en-SG")}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.tripCard}>
              <p className={styles.panelLabel}>If you are travelling later</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedZone.id}
                  className={styles.tripAdvice}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <strong>{selectedZone.windows[2].risk === "tight" ? "Have a pickup fallback ready" : "You still have a small buffer"}</strong>
                  <p>
                    {selectedZone.windows[2].risk === "tight"
                      ? `Around ${selectedZone.catchment}, the middle of the next hour drops quickly. Move your pickup point to a brighter road or leave earlier if you can.`
                      : `Around ${selectedZone.catchment}, supply is easing but not collapsing. If you need a slower departure, keep an eye on the final two windows.`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
