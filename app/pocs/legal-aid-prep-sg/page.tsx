"use client";

import Link from "next/link";
import { Manrope, Newsreader } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { helpRoutes, intakeSteps, paperGuides, routeOrder } from "./data";
import styles from "./page.module.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-legal-aid-body" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-legal-aid-display" });

type FormValues = Partial<Record<(typeof intakeSteps)[number]["id"], string>>;

type Message =
  | {
      id: string;
      speaker: "assistant";
      title?: string;
      body: string;
      helper?: string;
      label?: string;
    }
  | {
      id: string;
      speaker: "user";
      body: string;
    };

function getOptionLabel(stepId: keyof FormValues, optionId?: string) {
  const step = intakeSteps.find((item) => item.id === stepId);
  return step?.options.find((option) => option.id === optionId)?.label ?? "";
}

function scoreRoute(routeId: string, answers: FormValues) {
  const route = helpRoutes.find((item) => item.id === routeId);
  if (!route) return 0;

  let score = 0;
  Object.values(answers).forEach((answer) => {
    if (!answer) return;
    if (route.fit.includes(answer)) score += 2;
    if (route.caution?.includes(answer)) score -= 1;
  });

  if (routeId === "lab" && answers.urgency === "urgent") score += 1;
  if (routeId === "clc" && answers.papers === "none") score += 1;
  if (routeId === "tripartite" && answers.issue === "work") score += 2;

  return score;
}

function buildCopySummary(answers: FormValues, topRouteName: string, papers: string[]) {
  const issue = getOptionLabel("issue", answers.issue);
  const urgency = getOptionLabel("urgency", answers.urgency);
  const income = getOptionLabel("income", answers.income);
  const residency = getOptionLabel("residency", answers.residency);

  return [
    "My legal help notes",
    `Main issue: ${issue || "Not answered yet"}`,
    `Deadline: ${urgency || "Not answered yet"}`,
    `Household income: ${income || "Not answered yet"}`,
    `Residency: ${residency || "Not answered yet"}`,
    `Best first route: ${topRouteName}`,
    "",
    "Bring these first:",
    ...papers.map((paper) => `- ${paper}`),
  ].join("\n");
}

export default function LegalAidPrepPage() {
  const form = useForm<FormValues>({
    defaultValues: {},
  });
  const answers = form.watch();
  const [copied, setCopied] = useState(false);

  const answeredSteps = intakeSteps.filter((step) => answers[step.id]);
  const nextStep = intakeSteps.find((step) => !answers[step.id]) ?? null;
  const routeMatches = useMemo(() => {
    const ranked = routeOrder
      .map((routeId) => {
        const route = helpRoutes.find((item) => item.id === routeId)!;
        return {
          ...route,
          score: scoreRoute(routeId, answers),
        };
      })
      .sort((left, right) => right.score - left.score);

    return ranked;
  }, [answers]);

  const topRoute = routeMatches[0];
  const missingPapers =
    answers.papers === "ready"
      ? []
      : topRoute?.papers.slice(1) ?? [];

  const messages: Message[] = [
    {
      id: "intro",
      speaker: "assistant",
      label: "Case intake",
      title: "See which legal help route may fit before you make the call.",
      body:
        "Answer a few plain questions and keep your papers in one place before you speak to a clinic or agency.",
      helper: "Start with the issue you want to sort out first.",
    },
    ...answeredSteps.flatMap((step) => [
      {
        id: `${step.id}-prompt`,
        speaker: "assistant" as const,
        body: step.prompt,
        helper: step.helper,
      },
      {
        id: `${step.id}-answer`,
        speaker: "user" as const,
        body: getOptionLabel(step.id, answers[step.id]),
      },
    ]),
  ];

  async function handleAnswer(stepId: keyof FormValues, optionId: string) {
    form.setValue(stepId, optionId, { shouldDirty: true, shouldTouch: true });
    setCopied(false);
  }

  async function handleCopy() {
    if (!topRoute) return;
    const summary = buildCopySummary(answers, topRoute.name, topRoute.papers);
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  }

  const timeLabel = new Intl.DateTimeFormat("en-SG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return (
    <main
      className={`${styles.page} ${manrope.variable} ${newsreader.variable}`}
      style={{
        fontFamily: "var(--font-legal-aid-body), sans-serif",
      }}
    >
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          ← Back to gallery
        </Link>

        <div className={styles.layout}>
          <section className={styles.threadCard}>
            <div className={styles.topRow}>
              <span className={styles.chip}>Legal support</span>
              <span className={styles.clock}>Updated at {timeLabel}</span>
            </div>

            <div className={styles.messages}>
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.article
                    key={message.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.26, delay: index * 0.04 }}
                    className={
                      message.speaker === "assistant"
                        ? styles.assistantBubble
                        : styles.userBubble
                    }
                  >
                    {message.speaker === "assistant" && message.label ? (
                      <p className={styles.smallText}>{message.label}</p>
                    ) : null}
                    {message.speaker === "assistant" && message.title ? (
                      <h1
                        className={styles.heroTitle}
                        style={{ fontFamily: "var(--font-legal-aid-display), serif" }}
                      >
                        {message.title}
                      </h1>
                    ) : null}
                    <p className={message.title ? styles.heroText : styles.bubbleText}>{message.body}</p>
                    {message.speaker === "assistant" && message.helper ? (
                      <p className={styles.helper}>{message.helper}</p>
                    ) : null}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <div className={styles.responseArea}>
              {nextStep ? (
                <>
                  <p className={styles.responsePrompt}>{nextStep.prompt}</p>
                  <div className={styles.options}>
                    {nextStep.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={styles.optionButton}
                        onClick={() => handleAnswer(nextStep.id, option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.responsePrompt}>
                    You have enough to make the first call with a clearer picture.
                  </p>
                  <div className={styles.options}>
                    <button type="button" className={styles.copyButton} onClick={handleCopy}>
                      Copy what to bring
                    </button>
                    {copied ? <span className={styles.copyNote}>Copied for your notes.</span> : null}
                  </div>
                </>
              )}
            </div>
          </section>

          <aside className={styles.folderCard}>
            <header className={styles.folderHeader}>
              <span className={styles.chip}>Case folder</span>
              <h2
                className={styles.folderTitle}
                style={{ fontFamily: "var(--font-legal-aid-display), serif" }}
              >
                What to try first
              </h2>
              <p className={styles.folderSummary}>
                The shortlist updates as you answer, so you can see where to call and what papers to
                gather before you leave home.
              </p>
            </header>

            {answeredSteps.length === 0 ? (
              <div className={styles.pendingCard}>
                Answer the first question and your best first call route will settle here with the papers to bring.
              </div>
            ) : (
              <>
                <ul className={styles.routeList}>
                  {routeMatches.map((route, index) => (
                    <li key={route.id} className={styles.routeCard}>
                      <div className={styles.routeTop}>
                        <h3 className={styles.routeName}>{route.name}</h3>
                        <span className={index === 0 ? styles.routeBadge : styles.mutedBadge}>
                          {index === 0 ? "Best first step" : "Also worth checking"}
                        </span>
                      </div>
                      <p className={styles.routeCopy}>{route.summary}</p>
                      <p className={`${styles.routeCopy} ${styles.routeNext}`}>{route.nextStep}</p>
                    </li>
                  ))}
                </ul>

                <div className={styles.folderSections}>
                  <section className={styles.sectionCard}>
                    <div className={styles.sectionTitleRow}>
                      <h3 className={styles.sectionTitle}>Bring these first</h3>
                      {topRoute ? <span className={styles.mutedBadge}>{topRoute.name}</span> : null}
                    </div>
                    <ul className={styles.paperList}>
                      {(topRoute?.papers ?? []).map((paper) => (
                        <li key={paper} className={styles.paperItem}>
                          {paper}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.sectionCard}>
                    <div className={styles.sectionTitleRow}>
                      <h3 className={styles.sectionTitle}>Still missing</h3>
                      {answers.papers ? (
                        <span className={styles.mutedBadge}>
                          {answers.papers === "ready" ? "Almost there" : "Gather next"}
                        </span>
                      ) : null}
                    </div>
                    {answers.papers ? (
                      missingPapers.length > 0 ? (
                        <ul className={styles.paperList}>
                          {missingPapers.map((paper) => (
                            <li key={paper} className={styles.paperItem}>
                              {paper}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.sectionText}>
                          Your first set looks ready. Keep the letters together so you can refer to dates and
                          names quickly.
                        </p>
                      )
                    ) : (
                      <div className={styles.pendingCard}>
                        Tell me how much paperwork you already have, and I will narrow this list for you.
                      </div>
                    )}
                  </section>

                  <section className={styles.sectionCard}>
                    <div className={styles.sectionTitleRow}>
                      <h3 className={styles.sectionTitle}>Next few moves</h3>
                      {answers.papers ? (
                        <span className={styles.mutedBadge}>After your answers</span>
                      ) : null}
                    </div>
                    <ul className={styles.timelineList}>
                      <li className={styles.timelineItem}>
                        Keep your issue in one short timeline: what happened, when it started, and what deadline
                        is coming.
                      </li>
                      <li className={styles.timelineItem}>
                        {answers.papers
                          ? paperGuides[answers.papers]
                          : "I will help you sort the papers after the next answer."}
                      </li>
                      <li className={styles.timelineItem}>
                        {topRoute
                          ? topRoute.nextStep
                          : "Answer the first question so the shortlist can settle on the strongest route."}
                      </li>
                    </ul>
                  </section>
                </div>
              </>
            )}

            {!nextStep ? (
              <div className={styles.footerActions}>
                <button type="button" className={styles.copyButton} onClick={handleCopy}>
                  Copy what to bring
                </button>
                {copied ? <span className={styles.copyNote}>Copied for your notes.</span> : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
