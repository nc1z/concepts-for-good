"use client";

import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  announcerSeed,
  defaultOrder,
  missionConfig,
  stopLookup,
  type Stop,
} from "./data";
import styles from "./page.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-food-donation-route",
  weight: ["400", "500", "600", "700", "800"],
});

const STORAGE_KEY = "cfg-food-donation-route-sg-v2";

type Phase = "briefing" | "running" | "won" | "lost";

type RoutePreviewStep = {
  stop: Stop;
  arrivalMin: number;
  marginMin: number;
  projectedPoints: number;
  rescuedMeals: number;
  willMiss: boolean;
};

function buildRoutePreview(routeOrder: string[], benchedIds: string[]) {
  const activeStops = routeOrder
    .filter((id) => !benchedIds.includes(id))
    .map((id) => stopLookup[id])
    .filter(Boolean);

  let travelClock = 0;
  let projectedScore = 0;
  let projectedStrikes = 0;
  let projectedMeals = 0;

  const steps = activeStops.map((stop) => {
    travelClock += stop.travelFromPreviousMin;
    const marginMin = stop.closingInMin - travelClock;
    const willMiss = marginMin < 0;

    let projectedPoints = 0;
    let rescuedMeals = 0;

    if (stop.kind === "pickup") {
      if (willMiss) {
        projectedPoints = -18;
        projectedStrikes += 1;
      } else {
        rescuedMeals = stop.meals;
        projectedMeals += stop.meals;
        projectedPoints = stop.meals * 2 + Math.max(6, marginMin);
      }
    } else if (willMiss || projectedMeals === 0) {
      projectedPoints = -12;
      projectedStrikes += 1;
    } else {
      projectedPoints = Math.min(46, Math.round(projectedMeals * 0.38));
    }

    projectedScore += projectedPoints;

    return {
      stop,
      arrivalMin: travelClock,
      marginMin,
      projectedPoints,
      rescuedMeals,
      willMiss,
    };
  });

  return {
    steps,
    projectedScore,
    projectedStrikes,
    projectedMeals,
  };
}

function formatEta(minutes: number) {
  const totalMinutes = 40 + minutes;
  const hour = 7 + Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const hour12 = hour > 12 ? hour - 12 : hour;
  return `${hour12}:${String(minute).padStart(2, "0")} pm`;
}

function scoreLabel(points: number) {
  return points > 0 ? `+${points}` : String(points);
}

function marginLabel(step: RoutePreviewStep) {
  if (step.willMiss) return `${Math.abs(step.marginMin)} min late`;
  return `${step.marginMin} min spare`;
}

function kindLabel(stop: Stop) {
  return stop.kind === "pickup" ? "Pickup" : "Drop-off";
}

function RoutePathOverlay({
  routeOrder,
  benchedIds,
  nodeRefs,
  containerRef,
}: {
  routeOrder: string[];
  benchedIds: string[];
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    const recalculate = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const activeIds = routeOrder.filter((id) => !benchedIds.includes(id));
      const nextPaths: string[] = [];

      for (let index = 0; index < activeIds.length - 1; index += 1) {
        const fromNode = nodeRefs.current[activeIds[index]];
        const toNode = nodeRefs.current[activeIds[index + 1]];

        if (!fromNode || !toNode) continue;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2 - rect.left;
        const fromY = fromRect.top + fromRect.height / 2 - rect.top;
        const toX = toRect.left + toRect.width / 2 - rect.left;
        const toY = toRect.top + toRect.height / 2 - rect.top;
        const midY = (fromY + toY) / 2;

        nextPaths.push(
          `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`,
        );
      }

      setPaths(nextPaths);
    };

    recalculate();
    const frameOne = window.requestAnimationFrame(recalculate);
    const frameTwo = window.requestAnimationFrame(recalculate);
    window.addEventListener("resize", recalculate);

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
      window.removeEventListener("resize", recalculate);
    };
  }, [routeOrder, benchedIds, nodeRefs, containerRef]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDashOffset((value) => value - 1);
    }, 40);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <svg className={styles.pathCanvas} aria-hidden="true">
      {paths.map((path, index) => (
        <path
          key={`${path}-${index}`}
          d={path}
          className={styles.routePath}
          style={{ strokeDashoffset: dashOffset }}
        />
      ))}
    </svg>
  );
}

export default function FoodDonationRoutePage() {
  const [routeOrder, setRouteOrder] = useState(defaultOrder);
  const [benchedIds, setBenchedIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("briefing");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [rescuedMeals, setRescuedMeals] = useState(0);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [bestScore, setBestScore] = useState(248);
  const [announcerNotes, setAnnouncerNotes] = useState(announcerSeed);

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { bestScore?: number };
        if (typeof parsed.bestScore === "number") {
          setBestScore(parsed.bestScore);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore }));
  }, [bestScore]);

  const preview = buildRoutePreview(routeOrder, benchedIds);
  const activeSteps = preview.steps;
  const currentStep = activeSteps[currentStepIndex] ?? null;
  const stageCount = activeSteps.length;
  const canBench = phase === "briefing";
  const hasRoute = stageCount > 0;

  function resetRound() {
    setPhase("briefing");
    setCurrentStepIndex(0);
    setRescuedMeals(0);
    setScore(0);
    setStrikes(0);
    setBenchedIds([]);
    setRouteOrder(defaultOrder);
    setAnnouncerNotes(announcerSeed);
  }

  function startRound() {
    if (!hasRoute) return;
    setPhase("running");
    setCurrentStepIndex(0);
    setRescuedMeals(0);
    setScore(0);
    setStrikes(0);
    setAnnouncerNotes([
      "Engines on. Drive the route in order and keep the closing windows alive.",
      `Mission target: rescue ${missionConfig.targetMeals} meals before the last pantry handoff.`,
    ]);
  }

  function finishRound(nextScore: number, nextMeals: number, nextStrikes: number) {
    if (nextScore > bestScore) {
      setBestScore(nextScore);
    }

    const won =
      nextStrikes < missionConfig.maxStrikes &&
      nextMeals >= missionConfig.targetMeals &&
      nextScore >= missionConfig.targetScore;

    setPhase(won ? "won" : "lost");
    setAnnouncerNotes((current) => [
      won
        ? `Round clear. ${nextMeals} meals rescued and both pantry drops landed on time.`
        : "Round over. Too many meals were left behind before the shutters came down.",
      ...current,
    ]);
  }

  function resolveCurrentStep(skipCurrent = false) {
    if (!currentStep) return;

    let nextScore = score;
    let nextMeals = rescuedMeals;
    let nextStrikes = strikes;

    if (skipCurrent) {
      nextScore -= 12;
      nextStrikes += 1;
      setAnnouncerNotes((current) => [
        `Skipped ${currentStep.stop.name}. The detour cost time and one strike.`,
        ...current,
      ]);
    } else if (currentStep.stop.kind === "pickup") {
      if (currentStep.willMiss) {
        nextScore += currentStep.projectedPoints;
        nextStrikes += 1;
        setAnnouncerNotes((current) => [
          `${currentStep.stop.name} was late. ${Math.abs(currentStep.marginMin)} minutes too slow for pickup.`,
          ...current,
        ]);
      } else {
        nextMeals += currentStep.stop.meals;
        nextScore += currentStep.projectedPoints;
        setAnnouncerNotes((current) => [
          `${currentStep.stop.name} loaded ${currentStep.stop.meals} meals with ${currentStep.marginMin} minutes to spare.`,
          ...current,
        ]);
      }
    } else if (currentStep.willMiss || nextMeals === 0) {
      nextScore -= 12;
      nextStrikes += 1;
      setAnnouncerNotes((current) => [
        `${currentStep.stop.name} could not take the handoff in time.`,
        ...current,
      ]);
    } else {
      const dropBonus = Math.min(46, Math.round(nextMeals * 0.38));
      nextScore += dropBonus;
      setAnnouncerNotes((current) => [
        `${currentStep.stop.name} banked the rescue run. ${dropBonus} score added to the board.`,
        ...current,
      ]);
    }

    setRescuedMeals(nextMeals);
    setScore(nextScore);
    setStrikes(nextStrikes);

    const isLastStep = currentStepIndex >= activeSteps.length - 1;
    if (nextStrikes >= missionConfig.maxStrikes || isLastStep) {
      finishRound(nextScore, nextMeals, nextStrikes);
      return;
    }

    setCurrentStepIndex((value) => value + 1);
  }

  function toggleBench(stopId: string) {
    if (!canBench) return;

    setBenchedIds((current) =>
      current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId],
    );
  }

  const orderedStops = routeOrder.map((id) => stopLookup[id]).filter(Boolean);
  const stageLabel =
    phase === "briefing"
      ? "Plan the route"
      : currentStep
        ? `Stage ${currentStepIndex + 1} of ${stageCount}`
        : "Round complete";

  const nextActionLabel =
    phase === "briefing"
      ? "Start rescue round"
      : phase === "running"
        ? currentStep
          ? currentStep.stop.kind === "pickup"
            ? `Drive to ${currentStep.stop.area}`
            : `Deliver to ${currentStep.stop.area}`
          : "Route needs at least one stop"
        : "Run it again";

  return (
    <main
      className={`${styles.page} ${bricolage.variable}`}
      style={{ fontFamily: "var(--font-food-donation-route), sans-serif" }}
    >
      <Link href="/" className={styles.backLink}>
        ← Back to gallery
      </Link>

      <section className={styles.arena}>
        <header className={styles.hud}>
          <div className={styles.hudBlock}>
            <span className={styles.hudLabel}>Mission clock</span>
            <strong>{missionConfig.startClock}</strong>
          </div>
          <div className={styles.hudBlock}>
            <span className={styles.hudLabel}>Score</span>
            <strong>{score}</strong>
          </div>
          <div className={styles.hudBlock}>
            <span className={styles.hudLabel}>Meals saved</span>
            <strong>{rescuedMeals}</strong>
          </div>
          <div className={styles.hudBlock}>
            <span className={styles.hudLabel}>Strikes</span>
            <strong>
              {strikes}/{missionConfig.maxStrikes}
            </strong>
          </div>
          <div className={styles.hudBlock}>
            <span className={styles.hudLabel}>Best run</span>
            <strong>{bestScore}</strong>
          </div>
        </header>

        <div className={styles.boardShell}>
          <section className={styles.playfield}>
            <div className={styles.gridGlow} />
            <div className={styles.boardStats}>
              <span className={styles.stagePill}>{stageLabel}</span>
              <span className={styles.stagePill}>Projected score {preview.projectedScore}</span>
              <span className={styles.stagePill}>Projected meals {preview.projectedMeals}</span>
            </div>

            <div className={styles.routeTrack} ref={containerRef}>
              <RoutePathOverlay
                routeOrder={routeOrder}
                benchedIds={benchedIds}
                nodeRefs={nodeRefs}
                containerRef={containerRef}
              />

              <Reorder.Group
                axis="y"
                values={routeOrder}
                onReorder={canBench ? setRouteOrder : () => undefined}
                className={styles.routeList}
              >
                {orderedStops.map((stop) => {
                  const previewStep = preview.steps.find((step) => step.stop.id === stop.id) ?? null;
                  const benched = benchedIds.includes(stop.id);
                  const current = currentStep?.stop.id === stop.id && phase === "running";
                  const resolved = phase !== "briefing" && preview.steps
                    .slice(0, currentStepIndex)
                    .some((step) => step.stop.id === stop.id);

                  return (
                    <Reorder.Item
                      key={stop.id}
                      value={stop.id}
                      drag={canBench ? "y" : false}
                      className={styles.routeItem}
                    >
                      <article
                        className={[
                          styles.stopToken,
                          benched ? styles.stopTokenBenched : "",
                          current ? styles.stopTokenCurrent : "",
                          resolved ? styles.stopTokenResolved : "",
                          stop.kind === "dropoff" ? styles.stopTokenDropoff : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{ marginLeft: `${stop.laneShift}px` }}
                      >
                        <div className={styles.nodeColumn}>
                          <div
                            ref={(node) => {
                              nodeRefs.current[stop.id] = node;
                            }}
                            className={styles.nodeDot}
                          />
                        </div>

                        <div className={styles.stopBody}>
                          <div className={styles.stopHeader}>
                            <span className={styles.kindBadge}>{kindLabel(stop)}</span>
                            <span className={styles.areaBadge}>{stop.area}</span>
                          </div>
                          <h2 className={styles.stopName}>{stop.name}</h2>
                          <p className={styles.stopNote}>{stop.note}</p>

                          <div className={styles.stopMetaRow}>
                            <span>{stop.windowLabel}</span>
                            <span>{stop.travelFromPreviousMin} min drive</span>
                            <span>
                              {stop.kind === "pickup" ? `${stop.meals} meals` : "Bank the run"}
                            </span>
                          </div>

                          {previewStep ? (
                            <div className={styles.stopForecastRow}>
                              <span>{formatEta(previewStep.arrivalMin)}</span>
                              <span className={previewStep.willMiss ? styles.penaltyText : styles.rewardText}>
                                {marginLabel(previewStep)}
                              </span>
                              <span className={previewStep.projectedPoints > 0 ? styles.rewardText : styles.penaltyText}>
                                {scoreLabel(previewStep.projectedPoints)}
                              </span>
                            </div>
                          ) : (
                            <div className={styles.stopForecastRow}>
                              <span>Benched from this run</span>
                              <span className={styles.penaltyText}>No route slot</span>
                            </div>
                          )}

                          {phase === "briefing" ? (
                            <button
                              type="button"
                              className={styles.benchButton}
                              onClick={() => toggleBench(stop.id)}
                            >
                              {benched ? "Put back on route" : "Bench this stop"}
                            </button>
                          ) : null}
                        </div>
                      </article>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>

            <div className={styles.heroPanel}>
              <p className={styles.heroEyebrow}>Route rescue game</p>
              <h1 className={styles.heroTitle}>Save the most meals before the shutters come down.</h1>
              <p className={styles.heroLede}>
                Reorder the run, watch the dotted route redraw, and lock in the route that keeps more dinners alive tonight.
              </p>

              <div className={styles.heroActions}>
                {phase === "briefing" ? (
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={startRound}
                    disabled={!hasRoute}
                  >
                    {nextActionLabel}
                  </button>
                ) : phase === "running" ? (
                  <>
                    <button type="button" className={styles.primaryAction} onClick={() => resolveCurrentStep(false)}>
                      {nextActionLabel}
                    </button>
                    <button type="button" className={styles.secondaryAction} onClick={() => resolveCurrentStep(true)}>
                      Skip this stop
                    </button>
                  </>
                ) : (
                  <button type="button" className={styles.primaryAction} onClick={resetRound}>
                    {nextActionLabel}
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className={styles.sidePanel}>
            <section className={styles.sideCard}>
              <p className={styles.sideLabel}>Mission board</p>
              <h2 className={styles.sideTitle}>Tonight&apos;s target</h2>
              <div className={styles.targetGrid}>
                <div>
                  <span>Meals</span>
                  <strong>{missionConfig.targetMeals}</strong>
                </div>
                <div>
                  <span>Score</span>
                  <strong>{missionConfig.targetScore}</strong>
                </div>
                <div>
                  <span>Active stops</span>
                  <strong>{stageCount}</strong>
                </div>
                <div>
                  <span>Live phase</span>
                  <strong>{phase}</strong>
                </div>
              </div>
            </section>

            <section className={styles.sideCard}>
              <p className={styles.sideLabel}>Route radar</p>
              <h2 className={styles.sideTitle}>What happens if you lock it now</h2>
              <ul className={styles.radarList}>
                {activeSteps.map((step, index) => (
                  <li key={step.stop.id} className={styles.radarItem}>
                    <span className={styles.radarIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{step.stop.name}</strong>
                      <p>
                        {formatEta(step.arrivalMin)} · {marginLabel(step)} · {scoreLabel(step.projectedPoints)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.sideCard}>
              <p className={styles.sideLabel}>Dispatch radio</p>
              <h2 className={styles.sideTitle}>Latest call-outs</h2>
              <div className={styles.radioStack}>
                <AnimatePresence initial={false}>
                  {announcerNotes.slice(0, 5).map((note, index) => (
                    <motion.article
                      key={`${note}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={styles.radioNote}
                    >
                      {note}
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
