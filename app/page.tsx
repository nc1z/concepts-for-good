import Link from "next/link";

import { pocCards } from "@/lib/pocs";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          SG Concepts for Good
        </div>
        <div className="hero__copy">
          <h1>Simple digital ideas that support everyday life in Singapore.</h1>
          <p className="hero__lede">
            Explore early concepts for community care, food support, and easier
            access to helpful services.
          </p>
        </div>
      </section>

      <section className="gallery">
        <div className="card-grid">
          {pocCards.map((card) => (
            <article key={card.slug} className="poc-card">
              <div className="poc-card__meta">{card.category}</div>
              <div className="poc-card__body">
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
              </div>
              <div className="poc-card__footer">
                <p>{card.impact}</p>
                <Link href={`/pocs/${card.slug}`} className="poc-card__link">
                  Learn more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
