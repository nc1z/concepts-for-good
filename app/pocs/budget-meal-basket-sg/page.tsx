"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import styles from "./page.module.css";

type ScenarioKey = "stretch" | "balanced" | "prep";

type DraftState = {
  scenario: ScenarioKey;
  budget: string;
  people: string;
};

type MealDay = {
  day: string;
  meal: string;
  note: string;
  cost: number;
};

type BasketItem = {
  name: string;
  amount: string;
  price: number;
  note: string;
};

type ScenarioDefinition = {
  key: ScenarioKey;
  label: string;
  title: string;
  summary: string;
  angle: string;
  recommendedBudget: number;
  days: MealDay[];
  basket: BasketItem[];
  tip: string;
};

type SavedPlan = {
  id: string;
  title: string;
  summary: string;
  budget: string;
  people: string;
  scenario: string;
  createdAt: string;
};

const scenarioMap: Record<ScenarioKey, ScenarioDefinition> = {
  stretch: {
    key: "stretch",
    label: "Stretch the basket",
    title: "Tight week, steady meals",
    summary:
      "Lean on repeat ingredients, simple prep, and a few flexible swaps to keep costs down.",
    angle: "Best when every dollar needs to do more than one job.",
    recommendedBudget: 54,
    tip: "Swap one premium protein meal for tofu or eggs if you need more room.",
    days: [
      { day: "Mon", meal: "Egg toast with bananas", note: "Fast breakfast and a low-cost start to the week.", cost: 5.4 },
      { day: "Tue", meal: "Rice, tofu, and cai xin", note: "Built around one pan and one pot.", cost: 6.2 },
      { day: "Wed", meal: "Fried noodles with egg", note: "Uses leftovers before they lose momentum.", cost: 5.8 },
      { day: "Thu", meal: "Soup noodles with greens", note: "A lighter dinner with enough volume to carry the day.", cost: 6.1 },
      { day: "Fri", meal: "Canned tuna rice bowl", note: "Convenient protein without much prep.", cost: 5.7 },
      { day: "Sat", meal: "Tomato egg rice", note: "Familiar, filling, and easy to batch.", cost: 5.5 },
      { day: "Sun", meal: "Porridge with sesame toast", note: "Comfort food that closes the week gently.", cost: 4.9 },
    ],
    basket: [
      { name: "Eggs", amount: "12", price: 3.6, note: "Breakfasts, fried rice, and soup topping." },
      { name: "Rice", amount: "2 kg", price: 4.9, note: "Base for bowls and porridge." },
      { name: "Tofu", amount: "3 blocks", price: 2.7, note: "Flexible protein for quick dinners." },
      { name: "Cai xin", amount: "2 bunches", price: 3.2, note: "Green veg with low waste." },
      { name: "Noodles", amount: "3 packs", price: 2.6, note: "Quick lunch or dinner fallback." },
      { name: "Bananas", amount: "1 bunch", price: 2.3, note: "Easy fruit for snacks and breakfast." },
    ],
  },
  balanced: {
    key: "balanced",
    label: "Balanced week",
    title: "Comfortable and practical",
    summary:
      "A more even basket with a mix of fresh produce, protein, and easy meals across the week.",
    angle: "Best when the plan should feel normal, not stripped back.",
    recommendedBudget: 72,
    tip: "Keep one freezer-friendly meal in reserve for a busy evening.",
    days: [
      { day: "Mon", meal: "Oats with fruit and boiled eggs", note: "A simple start with enough energy for the morning.", cost: 6.4 },
      { day: "Tue", meal: "Chicken rice bowl with cucumber", note: "Familiar and easy to portion for more than one person.", cost: 8.8 },
      { day: "Wed", meal: "Tofu stir-fry with rice", note: "Fresh veg and a quick pan meal.", cost: 7.5 },
      { day: "Thu", meal: "Pasta with tomato and tuna", note: "A pantry-friendly evening option.", cost: 7.9 },
      { day: "Fri", meal: "Soup with greens and mushrooms", note: "Calm, light, and easy to prep ahead.", cost: 7.2 },
      { day: "Sat", meal: "Egg fried rice", note: "Uses up the week’s leftovers well.", cost: 6.9 },
      { day: "Sun", meal: "Noodle soup with fruit", note: "A low-effort finish with room for extras.", cost: 6.2 },
    ],
    basket: [
      { name: "Chicken thigh", amount: "1.2 kg", price: 8.9, note: "Lunch or dinner protein across the week." },
      { name: "Eggs", amount: "12", price: 3.6, note: "Breakfast, dinner, and leftovers." },
      { name: "Rice", amount: "2 kg", price: 4.9, note: "Easy base for bowls and fried rice." },
      { name: "Mixed greens", amount: "3 packs", price: 5.4, note: "Fresh veg with straightforward prep." },
      { name: "Pasta", amount: "2 packs", price: 4.1, note: "A quick pantry meal when time is tight." },
      { name: "Fruit mix", amount: "4 pieces", price: 5.2, note: "Keeps breakfasts and snacks simple." },
    ],
  },
  prep: {
    key: "prep",
    label: "Prep ahead",
    title: "One cook, several meals",
    summary:
      "Batch-cook friendly basket with ingredients that can be reused in different ways through the week.",
    angle: "Best when the kitchen time is limited but planning is strong.",
    recommendedBudget: 68,
    tip: "Cook once, then split the result across bowls, wraps, and soup.",
    days: [
      { day: "Mon", meal: "Overnight oats with fruit", note: "A no-cook breakfast with a smooth start.", cost: 5.8 },
      { day: "Tue", meal: "Batch rice bowl with chicken", note: "Cook extra once and reuse it later in the week.", cost: 8.5 },
      { day: "Wed", meal: "Tofu and greens stir-fry", note: "Built to be reheated without losing texture.", cost: 7.1 },
      { day: "Thu", meal: "Chicken noodle soup", note: "Uses the same base ingredients in a different form.", cost: 7.7 },
      { day: "Fri", meal: "Wraps with egg and salad", note: "Quick assembly from prepped parts.", cost: 6.8 },
      { day: "Sat", meal: "Fried rice with veg", note: "A good way to clear the fridge.", cost: 6.6 },
      { day: "Sun", meal: "Simple porridge bowl", note: "Soft landing before the next grocery run.", cost: 5.5 },
    ],
    basket: [
      { name: "Chicken thigh", amount: "1 kg", price: 8.1, note: "Batch cook, then reuse in different dishes." },
      { name: "Eggs", amount: "10", price: 3.2, note: "Quick protein across multiple meals." },
      { name: "Rice", amount: "2 kg", price: 4.9, note: "Keeps the plan grounded." },
      { name: "Wraps", amount: "1 pack", price: 3.8, note: "Useful for lunches and quick dinners." },
      { name: "Greens", amount: "3 packs", price: 5.1, note: "Freshness for bowls and soups." },
      { name: "Oats", amount: "1 bag", price: 4.2, note: "Simple breakfasts with little effort." },
    ],
  },
};

const seededPrices = [
  { name: "Eggs (12)", price: 3.6, note: "Supermarket blend" },
  { name: "Rice (2 kg)", price: 4.9, note: "Staple base" },
  { name: "Tofu (3 blocks)", price: 2.7, note: "Wet market buy" },
  { name: "Chicken thigh (1 kg)", price: 8.9, note: "Common fresh protein" },
  { name: "Cai xin (2 bunches)", price: 3.2, note: "Seasonal greens" },
  { name: "Fruit mix", price: 5.2, note: "Bananas, apples, pears" },
];

const storageKey = "budget-meal-basket-sg-saves";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 2,
  }).format(value);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function buildPlan(draft: DraftState) {
  const scenario = scenarioMap[draft.scenario];
  const people = Number(draft.people);
  const budget = Number(draft.budget);
  const scale = people <= 1 ? 0.82 : people <= 2 ? 1 : people <= 4 ? 1.42 : 1.78;
  const basket = scenario.basket.map((item) => ({
    ...item,
    price: round(item.price * scale),
  }));
  const total = round(basket.reduce((sum, item) => sum + item.price, 0));
  const difference = round(budget - total);

  return {
    scenario,
    people,
    budget,
    scale,
    basket,
    total,
    difference,
    days: scenario.days.map((day) => ({
      ...day,
      cost: round(day.cost * scale),
    })),
  };
}

function buildShareText(plan: ReturnType<typeof buildPlan>) {
  const lines = [
    `Budget Meal Basket SG`,
    `${plan.scenario.title} for ${plan.people} people`,
    `Budget: ${formatMoney(plan.budget)} | Estimated basket: ${formatMoney(plan.total)}`,
    `Weekly plan:`,
    ...plan.days.map((day) => `${day.day}: ${day.meal}`),
    `Basket:`,
    ...plan.basket.map((item) => `${item.name} ${item.amount}`),
  ];

  return lines.join("\n");
}

export default function BudgetMealBasketPage() {
  const [draft, setDraft] = useState<DraftState>({
    scenario: "balanced",
    budget: "72",
    people: "4",
  });
  const [applied, setApplied] = useState<DraftState>(draft);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy summary");

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedPlan[];
        setSavedPlans(parsed);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(savedPlans));
  }, [hydrated, savedPlans]);

  const plan = buildPlan(applied);
  const shareText = buildShareText(plan);
  const budgetLabel =
    plan.difference >= 0
      ? `${formatMoney(plan.difference)} left after this basket.`
      : `${formatMoney(Math.abs(plan.difference))} over budget.`;

  function updateScenario(nextScenario: ScenarioKey) {
    setDraft((current) => ({ ...current, scenario: nextScenario }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplied(draft);
  }

  async function handleCopySummary() {
    await navigator.clipboard.writeText(shareText);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy summary"), 1800);
  }

  function handleSavePlan() {
    const entry: SavedPlan = {
      id: crypto.randomUUID(),
      title: `${plan.scenario.label} for ${plan.people} people`,
      summary: shareText,
      budget: formatMoney(plan.budget),
      people: String(plan.people),
      scenario: plan.scenario.label,
      createdAt: new Date().toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setSavedPlans((current) => [entry, ...current].slice(0, 4));
  }

  function removeSavedPlan(id: string) {
    setSavedPlans((current) => current.filter((planItem) => planItem.id !== id));
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            Back to gallery
          </Link>
          <span className={styles.topbarLabel}>Browser-only demo</span>
        </div>

        <section className={styles.hero}>
          <p className={styles.kicker}>Food Security</p>
          <h1>Budget Meal Basket SG</h1>
          <p className={styles.lede}>
            Build a weekly basket from seeded Singapore prices, then shape it
            around the budget and household size you choose.
          </p>
          <div className={styles.heroMeta}>
            <span>Local data only</span>
            <span>No auth</span>
            <span>Save and share in browser</span>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <form className={styles.panel} onSubmit={handleSubmit}>
            <div className={styles.panelHeader}>
              <p className={styles.panelLabel}>Guided input</p>
              <h2>Shape the basket</h2>
              <p>
                Pick a planning style, set the weekly budget, and choose how
                many people the basket should cover.
              </p>
            </div>

            <div className={styles.switcher}>
              {Object.values(scenarioMap).map((scenario) => (
                <button
                  key={scenario.key}
                  type="button"
                  className={
                    draft.scenario === scenario.key
                      ? `${styles.switcherButton} ${styles.switcherButtonActive}`
                      : styles.switcherButton
                  }
                  onClick={() => updateScenario(scenario.key)}
                >
                  <strong>{scenario.label}</strong>
                  <span>{scenario.angle}</span>
                </button>
              ))}
            </div>

            <label className={styles.field}>
              <span>Weekly budget</span>
              <input
                type="number"
                min="30"
                step="1"
                value={draft.budget}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, budget: event.target.value }))
                }
              />
            </label>

            <label className={styles.field}>
              <span>People in the household</span>
              <select
                value={draft.people}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, people: event.target.value }))
                }
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="4">4 people</option>
                <option value="5">5+ people</option>
              </select>
            </label>

            <button type="submit" className={styles.primaryButton}>
              Update basket
            </button>

            <div className={styles.helperCard}>
              <p className={styles.helperLabel}>Scenario note</p>
              <p>{plan.scenario.tip}</p>
              <p>Recommended weekly budget: {formatMoney(plan.scenario.recommendedBudget)}</p>
            </div>
          </form>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelLabel}>Weekly output</p>
              <h2>Generated meal basket</h2>
              <p>{plan.scenario.summary}</p>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.summaryCard}>
                <span>Estimated basket</span>
                <strong>{formatMoney(plan.total)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span>Budget check</span>
                <strong>{budgetLabel}</strong>
              </div>
            </div>

            <div className={styles.dayGrid}>
              {plan.days.map((day) => (
                <article key={day.day} className={styles.dayCard}>
                  <p>{day.day}</p>
                  <h3>{day.meal}</h3>
                  <span>{day.note}</span>
                  <strong>{formatMoney(day.cost)}</strong>
                </article>
              ))}
            </div>

            <div className={styles.sharePanel}>
              <div className={styles.shareHeader}>
                <div>
                  <p className={styles.panelLabel}>Share-ready summary</p>
                  <h3>{plan.scenario.label}</h3>
                </div>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleCopySummary}
                >
                  {copyLabel}
                </button>
              </div>
              <textarea readOnly value={shareText} className={styles.summaryBox} />
              <div className={styles.shareActions}>
                <button type="button" className={styles.secondaryButton} onClick={handleSavePlan}>
                  Save basket
                </button>
                <span>{plan.scenario.tip}</span>
              </div>
            </div>
          </section>
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelLabel}>Basket contents</p>
              <h2>What goes into the cart</h2>
              <p>
                The basket is composed from seeded ingredients and local pricing
                estimates for a Singapore context.
              </p>
            </div>
            <div className={styles.basketList}>
              {plan.basket.map((item) => (
                <div key={item.name} className={styles.basketRow}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.amount}</span>
                  </div>
                  <div>
                    <strong>{formatMoney(item.price)}</strong>
                    <span>{item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelLabel}>Saved baskets</p>
              <h2>Keep a few versions</h2>
              <p>
                Saved baskets stay in this browser so the demo can be replayed
                without any backend.
              </p>
            </div>
            <div className={styles.savedList}>
              {savedPlans.length === 0 ? (
                <p className={styles.emptyState}>
                  Nothing saved yet. Generate a basket and store it here.
                </p>
              ) : (
                savedPlans.map((item) => (
                  <article key={item.id} className={styles.savedCard}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.budget} | {item.people}
                      </span>
                    </div>
                    <p>{item.createdAt}</p>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => removeSavedPlan(item.id)}
                    >
                      Remove
                    </button>
                  </article>
                ))
              )}
            </div>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelLabel}>Seeded pricing</p>
            <h2>Local ingredient data used by the demo</h2>
            <p>
              These are fixed demo numbers so the plan stays predictable and
              fully browser-only.
            </p>
          </div>
          <div className={styles.priceGrid}>
            {seededPrices.map((item) => (
              <article key={item.name} className={styles.priceCard}>
                <span>{item.note}</span>
                <strong>{item.name}</strong>
                <p>{formatMoney(item.price)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
