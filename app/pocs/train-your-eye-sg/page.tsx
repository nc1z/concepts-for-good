"use client";

import Link from "next/link";
import { Playfair_Display, Space_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  challenges,
  DEFAULT_STATE,
  STORAGE_KEY,
  type Challenge,
  type SavedState,
} from "./data";
import styles from "./page.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600"],
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadState(): SavedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Highlight weak phrases in AI content
function SpecimenText({
  content,
  weakPhrases,
  highlightActive,
}: {
  content: string;
  weakPhrases: string[];
  highlightActive: boolean;
}) {
  if (!highlightActive) {
    return (
      <p
        className={styles.specimenText}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Split text around weak phrases and wrap them
  let remaining = content;
  const parts: { text: string; isWeak: boolean }[] = [];

  // Sort phrases by their position in the text (greedy left-to-right)
  const lowerContent = content.toLowerCase();
  const phrases = [...weakPhrases].sort((a, b) => {
    const posA = lowerContent.indexOf(a.toLowerCase());
    const posB = lowerContent.indexOf(b.toLowerCase());
    return posA - posB;
  });

  let cursor = 0;
  const foundPhrases: { start: number; end: number; phrase: string }[] = [];

  for (const phrase of phrases) {
    const idx = remaining.toLowerCase().indexOf(phrase.toLowerCase());
    if (idx === -1) continue;
    const absoluteStart = cursor + idx;
    const absoluteEnd = absoluteStart + phrase.length;
    // Avoid overlaps
    if (foundPhrases.some((p) => absoluteStart < p.end && absoluteEnd > p.start)) continue;
    foundPhrases.push({ start: absoluteStart, end: absoluteEnd, phrase });
    cursor = absoluteStart + phrase.length;
    remaining = content.slice(cursor);
  }

  foundPhrases.sort((a, b) => a.start - b.start);

  let pos = 0;
  for (const { start, end, phrase } of foundPhrases) {
    if (pos < start) {
      parts.push({ text: content.slice(pos, start), isWeak: false });
    }
    parts.push({ text: phrase, isWeak: true });
    pos = end;
  }
  if (pos < content.length) {
    parts.push({ text: content.slice(pos), isWeak: false });
  }

  return (
    <p className={styles.specimenText}>
      {parts.map((part, i) =>
        part.isWeak ? (
          <motion.mark
            key={i}
            className={styles.weakPhrase}
            initial={{ backgroundColor: "transparent", borderBottomColor: "transparent" }}
            animate={{ backgroundColor: "rgba(232,160,32,0.12)", borderBottomColor: "#E8A020" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            dangerouslySetInnerHTML={{ __html: part.text }}
          />
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: part.text }} />
        )
      )}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TrainYourEye() {
  const [state, setState] = useState<SavedState>(DEFAULT_STATE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<"critique" | "rewrite">("critique");
  const [critiqueInput, setCritiqueInput] = useState("");
  const [rewriteInput, setRewriteInput] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const critiqueRef = useRef<HTMLTextAreaElement>(null);
  const rewriteRef = useRef<HTMLTextAreaElement>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    setState(saved);

    // Find the first incomplete challenge
    const firstIncomplete = challenges.findIndex(
      (c) => !saved.completedIds.includes(c.id)
    );
    if (firstIncomplete !== -1) {
      setCurrentIndex(firstIncomplete);
    } else {
      setCurrentIndex(challenges.length); // all done
    }
  }, []);

  const allDone = state.completedIds.length === challenges.length;
  const challenge: Challenge | undefined = challenges[currentIndex];
  const highlightActive = step === "rewrite";

  function handleCritiqueSubmit() {
    if (!critiqueInput.trim() || !challenge) return;
    const next: SavedState = {
      ...state,
      critiques: { ...state.critiques, [challenge.id]: critiqueInput.trim() },
    };
    setState(next);
    saveState(next);
    setStep("rewrite");
    setTimeout(() => rewriteRef.current?.focus(), 300);
  }

  function handleRewriteSubmit() {
    if (!rewriteInput.trim() || !challenge) return;
    setIsTransitioning(true);

    const next: SavedState = {
      ...state,
      completedIds: [...state.completedIds, challenge.id],
      rewrites: { ...state.rewrites, [challenge.id]: rewriteInput.trim() },
    };
    setState(next);
    saveState(next);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setStep("critique");
      setCritiqueInput("");
      setRewriteInput("");
      setIsTransitioning(false);
      setTimeout(() => critiqueRef.current?.focus(), 100);
    }, 400);
  }

  function handleKeyDown(
    e: React.KeyboardEvent,
    action: () => void
  ) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      action();
    }
  }

  const fontVars = [playfair.variable, spaceMono.variable, plusJakarta.variable].join(" ");

  // ── Final vocabulary screen ──────────────────────────────────────────────

  if (allDone) {
    return (
      <div className={`${styles.shell} ${fontVars}`}>
        <header className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
          <div className={styles.counter}>
            <span className={styles.counterDone}>10 / 10</span>
          </div>
          <div className={styles.dots}>
            {challenges.map((c) => (
              <div key={c.id} className={`${styles.dot} ${styles.dotFilled}`} />
            ))}
          </div>
        </header>

        <motion.div
          className={styles.vocabScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.vocabInner}>
            <motion.p
              className={styles.vocabEyebrow}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              YOUR STANDARDS
            </motion.p>
            <motion.h1
              className={styles.vocabHeading}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              The lines you won&apos;t cross.
            </motion.h1>
            <motion.div
              className={styles.vocabList}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
                hidden: {},
              }}
            >
              {challenges.map((c) => {
                const critique = state.critiques[c.id];
                const rewrite = state.rewrites[c.id];
                return (
                  <motion.div
                    key={c.id}
                    className={styles.vocabItem}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <span className={styles.vocabNumber}>{String(c.number).padStart(2, "0")}</span>
                    <div className={styles.vocabContent}>
                      <p className={styles.vocabContext}>{c.context}</p>
                      {critique && (
                        <p className={styles.vocabCritique}>
                          &ldquo;{critique}&rdquo;
                        </p>
                      )}
                      {rewrite && (
                        <details className={styles.vocabRewriteDetails}>
                          <summary className={styles.vocabRewriteSummary}>
                            Your rewrite
                          </summary>
                          <p className={styles.vocabRewrite}>{rewrite}</p>
                        </details>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              className={styles.vocabFooter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <button
                className={styles.restartBtn}
                onClick={() => {
                  setState(DEFAULT_STATE);
                  saveState(DEFAULT_STATE);
                  setCurrentIndex(0);
                  setStep("critique");
                  setCritiqueInput("");
                  setRewriteInput("");
                }}
              >
                Start again
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Challenge screen ─────────────────────────────────────────────────────

  if (!challenge) return null;

  const completedCount = state.completedIds.length;

  return (
    <div className={`${styles.shell} ${fontVars}`}>
      <header className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <div className={styles.counter}>
          Challenge{" "}
          <span className={styles.counterNum}>{challenge.number}</span>
          <span className={styles.counterSep}>/</span>
          <span className={styles.counterTotal}>10</span>
        </div>
        <div className={styles.dots} aria-label="Progress">
          {challenges.map((c, i) => {
            const isDone = state.completedIds.includes(c.id);
            const isCurrent = i === currentIndex;
            return (
              <motion.div
                key={c.id}
                className={styles.dot}
                animate={{
                  backgroundColor: isDone
                    ? "#E8A020"
                    : isCurrent
                    ? "#4A4540"
                    : "#2A2520",
                }}
                transition={{ duration: 0.3 }}
                aria-label={
                  isDone
                    ? `Challenge ${i + 1} complete`
                    : isCurrent
                    ? `Challenge ${i + 1} in progress`
                    : `Challenge ${i + 1} not yet started`
                }
              />
            );
          })}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          className={styles.splitscreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Left: Specimen ── */}
          <div className={styles.specimenPanel}>
            <div className={styles.specimenInner}>
              <p className={styles.specimenLabel}>AI WROTE THIS</p>
              <div className={styles.specimenContext}>{challenge.context}</div>
              <SpecimenText
                content={challenge.aiContent}
                weakPhrases={challenge.weakPhrases}
                highlightActive={highlightActive}
              />
              {highlightActive && (
                <motion.p
                  className={styles.specimenHint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Underlined phrases: the words that could be from any other piece of content ever written.
                </motion.p>
              )}
            </div>
          </div>

          {/* ── Right: Critique panel ── */}
          <div className={styles.critiquePanel}>
            <div className={styles.critiqueInner}>
              {step === "critique" ? (
                <motion.div
                  key="step-critique"
                  className={styles.critiqueStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={styles.critiquePrompt}>
                    This fails because&hellip;
                  </p>
                  <textarea
                    ref={critiqueRef}
                    className={styles.critiqueInput}
                    value={critiqueInput}
                    onChange={(e) => setCritiqueInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleCritiqueSubmit)}
                    placeholder="Name what's wrong with it."
                    rows={5}
                    autoFocus
                  />
                  <div className={styles.critiqueActions}>
                    <span className={styles.critiqueHint}>⌘↵ to submit</span>
                    <button
                      className={styles.submitBtn}
                      onClick={handleCritiqueSubmit}
                      disabled={!critiqueInput.trim()}
                    >
                      Name it →
                    </button>
                  </div>
                  {completedCount > 0 && (
                    <p className={styles.streakNote}>
                      {completedCount} {completedCount === 1 ? "critique" : "critiques"} filed
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="step-rewrite"
                  className={styles.critiqueStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.userCritiqueBox}>
                    <span className={styles.userCritiqueLabel}>You said</span>
                    <p className={styles.userCritiqueText}>
                      &ldquo;{state.critiques[challenge.id]}&rdquo;
                    </p>
                  </div>

                  <motion.div
                    className={styles.expertCritiqueBox}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    <span className={styles.expertLabel}>What else is there</span>
                    <p
                      className={styles.expertCritiqueText}
                      dangerouslySetInnerHTML={{ __html: challenge.expertCritique }}
                    />
                  </motion.div>

                  <motion.div
                    className={styles.rewriteSection}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <p className={styles.constraintLabel}>
                      Now rewrite it. One rule:
                    </p>
                    <p className={styles.constraintText}
                      dangerouslySetInnerHTML={{ __html: challenge.constraint }}
                    />
                    <textarea
                      ref={rewriteRef}
                      className={styles.critiqueInput}
                      value={rewriteInput}
                      onChange={(e) => setRewriteInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleRewriteSubmit)}
                      placeholder="Your version."
                      rows={4}
                    />
                    <div className={styles.critiqueActions}>
                      <span className={styles.critiqueHint}>⌘↵ to submit</span>
                      <button
                        className={styles.submitBtn}
                        onClick={handleRewriteSubmit}
                        disabled={!rewriteInput.trim()}
                      >
                        Publish your version →
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
