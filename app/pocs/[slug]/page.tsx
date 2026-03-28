import Link from "next/link";
import { notFound } from "next/navigation";

import { getPocBySlug, pocCards } from "@/lib/pocs";

export function generateStaticParams() {
  return pocCards.map((card) => ({
    slug: card.slug,
  }));
}

export default async function PocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getPocBySlug(slug);

  if (!card) {
    notFound();
  }

  return (
    <main className="shell shell--detail">
      <Link href="/" className="back-link">
        Back to gallery
      </Link>

      <section className="detail-hero">
        <div className="detail-hero__heading">
          <p className="detail-hero__kicker">{card.category}</p>
          <h1>{card.title}</h1>
          <p>{card.summary}</p>
        </div>

        <div className="detail-hero__panel">
          <span>{card.status}</span>
          <h2>{card.accent}</h2>
          <p>{card.impact}</p>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="detail-card__label">Why this placeholder exists</p>
          <h2>Route-ready concept page</h2>
          <p>
            This route confirms the gallery can expand from a landing page into
            dedicated POC experiences without changing the overall design
            language.
          </p>
        </article>

        <article className="detail-card">
          <p className="detail-card__label">Next implementation step</p>
          <h2>Replace static content with a true app slice</h2>
          <p>
            The next milestone is to turn each placeholder into a real
            browser-based prototype with seeded data, persona switching, and a
            focused demo flow.
          </p>
        </article>
      </section>
    </main>
  );
}

