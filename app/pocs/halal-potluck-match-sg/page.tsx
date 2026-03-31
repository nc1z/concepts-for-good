"use client";

import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { dishes, guestGroups, type Dish } from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"],
  display: "swap",
});

const STORAGE_KEY = "cfg-halal-potluck-match-sg-v1";

function dishFitsGroup(dish: Dish, groupId: string) {
  const group = guestGroups.find((entry) => entry.id === groupId);
  if (!group) return true;
  return group.needs.every((need) => dish[need]);
}

export default function HalalPotluckMatchPage() {
  const [activeGroupId, setActiveGroupId] = useState(guestGroups[0].id);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { activeGroupId: string; claimedIds: string[] };
      if (parsed.activeGroupId) setActiveGroupId(parsed.activeGroupId);
      if (Array.isArray(parsed.claimedIds)) setClaimedIds(parsed.claimedIds);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const activeGroup = guestGroups.find((group) => group.id === activeGroupId) ?? guestGroups[0];
  const compatibleCount = useMemo(
    () => dishes.filter((dish) => dishFitsGroup(dish, activeGroup.id)).length,
    [activeGroup.id],
  );

  const compatibilityScore = Math.round((compatibleCount / dishes.length) * 100);
  const flaggedDishes = dishes.filter((dish) => !dishFitsGroup(dish, activeGroup.id));

  function toggleClaim(id: string) {
    setClaimedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeGroupId, claimedIds: next }));
      }
      return next;
    });
  }

  function setGroup(id: string) {
    setActiveGroupId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ activeGroupId: id, claimedIds }));
    }
  }

  return (
    <main className={`${styles.page} ${fraunces.variable} ${manrope.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
      </header>

      <section className={styles.firstScreen}>
        <p className={styles.kicker}>Block potluck planner</p>
        <h1>Plan one shared meal where every neighbour can eat comfortably.</h1>
        <p className={styles.lede}>
          Start with a guest group, then tap dishes on the table to see who is covered and what still needs a swap.
        </p>
        <a href="#spread" className={styles.heroButton}>
          Check Friday dinner spread
        </a>
      </section>

      <section className={styles.stageWrap} id="spread">
        <div className={styles.selectorRail}>
          {guestGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`${styles.groupButton} ${group.id === activeGroupId ? styles.groupButtonActive : ""}`}
              onClick={() => setGroup(group.id)}
            >
              <span>{group.label}</span>
              <strong>{group.headcount} guests</strong>
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          <div className={styles.tableSurface}>
            <p className={styles.tableLabel}>Shared table</p>
          </div>

          <ul className={styles.dishOrbit}>
            {dishes.map((dish, index) => {
              const isCompatible = dishFitsGroup(dish, activeGroupId);
              const isClaimed = claimedIds.includes(dish.id);
              return (
                <motion.li
                  key={dish.id}
                  className={styles.dishItem}
                  style={{ left: `${dish.x}%`, top: `${dish.y}%` }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.22 }}
                >
                  <button
                    type="button"
                    className={`${styles.dishButton} ${isCompatible ? styles.compatible : styles.notCompatible}`}
                    onClick={() => toggleClaim(dish.id)}
                  >
                    <p className={styles.dishName}>{dish.name}</p>
                    <p className={styles.dishMeta}>{dish.spot}</p>
                    <p className={styles.dishMeta}>Bringing: {dish.bringer}</p>
                    <p className={styles.dishNote}>{dish.note}</p>
                    <p className={styles.dishStatus}>
                      {isCompatible ? "Fits this group" : "Needs a safer swap"}
                      {isClaimed ? " • Added to spread" : ""}
                    </p>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <aside className={styles.coveragePanel}>
          <p className={styles.panelEyebrow}>Coverage for {activeGroup.label}</p>
          <p className={styles.panelScore}>{compatibilityScore}% of dishes fit this group</p>
          <p className={styles.panelLine}>{activeGroup.guidance}</p>

          {flaggedDishes.length > 0 ? (
            <>
              <p className={styles.panelHeading}>Dishes to review</p>
              <ul className={styles.flagList}>
                {flaggedDishes.map((dish) => (
                  <li key={dish.id}>
                    <span>{dish.name}</span>
                    <strong>{dish.spot}</strong>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.clearLine}>Everyone in this group can eat from the current spread.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
