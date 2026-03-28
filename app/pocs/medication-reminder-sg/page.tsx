"use client";

import Image from "next/image";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  COLOUR_MAP,
  DEFAULT_TAKEN,
  type Medication,
  medications,
  STORAGE_KEY,
} from "./data";
import styles from "./page.module.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-med-rem" });

// ─── Clock geometry helpers ──────────────────────────────────────────────────

const CX = 250;
const CY = 250;
const R_OUTER = 220;
const R_INNER = 150;
const R_HAND = 200;
const R_HOUR_TICK_OUTER = 228;
const R_HOUR_TICK_INNER = 210;
const R_LABEL = 240;

/** Map a 24-hour time to a clock angle (0° at top = midnight, clockwise). */
function timeToAngle(hour: number, minute: number): number {
  return ((hour + minute / 60) / 24) * 360;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
): string {
  // Clamp arc to a minimum angular size so 12:00 meds (same time) get a wider arc
  const sweep = endAngle - startAngle;
  const MIN_SWEEP = 14; // degrees
  const halfExtra = sweep < MIN_SWEEP ? (MIN_SWEEP - sweep) / 2 : 0;
  const a0 = startAngle - halfExtra;
  const a1 = endAngle + halfExtra;

  const outerStart = polarToCartesian(cx, cy, rOuter, a0);
  const outerEnd = polarToCartesian(cx, cy, rOuter, a1);
  const innerStart = polarToCartesian(cx, cy, rInner, a0);
  const innerEnd = polarToCartesian(cx, cy, rInner, a1);
  const largeArc = a1 - a0 > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function checkmarkOnArc(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  return polarToCartesian(cx, cy, radius, angleDeg);
}

// ─── Format helpers ──────────────────────────────────────────────────────────

function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? "am" : "pm";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const m = String(minute).padStart(2, "0");
  return `${h}:${m} ${period}`;
}

function formatCurrentTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-SG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ─── Arc component ───────────────────────────────────────────────────────────

type ArcProps = {
  med: Medication;
  taken: boolean;
  selected: boolean;
  onClick: () => void;
  rOuter: number;
  rInner: number;
};

function MedArc({ med, taken, selected, onClick, rOuter, rInner }: ArcProps) {
  const colours = COLOUR_MAP[med.colour];
  const midAngle = timeToAngle(med.hour, med.minute);
  const startAngle = midAngle - 6.5;
  const endAngle = midAngle + 6.5;
  const fill = taken ? colours.arcTaken : colours.arc;
  const path = arcPath(CX, CY, rOuter, rInner, startAngle, endAngle);

  // Checkmark position on the arc midline
  const checkR = (rOuter + rInner) / 2;
  const checkPos = checkmarkOnArc(CX, CY, checkR, midAngle);

  return (
    <g
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      aria-label={`${med.name} ${med.dosage} at ${formatTime(med.hour, med.minute)}${taken ? " — taken" : ""}`}
    >
      <path
        d={path}
        fill={fill}
        opacity={taken ? 0.7 : 1}
        stroke={selected ? colours.arc : "transparent"}
        strokeWidth={selected ? 2.5 : 0}
        style={{ transition: "fill 400ms ease, opacity 400ms ease" }}
      />
      {taken && (
        <text
          x={checkPos.x}
          y={checkPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fill="#fff"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          ✓
        </text>
      )}
      {/* Invisible wider hit zone */}
      <path d={arcPath(CX, CY, rOuter + 8, rInner - 8, startAngle - 4, endAngle + 4)} fill="transparent" />
    </g>
  );
}

// ─── Clock hand ──────────────────────────────────────────────────────────────

function ClockHand({ angle }: { angle: number }) {
  const tip = polarToCartesian(CX, CY, R_HAND, angle);
  const short = polarToCartesian(CX, CY, -24, angle);
  return (
    <line
      x1={short.x}
      y1={short.y}
      x2={tip.x}
      y2={tip.y}
      stroke="#2c3038"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.65"
      style={{ transition: "all 1s linear" }}
    />
  );
}

// ─── Taken-at state ──────────────────────────────────────────────────────────

type TakenRecord = Record<string, string>; // id → "HH:MM"

function loadTakenState(): TakenRecord {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TakenRecord;
  } catch {
    /* ignore */
  }
  // Seed default taken state (mid-afternoon)
  const defaults: TakenRecord = {};
  for (const id of DEFAULT_TAKEN) {
    const med = medications.find((m) => m.id === id);
    if (med) {
      defaults[id] = formatTime(med.hour, med.minute);
    }
  }
  return defaults;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function MedicationReminderPage() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [taken, setTaken] = useState<TakenRecord>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasMounted = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadTakenState();
    setTaken(loaded);
    hasMounted.current = true;
  }, []);

  // Persist taken state
  useEffect(() => {
    if (!hasMounted.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taken));
  }, [taken]);

  // Real-time clock — updates every 30 seconds
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const handAngle = timeToAngle(now.getHours(), now.getMinutes());
  const takenCount = Object.keys(taken).length;
  const totalCount = medications.length;
  const selectedMed = selectedId ? medications.find((m) => m.id === selectedId) ?? null : null;

  function handleMark() {
    if (!selectedId) return;
    const med = medications.find((m) => m.id === selectedId);
    if (!med) return;
    const timeStr = formatCurrentTime(now);
    setTaken((prev) => ({ ...prev, [selectedId]: timeStr }));
  }

  // Arc radii — stagger meds at same time slot slightly outward
  const arcRadii: Record<string, { outer: number; inner: number }> = {};
  const slotCount: Record<string, number> = {};
  for (const med of medications) {
    const slot = `${med.hour}:${med.minute}`;
    slotCount[slot] = (slotCount[slot] ?? 0) + 1;
  }
  const slotIndex: Record<string, number> = {};
  for (const med of medications) {
    const slot = `${med.hour}:${med.minute}`;
    const idx = slotIndex[slot] ?? 0;
    slotIndex[slot] = idx + 1;
    const count = slotCount[slot] ?? 1;
    // If multiple meds at same time, stack rings
    const bandWidth = R_OUTER - R_INNER; // 70px total
    const segH = bandWidth / count - 4;
    const segOuter = R_OUTER - idx * (segH + 4);
    const segInner = segOuter - segH;
    arcRadii[med.id] = { outer: segOuter, inner: segInner };
  }

  return (
    <main className={`${styles.page} ${dmSans.variable}`} style={{ fontFamily: "var(--font-med-rem), sans-serif" }}>
      {/* Top bar */}
      <header className={styles.topline}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>Health &amp; ageing</p>
          <h1 className={styles.heroTitle}>Your medications for today</h1>
          <p className={styles.heroLede}>
            See all of today&apos;s medications at a glance and mark each one as taken.
          </p>
        </div>
        <Image
          src="/undraw/undraw_reminders_o8j5.svg"
          alt=""
          width={520}
          height={420}
          className={styles.heroIllustration}
        />
      </section>

      {/* Main layout: clock + panel */}
      <div className={styles.layout}>
        {/* ── Left: 24-hour clock ── */}
        <div className={styles.clockPanel}>
          <div className={styles.clockWrap}>
            <svg
              className={styles.clockSvg}
              viewBox="0 0 500 500"
              aria-label="24-hour medication clock"
              role="img"
            >
              {/* Face */}
              <circle cx={CX} cy={CY} r={R_OUTER + 12} fill="#fff" />
              <circle cx={CX} cy={CY} r={R_OUTER + 12} fill="none" stroke="rgba(44,48,56,0.08)" strokeWidth="1" />

              {/* Inner face */}
              <circle cx={CX} cy={CY} r={R_INNER - 2} fill="#f8f9fa" />

              {/* Hour tick marks at 0, 6, 12, 18 */}
              {[
                { h: 0, label: "Midnight" },
                { h: 6, label: "6 am" },
                { h: 12, label: "Noon" },
                { h: 18, label: "6 pm" },
              ].map(({ h, label }) => {
                const angle = timeToAngle(h, 0);
                const outer = polarToCartesian(CX, CY, R_HOUR_TICK_OUTER, angle);
                const inner = polarToCartesian(CX, CY, R_HOUR_TICK_INNER, angle);
                const lp = polarToCartesian(CX, CY, R_LABEL, angle);
                return (
                  <g key={h}>
                    <line
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="rgba(44,48,56,0.3)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fill="rgba(44,48,56,0.5)"
                      fontFamily="inherit"
                      fontWeight="500"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Minor ticks every 3 hours */}
              {Array.from({ length: 24 }, (_, i) => i)
                .filter((i) => i % 6 !== 0)
                .map((h) => {
                  const angle = timeToAngle(h, 0);
                  const o = polarToCartesian(CX, CY, R_HOUR_TICK_OUTER, angle);
                  const inn = polarToCartesian(CX, CY, R_HOUR_TICK_OUTER - 8, angle);
                  return (
                    <line
                      key={h}
                      x1={inn.x}
                      y1={inn.y}
                      x2={o.x}
                      y2={o.y}
                      stroke="rgba(44,48,56,0.18)"
                      strokeWidth="1"
                    />
                  );
                })}

              {/* Medication arcs */}
              {medications.map((med) => {
                const radii = arcRadii[med.id] ?? { outer: R_OUTER, inner: R_INNER };
                return (
                  <MedArc
                    key={med.id}
                    med={med}
                    taken={!!taken[med.id]}
                    selected={selectedId === med.id}
                    onClick={() => setSelectedId((prev) => (prev === med.id ? null : med.id))}
                    rOuter={radii.outer}
                    rInner={radii.inner}
                  />
                );
              })}

              {/* Current-time arc highlight (subtle glow zone ±15 min) */}
              {(() => {
                const baseAngle = handAngle;
                const p0 = polarToCartesian(CX, CY, R_OUTER + 10, baseAngle - 2.5);
                const p1 = polarToCartesian(CX, CY, R_OUTER + 10, baseAngle + 2.5);
                const pi0 = polarToCartesian(CX, CY, R_INNER - 12, baseAngle - 2.5);
                const pi1 = polarToCartesian(CX, CY, R_INNER - 12, baseAngle + 2.5);
                return (
                  <path
                    d={`M ${p0.x} ${p0.y} A ${R_OUTER + 10} ${R_OUTER + 10} 0 0 1 ${p1.x} ${p1.y} L ${pi1.x} ${pi1.y} A ${R_INNER - 12} ${R_INNER - 12} 0 0 0 ${pi0.x} ${pi0.y} Z`}
                    fill="rgba(45,125,111,0.12)"
                    style={{ transition: "all 1s linear" }}
                  />
                );
              })()}

              {/* Clock hand */}
              <ClockHand angle={handAngle} />

              {/* Centre dot */}
              <circle cx={CX} cy={CY} r="7" fill="#2c3038" />
              <circle cx={CX} cy={CY} r="3.5" fill="#f8f9fa" />
            </svg>
          </div>

          {/* Date / time / summary */}
          <div className={styles.clockMeta}>
            <p className={styles.clockDate}>{formatDate(now)}</p>
            <p className={styles.clockTime}>{formatCurrentTime(now)}</p>
            <p className={styles.clockSummary}>
              {takenCount} of {totalCount} taken today
            </p>
          </div>
        </div>

        {/* ── Right: list + detail ── */}
        <div className={styles.detailPanel}>
          <p className={styles.panelLabel}>Today&apos;s schedule</p>

          {/* Medication list */}
          <nav className={styles.medList} aria-label="Medications list">
            {medications.map((med) => {
              const colours = COLOUR_MAP[med.colour];
              const isTaken = !!taken[med.id];
              const isSelected = selectedId === med.id;
              return (
                <button
                  key={med.id}
                  className={`${styles.medItem} ${isTaken ? styles.taken : ""} ${isSelected ? styles.selected : ""}`}
                  onClick={() => setSelectedId((prev) => (prev === med.id ? null : med.id))}
                  aria-pressed={isSelected}
                  style={{
                    borderColor: isSelected ? colours.arc : undefined,
                  }}
                >
                  <span
                    className={styles.medDot}
                    style={{ background: isTaken ? colours.arcTaken : colours.arc }}
                  />
                  <span className={styles.medInfo}>
                    <span className={styles.medName}>
                      {med.name} {med.dosage}
                    </span>
                    <span className={styles.medTime}>{formatTime(med.hour, med.minute)}</span>
                  </span>
                  <span
                    className={styles.medStatus}
                    style={{ color: isTaken ? colours.arc : "rgba(44,48,56,0.35)" }}
                  >
                    {isTaken ? "Taken" : "Upcoming"}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Detail card */}
          <AnimatePresence mode="wait">
            {selectedMed ? (
              <motion.div
                key={selectedMed.id}
                className={styles.detailCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div
                  className={styles.detailCardTop}
                  style={{ background: COLOUR_MAP[selectedMed.colour].bg }}
                >
                  <h2 className={styles.detailMedName}>{selectedMed.name}</h2>
                  <p className={styles.detailMedDosage}>{selectedMed.dosage}</p>
                </div>
                <div className={styles.detailCardBody}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailRowLabel}>Scheduled time</span>
                    <span className={`${styles.detailRowValue} ${styles.large}`}>
                      {formatTime(selectedMed.hour, selectedMed.minute)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailRowLabel}>Instructions</span>
                    <span className={styles.detailRowValue}>{selectedMed.instructions}</span>
                  </div>
                </div>

                {taken[selectedMed.id] ? (
                  <div className={styles.takenConfirm}>
                    <svg
                      className={styles.takenConfirmIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" fill="#5e8f5e" opacity="0.18" />
                      <path
                        d="M7.5 12.5l3 3 6-6"
                        stroke="#5e8f5e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <span className={styles.takenConfirmText}>Taken</span>
                      <span className={styles.takenConfirmTime}>
                        Marked at {taken[selectedMed.id]}
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    className={styles.takenBtn}
                    onClick={handleMark}
                    whileTap={{ scale: 0.975 }}
                    transition={{ duration: 0.1 }}
                    aria-label={`Mark ${selectedMed.name} ${selectedMed.dosage} as taken`}
                  >
                    Mark as taken
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className={styles.detailEmpty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                Tap a medication on the clock or in the list above to confirm your dose.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
