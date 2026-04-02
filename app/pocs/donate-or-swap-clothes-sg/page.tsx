"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bebas_Neue, Newsreader, IBM_Plex_Mono } from "next/font/google";

import { clothingPosts, conditionFilters, sizeFilters, typeFilters, type ClothingPost } from "./data";
import styles from "./page.module.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const body = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

function conditionFill(post: ClothingPost) {
  if (post.condition === "Like new") {
    return 0.2;
  }
  if (post.condition === "Gently used") {
    return 0.46;
  }
  return 0.72;
}

export default function DonateOrSwapClothesPage() {
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("All");
  const [sizeFilter, setSizeFilter] = useState<(typeof sizeFilters)[number]>("All sizes");
  const [conditionFilter, setConditionFilter] = useState<(typeof conditionFilters)[number]>("All conditions");
  const [activePostId, setActivePostId] = useState(clothingPosts[0]?.id ?? "");

  const filteredPosts = useMemo(
    () =>
      clothingPosts.filter((post) => {
        const typeOk = typeFilter === "All" || post.type === typeFilter;
        const sizeOk = sizeFilter === "All sizes" || post.size === sizeFilter;
        const conditionOk = conditionFilter === "All conditions" || post.condition === conditionFilter;
        return typeOk && sizeOk && conditionOk;
      }),
    [conditionFilter, sizeFilter, typeFilter],
  );

  const activePost = useMemo(() => {
    return filteredPosts.find((post) => post.id === activePostId) ?? filteredPosts[0] ?? null;
  }, [activePostId, filteredPosts]);

  const hasPosts = filteredPosts.length > 0;

  return (
    <main className={`${styles.page} ${display.variable} ${body.variable} ${mono.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <p className={styles.liveTag}>Singapore swaps today</p>
      </header>

      <section className={styles.firstScreen}>
        <p className={styles.eyebrow}>Donate or swap clothes near you</p>
        <h1>Pass on what you don&apos;t wear and find what you still need.</h1>
        <button type="button" className={styles.primaryAction}>
          Browse posts near me
        </button>
      </section>

      <section className={styles.filtersWrap}>
        <div className={styles.filterStrip}>
          {typeFilters.map((option) => (
            <button
              key={option}
              type="button"
              className={typeFilter === option ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip}
              onClick={() => setTypeFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.filterStrip}>
          {sizeFilters.map((option) => (
            <button
              key={option}
              type="button"
              className={sizeFilter === option ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip}
              onClick={() => setSizeFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.filterStrip}>
          {conditionFilters.map((option) => (
            <button
              key={option}
              type="button"
              className={
                conditionFilter === option ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip
              }
              onClick={() => setConditionFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.feedSection}>
        <AnimatePresence mode="wait">
          {hasPosts ? (
            <motion.div
              key="feed"
              className={styles.feedList}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className={post.id === activePost?.id ? `${styles.feedItem} ${styles.feedItemActive}` : styles.feedItem}
                  onClick={() => setActivePostId(post.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.04 }}
                >
                  <div className={styles.feedMeta}>
                    <span>{post.type}</span>
                    <span>{post.neighbourhood}</span>
                    <span>{post.size}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.note}</p>
                  <div className={styles.feedFooter}>
                    <span>{post.pickupWindow}</span>
                    <span>
                      {post.hearts} hearts • {post.chats} chats
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No matches yet. Try another size or condition to see nearby posts.
            </motion.p>
          )}
        </AnimatePresence>

        {activePost ? (
          <aside className={styles.conditionBoard}>
            <p className={styles.boardLabel}>Condition sketch</p>
            <h3>{activePost.title}</h3>
            <p className={styles.boardNote}>{activePost.wants}</p>
            <div className={styles.figureWrap} aria-hidden="true">
              <svg viewBox="0 0 200 250" className={styles.figure}>
                <path d="M70 18h60l17 28 22 8-11 33h-18v132H60V87H42L31 54l22-8 17-28z" />
              </svg>
              <motion.div
                className={styles.fadeOverlay}
                initial={false}
                animate={{ height: `${conditionFill(activePost) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              {activePost.wearAreas.map((area) => (
                <span key={area} className={styles.wearTag}>
                  {area}
                </span>
              ))}
            </div>
            <p className={styles.pickupText}>{activePost.pickupWindow}</p>
            <button type="button" className={styles.chatAction}>
              Message this neighbour
            </button>
          </aside>
        ) : null}
      </section>
    </main>
  );
}
