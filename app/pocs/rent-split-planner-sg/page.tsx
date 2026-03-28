"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DM_Sans } from "next/font/google";
import Link from "next/link";

import {
  defaultBills,
  defaultPeople,
  getBillShareForPerson,
  getPersonShare,
  STORAGE_KEY,
  type Assignment,
  type Bill,
  type Person,
} from "./data";
import styles from "./page.module.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

function loadBills(): Bill[] {
  if (typeof window === "undefined") return defaultBills;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBills;
    const parsed = JSON.parse(raw) as Bill[];
    return Array.isArray(parsed) ? parsed : defaultBills;
  } catch {
    return defaultBills;
  }
}

function formatSGD(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

function assignmentLabel(bill: Bill, people: Person[]): string {
  const { assignment } = bill;
  if (assignment.type === "sole") {
    const person = people.find((p) => p.id === assignment.personId);
    return person?.name ?? "Unassigned";
  }
  const parts = Object.entries(assignment.ratios)
    .filter(([, r]) => r > 0)
    .map(([id, r]) => {
      const person = people.find((p) => p.id === id);
      return `${person?.name ?? id} ${Math.round(r * 100)}%`;
    });
  return parts.join(" · ");
}

function assignmentDotColor(bill: Bill, people: Person[]): string {
  const { assignment } = bill;
  if (assignment.type === "sole") {
    return people.find((p) => p.id === assignment.personId)?.color ?? "#b0a99a";
  }
  // Multiple — return a neutral warm tone
  return "#b0a99a";
}

// ── Sub-components ──────────────────────────────────────────────────

function SplitEditor({
  bill,
  people,
  onChange,
}: {
  bill: Bill;
  people: Person[];
  onChange: (assignment: Assignment) => void;
}) {
  const isSole = bill.assignment.type === "sole";

  function handleModeSwitch(mode: "sole" | "split") {
    if (mode === "sole") {
      onChange({ type: "sole", personId: people[0].id });
    } else {
      const even = 1 / people.length;
      const ratios: Record<string, number> = {};
      people.forEach((p) => { ratios[p.id] = parseFloat(even.toFixed(3)); });
      onChange({ type: "split", ratios });
    }
  }

  function handleSoleSelect(personId: string) {
    onChange({ type: "sole", personId });
  }

  function handleRatioChange(personId: string, value: number) {
    if (bill.assignment.type !== "split") return;
    const next = { ...bill.assignment.ratios, [personId]: value / 100 };
    onChange({ type: "split", ratios: next });
  }

  return (
    <div className={styles.splitEditor}>
      <p className={styles.splitEditorTitle}>Who pays?</p>

      <div className={styles.modeRow}>
        <button
          type="button"
          className={`${styles.modeBtn} ${isSole ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeSwitch("sole")}
        >
          One person
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${!isSole ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeSwitch("split")}
        >
          Split
        </button>
      </div>

      {isSole ? (
        <div className={styles.soleRow}>
          {people.map((person) => {
            const isActive =
              bill.assignment.type === "sole" &&
              bill.assignment.personId === person.id;
            return (
              <button
                key={person.id}
                type="button"
                className={`${styles.personChoiceBtn} ${isActive ? styles.personChoiceBtnActive : ""}`}
                style={
                  isActive
                    ? { borderColor: person.color, background: person.lightColor }
                    : {}
                }
                onClick={() => handleSoleSelect(person.id)}
              >
                <span
                  className={styles.choiceDot}
                  style={{ background: person.color }}
                />
                {person.name}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.sliderRows}>
          {people.map((person) => {
            const ratios =
              bill.assignment.type === "split" ? bill.assignment.ratios : {};
            const pct = Math.round((ratios[person.id] ?? 0) * 100);
            return (
              <div key={person.id} className={styles.sliderRow}>
                <span className={styles.sliderName}>
                  <span
                    className={styles.sliderDot}
                    style={{ background: person.color }}
                  />
                  {person.name}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={pct}
                  className={styles.splitSlider}
                  onChange={(e) =>
                    handleRatioChange(person.id, Number(e.target.value))
                  }
                />
                <span className={styles.sliderValue}>{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PersonBar({
  person,
  bills,
  totalMonthly,
}: {
  person: Person;
  bills: Bill[];
  totalMonthly: number;
}) {
  const segments = bills
    .map((bill) => ({
      id: bill.id,
      name: bill.name,
      share: getBillShareForPerson(person.id, bill),
    }))
    .filter((s) => s.share > 0);

  const personTotal = getPersonShare(person.id, bills);
  const barHeightPct = totalMonthly > 0 ? (personTotal / totalMonthly) * 100 : 0;

  return (
    <div className={styles.personColumn}>
      <span className={styles.personName}>{person.name}</span>
      <div className={styles.barWrap}>
        <motion.div
          className={styles.barStack}
          layout
          style={{ height: `${barHeightPct}%` }}
        >
          <AnimatePresence mode="popLayout">
            {segments.map((seg) => {
              const segPct = totalMonthly > 0 ? (seg.share / totalMonthly) * 100 : 0;
              return (
                <motion.div
                  key={seg.id}
                  layout
                  className={styles.barSegment}
                  style={{
                    background: person.color,
                    opacity: 0.55 + (segPct / 100) * 0.45,
                    height: `${segPct}%`,
                  }}
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1, originY: 1 }}
                  exit={{ scaleY: 0, originY: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 32 }}
                  title={`${seg.name}: ${formatSGD(seg.share)}`}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className={styles.personTotals}>
        <span className={styles.barTotal}>{formatSGD(personTotal)}</span>
        <span className={styles.barSubtotal}>this month</span>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────

export default function RentSplitPlanner() {
  const people = defaultPeople;

  const [bills, setBills] = useState<Bill[]>(defaultBills);
  const [activeBillId, setActiveBillId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  const [newBillName, setNewBillName] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");

  useEffect(() => {
    setBills(loadBills());
    setMounted(true);
  }, []);

  function handleAssignChange(billId: string, assignment: Assignment) {
    setBills((current) =>
      current.map((b) => (b.id === billId ? { ...b, assignment } : b))
    );
  }

  function handleSave() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function handleAddBill() {
    const name = newBillName.trim();
    const amount = parseFloat(newBillAmount);
    if (!name || isNaN(amount) || amount <= 0) return;

    const even = 1 / people.length;
    const ratios: Record<string, number> = {};
    people.forEach((p) => { ratios[p.id] = parseFloat(even.toFixed(3)); });

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      name,
      amount,
      assignment: { type: "split", ratios },
    };

    setBills((current) => [...current, newBill]);
    setNewBillName("");
    setNewBillAmount("");
    setActiveBillId(newBill.id);
  }

  const totalMonthly = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <main className={`${styles.page} ${dmSans.variable}`}>
      <div className={styles.shell}>

        {/* Back */}
        <Link href="/" className={styles.backLink}>← Back to gallery</Link>

        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Rent Split Planner</p>
          <h1>See exactly what everyone owes this month.</h1>
          <p className={styles.lede}>
            Assign each bill to the right person — or split it — and watch the bars
            on the right update in real time. No spreadsheets, no awkward conversations.
          </p>
        </section>

        {/* Board */}
        <div className={styles.board}>

          {/* Bills column */}
          <section className={styles.billsSection}>
            <div className={styles.billsHeader}>
              <p className={styles.sectionLabel}>Monthly bills</p>
              <span className={styles.totalBadge}>Total {formatSGD(totalMonthly)}/mo</span>
            </div>

            <div className={styles.billsList}>
              {bills.length === 0 && (
                <div className={styles.emptyState}>
                  Add your first bill to start splitting costs between flatmates.
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {bills.map((bill) => {
                  const isActive = activeBillId === bill.id;
                  const dotColor = assignmentDotColor(bill, people);
                  const label = assignmentLabel(bill, people);

                  return (
                    <motion.div
                      key={bill.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div
                        className={`${styles.billTile} ${isActive ? styles.active : ""}`}
                        style={{ ["--border-color" as string]: dotColor }}
                        onClick={() =>
                          setActiveBillId(isActive ? null : bill.id)
                        }
                      >
                        <div className={styles.billTop}>
                          <span className={styles.billName}>{bill.name}</span>
                          <span className={styles.billAmount}>
                            {formatSGD(bill.amount)}/mo
                          </span>
                        </div>
                        <div className={styles.billMeta}>
                          <span
                            className={styles.ownerDot}
                            style={{ background: dotColor }}
                          />
                          <span className={styles.ownerLabel}>{label}</span>
                        </div>

                        {isActive && (
                          <SplitEditor
                            bill={bill}
                            people={people}
                            onChange={(assignment) =>
                              handleAssignChange(bill.id, assignment)
                            }
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Add a bill */}
            <div className={styles.addBillForm}>
              <div className={styles.addBillFields}>
                <input
                  type="text"
                  placeholder="Bill name — e.g. Netflix subscription"
                  value={newBillName}
                  onChange={(e) => setNewBillName(e.target.value)}
                  className={styles.addBillInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddBill();
                  }}
                />
                <input
                  type="number"
                  placeholder="Amount $"
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                  className={styles.addBillInput}
                  min={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddBill();
                  }}
                />
              </div>
              <button
                type="button"
                className={styles.addBillBtn}
                onClick={handleAddBill}
                disabled={!newBillName.trim() || !newBillAmount}
              >
                Add a bill
              </button>
            </div>
          </section>

          {/* People bars column */}
          <section className={styles.peopleSection}>
            <div className={styles.peopleHeader}>
              <p className={styles.sectionLabel}>Each person&rsquo;s share</p>
            </div>
            <div className={styles.peopleBars}>
              {people.map((person) => (
                <PersonBar
                  key={person.id}
                  person={person}
                  bills={bills}
                  totalMonthly={totalMonthly}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Summary footer */}
        {mounted && (
          <div className={styles.summaryFooter}>
            <p className={styles.summaryNote}>
              Your split covers <strong>{formatSGD(totalMonthly)}/month</strong> across{" "}
              {bills.length} bill{bills.length !== 1 ? "s" : ""}. Click any bill above
              to reassign or adjust the split.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {saved && (
                <span className={styles.savedNote}>Changes saved</span>
              )}
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
