"use client";

import Link from "next/link";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";

import {
  defaultState,
  dishes,
  getDish,
  getMealSlot,
  mealSlots,
  STORAGE_KEY,
  type MealSlotId,
  type PlannerState,
} from "./data";
import styles from "./page.module.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-hawker-budget-display",
  weight: ["500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-hawker-budget-body",
  weight: ["400", "500", "600", "700"],
});

function loadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as PlannerState;
    return {
      activeMeal: mealSlots.some((slot) => slot.id === parsed.activeMeal)
        ? parsed.activeMeal
        : defaultState.activeMeal,
      selectedByMeal: parsed.selectedByMeal ?? {},
    };
  } catch {
    return defaultState;
  }
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatCalories(value: number) {
  return `${value} kcal`;
}

function nextEmptyMeal(current: Partial<Record<MealSlotId, string>>) {
  return mealSlots.find((slot) => current[slot.id] === undefined)?.id ?? null;
}

export default function HealthyHawkerBudgetPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plannerState, setPlannerState] = useState<PlannerState>(defaultState);

  useEffect(() => {
    setPlannerState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
  }, [hydrated, plannerState]);

  const selectedMeals = useMemo(
    () =>
      mealSlots.map((slot) => ({
        slot,
        dish: getDish(plannerState.selectedByMeal[slot.id]),
      })),
    [plannerState.selectedByMeal],
  );

  const activeSlot = getMealSlot(plannerState.activeMeal);
  const activeDishes = dishes.filter((dish) => dish.meal === plannerState.activeMeal);
  const totalSpend = selectedMeals.reduce((sum, item) => sum + (item.dish?.price ?? 0), 0);
  const totalCalories = selectedMeals.reduce((sum, item) => sum + (item.dish?.calories ?? 0), 0);
  const selectedCount = selectedMeals.filter((item) => item.dish).length;

  const railData = [
    mealSlots.reduce((row, slot) => {
      row.metric = "Spend";
      row[slot.id] = getDish(plannerState.selectedByMeal[slot.id])?.price ?? 0;
      return row;
    }, {} as Record<string, number | string>),
    mealSlots.reduce((row, slot) => {
      row.metric = "Calories";
      row[slot.id] = getDish(plannerState.selectedByMeal[slot.id])?.calories ?? 0;
      return row;
    }, {} as Record<string, number | string>),
  ];

  function assignDish(dishId: string) {
    setPlannerState((current) => {
      const selectedByMeal = {
        ...current.selectedByMeal,
        [current.activeMeal]: dishId,
      };
      const nextMeal = nextEmptyMeal(selectedByMeal);

      return {
        activeMeal: nextMeal ?? current.activeMeal,
        selectedByMeal,
      };
    });
  }

  function clearMeal(mealId: MealSlotId) {
    setPlannerState((current) => {
      const selectedByMeal = { ...current.selectedByMeal };
      delete selectedByMeal[mealId];

      return {
        activeMeal: mealId,
        selectedByMeal,
      };
    });
  }

  return (
    <main className={`${styles.page} ${cormorant.variable} ${sourceSans.variable}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Healthy Hawker Budget</p>
            <h1>Build a healthier hawker day without overspending.</h1>
            <p className={styles.lede}>
              Choose the meal you are filling, then tap one familiar dish to place it on today&apos;s tray.
            </p>

            <div className={styles.mealTabs} aria-label="Choose the meal you are filling">
              {mealSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`${styles.mealTab} ${slot.id === plannerState.activeMeal ? styles.mealTabActive : ""}`}
                  onClick={() => setPlannerState((current) => ({ ...current, activeMeal: slot.id }))}
                  style={{ ["--slot-accent" as string]: slot.accent }}
                >
                  <strong>{slot.label}</strong>
                  <span>{slot.timeLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <section className={styles.summaryBoard}>
            <div className={styles.summaryHeader}>
              <div>
                <p className={styles.summaryLabel}>Today&apos;s running rail</p>
                <h2>{selectedCount === 0 ? "Start with one dish" : `${selectedCount} meal${selectedCount === 1 ? "" : "s"} now on the tray`}</h2>
              </div>
              <span className={styles.summaryNote}>
                {totalSpend <= 16 ? "Comfortable for a weekday hawker spend." : "Lunch and dinner now carry most of the spend."}
              </span>
            </div>

            <div className={styles.railWrap}>
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={railData} layout="vertical" margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="metric" type="category" axisLine={false} tickLine={false} width={76} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ borderRadius: 18, border: "1px solid rgba(75, 50, 33, 0.12)", boxShadow: "0 14px 28px rgba(75, 50, 33, 0.12)" }}
                    formatter={(value, key, item) => {
                      const numericValue = Number(value);
                      const label = mealSlots.find((slot) => slot.id === key)?.label ?? String(key);
                      const measure = item.payload.metric === "Spend" ? formatCurrency(numericValue) : formatCalories(numericValue);
                      return [measure, label];
                    }}
                  />
                  {mealSlots.map((slot) => (
                    <Bar key={slot.id} dataKey={slot.id} stackId="totals" fill={slot.accent} radius={slot.id === "dinner" ? [16, 16, 16, 16] : [0, 0, 0, 0]} animationDuration={420} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.totalsRow}>
              <div>
                <span>Spend</span>
                <strong>{formatCurrency(totalSpend)}</strong>
              </div>
              <div>
                <span>Calories</span>
                <strong>{formatCalories(totalCalories)}</strong>
              </div>
              <div>
                <span>Best next move</span>
                <strong>{activeSlot.label}</strong>
              </div>
            </div>
          </section>
        </section>

        <section className={styles.stage}>
          <section className={styles.menuBoard}>
            <div className={styles.boardTopline}>
              <div>
                <p className={styles.boardLabel}>Choose a dish for {activeSlot.label.toLowerCase()}</p>
                <h2>{activeSlot.prompt}</h2>
              </div>
              <span className={styles.boardHint}>Tap once to place it on the tray.</span>
            </div>

            <div className={styles.menuGrid}>
              {activeDishes.map((dish) => (
                <motion.button
                  key={dish.id}
                  type="button"
                  className={styles.dishCard}
                  onClick={() => assignDish(dish.id)}
                  initial={{ opacity: 0, y: 18, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ ["--dish-accent" as string]: dish.accent, ["--dish-paper" as string]: dish.paper }}
                >
                  <span className={styles.dishBadge}>{dish.badge}</span>
                  <strong>{dish.name}</strong>
                  <em>{dish.stall}</em>
                  <p>{dish.summary}</p>
                  <div className={styles.dishMeta}>
                    <span>{formatCurrency(dish.price)}</span>
                    <span>{formatCalories(dish.calories)}</span>
                  </div>
                  <div className={styles.dishNotes}>
                    <span>{dish.healthNote}</span>
                    <span>{dish.swapTip}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <section className={styles.trayBoard}>
            <div className={styles.boardTopline}>
              <div>
                <p className={styles.boardLabel}>Today&apos;s tray</p>
                <h2>Four meal moments, one running spend.</h2>
              </div>
              <span className={styles.boardHint}>Filled slots can be swapped anytime.</span>
            </div>

            <div className={styles.trayGrid}>
              <AnimatePresence initial={false}>
                {selectedMeals.map(({ slot, dish }) => (
                  <motion.section
                    key={slot.id}
                    className={`${styles.traySlot} ${slot.id === plannerState.activeMeal ? styles.traySlotActive : ""}`}
                    onClick={() => setPlannerState((current) => ({ ...current, activeMeal: slot.id }))}
                    style={{ ["--slot-accent" as string]: slot.accent }}
                    layout
                  >
                    <div className={styles.slotHeader}>
                      <div>
                        <p>{slot.label}</p>
                        <span>{slot.timeLabel}</span>
                      </div>
                      {dish ? (
                        <button
                          type="button"
                          className={styles.clearButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            clearMeal(slot.id);
                          }}
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>

                    {dish ? (
                      <motion.div
                        key={dish.id}
                        className={styles.trayDish}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -18, scale: 0.96 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        style={{ ["--dish-accent" as string]: dish.accent, ["--dish-paper" as string]: dish.paper }}
                      >
                        <strong>{dish.name}</strong>
                        <em>{dish.stall}</em>
                        <div className={styles.trayMeta}>
                          <span>{formatCurrency(dish.price)}</span>
                          <span>{formatCalories(dish.calories)}</span>
                        </div>
                        <p>{dish.healthNote}</p>
                      </motion.div>
                    ) : (
                      <div className={styles.slotEmpty}>
                        Add one dish here so your {slot.label.toLowerCase()} has a clear plan.
                      </div>
                    )}
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>

            <div className={styles.footerStrip}>
              {selectedMeals.some((item) => item.dish) ? (
                selectedMeals.filter((item) => item.dish).map(({ slot, dish }) => (
                  <div key={slot.id} className={styles.footerNote} style={{ ["--slot-accent" as string]: slot.accent }}>
                    <strong>{slot.label}</strong>
                    <span>{dish?.swapTip}</span>
                  </div>
                ))
              ) : (
                <div className={styles.footerNote} style={{ ["--slot-accent" as string]: activeSlot.accent }}>
                  <strong>Start here</strong>
                  <span>Pick one dish for {activeSlot.label.toLowerCase()} and the running rail will begin to split by meal.</span>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
