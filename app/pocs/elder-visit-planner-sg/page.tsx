"use client";

import Link from "next/link";
import { Manrope } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  days,
  initialVisits,
  seniors,
  STORAGE_KEY,
  visitTimes,
  volunteers,
  type VisitSlot,
} from "./data";
import styles from "./page.module.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

export default function ElderVisitPlannerPage() {
  const [visits, setVisits] = useState<VisitSlot[]>(initialVisits);
  const [selectedDay, setSelectedDay] = useState<(typeof days)[number]>("Thursday");
  const [selectedSeniorId, setSelectedSeniorId] = useState(seniors[2].id);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(volunteers[0].id);
  const [selectedTime, setSelectedTime] = useState<(typeof visitTimes)[number]>("3:30 pm");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVisits(JSON.parse(raw) as VisitSlot[]);
      }
    } catch {
      // Ignore invalid saved state.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  }, [visits]);

  const missingDays = days.filter((day) => !visits.some((visit) => visit.day === day));
  const selectedSenior = seniors.find((senior) => senior.id === selectedSeniorId) ?? seniors[0];

  const handleBookVisit = () => {
    const exists = visits.some(
      (visit) => visit.day === selectedDay && visit.seniorId === selectedSeniorId,
    );

    if (exists) {
      return;
    }

    setVisits((current) => [
      ...current,
      {
        id: `visit-${crypto.randomUUID()}`,
        day: selectedDay,
        seniorId: selectedSeniorId,
        volunteerId: selectedVolunteerId,
        time: selectedTime,
      },
    ]);
  };

  return (
    <main className={`${styles.page} ${manrope.variable}`}>
      <div className={styles.shell}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <div className={styles.weekBadge}>This week&apos;s neighbourhood visits</div>
        </div>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Community care</p>
          <h1 className={styles.title}>See the week at a glance and fill the visits still missing.</h1>
          <p className={styles.lede}>
            Pick a day, add a volunteer visit, and keep track of which seniors still need someone to drop by.
          </p>
        </section>

        <div className={styles.layout}>
          <section className={styles.planner}>
            <div className={styles.summaryBar}>
              <div className={styles.summaryTile}>
                <span className={styles.summaryLabel}>Visits booked</span>
                <span className={styles.summaryValue}>{visits.length}</span>
              </div>
              <div className={styles.summaryTile}>
                <span className={styles.summaryLabel}>Days still open</span>
                <span className={styles.summaryValue}>{missingDays.length}</span>
              </div>
              <div className={styles.summaryTile}>
                <span className={styles.summaryLabel}>Seniors on this week&apos;s list</span>
                <span className={styles.summaryValue}>{seniors.length}</span>
              </div>
            </div>

            <div className={styles.calendar}>
              <div className={styles.calendarGrid}>
                {days.map((day) => {
                  const dayVisits = visits.filter((visit) => visit.day === day);
                  const isMissing = dayVisits.length === 0;
                  const isOpen = selectedDay === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={[
                        styles.dayCard,
                        isMissing && styles.dayCardMissing,
                        isMissing && styles.pulse,
                        isOpen && styles.dayCardOpen,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className={styles.dayTop}>
                        <h2 className={styles.dayName}>{day}</h2>
                        <div className={styles.dayState}>
                          {isMissing
                            ? "No visit booked yet."
                            : `${dayVisits.length} visit${dayVisits.length > 1 ? "s" : ""} planned.`}
                        </div>
                      </div>

                      <div className={styles.slotList}>
                        {dayVisits.map((visit) => {
                          const senior = seniors.find((item) => item.id === visit.seniorId);
                          const volunteer = volunteers.find((item) => item.id === visit.volunteerId);

                          if (!senior || !volunteer) return null;

                          return (
                            <motion.div
                              key={visit.id}
                              layout
                              initial={{ opacity: 0, y: 18, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={styles.slot}
                              style={
                                {
                                  ["--slot-accent" as string]: volunteer.accent,
                                } as React.CSSProperties
                              }
                            >
                              <div className={styles.slotTime}>{visit.time}</div>
                              <h3 className={styles.slotTitle}>{senior.name}</h3>
                              <div className={styles.slotVolunteer}>{volunteer.name} · {senior.visitNeed}</div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {isMissing ? (
                        <div className={styles.emptyPrompt}>Tap this day to arrange a visit.</div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className={styles.sideRail}>
            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>{selectedDay}</h2>
              <p className={styles.panelText}>
                Add one visit for this day so the week has fewer gaps.
              </p>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="senior">
                  Senior to visit
                </label>
                <select
                  id="senior"
                  className={styles.select}
                  value={selectedSeniorId}
                  onChange={(event) => setSelectedSeniorId(event.target.value)}
                >
                  {seniors.map((senior) => (
                    <option key={senior.id} value={senior.id}>
                      {senior.name} · {senior.area}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="volunteer">
                  Volunteer
                </label>
                <select
                  id="volunteer"
                  className={styles.select}
                  value={selectedVolunteerId}
                  onChange={(event) => setSelectedVolunteerId(event.target.value)}
                >
                  {volunteers.map((volunteer) => (
                    <option key={volunteer.id} value={volunteer.id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="time">
                  Visit time
                </label>
                <select
                  id="time"
                  className={styles.select}
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value as (typeof visitTimes)[number])}
                >
                  {visitTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" className={styles.bookButton} onClick={handleBookVisit}>
                Add visit to {selectedDay}
              </button>

              <p className={styles.panelText}>{selectedSenior.note}</p>
            </section>

            <section className={styles.seniorList}>
              <h2 className={styles.seniorListTitle}>Still waiting for visits</h2>
              <p className={styles.seniorListText}>
                Keep an eye on preferred days that have not been booked yet.
              </p>
              {seniors.map((senior) => {
                const hasPreferredVisit = visits.some(
                  (visit) => visit.day === senior.preferredDay && visit.seniorId === senior.id,
                );

                return (
                  <div key={senior.id} className={styles.seniorCard}>
                    <div className={styles.seniorNameRow}>
                      <h3 className={styles.seniorName}>{senior.name}</h3>
                      <span className={styles.preferredDay}>{senior.preferredDay}</span>
                    </div>
                    <div className={styles.seniorMeta}>{senior.area}</div>
                    <div className={styles.seniorMeta}>{senior.visitNeed}</div>
                    <p className={styles.seniorNote}>
                      {hasPreferredVisit
                        ? "Preferred day already covered this week."
                        : "Preferred day still open this week."}
                    </p>
                  </div>
                );
              })}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
