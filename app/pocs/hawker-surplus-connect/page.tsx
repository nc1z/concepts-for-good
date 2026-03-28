"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  initialWatchlist,
  personas,
  seededAlerts,
  seededListings,
  volunteers,
  zoneOptions,
  type AlertItem,
  type Persona,
  type Watchlist,
} from "./data";
import styles from "./page.module.css";

const STORAGE_KEY = "cfg-hawker-surplus-connect-v2";

type DemoState = {
  activePersona: Persona;
  watchlist: Watchlist;
  assignments: Record<string, string>;
  claimedIds: string[];
  alerts: AlertItem[];
};

const defaultState: DemoState = {
  activePersona: "coordinator",
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

export default function HawkerSurplusConnectPage() {
  const [state, setState] = useState<DemoState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

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
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

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
      .map(([listingId]) =>
        seededListings.find((listing) => listing.id === listingId),
      )
      .filter(Boolean),
  }));

  function toggleZone(zone: string) {
    setState((current) => {
      const areas = current.watchlist.areas.includes(zone)
        ? current.watchlist.areas.filter((item) => item !== zone)
        : [...current.watchlist.areas, zone];

      return {
        ...current,
        watchlist: {
          ...current.watchlist,
          areas,
        },
      };
    });
  }

  function setPersona(persona: Persona) {
    setState((current) => ({
      ...current,
      activePersona: persona,
      alerts: [
        {
          id: `persona-${Date.now()}`,
          headline:
            persona === "coordinator"
              ? "Coordinator board loaded"
              : "Volunteer board loaded",
          detail:
            persona === "coordinator"
              ? "Assignment controls and watch zones are active."
              : "Nearby runs and claim flow are active.",
          time: "just now",
          severity: "watching",
        },
        ...current.alerts.slice(0, 5),
      ],
    }));
  }

  function assignRun(listingId: string, volunteerId: string) {
    const listing = seededListings.find((item) => item.id === listingId);
    const volunteer = volunteers.find((item) => item.id === volunteerId);

    if (!listing || !volunteer) {
      return;
    }

    setState((current) => ({
      ...current,
      assignments: {
        ...current.assignments,
        [listingId]: volunteerId,
      },
      claimedIds: current.claimedIds.includes(listingId)
        ? current.claimedIds
        : [...current.claimedIds, listingId],
      alerts: [
        {
          id: `assign-${Date.now()}`,
          headline: `${volunteer.name} assigned to ${listing.area}`,
          detail: `${listing.name} is now part of the active dispatch lane.`,
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

  function simulateWave() {
    const nextListing =
      filteredListings.find((listing) => !state.claimedIds.includes(listing.id)) ??
      filteredListings[0];

    if (!nextListing) {
      return;
    }

    setState((current) => ({
      ...current,
      alerts: [
        {
          id: `sim-${Date.now()}`,
          headline: `${nextListing.area} needs pickup attention`,
          detail: `${nextListing.portions} portions from ${nextListing.name} are now inside the active window.`,
          time: "just now",
          severity: nextListing.priority === "urgent" ? "urgent" : "ready",
        },
        ...current.alerts.slice(0, 5),
      ],
    }));
  }

  function resetDemo() {
    setState(defaultState);
    window.localStorage.removeItem(STORAGE_KEY);
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
            A browser-only operations board for watch zones, live pickup windows,
            and volunteer assignment across Singapore neighbourhoods.
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
            <span>watch zones</span>
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

      <section className={styles.personaStrip}>
        {personas.map((persona) => (
          <button
            key={persona.id}
            type="button"
            className={`${styles.personaButton} ${
              state.activePersona === persona.id ? styles.personaButtonActive : ""
            }`}
            onClick={() => setPersona(persona.id)}
          >
            <strong>{persona.label}</strong>
            <span>{persona.description}</span>
          </button>
        ))}
      </section>

      <section className={styles.layout}>
        <div className={styles.lane}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Dispatch lane</p>
              <h2>Tonight&apos;s pickup windows</h2>
            </div>
            <button type="button" className={styles.actionButton} onClick={simulateWave}>
              Simulate alert
            </button>
          </div>

          <div className={styles.runList}>
            {filteredListings.map((listing) => {
              const volunteerId = state.assignments[listing.id];
              const volunteer = volunteers.find((item) => item.id === volunteerId);

              return (
                <motion.article
                  key={listing.id}
                  layout
                  className={styles.runRow}
                >
                  <div className={styles.runTime}>
                    <span>{listing.readyBy}</span>
                    <small>{listing.area}</small>
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
            <p>Watch settings</p>
            <h2>Where should the board listen?</h2>
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
            <p>Volunteer roster</p>
            <h2>Available tonight</h2>
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

          <section className={styles.sideSection}>
            <p>Demo controls</p>
            <h2>Reset or rerun the night</h2>
            <button type="button" className={styles.resetButton} onClick={resetDemo}>
              Reset dispatch state
            </button>
          </section>
        </aside>
      </section>
    </main>
  );
}
