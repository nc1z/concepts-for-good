"use client";

import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import { useMemo, useState } from "react";

import { people } from "./data";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

type GraphNode = {
  id: string;
  group: "skill" | "person";
  label: string;
  detail?: string;
  color: string;
  personName?: string;
};

type GraphLink = {
  source: string;
  target: string;
};

function buildGraph() {
  const skillMap = new Map<string, number>();
  people.forEach((person) => {
    person.skills.forEach((skill) => {
      skillMap.set(skill, (skillMap.get(skill) ?? 0) + 1);
    });
  });

  const skillNodes: GraphNode[] = [...skillMap.entries()].map(([skill, count]) => ({
    id: `skill-${skill}`,
    group: "skill",
    label: skill,
    color: "#224c8f",
    detail: `${count} people can help here`,
  }));

  const personNodes: GraphNode[] = people.map((person) => ({
    id: `person-${person.name}`,
    group: "person",
    label: person.name,
    personName: person.name,
    color: person.accent,
    detail: `${person.role} · ${person.org}`,
  }));

  const links: GraphLink[] = people.flatMap((person) =>
    person.skills.map((skill) => ({
      source: `person-${person.name}`,
      target: `skill-${skill}`,
    })),
  );

  const nodes = [...skillNodes, ...personNodes];
  const positions = new Map<string, { x: number; y: number }>();
  const center = { x: 430, y: 320 };

  skillNodes.forEach((node, index) => {
    const angle = (index / skillNodes.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: center.x + Math.cos(angle) * 170,
      y: center.y + Math.sin(angle) * 170,
    });
  });

  personNodes.forEach((node, index) => {
    const angle = (index / personNodes.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: center.x + Math.cos(angle) * 290,
      y: center.y + Math.sin(angle) * 290,
    });
  });

  return { nodes, links, positions };
}

export default function SkillsForGoodPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const graph = useMemo(() => buildGraph(), []);

  const selected = graph.nodes.find((node) => node.id === selectedId) ?? null;

  const selectedPerson =
    selected?.group === "person"
      ? people.find((person) => `person-${person.name}` === selected.id) ?? null
      : null;

  return (
    <main className={`${styles.page} ${fraunces.variable} ${manrope.variable}`}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>
            ← Back to gallery
          </Link>
          <p className={styles.topHint}>Tap a skill or a person to follow the connections.</p>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>Skills for Good</p>
          <h1>Follow the network and see who can help.</h1>
          <p className={styles.lede}>
            Start with a skill or a person and let the map pull the nearest matches into view.
          </p>
        </section>

        <section className={styles.graphStage}>
          <svg viewBox="0 0 860 640" className={styles.graphSvg} role="img" aria-label="Skills network graph">
            {graph.links.map((link) => {
              const source = graph.positions.get(link.source);
              const target = graph.positions.get(link.target);
              if (!source || !target) return null;

              const highlighted = selectedId && (selectedId === link.source || selectedId === link.target);
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={highlighted ? "rgba(33, 74, 128, 0.65)" : "rgba(84, 108, 136, 0.22)"}
                  strokeWidth={highlighted ? 2.2 : 1}
                />
              );
            })}

            {graph.nodes.map((node) => {
              const point = graph.positions.get(node.id);
              if (!point) return null;
              const selectedNode = selectedId === node.id;
              const radius = node.group === "skill" ? 17 : 12;

              return (
                <g
                  key={node.id}
                  transform={`translate(${point.x}, ${point.y})`}
                  className={styles.graphNode}
                  onClick={() => setSelectedId(node.id)}
                >
                  <circle
                    r={selectedNode ? radius + 3 : radius}
                    fill={node.color}
                    stroke={selectedNode ? "#10263f" : "transparent"}
                    strokeWidth={selectedNode ? 2 : 0}
                  />
                  <text x={radius + 7} y={4} className={node.group === "skill" ? styles.skillLabel : styles.personLabel}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className={styles.graphFrame} aria-hidden="true" />
        </section>

        <section className={styles.readout}>
          {selected ? (
            <>
              <p className={styles.readoutLabel}>{selected.group === "skill" ? "Skill focus" : "Person focus"}</p>
              <h2>{selected.label}</h2>
              <p className={styles.readoutMeta}>{selected.detail}</p>
              {selectedPerson ? (
                <>
                  <p className={styles.readoutNote}>{selectedPerson.note}</p>
                  <div className={styles.readoutRow}>
                    {selectedPerson.availability.map((slot) => (
                      <span key={slot}>{slot}</span>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <>
              <p className={styles.readoutLabel}>Start here</p>
              <h2>Pick any node on the map.</h2>
              <p className={styles.readoutMeta}>The network will show which people gather around each skill.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

