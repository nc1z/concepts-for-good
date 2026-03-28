"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  initialWatchlist,
  seededAlerts,
  seededListings,
  volunteers,
  zoneOptions,
  type AlertItem,
  type Watchlist,
} from "./data";
import styles from "./page.module.css";

const STORAGE_KEY = "cfg-hawker-surplus-connect-v2";

type DemoState = {
  watchlist: Watchlist;
  assignments: Record<string, string>;
  claimedIds: string[];
  alerts: AlertItem[];
};

const defaultState: DemoState = {
  watchlist: initialWatchlist,
  assignments: {
    "listing-2": "v3",
    "listing-4": "v2",
  },
  claimedIds: ["listing-1", "listing-2", "listing-4"],
  alerts: seededAlerts,
};

function formatZones(zones: string[]) {
  return zones.length ? zones.join(", ") : "All zones";
}

function parseReadyByMs(readyBy: string): number {
  const now = new Date();
  const parts = readyBy.match(/(\d+):(\d+)\s*(am|pm)/i);
  if (!parts) return 0;
  let hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[2], 10);
  const period = parts[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  ).getTime();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCountdownLabel(readyBy: string, _tick: number): string {
  const diff = parseReadyByMs(readyBy) - Date.now();
  if (diff <= 0) return "Closing";
  const totalSecs = Math.floor(diff / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function getUrgencyClass(readyBy: string, priority: string, styles: Record<string, string>): string {
  const diff = parseReadyByMs(readyBy) - Date.now();
  const mins = diff / 60000;
  if (diff <= 0 || priority === "urgent" || mins < 20) return styles.runRowUrgent;
  if (priority === "ready" || mins < 45) return styles.runRowReady;
  return "";
}

export default function HawkerSurplusConnectPage() {
  const [state, setState] = useState<DemoState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw) as DemoState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const filteredListings = useMemo(() => {
    return seededListings.filter((listing) => {
      const zonesMatch =
        state.watchlist.areas.length === 0 ||
        state.watchlist.areas.includes(listing.area);
      return zonesMatch && listing.portions >= state.watchlist.minimumPortions;
    });
  }, [state.watchlist]);

  const readyNow = filteredListings.filter((listing) => listing.priority !== "watch");
  const unclaimedCount = filteredListings.filter(
    (listing) => !state.claimedIds.includes(listing.id),
  ).length;

  const assignmentsByVolunteer = volunteers.map((volunteer) => ({
    ...volunteer,
    runs: Object.entries(state.assignments)
      .filter(([, volunteerId]) => volunteerId === volunteer.id)
      .map(([listingId]) => seededListings.find((listing) => listing.id === listingId))
      .filter(Boolean),
  }));

  function toggleZone(zone: string) {
    setState((current) => {
      const areas = current.watchlist.areas.includes(zone)
        ? current.watchlist.areas.filter((item) => item !== zone)
        : [...current.watchlist.areas, zone];
      return { ...current, watchlist: { ...current.watchlist, areas } };
    });
  }

  function assignRun(listingId: string, volunteerId: string) {
    const listing = seededListings.find((item) => item.id === listingId);
    const volunteer = volunteers.find((item) => item.id === volunteerId);
    if (!listing || !volunteer) return;

    setState((current) => ({
      ...current,
      assignments: { ...current.assignments, [listingId]: volunteerId },
      claimedIds: current.claimedIds.includes(listingId)
        ? current.claimedIds
        : [...current.claimedIds, listingId],
      alerts: [
        {
          id: `assign-${Date.now()}`,
          headline: `${volunteer.name} assigned to ${listing.area}`,
          detail: `${listing.name} is now part of tonight's active runs.`,
          time: "just now",
          severity: "ready",
        },
        ...current.alerts.slice(0, 5),
      ],
    }));
  }

  function releaseRun(listingId: string) {
    const listing = seededListings.find((item) => item.id === listingId);
    setState((current) => {
      const nextAssignments = { ...current.assignments };
      delete nextAssignments[listingId];
      return {
        ...current,
        assignments: nextAssignments,
        claimedIds: current.claimedIds.filter((id) => id !== listingId),
        alerts: listing
          ? [
              {
                id: `release-${Date.now()}`,
                headline: `${listing.area} run released`,
                detail: `${listing.name} is back in the open queue.`,
                time: "just now",
                severity: "watching",
              },
              ...current.alerts.slice(0, 5),
            ]
          : current.alerts,
      };
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.topline}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <span className={styles.toplineLabel}>Night rescue control room</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Hawker Surplus Connect</p>
          <h1>Dispatch small rescue runs before the lights go out.</h1>
          <p className={styles.lede}>
            Coordinate tonight&apos;s food rescue runs from hawker centres across your area.
          </p>
        </div>

        <div className={styles.heroStats}>
          <div>
            <strong>{readyNow.length}</strong>
            <span>active runs</span>
          </div>
          <div>
            <strong>{unclaimedCount}</strong>
            <span>open to claim</span>
          </div>
          <div>
            <strong>{formatZones(state.watchlist.areas)}</strong>
            <span>areas covered</span>
          </div>
        </div>
      </section>

      <section className={styles.signalTape}>
        <AnimatePresence initial={false}>
          {state.alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${styles.signal} ${styles[`signal--${alert.severity}`]}`}
            >
              <strong>{alert.headline}</strong>
              <span>{alert.detail}</span>
              <small>{alert.time}</small>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <section className={styles.layout}>
        <div className={styles.lane}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Tonight&apos;s runs</p>
              <h2>Active pickup windows</h2>
            </div>
          </div>

          <div className={styles.runList}>
            {filteredListings.map((listing) => {
              const volunteerId = state.assignments[listing.id];
              const volunteer = volunteers.find((item) => item.id === volunteerId);

              return (
                <motion.article
                  key={listing.id}
                  layout
                  className={`${styles.runRow} ${getUrgencyClass(listing.readyBy, listing.priority, styles)}`}
                >
                  <div className={styles.runTime}>
                    <span>{listing.readyBy}</span>
                    <small>{listing.area}</small>
                    <span className={styles.countdown}>
                      {getCountdownLabel(listing.readyBy, tick)}
                    </span>
                  </div>

                  <div className={styles.runCopy}>
                    <h3>{listing.name}</h3>
                    <p>
                      {listing.source} · {listing.portions} portions · {listing.pickupPoint}
                    </p>
                    <div className={styles.tagRow}>
                      {listing.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.runActions}>
                    <small>{listing.notes}</small>
                    {volunteer ? (
                      <div className={styles.assignmentRow}>
                        <span>{volunteer.name} assigned</span>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => releaseRun(listing.id)}
                        >
                          Release
                        </button>
                      </div>
                    ) : (
                      <div className={styles.assignButtons}>
                        {volunteers.map((volunteerOption) => (
                          <button
                            key={volunteerOption.id}
                            type="button"
                            className={styles.assignChip}
                            onClick={() => assignRun(listing.id, volunteerOption.id)}
                          >
                            {volunteerOption.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.sideSection}>
            <p>Areas you cover</p>
            <h2>Watch zones</h2>
            <div className={styles.zoneCloud}>
              {zoneOptions.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  className={`${styles.zoneButton} ${
                    state.watchlist.areas.includes(zone) ? styles.zoneButtonActive : ""
                  }`}
                  onClick={() => toggleZone(zone)}
                >
                  {zone}
                </button>
              ))}
            </div>

            <label className={styles.sliderLabel}>
              Minimum portions: {state.watchlist.minimumPortions}
              <input
                type="range"
                min="10"
                max="50"
                step="2"
                value={state.watchlist.minimumPortions}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    watchlist: {
                      ...current.watchlist,
                      minimumPortions: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
          </section>

          <section className={styles.sideSection}>
            <p>Available tonight</p>
            <h2>Runners</h2>
            <div className={styles.roster}>
              {assignmentsByVolunteer.map((volunteer) => (
                <div key={volunteer.id} className={styles.rosterRow}>
                  <div>
                    <strong>{volunteer.name}</strong>
                    <span>
                      {volunteer.base} · {volunteer.mode}
                    </span>
                  </div>
                  <small>
                    {volunteer.runs.length}/{volunteer.capacity} runs
                  </small>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
