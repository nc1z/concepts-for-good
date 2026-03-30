"use client";

import Link from "next/link";
import { Alegreya_Sans, Prata } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
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

const prata = Prata({
  subsets: ["latin"],
  variable: "--font-hawker-budget-display",
  weight: ["400"],
});

const alegreya = Alegreya_Sans({
  subsets: ["latin"],
  variable: "--font-hawker-budget-body",
  weight: ["400", "500", "700", "800"],
});

const DAILY_BUDGET = 15;
const MAX_BAR_SPEND = 18;
const MAX_BAR_CALORIES = 1800;

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

function getBudgetStatus(totalSpend: number) {
  if (totalSpend === 0) {
    return {
      label: "Open day",
      note: "Pick a first meal and the spend line starts moving.",
    };
  }

  if (totalSpend <= DAILY_BUDGET) {
    return {
      label: "Within budget",
      note: "You still have room for one fuller meal or a steadier snack.",
    };
  }

  if (totalSpend <= MAX_BAR_SPEND) {
    return {
      label: "Watch dinner",
      note: "The day still works, but the last meal needs a lighter touch.",
    };
  }

  return {
    label: "Over target",
    note: "Swap one heavier pick and the total drops fast.",
  };
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
  const spendStatus = getBudgetStatus(totalSpend);
  const spendPercent = Math.min((totalSpend / MAX_BAR_SPEND) * 100, 100);
  const caloriePercent = Math.min((totalCalories / MAX_BAR_CALORIES) * 100, 100);
  const nextMealId = nextEmptyMeal(plannerState.selectedByMeal);

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

  function jumpToMeal(mealId: MealSlotId) {
    setPlannerState((current) => ({ ...current, activeMeal: mealId }));
    window.requestAnimationFrame(() => {
      document.getElementById("hawker-menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className={`${styles.page} ${prata.variable} ${alegreya.variable}`}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Healthy Hawker Budget</p>
            <h1>Plan a full hawker day that stays affordable and still feels like a proper day of meals.</h1>
            <p className={styles.lede}>
              Pick the meal you&apos;re eating next, then drop one familiar dish onto today&apos;s running spend line.
            </p>
            <button
              type="button"
              className={styles.startButton}
              onClick={() => jumpToMeal(nextMealId ?? plannerState.activeMeal)}
            >
              {selectedCount === 0 ? "Pick the first meal" : `Continue with ${getMealSlot(nextMealId ?? plannerState.activeMeal).label.toLowerCase()}`}
            </button>

            <div className={styles.mealRail} aria-label="Choose a meal to fill">
              {mealSlots.map((slot) => {
                const dish = getDish(plannerState.selectedByMeal[slot.id]);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={`${styles.mealButton} ${slot.id === plannerState.activeMeal ? styles.mealButtonActive : ""}`}
                    onClick={() => jumpToMeal(slot.id)}
                    style={{ ["--slot-accent" as string]: slot.accent }}
                  >
                    <span>{slot.label}</span>
                    <strong>{dish ? dish.name : slot.timeLabel}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          <section className={styles.budgetSlip} aria-label="Today&apos;s running total">
            <div className={styles.slipTopline}>
              <p>Today&apos;s tray</p>
              <strong>{spendStatus.label}</strong>
            </div>

            <div className={styles.bigTotalRow}>
              <div>
                <span>Spend</span>
                <strong>{formatCurrency(totalSpend)}</strong>
              </div>
              <div>
                <span>Calories</span>
                <strong>{formatCalories(totalCalories)}</strong>
              </div>
            </div>

            <div className={styles.meterGroup}>
              <div className={styles.meterLabelRow}>
                <span>Spend line</span>
                <span>{formatCurrency(DAILY_BUDGET)} target</span>
              </div>
              <div className={styles.meterTrack}>
                <motion.div
                  className={styles.meterFill}
                  animate={{ width: `${spendPercent}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {selectedMeals.map(({ slot, dish }) =>
                    dish ? (
                      <motion.span
                        key={slot.id}
                        className={styles.meterSegment}
                        layout
                        style={{ background: slot.accent, width: `${(dish.price / Math.max(totalSpend, 1)) * 100}%` }}
                      />
                    ) : null,
                  )}
                </motion.div>
                <span className={styles.targetMark} style={{ left: `${(DAILY_BUDGET / MAX_BAR_SPEND) * 100}%` }} />
              </div>
            </div>

            <div className={styles.meterGroup}>
              <div className={styles.meterLabelRow}>
                <span>Energy line</span>
                <span>{MAX_BAR_CALORIES} kcal guide</span>
              </div>
              <div className={`${styles.meterTrack} ${styles.energyTrack}`}>
                <motion.div
                  className={`${styles.meterFill} ${styles.energyFill}`}
                  animate={{ width: `${caloriePercent}%` }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                />
              </div>
            </div>

            <p className={styles.slipNote}>{spendStatus.note}</p>
          </section>
        </section>

        <section className={styles.contentGrid}>
          <section className={styles.menuStage} id="hawker-menu">
            <div className={styles.sectionHead}>
              <p>{activeSlot.label}</p>
              <h2>{activeSlot.prompt}</h2>
            </div>

            <div className={styles.menuWall}>
              {activeDishes.map((dish, index) => (
                <motion.button
                  key={dish.id}
                  type="button"
                  className={styles.dishCard}
                  onClick={() => assignDish(dish.id)}
                  initial={{ opacity: 0, y: 28, rotate: index % 2 === 0 ? -2 : 2 }}
                  animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  style={{ ["--dish-accent" as string]: dish.accent, ["--dish-paper" as string]: dish.paper }}
                >
                  <span className={styles.cardTape}>{dish.badge}</span>
                  <strong>{dish.name}</strong>
                  <em>{dish.stall}</em>
                  <p>{dish.summary}</p>
                  <dl className={styles.cardStats}>
                    <div>
                      <dt>Price</dt>
                      <dd>{formatCurrency(dish.price)}</dd>
                    </div>
                    <div>
                      <dt>Calories</dt>
                      <dd>{formatCalories(dish.calories)}</dd>
                    </div>
                  </dl>
                  <div className={styles.cardFooter}>
                    <span>{dish.healthNote}</span>
                    <span>{dish.swapTip}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <aside className={styles.receiptRail}>
            <div className={styles.receiptHead}>
              <p>Your day</p>
              <h2>{selectedCount === 0 ? "Nothing picked yet" : `${selectedCount} meal${selectedCount === 1 ? "" : "s"} on the plan`}</h2>
            </div>

            <div className={styles.receiptBody}>
              <AnimatePresence initial={false}>
                {selectedMeals.map(({ slot, dish }) => (
                  <motion.section
                    key={slot.id}
                    className={styles.receiptRow}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                  >
                    <div className={styles.receiptRowHead}>
                      <div>
                        <p>{slot.label}</p>
                        <span>{slot.timeLabel}</span>
                      </div>
                      {dish ? (
                        <button
                          type="button"
                          className={styles.clearButton}
                          onClick={() => clearMeal(slot.id)}
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>

                    {dish ? (
                      <motion.div
                        key={dish.id}
                        className={styles.receiptDish}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <strong>{dish.name}</strong>
                        <em>{dish.stall}</em>
                        <div className={styles.receiptMeta}>
                          <span>{formatCurrency(dish.price)}</span>
                          <span>{formatCalories(dish.calories)}</span>
                        </div>
                        <p>{dish.healthNote}</p>
                      </motion.div>
                    ) : (
                      <p className={styles.emptyLine}>Pick one dish for {slot.label.toLowerCase()} to keep the day balanced.</p>
                    )}
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
