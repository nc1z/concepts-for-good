"use client";

import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

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
  radius: number;
  x: number;
  y: number;
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

  const skillEntries = [...skillMap.entries()];
  const skillNodes: GraphNode[] = skillEntries.map(([skill, count], index) => {
    const theta = (Math.PI * 2 * index) / Math.max(skillEntries.length, 1);
    return {
      id: `skill-${skill}`,
      group: "skill",
      label: skill,
      color: "#224c8f",
      radius: 11 + count * 1.7,
      detail: `${count} people can help here`,
      x: 360 + Math.cos(theta) * 195,
      y: 250 + Math.sin(theta) * 145,
    };
  });

  const personNodes: GraphNode[] = people.map((person, index) => {
    const theta = (Math.PI * 2 * index) / Math.max(people.length, 1);
    return {
      id: `person-${person.name}`,
      group: "person",
      label: person.name,
      personName: person.name,
      color: person.accent,
      radius: 8 + person.level * 1.8,
      detail: `${person.role} · ${person.org}`,
      x: 360 + Math.cos(theta) * 290,
      y: 250 + Math.sin(theta) * 220,
    };
  });

  const links: GraphLink[] = people.flatMap((person) =>
    person.skills.map((skill) => ({
      source: `person-${person.name}`,
      target: `skill-${skill}`,
    })),
  );

  return { nodes: [...skillNodes, ...personNodes], links };
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
          <svg viewBox="0 0 720 500" className={styles.graphSvg} role="img" aria-label="Skills network graph">
            {graph.links.map((link) => {
              const source = graph.nodes.find((node) => node.id === link.source);
              const target = graph.nodes.find((node) => node.id === link.target);
              if (!source || !target) {
                return null;
              }

              const highlighted = selectedId && (source.id === selectedId || target.id === selectedId);
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={highlighted ? styles.linkActive : styles.link}
                />
              );
            })}

            {graph.nodes.map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <motion.circle
                  r={node.radius}
                  className={node.group === "skill" ? styles.skillNode : styles.personNode}
                  style={{ color: node.color }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setSelectedId(node.id)}
                />
                <text
                  x={node.radius + 6}
                  y={4}
                  className={node.group === "skill" ? styles.skillLabel : styles.personLabel}
                >
                  {node.label}
                </text>
              </g>
            ))}
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
