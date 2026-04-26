"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import { groceryItems, type GroceryItem } from "./data";

function useAnimatedValue(target: number, duration = 500) {
  const [displayed, setDisplayed] = useState(target);
  const startRef = useRef(target);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const from = startRef.current;
    const to = target;
    if (Math.abs(from - to) < 0.001) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(from + (to - from) * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = to;
      }
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return displayed;
}

const CATEGORY_COLORS: Record<string, string> = {
  Carbs: "#7B6D52",
  Protein: "#5C4A3A",
  Vegetables: "#3A5C42",
  Pantry: "#4A4A6A",
};

export default function LowerYourGroceryBill() {
  const [picks, setPicks] = useState<Record<string, 0 | 1>>(() =>
    Object.fromEntries(groceryItems.map((item) => [item.id, item.defaultPick]))
  );
  const [justSwapped, setJustSwapped] = useState<string | null>(null);

  const total = groceryItems.reduce(
    (sum, item) => sum + item.options[picks[item.id]].price,
    0
  );

  const maxTotal = groceryItems.reduce(
    (sum, item) => sum + item.options[1].price,
    0
  );

  const saved = maxTotal - total;
  const swapsUsed = groceryItems.filter((item) => picks[item.id] === 0).length;

  const animatedTotal = useAnimatedValue(total);
  const animatedSaved = useAnimatedValue(saved);

  const handleSwap = useCallback(
    (item: GroceryItem) => {
      setPicks((prev) => ({
        ...prev,
        [item.id]: prev[item.id] === 0 ? 1 : 0,
      }));
      setJustSwapped(item.id);
      setTimeout(() => setJustSwapped(null), 700);
    },
    []
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Cost of living</span>
        <h1 className={styles.title}>Lower Your<br />Grocery Bill</h1>
        <p className={styles.subtitle}>
          See where a simple swap cuts your weekly total.
        </p>
      </header>

      <main className={styles.ledgerWrap}>
        <div className={styles.ledgerHeading}>
          <span className={styles.ledgerLabel}>This week&apos;s basket</span>
          <span className={styles.ledgerCount}>{groceryItems.length} items</span>
        </div>

        <ul className={styles.ledger} role="list">
          {groceryItems.map((item) => {
            const pick = picks[item.id];
            const current = item.options[pick];
            const alt = item.options[pick === 0 ? 1 : 0];
            const canSave = pick === 1;
            const savings = item.options[1].price - item.options[0].price;
            const isSwapped = justSwapped === item.id;

            return (
              <motion.li
                key={item.id}
                className={styles.item}
                animate={
                  isSwapped
                    ? { backgroundColor: canSave ? "#E8F5EE" : "#F5E8C8" }
                    : { backgroundColor: "#F5E8C8" }
                }
                transition={{ duration: 0.6 }}
              >
                <div className={styles.itemLeft}>
                  <span
                    className={styles.category}
                    style={{ color: CATEGORY_COLORS[item.category] }}
                  >
                    {item.category}
                  </span>
                  <div className={styles.itemMeta}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={current.brand}
                        className={styles.itemName}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                        <span className={styles.itemBrand}>
                          &nbsp;·&nbsp;{current.brand}
                        </span>
                      </motion.span>
                    </AnimatePresence>
                    <span className={styles.itemWeight}>{item.weight}</span>
                  </div>
                </div>

                <div className={styles.itemRight}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.price}
                      className={styles.itemPrice}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.18 }}
                    >
                      ${current.price.toFixed(2)}
                    </motion.span>
                  </AnimatePresence>

                  <button
                    className={`${styles.swapBtn} ${canSave ? styles.swapBtnSave : styles.swapBtnUndo}`}
                    onClick={() => handleSwap(item)}
                    aria-label={
                      canSave
                        ? `Swap to ${alt.brand} and save $${savings.toFixed(2)}`
                        : `Switch back to ${alt.brand}`
                    }
                  >
                    {canSave ? (
                      <>
                        <span className={styles.swapArrow}>↕</span>
                        <span>Save ${savings.toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.swapArrow}>✓</span>
                        <span>Saved ${savings.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </main>

      <div className={styles.receipt}>
        <div className={styles.receiptInner}>
          <div className={styles.receiptLeft}>
            {swapsUsed > 0 ? (
              <motion.p
                key={swapsUsed}
                className={styles.receiptSaved}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                You&apos;ve saved{" "}
                <span className={styles.savedAmount}>
                  ${animatedSaved.toFixed(2)}
                </span>{" "}
                across {swapsUsed} swap{swapsUsed !== 1 ? "s" : ""}
              </motion.p>
            ) : (
              <p className={styles.receiptHint}>
                Tap a swap to see your total drop
              </p>
            )}
            <p className={styles.receiptItemCount}>
              {groceryItems.length} items this week
            </p>
          </div>
          <div className={styles.receiptRight}>
            <span className={styles.receiptLabel}>Total</span>
            <span className={styles.receiptTotal}>
              ${animatedTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
