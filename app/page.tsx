"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { pocCards } from "@/lib/pocs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCardTimestamp(value: string) {
  const date = new Date(value);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()] ?? "";
  const year = date.getFullYear();
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 || 12;

  return `${day} ${month} ${year}, ${hours12}:${minutes} ${suffix}`;
}

function hashWithSeed(value: string, seed: number) {
  let hash = seed || 1;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return hash >>> 0;
}

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlSortParam = searchParams.get("sort");
  const urlSortOrder = urlSortParam === "asc" ? "asc" : "desc";
  const [query, setQuery] = useState(urlQuery);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(urlSortOrder);
  const [randomSeed, setRandomSeed] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [attrOpen, setAttrOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const attrRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setSortOrder(urlSortOrder);
  }, [urlSortOrder]);

  useEffect(() => {
    const nextQuery = query.trim();
    const currentQuery = searchParams.get("q") ?? "";
    const currentSortParam = searchParams.get("sort");
    const nextSortParam = randomSeed === 0 ? sortOrder : null;

    if (nextQuery === currentQuery && nextSortParam === currentSortParam) return;

    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextQuery) {
      nextParams.set("q", nextQuery);
    } else {
      nextParams.delete("q");
    }

    if (nextSortParam) {
      nextParams.set("sort", nextSortParam);
    } else {
      nextParams.delete("sort");
    }

    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, query, randomSeed, router, searchParams, sortOrder]);

  useEffect(() => {
    if (!attrOpen) return;
    function handleClick(e: MouseEvent) {
      if (attrRef.current && !attrRef.current.contains(e.target as Node)) {
        setAttrOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [attrOpen]);

  const quickFilters = useMemo(
    () => [
      "All",
      "Community",
      "Caregiving",
      "Mobility",
      "Accessibility",
      "Volunteering",
      "Transport",
      "Food",
      "Seniors",
      "Housing",
    ],
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
      return matchesQuery;
    });

    if (randomSeed !== 0) {
      return [...cards].sort(
        (left, right) =>
          hashWithSeed(left.slug, randomSeed) - hashWithSeed(right.slug, randomSeed),
      );
    }

    return [...cards].sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortOrder === "desc" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [query, randomSeed, sortOrder]);

  useEffect(() => {
    setVisibleCount(4);
  }, [query, randomSeed, sortOrder]);

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
  const normalizedQuery = query.trim().toLowerCase();
  const hasActiveFilters = normalizedQuery.length > 0;

  function handleTagClick(tag: string) {
    setRandomSeed(0);
    setQuery(tag);
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }

  function handleQuickFilterClick(filter: string) {
    if (filter === "All") {
      clearFilters();
      return;
    }

    setRandomSeed(0);
    setQuery(filter);
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }

  function clearFilters() {
    setRandomSeed(0);
    setQuery("");
  }

  function handleSortChange(nextSortOrder: "desc" | "asc") {
    setRandomSeed(0);
    setSortOrder(nextSortOrder);
  }

  function handleRandomize() {
    setRandomSeed(Date.now());
  }

  return (
    <main id="top" className="shell">
      <div className="topbar">
        <div className="topbar__attributions" ref={attrRef}>
          <button
            type="button"
            className="topbar__attr-btn"
            onClick={() => setAttrOpen((v) => !v)}
            aria-expanded={attrOpen}
          >
            Attributions
            <svg viewBox="0 0 10 6" aria-hidden="true" className={attrOpen ? "topbar__attr-chevron topbar__attr-chevron--open" : "topbar__attr-chevron"}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {attrOpen && (
            <div className="topbar__attr-popover" role="dialog" aria-label="Attributions">
              <p className="topbar__attr-heading">Attributions</p>
              <ul className="topbar__attr-list">
                <li>
                  <a href="https://undraw.co/illustrations" target="_blank" rel="noopener noreferrer">
                    unDraw
                  </a>
                  <span>Open-source illustrations</span>
                </li>
              </ul>
            </div>
          )}
        </div>
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
          <p className="hero__note">* Concepts are autonomously ideated and built by AI agent team</p>
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
            <div className="gallery-categories" aria-label="Filter by tag">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`gallery-category-chip ${(filter === "All" && !hasActiveFilters) || normalizedQuery === filter.toLowerCase() ? "gallery-category-chip--active" : ""}`}
                  onClick={() => handleQuickFilterClick(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="gallery-meta-row">
              <p className="gallery-count">
                {filteredCards.length} idea{filteredCards.length === 1 ? "" : "s"}
              </p>
              <div className="gallery-actions">
                {hasActiveFilters ? (
                  <button type="button" className="gallery-clear" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : null}
                <button
                  type="button"
                  className="gallery-randomize"
                  onClick={handleRandomize}
                  aria-label="Randomize visible results"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 2.75l1.18 3.32 3.32 1.18-3.32 1.18L12 11.75l-1.18-3.32-3.32-1.18 3.32-1.18L12 2.75Zm6.25 7.5.82 2.31 2.31.82-2.31.82-.82 2.3-.82-2.3-2.3-.82 2.3-.82.82-2.31ZM8.25 13.25l1.47 4.13 4.13 1.47-4.13 1.46-1.47 4.14-1.46-4.14-4.14-1.46 4.14-1.47 1.46-4.13Z"
                    />
                  </svg>
                  <span>Randomize</span>
                </button>
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
                    onChange={(event) => handleSortChange(event.target.value as "desc" | "asc")}
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>
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
                <time dateTime={card.createdAt}>{formatCardTimestamp(card.createdAt)}</time>
              </div>

              <div className="gallery-item__body">
                <h2>{card.title}</h2>
                <p>{card.summary}</p>
              </div>

              <div className="gallery-item__tags">
                {card.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="gallery-item__tag"
                    onClick={() => handleTagClick(tag)}
                    aria-label={`Filter ideas by ${tag}`}
                  >
                    {tag}
                  </button>
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
        <p>
          By{" "}
          <a
            href="https://www.linkedin.com/in/neil-c"
            target="_blank"
            rel="noopener noreferrer"
          >
            Neil C
          </a>
          {" "}· Built with Claude and Codex · 2026
        </p>
      </footer>
    </main>
  );
}
