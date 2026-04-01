"use client";

import Link from "next/link";
import { Public_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Radio, RadioGroup } from "react-aria-components";
import { useMemo, useState } from "react";

import { packingItems, visitTypes } from "./data";
import styles from "./page.module.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

function DraggableItem({
  id,
  title,
  detail,
  packed,
  onQuickPack,
}: {
  id: string;
  title: string;
  detail: string;
  packed: boolean;
  onQuickPack: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: packed,
  });

  return (
    <article
      ref={setNodeRef}
      className={`${styles.itemCard} ${packed ? styles.itemCardPacked : ""} ${isDragging ? styles.itemDragging : ""}`}
      style={
        transform
          ? ({
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(-1deg)`,
            } as React.CSSProperties)
          : undefined
      }
      {...attributes}
      {...listeners}
    >
      <h3>{title}</h3>
      <p>{detail}</p>
      <button type="button" onClick={onQuickPack} disabled={packed} className={styles.secondaryAction}>
        {packed ? "Packed" : "Pack this"}
      </button>
    </article>
  );
}

export default function WhatToBringClinicPage() {
  const [visitTypeId, setVisitTypeId] = useState(visitTypes[0].id);
  const [packedIds, setPackedIds] = useState<string[]>([]);

  const visitType = useMemo(
    () => visitTypes.find((item) => item.id === visitTypeId) ?? visitTypes[0],
    [visitTypeId],
  );

  const scopedItems = useMemo(
    () => packingItems.filter((item) => item.requiredFor.includes(visitTypeId)),
    [visitTypeId],
  );

  const requiredIds = scopedItems.map((item) => item.id);
  const packedRequiredCount = requiredIds.filter((id) => packedIds.includes(id)).length;
  const isReady = packedRequiredCount === requiredIds.length && requiredIds.length > 0;

  const { setNodeRef: setBagRailRef, isOver } = useDroppable({
    id: "bag-rail",
  });

  const onPack = (itemId: string) => {
    setPackedIds((current) => (current.includes(itemId) ? current : [...current, itemId]));
  };

  const onUnpack = (itemId: string) => {
    setPackedIds((current) => current.filter((id) => id !== itemId));
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.over?.id === "bag-rail") {
      onPack(String(event.active.id));
    }
  };

  return (
    <main className={`${styles.page} ${publicSans.variable} ${fraunces.variable} ${mono.variable}`}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <p className={styles.sessionLabel}>Clinic prep board</p>
      </header>

      <section className={styles.firstScreen}>
        <p className={styles.eyebrow}>For seniors and caregivers</p>
        <h1>Pack what you need before leaving for the clinic.</h1>
        <p className={styles.lede}>Start by picking today&apos;s visit type, then move each required item into the bag rail.</p>
      </section>

      <section className={styles.visitTypeSection}>
        <RadioGroup
          aria-label="Visit type"
          value={visitTypeId}
          onChange={(value) => {
            setVisitTypeId(value);
            setPackedIds([]);
          }}
          className={styles.visitTypeGroup}
        >
          {visitTypes.map((option) => (
            <Radio key={option.id} value={option.id} className={styles.visitTypeOption}>
              <div>
                <strong>{option.label}</strong>
                <p>{option.hint}</p>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </section>

      <DndContext onDragEnd={onDragEnd}>
        <section className={styles.board}>
          <p className={styles.gridBreakNote}>Drag cards into the bag rail to clear the checklist</p>

          <div className={styles.trayArea}>
            <AnimatePresence mode="wait">
              {isReady ? (
                <motion.article
                  key="ready"
                  className={styles.leaveStrip}
                  initial={{ y: 18, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <p className={styles.leaveLabel}>Ready to leave</p>
                  <div className={styles.leaveDetails}>
                    <div>
                      <span>Time</span>
                      <strong>{visitType.clinicTime}</strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>{visitType.paymentNote}</strong>
                    </div>
                    <div>
                      <span>Medicine note</span>
                      <strong>{visitType.medicineNote}</strong>
                    </div>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="tray"
                  className={styles.trayGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {scopedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <DraggableItem
                        id={item.id}
                        title={item.label}
                        detail={item.detail}
                        packed={packedIds.includes(item.id)}
                        onQuickPack={() => onPack(item.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside ref={setBagRailRef} className={`${styles.bagRail} ${isOver ? styles.bagRailActive : ""}`}>
            <p className={styles.bagLabel}>Bag rail</p>
            <p className={styles.progressText}>
              {packedRequiredCount}/{requiredIds.length} required items packed
            </p>
            <div className={styles.progressTrack} aria-hidden="true">
              <motion.div
                className={styles.progressFill}
                initial={{ width: "0%" }}
                animate={{ width: `${(packedRequiredCount / Math.max(requiredIds.length, 1)) * 100}%` }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </div>

            <ul className={styles.packedList}>
              {scopedItems.map((item) => {
                const packed = packedIds.includes(item.id);
                return (
                  <li key={item.id} className={packed ? styles.packedRow : styles.unpackedRow}>
                    <span>{item.label}</span>
                    {packed ? (
                      <button type="button" className={styles.inlineAction} onClick={() => onUnpack(item.id)}>
                        Remove
                      </button>
                    ) : (
                      <button type="button" className={styles.inlineAction} onClick={() => onPack(item.id)}>
                        Pack
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>
      </DndContext>
    </main>
  );
}

