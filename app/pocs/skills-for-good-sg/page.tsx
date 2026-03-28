"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Fraunces, Manrope } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

import { people } from "./data";
import styles from "./page.module.css";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

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
  val: number;
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
    val: 5 + count * 1.4,
    detail: `${count} people can help here`,
  }));

  const personNodes: GraphNode[] = people.map((person) => ({
    id: `person-${person.name}`,
    group: "person",
    label: person.name,
    personName: person.name,
    color: person.accent,
    val: 4 + person.level,
    detail: `${person.role} · ${person.org}`,
  }));

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
  const [size, setSize] = useState({ width: 1200, height: 720 });

  useEffect(() => {
    const syncSize = () => {
      setSize({
        width: Math.max(320, Math.min(window.innerWidth - 32, 1240)),
        height: Math.max(520, Math.min(window.innerHeight - 220, 760)),
      });
    };

    syncSize();
    window.addEventListener("resize", syncSize);
    return () => window.removeEventListener("resize", syncSize);
  }, []);

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
          <ForceGraph2D
            width={size.width}
            height={size.height}
            graphData={graph}
            nodeLabel={(node) => `${node.label}`}
            backgroundColor="transparent"
            cooldownTicks={90}
            linkColor={() => "rgba(84, 108, 136, 0.22)"}
            linkWidth={(link) =>
              selectedId &&
              ((typeof link.source === "object" && "id" in link.source && link.source.id === selectedId) ||
                (typeof link.target === "object" && "id" in link.target && link.target.id === selectedId))
                ? 2.2
                : 1
            }
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label as string;
              const fontSize = (node.group === "skill" ? 16 : 12) / globalScale;
              ctx.beginPath();
              ctx.fillStyle = node.color as string;
              ctx.arc(node.x ?? 0, node.y ?? 0, (node.val as number) * 1.8, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.font = `${fontSize}px Inter, sans-serif`;
              ctx.fillStyle = node.group === "skill" ? "#16304d" : "#45596e";
              ctx.fillText(label, (node.x ?? 0) + (node.val as number) * 2.4, (node.y ?? 0) + 4);
            }}
            onNodeClick={(node) => setSelectedId(node.id as string)}
          />

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
