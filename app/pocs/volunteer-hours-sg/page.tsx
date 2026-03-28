"use client";

import Link from "next/link";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { animate } from "animejs";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import {
  categories,
  days,
  getCategory,
  getDay,
  initialDraft,
  initialSessions,
  STORAGE_KEY,
  type DraftSession,
  type Session,
} from "./data";
import styles from "./page.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600"],
});

function loadSessions() {
  if (typeof window === "undefined") return initialSessions;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSessions;
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : initialSessions;
  } catch {
    return initialSessions;
  }
}

function sumHours(list: Session[]) {
  return list.reduce((total, session) => total + session.hours, 0);
}

export default function VolunteerHoursPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [draft, setDraft] = useState<DraftSession>(initialDraft);
  const [mounted, setMounted] = useState(false);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [mounted, sessions]);

  const orderedSessions = useMemo(
    () => [...sessions].sort((left, right) => left.dayKey - right.dayKey || left.createdAt - right.createdAt),
    [sessions],
  );

  const totalHours = useMemo(() => sumHours(sessions), [sessions]);
  const groupedDays = useMemo(
    () =>
      days.map((day) => ({
        ...day,
        sessions: orderedSessions.filter((session) => session.dayKey === day.key),
      })),
    [orderedSessions],
  );

  useEffect(() => {
    if (!fillRef.current) return;
    const percentage = Math.min(100, (totalHours / 18) * 100);
    const animation = animate(fillRef.current, {
      width: `${percentage}%`,
      easing: "outCubic",
      duration: 650,
    });
    return () => {
      animation.pause();
    };
  }, [totalHours]);

  const activeDay = groupedDays.find((day) => day.key === selectedDay) ?? groupedDays[0];

  const handleAddSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.place.trim()) return;

    const nextSession: Session = {
      id: crypto.randomUUID(),
      dayKey: draft.dayKey,
      category: draft.category,
      hours: draft.hours,
      place: draft.place.trim(),
      note: draft.note.trim() || "Community shift logged.",
      time: draft.time,
      createdAt: Date.now(),
    };

    setSessions((current) => [...current, nextSession]);
    setSelectedDay(nextSession.dayKey);
    setDraft((current) => ({ ...current, place: "", note: "" }));
  };

  return (
    <main className={`${styles.page} ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Volunteer Hours</p>
            <h1>Keep a running journal of the week.</h1>
            <p className={styles.lede}>
              Drop each shift onto the timeline and watch the week fill with the time you gave.
            </p>
            <div className={styles.ribbon}>
              <div ref={fillRef} className={styles.ribbonFill} />
              <span>{totalHours.toFixed(1)} hours this week</span>
            </div>
          </div>
          <img
            src="/undraw/undraw_accomplishments_tb6k.svg"
            alt=""
            aria-hidden="true"
            className={styles.heroIllustration}
          />
        </section>

        <section className={styles.weekStrip}>
          {groupedDays.map((day) => {
            const hours = sumHours(day.sessions);

            return (
              <button
                key={day.key}
                type="button"
                className={`${styles.dayButton} ${day.key === activeDay.key ? styles.dayButtonActive : ""}`}
                onClick={() => setSelectedDay(day.key)}
              >
                <strong>{day.short}</strong>
                <span>{hours.toFixed(hours % 1 === 0 ? 0 : 1)}h</span>
              </button>
            );
          })}
        </section>

        <section className={styles.timeline}>
          <div className={styles.dayColumn}>
            <p className={styles.dayLabel}>{activeDay.label}</p>
            <h2>{sumHours(activeDay.sessions).toFixed(1)} hours logged</h2>
          </div>

          <div className={styles.entryColumn}>
            {activeDay.sessions.length > 0 ? (
              activeDay.sessions.map((session) => {
                const category = getCategory(session.category);
                return (
                  <article key={session.id} className={styles.entry} style={{ ["--accent" as string]: category.accent }}>
                    <div className={styles.entryTop}>
                      <span>{category.label}</span>
                      <strong>{session.hours}h</strong>
                    </div>
                    <h3>{session.place}</h3>
                    <p>{session.note}</p>
                    <div className={styles.entryMeta}>
                      <span>{getDay(session.dayKey).label}</span>
                      <span>{session.time}</span>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className={styles.emptyBlock}>
                <img
                  src="/undraw/undraw_goals_dwgr.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.emptyIllustration}
                />
                <p className={styles.emptyState}>
                  Nothing is logged for this day yet. Add a shift below to start the timeline here.
                </p>
              </div>
            )}
          </div>
        </section>

        <form className={styles.writer} onSubmit={handleAddSession}>
          <div className={styles.writerRow}>
            <label>
              <span>Day</span>
              <select
                value={draft.dayKey}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, dayKey: Number(event.target.value) as DraftSession["dayKey"] }))
                }
              >
                {days.map((day) => (
                  <option key={day.key} value={day.key}>
                    {day.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Group</span>
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, category: event.target.value as DraftSession["category"] }))
                }
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Hours</span>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={draft.hours}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, hours: Number(event.target.value) }))
                }
              />
            </label>
          </div>

          <div className={styles.writerRow}>
            <label className={styles.wideField}>
              <span>Place</span>
              <input
                type="text"
                value={draft.place}
                onChange={(event) => setDraft((current) => ({ ...current, place: event.target.value }))}
              />
            </label>

            <label>
              <span>Time</span>
              <input
                type="text"
                value={draft.time}
                onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
              />
            </label>
          </div>

          <label className={styles.noteField}>
            <span>Note</span>
            <textarea
              rows={3}
              value={draft.note}
              onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
            />
          </label>

          <button type="submit" className={styles.addButton}>
            Add this shift
          </button>
        </form>
      </div>
    </main>
  );
}
