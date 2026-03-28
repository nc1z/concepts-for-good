"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  initialWatchlist,
  personas,
  seededAlerts,
  seededListings,
  type AlertItem,
  type Persona,
  type Watchlist,
} from "./data";
import styles from "./page.module.css";

const STORAGE_KEY = "hawker-surplus-connect-demo";

type DemoState = {
  activePersona: Persona;
  watchlist: Watchlist;
  watchedIds: string[];
  alerts: AlertItem[];
};

const defaultState: DemoState = {
  activePersona: "volunteer",
  watchlist: initialWatchlist,
  watchedIds: ["listing-1", "listing-2"],
  alerts: seededAlerts,
};

function formatAreas(areas: string[]) {
  return areas.length ? areas.join(", ") : "Any area";
}

export default function HawkerSurplusConnectPage() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<DemoState>(defaultState);
  const [draftArea, setDraftArea] = useState(initialWatchlist.areas.join(", "));

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DemoState;
        setState(parsed);
        setDraftArea(parsed.watchlist.areas.join(", "));
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

  const activePersona = personas.find((item) => item.id === state.activePersona);
  const filteredListings = useMemo(() => {
    const watchAreas = state.watchlist.areas.map((item) => item.toLowerCase());

    return seededListings.filter((listing) => {
      const areaMatches =
        watchAreas.length === 0 ||
        watchAreas.some((area) => listing.area.toLowerCase().includes(area));

      return areaMatches && listing.portions >= state.watchlist.minimumPortions;
    });
  }, [state.watchlist]);

  const watchedListings = seededListings.filter((listing) =>
    state.watchedIds.includes(listing.id),
  );

  const nextAlert = filteredListings[0] ?? seededListings[0];

  const updatePersona = (persona: Persona) => {
    setState((current) => ({
      ...current,
      activePersona: persona,
      alerts: [
        {
          id: `alert-${Date.now()}`,
          headline:
            persona === "volunteer"
              ? "Volunteer view loaded"
              : "Coordinator view loaded",
          detail:
            persona === "volunteer"
              ? "Tracking nearby listings and acknowledgement states."
              : "Checking watchlists, coverage, and route readiness.",
          time: "just now",
          severity: "watching",
        },
        ...current.alerts.slice(0, 4),
      ],
    }));
  };

  const saveWatchlist = () => {
    const areas = draftArea
      .split(",")
      .map((area) => area.trim())
      .filter(Boolean);

    setState((current) => ({
      ...current,
      watchlist: {
        ...current.watchlist,
        areas,
      },
      alerts: [
        {
          id: `alert-${Date.now()}`,
          headline: "Watchlist updated",
          detail: `Now tracking ${formatAreas(areas)} with a minimum of ${current.watchlist.minimumPortions} portions.`,
          time: "just now",
          severity: "ready",
        },
        ...current.alerts.slice(0, 4),
      ],
    }));
  };

  const toggleWatched = (listingId: string) => {
    setState((current) => {
      const isTracked = current.watchedIds.includes(listingId);
      const watchedIds = isTracked
        ? current.watchedIds.filter((id) => id !== listingId)
        : [...current.watchedIds, listingId];
      const listing = seededListings.find((item) => item.id === listingId);

      return {
        ...current,
        watchedIds,
        alerts: [
          {
            id: `alert-${Date.now()}`,
            headline: isTracked
              ? "Removed from watchlist"
              : "Added to watchlist",
            detail: listing
              ? `${listing.name} in ${listing.area} is now ${isTracked ? "untracked" : "monitored"}.`
              : "Watchlist changed.",
            time: "just now",
            severity: isTracked ? "watching" : "ready",
          },
          ...current.alerts.slice(0, 4),
        ],
      };
    });
  };

  const simulateWave = () => {
    setState((current) => {
      const candidate = nextAlert;

      return {
        ...current,
        alerts: [
          {
            id: `alert-${Date.now()}`,
            headline: `${candidate.area} surplus is ready`,
            detail: `${candidate.name} has ${candidate.portions} portions available before ${candidate.readyBy}.`,
            time: "just now",
            severity: "ready",
          },
          ...current.alerts.slice(0, 4),
        ],
      };
    });
  };

  const resetDemo = () => {
    setState(defaultState);
    setDraftArea(initialWatchlist.areas.join(", "));
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backLink}>
        Back to gallery
      </Link>

      <section className={styles.hero}>
        <div className={styles.eyebrow}>Hawker Surplus Connect</div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1>Move surplus food before it goes quiet.</h1>
            <p>
              A public demo for matching end-of-day hawker surplus with volunteers and
              coordinators. Set a watchlist, tune alert preferences, and simulate the
              next pickup wave without signing in.
            </p>
          </div>
          <div className={styles.heroMeta}>
            <strong>{seededListings.length} live listings</strong>
            <span>
              {state.alerts.length} alerts in the feed and {state.watchedIds.length} items
              on the current watchlist.
            </span>
          </div>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <div>
              <h2>Nearby surplus</h2>
              <p>Seeded Singapore data, tuned for quick response and realistic handoff flow.</p>
            </div>
            <span className={styles.pill}>{filteredListings.length} matching</span>
          </div>

          <div className={styles.listingGrid}>
            {filteredListings.map((listing) => {
              const tracked = state.watchedIds.includes(listing.id);

              return (
                <article key={listing.id} className={styles.listingCard}>
                  <div className={styles.listingTop}>
                    <div>
                      <h3>{listing.name}</h3>
                      <p>
                        {listing.area} · {listing.source}
                      </p>
                    </div>
                    <span className={styles.pill}>{listing.portions} portions</span>
                  </div>

                  <div className={styles.listingBody}>
                    <p>{listing.notes}</p>
                    <div className={styles.tagRow}>
                      {listing.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={styles.metaLine}>Ready by {listing.readyBy}</p>
                  </div>

                  <div className={styles.listingFooter}>
                    <span className={styles.smallNote}>
                      {tracked ? "Already on your watchlist" : "Available for tracking"}
                    </span>
                    <button
                      type="button"
                      className={tracked ? styles.actionGhost : styles.action}
                      onClick={() => toggleWatched(listing.id)}
                    >
                      {tracked ? "Remove" : "Track"}
                    </button>
                  </div>
                </article>
              );
            })}

            {filteredListings.length === 0 ? (
              <div className={styles.emptyState}>
                No listings match this watchlist yet. Lower the portion threshold or widen the
                areas to see more opportunities.
              </div>
            ) : null}
          </div>
        </div>

        <aside className={styles.sideStack}>
          <section className={styles.panel}>
            <div className={styles.panelTitle}>
              <div>
                <h3>Persona</h3>
                <p>Switch between response modes without creating an account.</p>
              </div>
            </div>

            <div className={styles.chips}>
              {personas.map((persona) => {
                const active = persona.id === state.activePersona;

                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => updatePersona(persona.id)}
                    className={active ? styles.chipActive : styles.chip}
                  >
                    {persona.label}
                  </button>
                );
              })}
            </div>

            <p className={styles.personaCopy}>{activePersona?.description}</p>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelTitle}>
              <div>
                <h3>Watchlist setup</h3>
                <p>Shape which stalls and areas trigger attention.</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Areas to watch</span>
                <input
                  value={draftArea}
                  onChange={(event) => setDraftArea(event.target.value)}
                  placeholder="Tiong Bahru, Bedok"
                />
              </label>

              <label className={styles.field}>
                <span>Minimum portions</span>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={2}
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
                <span className={styles.smallNote}>{state.watchlist.minimumPortions} portions</span>
              </label>

              <label className={styles.field}>
                <span>Notification cadence</span>
                <select
                  value={state.watchlist.cadence}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      watchlist: {
                        ...current.watchlist,
                        cadence: event.target.value as Watchlist["cadence"],
                      },
                    }))
                  }
                >
                  <option value="instant">Instant</option>
                  <option value="hourly">Hourly</option>
                  <option value="digest">Digest</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Radius</span>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={state.watchlist.radiusKm}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      watchlist: {
                        ...current.watchlist,
                        radiusKm: Number(event.target.value),
                      },
                    }))
                  }
                />
                <span className={styles.smallNote}>{state.watchlist.radiusKm} km</span>
              </label>
            </div>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.action} onClick={saveWatchlist}>
                Save watchlist
              </button>
              <button type="button" className={styles.actionGhost} onClick={resetDemo}>
                Reset demo
              </button>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelTitle}>
              <div>
                <h3>Simulation controls</h3>
                <p>Push the feed forward and validate the handoff loop.</p>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.action} onClick={simulateWave}>
                Generate alert wave
              </button>
              <button type="button" className={styles.actionGhost} onClick={() => toggleWatched(nextAlert.id)}>
                Toggle next listing
              </button>
            </div>

            <div className={styles.previewBox}>
              <h3>Next likely alert</h3>
              <p>
                {nextAlert.name} in {nextAlert.area} with {nextAlert.portions} portions ready
                before {nextAlert.readyBy}.
              </p>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelTitle}>
              <div>
                <h3>Alerts feed</h3>
                <p>Newest updates appear here first.</p>
              </div>
            </div>

            <div className={styles.alertList}>
              {state.alerts.map((alert) => (
                <article key={alert.id} className={styles.alertItem} data-severity={alert.severity}>
                  <span className={styles.smallNote}>{alert.time}</span>
                  <h3>{alert.headline}</h3>
                  <p>{alert.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <strong>{watchedListings.length}</strong>
                <span>Tracked listings</span>
              </div>
              <div className={styles.stat}>
                <strong>{state.watchlist.radiusKm} km</strong>
                <span>Coverage radius</span>
              </div>
              <div className={styles.stat}>
                <strong>{state.watchlist.cadence}</strong>
                <span>Alert cadence</span>
              </div>
            </div>
            <p className={styles.footerNote}>
              {hydrated ? "State is saved locally in this browser." : "Loading demo state..."}
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
