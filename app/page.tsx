import Link from "next/link";

import { pocCards } from "@/lib/pocs";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          Singapore For Good
        </div>
        <div className="hero__content">
          <div className="hero__copy">
            <p className="hero__kicker">Proof-of-concept gallery</p>
            <h1>Small civic product ideas, presented like a crafted digital lab.</h1>
            <p className="hero__lede">
              This site will showcase many focused public-good prototypes for
              Singapore. The first version starts with a clean gallery, strong
              storytelling, and demo-friendly concepts that feel credible from
              the first click.
            </p>
          </div>

          <aside className="hero__panel">
            <p className="hero__panel-label">Current build phase</p>
            <h2>Foundation before scale</h2>
            <p>
              The gallery is live as a visual shell for future POCs. Each card
              below is a placeholder route for a more complete concept page.
            </p>
            <dl className="hero__stats">
              <div>
                <dt>3</dt>
                <dd>placeholder concepts</dd>
              </div>
              <div>
                <dt>100</dt>
                <dd>ideas in local planning dataset</dd>
              </div>
              <div>
                <dt>Next.js</dt>
                <dd>shared stack for the gallery and POCs</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="gallery">
        <div className="section-heading">
          <div>
            <p className="section-heading__kicker">Featured placeholders</p>
            <h2>Three concept cards to establish the visual system.</h2>
          </div>
          <p className="section-heading__body">
            White surfaces, disciplined blue accents, and dense but readable
            information design inspired by public-sector products and developer
            portfolios.
          </p>
        </div>

        <div className="card-grid">
          {pocCards.map((card) => (
            <article key={card.slug} className="poc-card">
              <div className="poc-card__meta">
                <span>{card.category}</span>
                <span>{card.status}</span>
              </div>
              <div className="poc-card__body">
                <div>
                  <p className="poc-card__accent">{card.accent}</p>
                  <h3>{card.title}</h3>
                </div>
                <p>{card.summary}</p>
              </div>
              <div className="poc-card__footer">
                <p>{card.impact}</p>
                <Link href={`/pocs/${card.slug}`} className="poc-card__link">
                  Open placeholder
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

