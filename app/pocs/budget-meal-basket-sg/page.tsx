"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import styles from "./page.module.css";

type ScenarioKey = "stretch" | "balanced" | "prep";

type FormValues = {
  scenario: ScenarioKey;
  budget: number;
  people: number;
  pantry: "low" | "medium" | "full";
  time: "tight" | "steady" | "batch";
};

type MealDay = {
  day: string;
  meal: string;
  cost: number;
  note: string;
};

type BasketItem = {
  name: string;
  amount: string;
  price: number;
};

type Scenario = {
  title: string;
  summary: string;
  tip: string;
  days: MealDay[];
  basket: BasketItem[];
};

type SavedPlan = {
  id: string;
  label: string;
  summary: string;
  timestamp: string;
};

const STORAGE_KEY = "cfg-budget-meal-basket-v2";

const defaultFormValues: FormValues = {
  scenario: "balanced",
  budget: 72,
  people: 4,
  pantry: "medium",
  time: "steady",
};

const scenarioMap: Record<ScenarioKey, Scenario> = {
  stretch: {
    title: "Stretch the basket",
    summary: "Repeat flexible ingredients and keep prep simple through the week.",
    tip: "Eggs, tofu, greens, and rice go further when two dinners share the same base.",
    days: [
      { day: "Mon", meal: "Egg toast and bananas", cost: 5.2, note: "A low-cost start." },
      { day: "Tue", meal: "Tofu rice bowl", cost: 6.1, note: "One-pan dinner." },
      { day: "Wed", meal: "Fried noodles with egg", cost: 5.6, note: "Leans on leftovers." },
      { day: "Thu", meal: "Soup noodles with greens", cost: 6, note: "Lighter and filling." },
      { day: "Fri", meal: "Tuna rice bowl", cost: 5.8, note: "Convenient protein." },
      { day: "Sat", meal: "Tomato egg rice", cost: 5.4, note: "Fast batch meal." },
      { day: "Sun", meal: "Porridge and toast", cost: 4.8, note: "Gentle close to the week." },
    ],
    basket: [
      { name: "Eggs", amount: "12", price: 3.6 },
      { name: "Rice", amount: "2 kg", price: 4.9 },
      { name: "Tofu", amount: "3 blocks", price: 2.7 },
      { name: "Cai xin", amount: "2 bunches", price: 3.2 },
      { name: "Noodles", amount: "3 packs", price: 2.6 },
      { name: "Bananas", amount: "1 bunch", price: 2.3 },
    ],
  },
  balanced: {
    title: "Balanced week",
    summary: "A steadier basket with a mix of produce, protein, and quick fallback meals.",
    tip: "Keep one freezer-friendly meal in reserve for a tight evening.",
    days: [
      { day: "Mon", meal: "Oats, fruit, and boiled eggs", cost: 6.2, note: "Simple energy." },
      { day: "Tue", meal: "Chicken rice bowl", cost: 8.4, note: "Easy to portion." },
      { day: "Wed", meal: "Tofu stir-fry with rice", cost: 7.4, note: "Fresh and quick." },
      { day: "Thu", meal: "Pasta with tomato and tuna", cost: 7.7, note: "Pantry-friendly." },
      { day: "Fri", meal: "Soup with greens and mushrooms", cost: 7, note: "Light prep." },
      { day: "Sat", meal: "Egg fried rice", cost: 6.6, note: "Leftover-friendly." },
      { day: "Sun", meal: "Noodle soup and fruit", cost: 6.1, note: "Easy finish." },
    ],
    basket: [
      { name: "Chicken thigh", amount: "1.2 kg", price: 8.9 },
      { name: "Eggs", amount: "12", price: 3.6 },
      { name: "Rice", amount: "2 kg", price: 4.9 },
      { name: "Mixed greens", amount: "3 packs", price: 5.4 },
      { name: "Pasta", amount: "2 packs", price: 4.1 },
      { name: "Fruit mix", amount: "4 pieces", price: 5.2 },
    ],
  },
  prep: {
    title: "Prep ahead",
    summary: "Cook once, then carry the same ingredients across several easy meals.",
    tip: "Batch proteins early, then split into bowls, wraps, and soup later in the week.",
    days: [
      { day: "Mon", meal: "Overnight oats with fruit", cost: 5.7, note: "No-cook start." },
      { day: "Tue", meal: "Batch rice bowl with chicken", cost: 8.1, note: "Cook extra once." },
      { day: "Wed", meal: "Tofu and greens stir-fry", cost: 7, note: "Reheats well." },
      { day: "Thu", meal: "Chicken noodle soup", cost: 7.4, note: "Reuse the same base." },
      { day: "Fri", meal: "Wraps with egg and salad", cost: 6.5, note: "Fast assembly." },
      { day: "Sat", meal: "Fried rice with veg", cost: 6.4, note: "Clear the fridge." },
      { day: "Sun", meal: "Simple porridge bowl", cost: 5.2, note: "Low effort end." },
    ],
    basket: [
      { name: "Chicken thigh", amount: "1 kg", price: 8.1 },
      { name: "Eggs", amount: "10", price: 3.2 },
      { name: "Rice", amount: "2 kg", price: 4.9 },
      { name: "Wraps", amount: "1 pack", price: 3.8 },
      { name: "Greens", amount: "3 packs", price: 5.1 },
      { name: "Oats", amount: "1 bag", price: 4.2 },
    ],
  },
};

function money(value: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 2,
  }).format(value);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function getScale(values: FormValues) {
  const peopleScale = values.people <= 1 ? 0.84 : values.people <= 2 ? 1 : values.people <= 4 ? 1.42 : 1.8;
  const pantryScale = values.pantry === "full" ? 0.86 : values.pantry === "medium" ? 0.95 : 1;
  const timeScale = values.time === "tight" ? 1.06 : values.time === "batch" ? 0.94 : 1;

  return round(peopleScale * pantryScale * timeScale);
}

function buildPlan(values: FormValues) {
  const scenario = scenarioMap[values.scenario];
  const scale = getScale(values);
  const basket = scenario.basket.map((item) => ({
    ...item,
    price: round(item.price * scale),
  }));
  const days = scenario.days.map((day) => ({
    ...day,
    cost: round(day.cost * scale),
  }));
  const total = round(basket.reduce((sum, item) => sum + item.price, 0));
  const difference = round(values.budget - total);

  return {
    scenario,
    basket,
    days,
    total,
    difference,
  };
}

function buildSummary(values: FormValues, total: number) {
  return `${scenarioMap[values.scenario].title} for ${values.people} people. Basket ${money(total)} from a ${money(values.budget)} budget. Pantry ${values.pantry}, time ${values.time}.`;
}

export default function BudgetMealBasketPage() {
  const { control, handleSubmit, register, reset } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });
  const watched = useWatch({ control, defaultValue: defaultFormValues });
  const watchedValues = useMemo<FormValues>(
    () => ({ ...defaultFormValues, ...watched }),
    [watched],
  );
  const [applied, setApplied] = useState<FormValues>(defaultFormValues);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [copyLabel, setCopyLabel] = useState("Copy summary");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        setSavedPlans(JSON.parse(raw) as SavedPlan[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
  }, [savedPlans]);

  const previewPlan = useMemo(() => buildPlan(watchedValues), [watchedValues]);
  const appliedPlan = useMemo(() => buildPlan(applied), [applied]);
  const summary = buildSummary(applied, appliedPlan.total);

  async function copySummary() {
    await navigator.clipboard.writeText(summary);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy summary"), 1600);
  }

  function savePlan() {
    setSavedPlans((current) => [
      {
        id: crypto.randomUUID(),
        label: `${scenarioMap[applied.scenario].title} · ${applied.people} people`,
        summary,
        timestamp: "Saved just now",
      },
      ...current,
    ]);
  }

  function resetPlanner() {
    reset(defaultFormValues);
    setApplied(defaultFormValues);
    setSavedPlans([]);
    setCopyLabel("Copy summary");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topline}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <button type="button" className={styles.resetLink} onClick={resetPlanner}>
          Reset planner
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Budget Meal Basket SG</p>
          <h1>Shape a cheaper week before you even shop.</h1>
        </div>
        <p className={styles.lede}>
          A guided planner for household size, pantry strength, and time pressure,
          with a live weekly basket and day-by-day cost curve.
        </p>
      </section>

      <section className={styles.layout}>
        <form className={styles.planner} onSubmit={handleSubmit((values) => setApplied(values))}>
          <div className={styles.band}>
            <p>Scenario</p>
            <div className={styles.scenarioRow}>
              {(
                [
                  ["stretch", "Stretch the basket"],
                  ["balanced", "Balanced week"],
                  ["prep", "Prep ahead"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={styles.scenarioOption}>
                  <input type="radio" value={value} {...register("scenario")} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.sliderBand}>
            <label className={styles.sliderRow}>
              <span>Weekly budget</span>
            <strong>{money(watchedValues.budget)}</strong>
              <input type="range" min="36" max="160" step="2" {...register("budget", { valueAsNumber: true })} />
            </label>

            <label className={styles.sliderRow}>
              <span>People to feed</span>
            <strong>{watchedValues.people}</strong>
              <input type="range" min="1" max="6" step="1" {...register("people", { valueAsNumber: true })} />
            </label>
          </div>

          <div className={styles.bandGrid}>
            <fieldset className={styles.optionGroup}>
              <legend>Pantry starting point</legend>
              <label><input type="radio" value="low" {...register("pantry")} /> Low</label>
              <label><input type="radio" value="medium" {...register("pantry")} /> Medium</label>
              <label><input type="radio" value="full" {...register("pantry")} /> Full</label>
            </fieldset>

            <fieldset className={styles.optionGroup}>
              <legend>Kitchen time</legend>
              <label><input type="radio" value="tight" {...register("time")} /> Tight</label>
              <label><input type="radio" value="steady" {...register("time")} /> Steady</label>
              <label><input type="radio" value="batch" {...register("time")} /> Batch</label>
            </fieldset>
          </div>

          <div className={styles.previewStrip}>
            <span>{scenarioMap[watchedValues.scenario].summary}</span>
            <strong>{money(previewPlan.total)} estimated basket</strong>
          </div>

          <button type="submit" className={styles.primaryAction}>
            Generate weekly basket
          </button>
        </form>

        <section className={styles.output}>
          <div className={styles.outputHeader}>
            <div>
              <p>Current plan</p>
              <h2>{appliedPlan.scenario.title}</h2>
            </div>
            <strong className={styles.total}>{money(appliedPlan.total)}</strong>
          </div>

          <p className={styles.outputSummary}>{summary}</p>

          <div className={styles.receipt}>
            {appliedPlan.basket.map((item) => (
              <div key={item.name} className={styles.receiptRow}>
                <span>
                  {item.name} <small>{item.amount}</small>
                </span>
                <strong>{money(item.price)}</strong>
              </div>
            ))}
          </div>

          <div className={styles.chartBlock}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={appliedPlan.days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(41,44,34,0.12)" />
                <XAxis dataKey="day" stroke="#5f6455" />
                <YAxis stroke="#5f6455" />
                <Tooltip formatter={(value) => money(Number(value ?? 0))} />
                <Bar dataKey="cost" fill="#2a2f22" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.dayList}>
            {appliedPlan.days.map((day) => (
              <motion.div key={day.day} layout className={styles.dayRow}>
                <strong>{day.day}</strong>
                <div>
                  <span>{day.meal}</span>
                  <small>{day.note}</small>
                </div>
                <em>{money(day.cost)}</em>
              </motion.div>
            ))}
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.secondaryAction} onClick={copySummary}>
              {copyLabel}
            </button>
            <button type="button" className={styles.secondaryAction} onClick={savePlan}>
              Save plan
            </button>
          </div>

          <div className={styles.balanceLine}>
            {appliedPlan.difference >= 0
              ? `${money(appliedPlan.difference)} left in budget.`
              : `${money(Math.abs(appliedPlan.difference))} over budget.`}
          </div>
        </section>
      </section>

      <section className={styles.savedStrip}>
        <div>
          <p>Saved plans</p>
          <h2>Keep a few options on hand</h2>
        </div>
        <div className={styles.savedRail}>
          {savedPlans.length ? (
            savedPlans.map((plan) => (
              <div key={plan.id} className={styles.savedItem}>
                <strong>{plan.label}</strong>
                <span>{plan.summary}</span>
                <small>{plan.timestamp}</small>
              </div>
            ))
          ) : (
            <div className={styles.savedEmpty}>No saved plans yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
