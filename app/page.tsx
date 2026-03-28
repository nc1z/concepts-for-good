"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { pocCards } from "@/lib/pocs";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [visibleCount, setVisibleCount] = useState(4);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const categories = useMemo(
    () => ["All", ...new Set(pocCards.map((card) => card.category))],
    [],
  );

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const cards = pocCards.filter((card) => {
      const matchesQuery =
        !normalized ||
        [
          card.title,
          card.category,
          card.summary,
          card.impact,
          ...card.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      const matchesCategory =
        activeCategory === "All" || card.category === activeCategory;

      return matchesQuery && matchesCategory;
    });

    return [...cards].sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortOrder === "desc" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [activeCategory, query, sortOrder]);

  useEffect(() => {
    setVisibleCount(4);
  }, [activeCategory, query, sortOrder]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setVisibleCount((current) =>
          Math.min(current + 3, filteredCards.length),
        );
      },
      {
        rootMargin: "220px 0px",
      },
    );

    const node = sentinelRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, [filteredCards.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 700);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isSearchShortcut) return;

      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const visibleCards = filteredCards.slice(0, visibleCount);

  return (
    <main id="top" className="shell">
      <div className="topbar">
        <a
          href="https://github.com/nc1z/concepts-for-good"
          target="_blank"
          rel="noreferrer"
          aria-label="View project on GitHub"
          className="topbar__github"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.33 1.12 2.9.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.06A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.34 2.75-1.06 2.75-1.06.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.77 0 3.96-2.34 4.82-4.57 5.08.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
            />
          </svg>
        </a>
      </div>

      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          SG Concepts for Good
        </div>
        <div className="hero__copy">
          <h1>Simple digital ideas that support everyday life in Singapore.</h1>
          <p className="hero__lede">
            Explore rapid prototypes and proof of concepts made possible with AI.
          </p>
          <p className="hero__note">* These concepts are agentically generated.</p>
        </div>
      </section>

      <section className="gallery">
        <div className="gallery-controls">
          <label className="gallery-search" htmlFor="gallery-search">
            <span className="gallery-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.43 1.04-1.04-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              id="gallery-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic, use case, or audience"
            />
            <span className="gallery-search__hint" aria-hidden="true">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </span>
          </label>
          <div className="gallery-toolbar">
            <div className="gallery-categories" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`gallery-category-chip ${activeCategory === category ? "gallery-category-chip--active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="gallery-meta-row">
              <p className="gallery-count">
                {filteredCards.length} idea{filteredCards.length === 1 ? "" : "s"}
              </p>
              <label className="gallery-sort" htmlFor="gallery-sort">
                <span className="gallery-sort__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M7 4h10v2H7V4Zm3 7h7v2h-7v-2Zm4 7h3v2h-3v-2Z"
                    />
                  </svg>
                </span>
                <select
                  id="gallery-sort"
                  aria-label="Sort ideas"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as "desc" | "asc")}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="gallery-grid">
          {visibleCards.map((card) => (
            <article
              key={card.slug}
              className={`gallery-item gallery-item--${card.theme}`}
            >
              <div className="gallery-item__topline">
                <span>{card.category}</span>
              </div>

              <div className="gallery-item__body">
                <h2>{card.title}</h2>
                <p>{card.summary}</p>
              </div>

              <div className="gallery-item__tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="gallery-item__footer">
                <p>{card.impact}</p>
                <Link
                  href={`/pocs/${card.slug}`}
                  className="gallery-item__link"
                  aria-label={`Open ${card.title} demo`}
                >
                  <span>View</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7.5 12.75h7.19l-2.97 2.97 1.06 1.06 4.78-4.78-4.78-4.78-1.06 1.06 2.97 2.97H7.5v1.5Z"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredCards.length === 0 ? (
          <p className="gallery-empty">
            No ideas match that search yet. Try a broader word or topic.
          </p>
        ) : null}

        <div ref={sentinelRef} className="gallery-sentinel" aria-hidden="true" />
      </section>

      {showBackToTop ? (
        <a href="#top" className="back-to-top">
          Back to top
        </a>
      ) : null}

      <footer className="site-footer">
        <p>SG Concepts for Good</p>
        <p>Built with Claude and Codex | 2026</p>
      </footer>
    </main>
  );
}
