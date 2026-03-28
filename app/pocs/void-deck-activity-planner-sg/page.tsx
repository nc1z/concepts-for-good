"use client";

import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { CSSProperties, useEffect, useMemo, useState } from "react";

import {
  activityOptions,
  initialBookings,
  slots,
  STORAGE_KEY,
  weekDays,
  type Booking,
  type WeekDay,
  zones,
} from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-voiddeck-heading",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-voiddeck-body",
  weight: ["400", "500", "700"],
});

const dayOrder = new Map(weekDays.map((day, index) => [day, index]));

function getDefaultSlot(day: WeekDay) {
  return slots.find((slot) => slot.day === day)?.id ?? slots[0].id;
}

export default function VoidDeckActivityPlannerPage() {
  const [selectedDay, setSelectedDay] = useState<WeekDay>("Saturday");
  const [selectedSlotId, setSelectedSlotId] = useState<string>(getDefaultSlot("Saturday"));
  const [selectedActivityId, setSelectedActivityId] = useState<string>(activityOptions[1].id);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setBookings(JSON.parse(raw) as Booking[]);
      }
    } catch {
      // Ignore invalid saved data.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const selectedDaySlots = useMemo(
    () => slots.filter((slot) => slot.day === selectedDay),
    [selectedDay],
  );
  const selectedSlot =
    selectedDaySlots.find((slot) => slot.id === selectedSlotId) ?? selectedDaySlots[0] ?? slots[0];
  const selectedBooking =
    bookings.find((booking) => booking.slotId === selectedSlot.id) ?? null;
  const selectedActivity =
    activityOptions.find((activity) => activity.id === selectedActivityId) ?? activityOptions[0];

  const weeklyBoard = useMemo(() => {
    return bookings
      .map((booking) => {
        const slot = slots.find((item) => item.id === booking.slotId);
        const activity = activityOptions.find((item) => item.id === booking.activityId);

        if (!slot || !activity) return null;

        return { booking, slot, activity };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => {
        const leftDay = dayOrder.get(left.slot.day) ?? 0;
        const rightDay = dayOrder.get(right.slot.day) ?? 0;
        return leftDay - rightDay || left.slot.timeRange.localeCompare(right.slot.timeRange);
      });
  }, [bookings]);

  const handleDayChange = (day: WeekDay) => {
    setSelectedDay(day);
    setSelectedSlotId(getDefaultSlot(day));
  };

  const handlePinActivity = () => {
    if (selectedBooking) return;

    setBookings((current) => [
      ...current,
      {
        id: `booking-${crypto.randomUUID()}`,
        slotId: selectedSlot.id,
        activityId: selectedActivity.id,
      },
    ]);
  };

  return (
    <main className={`${styles.page} ${fraunces.variable} ${dmSans.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Void Deck Activity Planner</p>
            <h1>See which void deck hours are still open, then pin your next gathering to the week.</h1>
            <p className={styles.lede}>
              Tap an open hour on the floor plan to place a session where neighbours can join
              without clashing with what is already happening downstairs.
            </p>
          </div>
        </section>

        <div className={styles.dayTabs} role="tablist" aria-label="Pick a day">
          {weekDays.map((day) => (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={day === selectedDay}
              className={`${styles.dayTab} ${day === selectedDay ? styles.dayTabActive : ""}`}
              onClick={() => handleDayChange(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <section className={styles.stage}>
          <div className={styles.floorShell}>
            <div className={styles.floorTopline}>
              <div>
                <p className={styles.floorLabel}>{selectedDay}</p>
                <h2>The void deck</h2>
              </div>
              <span className={styles.floorHint}>Choose one time block</span>
            </div>

            <svg
              viewBox="0 0 760 470"
              className={styles.floorPlan}
              aria-label={`${selectedDay} floor plan with open and booked activity hours`}
            >
              <rect x="30" y="36" width="700" height="394" rx="34" className={styles.deckBase} />
              <rect x="58" y="58" width="644" height="350" rx="26" className={styles.deckInset} />
              <rect x="440" y="76" width="256" height="18" rx="9" className={styles.walkway} />
              <rect x="104" y="294" width="94" height="94" rx="20" className={styles.columnBlock} />
              <rect x="434" y="266" width="120" height="120" rx="24" className={styles.columnBlock} />

              {zones.map((zone) => (
                <g key={zone.id}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="24"
                    className={styles.zone}
                  />
                  <text
                    x={zone.x + 16}
                    y={zone.y + 28}
                    className={styles.zoneLabel}
                  >
                    {zone.label}
                  </text>
                </g>
              ))}

              {selectedDaySlots.map((slot) => {
                const booking = bookings.find((item) => item.slotId === slot.id);
                const activity = activityOptions.find((item) => item.id === booking?.activityId);
                const isSelected = slot.id === selectedSlot.id;
                const isBooked = Boolean(booking);

                return (
                  <motion.g
                    key={slot.id}
                    layout
                    onClick={() => setSelectedSlotId(slot.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedSlotId(slot.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${slot.label}, ${slot.timeRange}${isBooked ? `, booked for ${activity?.name}` : ", open"}`}
                    className={[
                      styles.slotGroup,
                      isSelected ? styles.slotGroupSelected : "",
                      isBooked ? styles.slotGroupBooked : styles.slotGroupOpen,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <motion.rect
                      x={slot.x}
                      y={slot.y}
                      width={slot.width}
                      height={slot.height}
                      rx="18"
                      className={styles.slotCard}
                      initial={false}
                      animate={{
                        scale: isSelected ? 1.02 : 1,
                      }}
                      style={
                        {
                          ["--slot-tone" as string]: activity?.tone ?? "#f3d9ad",
                        } as CSSProperties
                      }
                    />
                    <text x={slot.x + 16} y={slot.y + 24} className={styles.slotLabel}>
                      {slot.label}
                    </text>
                    <text x={slot.x + 16} y={slot.y + 44} className={styles.slotTime}>
                      {slot.timeRange}
                    </text>
                    <text x={slot.x + 16} y={slot.y + 62} className={styles.slotState}>
                      {isBooked ? activity?.name : "Open for your next activity"}
                    </text>
                    {isBooked ? (
                      <motion.circle
                        cx={slot.x + slot.width - 18}
                        cy={slot.y + 18}
                        r="6"
                        className={styles.slotDot}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      />
                    ) : null}
                  </motion.g>
                );
              })}
            </svg>
          </div>

          <div className={styles.sideRail}>
            <AnimatePresence mode="wait">
              <motion.section
                key={selectedSlot.id}
                className={styles.panel}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.22 }}
              >
                <div className={styles.panelTopline}>
                  <span>{selectedDay}</span>
                  <span>{selectedSlot.timeRange}</span>
                </div>
                <h2>{selectedSlot.label}</h2>
                <p className={styles.panelLead}>
                  {selectedBooking
                    ? "This hour is already pinned to the board."
                    : "Choose the activity that fits this hour best."}
                </p>

                {selectedBooking ? (
                  (() => {
                    const bookedActivity =
                      activityOptions.find((activity) => activity.id === selectedBooking.activityId) ??
                      activityOptions[0];

                    return (
                      <div
                        className={styles.bookedCard}
                        style={
                          {
                            ["--note-accent" as string]: bookedActivity.tone,
                          } as CSSProperties
                        }
                      >
                        <strong>{bookedActivity.name}</strong>
                        <p>{bookedActivity.note}</p>
                        <span>{bookedActivity.host}</span>
                        <em>Bring {bookedActivity.bring}</em>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <div className={styles.activityList}>
                      {activityOptions.map((activity) => (
                        <button
                          key={activity.id}
                          type="button"
                          className={`${styles.activityCard} ${activity.id === selectedActivityId ? styles.activityCardActive : ""}`}
                          onClick={() => setSelectedActivityId(activity.id)}
                          style={
                            {
                              ["--activity-accent" as string]: activity.tone,
                            } as CSSProperties
                          }
                        >
                          <strong>{activity.name}</strong>
                          <span>{activity.host}</span>
                        </button>
                      ))}
                    </div>

                    <div
                      className={styles.selectionNote}
                      style={
                        {
                          ["--note-accent" as string]: selectedActivity.tone,
                        } as CSSProperties
                      }
                    >
                      <p>{selectedActivity.note}</p>
                      <span>Bring {selectedActivity.bring}</span>
                    </div>

                    <button
                      type="button"
                      className={styles.pinButton}
                      onClick={handlePinActivity}
                    >
                      Pin this to the week
                    </button>
                  </>
                )}
              </motion.section>
            </AnimatePresence>

            <section className={styles.noticeboard}>
              <div className={styles.noticeboardHeading}>
                <div>
                  <p className={styles.floorLabel}>This week&apos;s board</p>
                  <h2>What neighbours will see downstairs</h2>
                </div>
              </div>

              {weeklyBoard.length > 0 ? (
                <div className={styles.noticeList}>
                  <AnimatePresence>
                    {weeklyBoard.map(({ booking, slot, activity }, index) => (
                      <motion.article
                        key={booking.id}
                        className={styles.noticeCard}
                        style={
                          {
                            ["--note-accent" as string]: activity.tone,
                            ["--note-rotate" as string]: `${index % 2 === 0 ? -1.4 : 1.8}deg`,
                          } as CSSProperties
                        }
                        initial={{ opacity: 0, y: 20, rotate: -2 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                      >
                        <div className={styles.noticePin} />
                        <span className={styles.noticeDay}>{slot.day}</span>
                        <h3>{activity.name}</h3>
                        <p>{slot.timeRange}</p>
                        <strong>{slot.label}</strong>
                        <span>{activity.host}</span>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <p className={styles.emptyState}>
                  Pick an open hour on the floor plan and pin the first activity here.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
