"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./page.module.css";
import { helpTypes, seedRequests, type HelpRequest, type HelpType } from "./data";

const STORAGE_KEY = "good-sg-help-a-neighbour";

type FeedFilter = "all" | "open" | "matched";

export default function HelpANeighbourPage() {
  const [requests, setRequests] = useState<HelpRequest[]>(seedRequests);
  const [filter, setFilter] = useState<FeedFilter>("open");
  const [showComposer, setShowComposer] = useState(false);
  const [lastMatchedId, setLastMatchedId] = useState<string | null>(null);
  const [formArea, setFormArea] = useState("Toa Payoh");
  const [formType, setFormType] = useState<HelpType>("Errand");
  const [formTitle, setFormTitle] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formWindow, setFormWindow] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as HelpRequest[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRequests(parsed);
      }
    } catch {
      setRequests(seedRequests);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((request) => request.status === filter);
  }, [filter, requests]);

  const addRequest = () => {
    if (!formTitle.trim() || !formDetails.trim() || !formWindow.trim()) {
      return;
    }

    const next: HelpRequest = {
      id: `req-${Date.now()}`,
      area: formArea.trim(),
      type: formType,
      title: formTitle.trim(),
      details: formDetails.trim(),
      window: formWindow.trim(),
      postedMinutesAgo: 0,
      status: "open",
    };

    setRequests((prev) => [next, ...prev]);
    setShowComposer(false);
    setFormTitle("");
    setFormDetails("");
    setFormWindow("");
    setFilter("open");
  };

  const matchRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "matched" } : request
      )
    );
    setLastMatchedId(id);
    window.setTimeout(() => setLastMatchedId(null), 1300);
  };

  const openCount = requests.filter((request) => request.status === "open").length;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Neighbour support board</p>
        <h1 className={styles.title}>Ask neighbours nearby for help.</h1>
        <p className={styles.lede}>
          Share what you need and a neighbour can step in.
        </p>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => setShowComposer((state) => !state)}
        >
          {showComposer ? "Close request form" : "Post a request"}
        </button>
      </section>

      <section className={styles.boardSection}>
        <motion.div
          className={styles.liveStrip}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {openCount} open requests near you
        </motion.div>

        <div className={styles.boardTop}>
          <div className={styles.filters} role="tablist" aria-label="Filter requests">
            <button
              type="button"
              className={`${styles.filterChip} ${filter === "open" ? styles.activeChip : ""}`}
              onClick={() => setFilter("open")}
            >
              Open
            </button>
            <button
              type="button"
              className={`${styles.filterChip} ${filter === "matched" ? styles.activeChip : ""}`}
              onClick={() => setFilter("matched")}
            >
              Matched
            </button>
            <button
              type="button"
              className={`${styles.filterChip} ${filter === "all" ? styles.activeChip : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showComposer && (
            <motion.form
              className={styles.composer}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={(event) => {
                event.preventDefault();
                addRequest();
              }}
            >
              <h2 className={styles.composerTitle}>Post a local request</h2>
              <p className={styles.composerHint}>
                Keep it short. Avoid names, unit numbers, and phone details.
              </p>
              <div className={styles.composerGrid}>
                <label className={styles.field}>
                  Area
                  <input
                    value={formArea}
                    onChange={(event) => setFormArea(event.target.value)}
                    maxLength={32}
                  />
                </label>
                <label className={styles.field}>
                  Help type
                  <select
                    value={formType}
                    onChange={(event) => setFormType(event.target.value as HelpType)}
                  >
                    {helpTypes.map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  What do you need?
                  <input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    placeholder="Pick up groceries before 8pm"
                    maxLength={70}
                  />
                </label>
                <label className={styles.field}>
                  Short details
                  <textarea
                    value={formDetails}
                    onChange={(event) => setFormDetails(event.target.value)}
                    placeholder="Two bags, no stairs"
                    maxLength={120}
                  />
                </label>
                <label className={styles.field}>
                  Time window
                  <input
                    value={formWindow}
                    onChange={(event) => setFormWindow(event.target.value)}
                    placeholder="Today, 6:30pm to 8:00pm"
                    maxLength={48}
                  />
                </label>
              </div>
              <button type="submit" className={styles.submitButton}>
                Post on board
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className={styles.board}>
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((request, index) => (
              <motion.article
                layout
                key={request.id}
                className={`${styles.note} ${
                  request.status === "matched" ? styles.noteMatched : styles.noteOpen
                }`}
                initial={{
                  opacity: 0,
                  y: -80,
                  rotate: index % 2 === 0 ? -5 : 6,
                  scale: 0.94,
                }}
                animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <span className={styles.pin} />
                <p className={styles.noteMeta}>
                  {request.type} · {request.area}
                </p>
                <h3 className={styles.noteTitle}>{request.title}</h3>
                <p className={styles.noteDetails}>{request.details}</p>
                <p className={styles.noteWindow}>{request.window}</p>
                <p className={styles.notePosted}>
                  Posted {request.postedMinutesAgo}m ago
                </p>

                {request.status === "open" ? (
                  <button
                    type="button"
                    className={styles.helpButton}
                    onClick={() => matchRequest(request.id)}
                  >
                    I can help
                  </button>
                ) : (
                  <p className={styles.matchedLabel}>Matched by a neighbour</p>
                )}

                <AnimatePresence>
                  {lastMatchedId === request.id && (
                    <motion.div
                      className={styles.matchFlash}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                    >
                      Matched
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredRequests.length === 0 && (
          <p className={styles.emptyState}>
            No requests in this view. Switch filter or post the first request now.
          </p>
        )}
      </section>
    </main>
  );
}
