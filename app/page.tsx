import Link from "next/link";

import { pocCards } from "@/lib/pocs";

export default function Home() {
  return (
    <main className="shell">
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
        <div className="gallery-grid">
          {pocCards.map((card) => (
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

              <div className="gallery-item__footer">
                <p>{card.impact}</p>
                <Link href={`/pocs/${card.slug}`} className="gallery-item__link">
                  Open demo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
