"use client";

import Link from "next/link";
import { Baloo_2, DM_Sans } from "next/font/google";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  activities,
  defaultState,
  neighbourhoods,
  plannerSlots,
  STORAGE_KEY,
  type Activity,
  type PlannerState,
} from "./data";
import styles from "./page.module.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-rest-day-display",
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-rest-day-body",
  weight: ["400", "500", "700"],
});

function loadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as PlannerState;
    if (
      !parsed.selectedNeighbourhoodId ||
      !Array.isArray(parsed.plannedActivityIds)
    ) {
      return defaultState;
    }

    return parsed;
  } catch {
    return defaultState;
  }
}

function slotActivity(planned: Activity[], slotKey: string) {
  return planned.find((activity) => activity.slot === slotKey) ?? null;
}

export default function RestDayPlannerPage() {
  const [plannerState, setPlannerState] = useState<PlannerState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlannerState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
  }, [hydrated, plannerState]);

  const selectedNeighbourhood =
    neighbourhoods.find(
      (item) => item.id === plannerState.selectedNeighbourhoodId,
    ) ?? neighbourhoods[0];

  const plannedActivities = useMemo(
    () =>
      plannerState.plannedActivityIds
        .map((id) => activities.find((activity) => activity.id === id) ?? null)
        .filter((activity): activity is Activity => Boolean(activity))
        .sort(
          (left, right) =>
            plannerSlots.findIndex((slot) => slot.key === left.slot) -
            plannerSlots.findIndex((slot) => slot.key === right.slot),
        ),
    [plannerState.plannedActivityIds],
  );

  const availableActivities = activities.filter(
    (activity) =>
      activity.neighbourhoodId === plannerState.selectedNeighbourhoodId &&
      !plannerState.plannedActivityIds.includes(activity.id),
  );

  const totalSpend = plannedActivities.reduce(
    (sum, activity) => sum + activity.costValue,
    0,
  );

  const freeStops = plannedActivities.filter(
    (activity) => activity.costValue === 0,
  ).length;

  function addActivity(activityId: string) {
    setPlannerState((current) => {
      if (current.plannedActivityIds.includes(activityId)) return current;

      return {
        ...current,
        plannedActivityIds: [...current.plannedActivityIds, activityId],
      };
    });
  }

  function removeActivity(activityId: string) {
    setPlannerState((current) => ({
      ...current,
      plannedActivityIds: current.plannedActivityIds.filter(
        (id) => id !== activityId,
      ),
    }));
  }

  return (
    <main className={`${styles.page} ${baloo.variable} ${dmSans.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Rest Day Planner</p>
            <h1>Plan a rest day that fits your budget, your errands, and the places you actually want to enjoy.</h1>
            <p className={styles.lede}>
              Start with one area, then drop a stop into your Sunday board.
            </p>
          </div>

          <div className={styles.heroSummary}>
            <div className={styles.summarySticker}>
              <span>Stops saved</span>
              <strong>{plannedActivities.length}</strong>
            </div>
            <div className={styles.summarySticker}>
              <span>Spend so far</span>
              <strong>${totalSpend}</strong>
            </div>
            <div className={styles.summarySticker}>
              <span>Free breaks</span>
              <strong>{freeStops}</strong>
            </div>
          </div>
        </section>

        <section className={styles.neighbourhoodStrip} aria-label="Choose an area">
          {neighbourhoods.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.neighbourhoodCard} ${
                item.id === selectedNeighbourhood.id
                  ? styles.neighbourhoodCardActive
                  : ""
              }`}
              onClick={() =>
                setPlannerState((current) => ({
                  ...current,
                  selectedNeighbourhoodId: item.id,
                }))
              }
              style={{ ["--neighbourhood-accent" as string]: item.accent }}
            >
              <strong>{item.name}</strong>
              <span>{item.line1}</span>
              <em>{item.line2}</em>
            </button>
          ))}
        </section>

        <section className={styles.stage}>
          <div className={styles.browserPanel}>
            <div className={styles.panelTopline}>
              <div>
                <p className={styles.panelLabel}>Pick your next stop</p>
                <h2>{selectedNeighbourhood.name}</h2>
              </div>
              <span className={styles.panelHint}>
                {selectedNeighbourhood.line2}
              </span>
            </div>

            <LayoutGroup>
              <div className={styles.activityDeck}>
                <AnimatePresence initial={false}>
                  {availableActivities.map((activity) => (
                    <motion.button
                      key={activity.id}
                      type="button"
                      layout
                      className={styles.activityCard}
                      initial={{ opacity: 0, y: 18, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, y: -24, rotate: 2 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      onClick={() => addActivity(activity.id)}
                      style={{ ["--activity-accent" as string]: activity.accent }}
                    >
                      <span className={styles.activityBadge}>{activity.badge}</span>
                      <strong>{activity.name}</strong>
                      <p>{activity.summary}</p>
                      <div className={styles.activityMeta}>
                        <span>{activity.timeLabel}</span>
                        <span>{activity.costLabel}</span>
                        <span>{activity.duration}</span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </LayoutGroup>

            {availableActivities.length === 0 ? (
              <p className={styles.emptyState}>
                This area is already on your board. Pick another area to add a different stop.
              </p>
            ) : null}
          </div>

          <div className={styles.sideRail}>
            <section className={styles.plannerPanel}>
              <div className={styles.panelTopline}>
                <div>
                  <p className={styles.panelLabel}>Sunday board</p>
                  <h2>Your rest day</h2>
                </div>
                <span className={styles.panelHint}>Tap a saved stop to clear space.</span>
              </div>

              <div className={styles.plannerGrid}>
                {plannerSlots.map((slot) => {
                  const activity = slotActivity(plannedActivities, slot.key);

                  return (
                    <div key={slot.key} className={styles.slotColumn}>
                      <div className={styles.slotHeader}>
                        <strong>{slot.key}</strong>
                        <span>{slot.timeRange}</span>
                      </div>
                      <p className={styles.slotNote}>{slot.note}</p>

                      <AnimatePresence mode="wait">
                        {activity ? (
                          <motion.button
                            key={activity.id}
                            type="button"
                            className={styles.plannedCard}
                            initial={{ opacity: 0, y: -30, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 360, damping: 26 }}
                            onClick={() => removeActivity(activity.id)}
                            style={{
                              ["--activity-accent" as string]: activity.accent,
                            }}
                          >
                            <span className={styles.plannedTime}>{activity.timeLabel}</span>
                            <strong>{activity.name}</strong>
                            <p>{activity.neighbourhood}</p>
                            <em>
                              {activity.costLabel} · Bring {activity.bring}
                            </em>
                          </motion.button>
                        ) : (
                          <motion.div
                            key={`${slot.key}-empty`}
                            className={styles.slotEmpty}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Add one stop here to shape this part of the day.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={styles.mapPanel}>
              <div className={styles.panelTopline}>
                <div>
                  <p className={styles.panelLabel}>Day route</p>
                  <h2>Where your day goes</h2>
                </div>
                <span className={styles.panelHint}>Your saved stops light up on the map.</span>
              </div>

              <svg
                viewBox="0 0 430 290"
                className={styles.routeMap}
                aria-label="Map of planned rest day activities across Singapore"
              >
                <path
                  d="M110 230 C150 195, 165 138, 190 118 S245 85, 272 162 S325 214, 356 205"
                  className={styles.routeLine}
                />

                {neighbourhoods.map((item) => {
                  const plannedCount = plannedActivities.filter(
                    (activity) => activity.neighbourhoodId === item.id,
                  ).length;

                  return (
                    <g
                      key={item.id}
                      className={styles.mapNode}
                      onClick={() =>
                        setPlannerState((current) => ({
                          ...current,
                          selectedNeighbourhoodId: item.id,
                        }))
                      }
                    >
                      <circle
                        cx={item.mapX}
                        cy={item.mapY}
                        r={plannedCount > 0 ? 22 : 17}
                        className={styles.mapNodeCircle}
                        style={{ ["--node-accent" as string]: item.accent }}
                      />
                      <text
                        x={item.mapX}
                        y={item.mapY + 4}
                        textAnchor="middle"
                        className={styles.mapNodeLabel}
                      >
                        {plannedCount > 0 ? plannedCount : "•"}
                      </text>
                      <text
                        x={item.mapX}
                        y={item.mapY + 40}
                        textAnchor="middle"
                        className={styles.mapNodeName}
                      >
                        {item.name}
                      </text>
                    </g>
                  );
                })}

                {plannedActivities.map((activity, index) => (
                  <motion.g
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.75, y: -18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.05 }}
                  >
                    <rect
                      x={activity.mapX - 44}
                      y={activity.mapY - 54}
                      width="88"
                      height="26"
                      rx="13"
                      className={styles.mapToken}
                      style={{ ["--token-accent" as string]: activity.accent }}
                    />
                    <text
                      x={activity.mapX}
                      y={activity.mapY - 37}
                      textAnchor="middle"
                      className={styles.mapTokenLabel}
                    >
                      {activity.timeLabel}
                    </text>
                  </motion.g>
                ))}
              </svg>

              <div className={styles.routeList}>
                {plannedActivities.length > 0 ? (
                  plannedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={styles.routeListItem}
                      style={{ ["--activity-accent" as string]: activity.accent }}
                    >
                      <strong>{activity.timeLabel}</strong>
                      <span>{activity.name}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>
                    Add a stop to see how your day moves from one area to the next.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
