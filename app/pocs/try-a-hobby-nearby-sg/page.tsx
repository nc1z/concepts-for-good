"use client";

import Link from "next/link";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

import {
  comfortLabels,
  defaultState,
  meetups,
  STORAGE_KEY,
  type ComfortLevel,
  type HobbyState,
} from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-hobby-display",
  weight: ["600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-hobby-mono",
  weight: ["400", "500", "600", "700"],
});

const comfortValues: ComfortLevel[] = [1, 2, 3, 4, 5];

function loadState(): HobbyState {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<HobbyState>;
    const comfort = comfortValues.includes(parsed.comfort as ComfortLevel)
      ? (parsed.comfort as ComfortLevel)
      : defaultState.comfort;
    const selectedId = meetups.some((meetup) => meetup.id === parsed.selectedId)
      ? parsed.selectedId!
      : defaultState.selectedId;
    const savedIds = Array.isArray(parsed.savedIds)
      ? parsed.savedIds.filter((id) => meetups.some((meetup) => meetup.id === id))
      : [];

    return { comfort, selectedId, savedIds };
  } catch {
    return defaultState;
  }
}

export default function TryAHobbyNearbyPage() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<HobbyState>(defaultState);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const selectedMeetup =
    meetups.find((meetup) => meetup.id === state.selectedId) ?? meetups[0];
  const nearbyCount = meetups.filter(
    (meetup) => meetup.comfort <= state.comfort,
  ).length;
  const savedMeetups = useMemo(
    () =>
      state.savedIds
        .map((id) => meetups.find((meetup) => meetup.id === id))
        .filter(Boolean),
    [state.savedIds],
  );

  function setComfort(value: number) {
    const comfort = Math.min(5, Math.max(1, value)) as ComfortLevel;
    const closestMatch =
      meetups.find((meetup) => meetup.comfort === comfort) ??
      meetups.find((meetup) => meetup.comfort <= comfort) ??
      selectedMeetup;

    setState((current) => ({
      ...current,
      comfort,
      selectedId:
        current.selectedId === selectedMeetup.id && selectedMeetup.comfort > comfort
          ? closestMatch.id
          : current.selectedId,
    }));
  }

  function toggleSaved(id: string) {
    setState((current) => ({
      ...current,
      savedIds: current.savedIds.includes(id)
        ? current.savedIds.filter((savedId) => savedId !== id)
        : [...current.savedIds, id],
    }));
  }

  return (
    <main
      className={`${styles.page} ${fraunces.variable} ${ibmPlexMono.variable}`}
    >
      <Link href="/" className={styles.backLink}>
        Back to gallery
      </Link>

      <section className={styles.intro} aria-labelledby="page-title">
        <p className={styles.kicker}>Try a hobby nearby</p>
        <h1 id="page-title">Find a gentle first meetup near home.</h1>
        <p className={styles.lede}>
          Choose how much social energy you have today, then pick a small hobby
          plan that feels possible.
        </p>
      </section>

      <section className={styles.comfortControl} aria-label="Choose your social energy">
        <div>
          <span>Today feels like</span>
          <strong>{comfortLabels[state.comfort]}</strong>
        </div>
        <input
          aria-label="Social energy"
          max="5"
          min="1"
          onChange={(event) => setComfort(Number(event.target.value))}
          type="range"
          value={state.comfort}
        />
        <p>{nearbyCount} gentle options are close enough for today.</p>
      </section>

      <section className={styles.constellation} aria-label="Find a gentle hobby meetup">
        <div className={styles.radar} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringMiddle} />
          <span
            className={styles.comfortRing}
            style={{ "--comfort-size": `${24 + state.comfort * 13}%` } as React.CSSProperties}
          />
          <span className={styles.crosshair} />
        </div>

        {meetups.map((meetup) => {
          const distance = Math.hypot(meetup.x, meetup.y);
          const isWithinReach = meetup.comfort <= state.comfort;
          const pull = isWithinReach ? 0.76 : 1.16 + meetup.comfort * 0.04;
          const left = 50 + meetup.x * pull;
          const top = 50 + meetup.y * pull;
          const isSelected = meetup.id === selectedMeetup.id;

          return (
            <button
              className={styles.cluster}
              data-active={isSelected}
              data-dimmed={!isWithinReach}
              key={meetup.id}
              onClick={() =>
                setState((current) => ({ ...current, selectedId: meetup.id }))
              }
              style={
                {
                  "--cluster-left": `${left}%`,
                  "--cluster-top": `${top}%`,
                  "--cluster-colour": meetup.colour,
                  "--cluster-size": `${Math.max(46, 92 - distance * 0.55)}px`,
                } as React.CSSProperties
              }
            >
              <span className={styles.clusterCore} />
              <span className={styles.clusterText}>
                <strong>{meetup.hobby}</strong>
                <small>{meetup.area}</small>
              </span>
            </button>
          );
        })}
      </section>

      <aside className={styles.detailDock} aria-label={`${selectedMeetup.title} plan`}>
        <div className={styles.ticketMark} aria-hidden="true" />
        <p className={styles.dockKicker}>
          {selectedMeetup.area} / {selectedMeetup.duration}
        </p>
        <h2>{selectedMeetup.title}</h2>
        <dl className={styles.quickFacts}>
          <div>
            <dt>Where</dt>
            <dd>{selectedMeetup.place}</dd>
          </div>
          <div>
            <dt>Group</dt>
            <dd>{selectedMeetup.groupSize}</dd>
          </div>
          <div>
            <dt>Getting there</dt>
            <dd>{selectedMeetup.travel}</dd>
          </div>
        </dl>
        <div className={styles.firstStep}>
          <span>First step</span>
          <p>{selectedMeetup.firstStep}</p>
        </div>
        <div className={styles.sayLine}>
          <span>What to say</span>
          <p>{selectedMeetup.whatToSay}</p>
        </div>
        <p className={styles.fitLine}>{selectedMeetup.goodFit}</p>
        <button
          className={styles.saveButton}
          onClick={() => toggleSaved(selectedMeetup.id)}
          type="button"
        >
          {state.savedIds.includes(selectedMeetup.id)
            ? "Saved for later"
            : "Save this first step"}
        </button>
      </aside>

      <aside className={styles.savedRail} aria-label="Saved first steps">
        <span>Try list</span>
        {savedMeetups.length > 0 ? (
          <ul>
            {savedMeetups.map((meetup) =>
              meetup ? (
                <li key={meetup.id}>
                  <button
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        selectedId: meetup.id,
                      }))
                    }
                    type="button"
                  >
                    {meetup.title}
                  </button>
                </li>
              ) : null,
            )}
          </ul>
        ) : (
          <p>Save one gentle option here before you message a host.</p>
        )}
      </aside>
    </main>
  );
}
