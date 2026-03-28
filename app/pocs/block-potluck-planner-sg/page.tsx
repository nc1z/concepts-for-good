"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  courses,
  EVENT_DATE,
  EVENT_NAME,
  findDuplicates,
  initialDishes,
  initialDraft,
  STORAGE_KEY,
  type CourseKey,
  type Dish,
  type DraftDish,
} from "./data";
import styles from "./page.module.css";

function loadDishes(): Dish[] {
  if (typeof window === "undefined") return initialDishes;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDishes;
    const parsed = JSON.parse(raw) as Dish[];
    return Array.isArray(parsed) ? parsed : initialDishes;
  } catch {
    return initialDishes;
  }
}

function DietaryTag({ note }: { note: string }) {
  if (!note) return null;
  const cls = note.toLowerCase().includes("halal")
    ? styles.halal
    : note.toLowerCase().includes("vegan")
      ? styles.vegan
      : note.toLowerCase().includes("vegetarian")
        ? styles.vegetarian
        : "";
  return <span className={`${styles.dietaryTag} ${cls}`}>{note}</span>;
}

function DishTile({
  dish,
  isDuplicate,
  duplicateCount,
}: {
  dish: Dish;
  isDuplicate: boolean;
  duplicateCount: number;
}) {
  return (
    <motion.article
      className={`${styles.tile} ${isDuplicate ? styles.duplicate : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      layout
    >
      <DietaryTag note={dish.dietaryNote} />
      <p className={styles.tileDishName}>{dish.dishName}</p>
      <p className={styles.tileBroughtBy}>Brought by {dish.broughtBy}</p>
      {isDuplicate && duplicateCount > 1 && (
        <span className={styles.duplicateBadge}>×{duplicateCount} of this!</span>
      )}
    </motion.article>
  );
}

function AddDishForm({
  course,
  onBring,
  onCancel,
}: {
  course: (typeof courses)[number];
  onBring: (draft: DraftDish) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<DraftDish>(initialDraft);
  const dishRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dishRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.dishName.trim() || !draft.broughtBy.trim()) return;
    onBring(draft);
    setDraft(initialDraft);
  }

  return (
    <motion.form
      className={styles.addForm}
      style={{ "--course-colour": course.colour } as React.CSSProperties}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      <p className={styles.addFormTitle}>I&apos;m bringing&hellip;</p>

      <div className={styles.addFormField}>
        <label htmlFor={`dish-${course.key}`}>Dish name</label>
        <input
          id={`dish-${course.key}`}
          ref={dishRef}
          type="text"
          placeholder={`e.g. ${course.key === "mains" ? "Char kway teow" : course.key === "sides" ? "Popiah" : course.key === "drinks" ? "Longan drink" : "Kueh lapis"}`}
          value={draft.dishName}
          onChange={(e) => setDraft((d) => ({ ...d, dishName: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.form?.requestSubmit()}
        />
      </div>

      <div className={styles.addFormField}>
        <label htmlFor={`name-${course.key}`}>Your name</label>
        <input
          id={`name-${course.key}`}
          type="text"
          placeholder="e.g. Auntie May"
          value={draft.broughtBy}
          onChange={(e) => setDraft((d) => ({ ...d, broughtBy: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.form?.requestSubmit()}
        />
      </div>

      <div className={styles.addFormField}>
        <label htmlFor={`dietary-${course.key}`}>Dietary note (optional)</label>
        <select
          id={`dietary-${course.key}`}
          value={draft.dietaryNote}
          onChange={(e) => setDraft((d) => ({ ...d, dietaryNote: e.target.value }))}
        >
          <option value="">None</option>
          <option value="halal">Halal</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>

      <div className={styles.addFormActions}>
        <button type="submit" className={styles.bringBtn}>
          Bring this dish
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export default function BlockPotluckPlannerPage() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [mounted, setMounted] = useState(false);
  const [openForm, setOpenForm] = useState<CourseKey | null>(null);

  useEffect(() => {
    setDishes(loadDishes());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  }, [mounted, dishes]);

  const duplicates = findDuplicates(dishes);

  function isDuplicate(dish: Dish): boolean {
    const key = dish.dishName.toLowerCase().trim();
    return key in duplicates;
  }

  function duplicateCount(dish: Dish): number {
    const key = dish.dishName.toLowerCase().trim();
    return duplicates[key]?.length ?? 1;
  }

  function handleBring(course: CourseKey, draft: DraftDish) {
    const next: Dish = {
      id: crypto.randomUUID(),
      course,
      dishName: draft.dishName.trim(),
      broughtBy: draft.broughtBy.trim(),
      dietaryNote: draft.dietaryNote,
      addedAt: Date.now(),
    };
    setDishes((current) => [...current, next]);
    setOpenForm(null);
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
        </header>

        <div className={styles.eventBanner}>
          <p className={styles.eventLabel}>Block Potluck</p>
          <h1 className={styles.eventName}>{EVENT_NAME}</h1>
          <p className={styles.eventDate}>{EVENT_DATE}</p>
        </div>

        <p className={styles.headline}>What&apos;s everyone bringing?</p>

        <div className={styles.table}>
          {courses.map((course) => {
            const courseDishes = dishes
              .filter((d) => d.course === course.key)
              .sort((a, b) => a.addedAt - b.addedAt);

            const isOpen = openForm === course.key;

            return (
              <section
                key={course.key}
                className={styles.courseSection}
                style={{ "--course-colour": course.colour } as React.CSSProperties}
              >
                <div className={styles.courseHeader}>
                  <h2 className={styles.courseTitle}>{course.label}</h2>
                  {!isOpen && (
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() => setOpenForm(course.key)}
                      aria-label={`Add a dish to ${course.label}`}
                      title={`Bring a ${course.label.toLowerCase()} dish`}
                    >
                      +
                    </button>
                  )}
                </div>

                <div className={styles.courseSectionInner}>
                  <div className={styles.tiles}>
                    <AnimatePresence initial={false}>
                      {courseDishes.map((dish) => (
                        <DishTile
                          key={dish.id}
                          dish={dish}
                          isDuplicate={isDuplicate(dish)}
                          duplicateCount={duplicateCount(dish)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {courseDishes.length === 0 && !isOpen && (
                    <p className={styles.emptyState}>{course.emptyMessage}</p>
                  )}

                  <AnimatePresence>
                    {isOpen && (
                      <AddDishForm
                        course={course}
                        onBring={(draft) => handleBring(course.key, draft)}
                        onCancel={() => setOpenForm(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: "#f0b429", boxShadow: "0 0 0 2px rgba(240,180,41,0.3)" }}
            />
            <span>Duplicate dish — someone else is already bringing this!</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#5a8a3c" }} />
            <span>Vegetarian</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#276234" }} />
            <span>Halal</span>
          </div>
        </div>
      </div>
    </main>
  );
}
