"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { filterOptions, personas, places, type PersonaId } from "./data";
import styles from "./free-meal-map-sg.module.css";

type SavedState = {
  personaId: PersonaId;
  filter: string;
  search: string;
  selectedPlaceId: string;
  savedPlaceIds: string[];
  checklistByPlace: Record<string, boolean[]>;
  notesByPlace: Record<string, string[]>;
};

const STORAGE_KEY = "cfg-free-meal-map-sg-v2";

function getChecklist(personaId: PersonaId) {
  if (personaId === "resident") {
    return ["Check opening hours", "Save this stop", "Share with someone nearby"];
  }

  if (personaId === "volunteer") {
    return ["Check stock level", "Mark what is low", "Plan a quick refill visit"];
  }

  return ["Save for route planning", "Review access notes", "Follow up later today"];
}

export default function FreeMealMapPage() {
  const [personaId, setPersonaId] = useState<PersonaId>("resident");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0].id);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const [checklistByPlace, setChecklistByPlace] = useState<Record<string, boolean[]>>(
    {},
  );
  const [notesByPlace, setNotesByPlace] = useState<Record<string, string[]>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedState;
        setPersonaId(parsed.personaId);
        setFilter(parsed.filter);
        setSearch(parsed.search);
        setSelectedPlaceId(parsed.selectedPlaceId);
        setSavedPlaceIds(parsed.savedPlaceIds);
        setChecklistByPlace(parsed.checklistByPlace);
        setNotesByPlace(parsed.notesByPlace);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const payload: SavedState = {
      personaId,
      filter,
      search,
      selectedPlaceId,
      savedPlaceIds,
      checklistByPlace,
      notesByPlace,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    checklistByPlace,
    filter,
    hydrated,
    notesByPlace,
    personaId,
    savedPlaceIds,
    search,
    selectedPlaceId,
  ]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesFilter = filter === "All" || place.kind === filter;
      const matchesSearch =
        !query ||
        [
          place.name,
          place.area,
          place.address,
          place.summary,
          place.stock,
          place.nextStep,
          ...place.tags,
        ].some((item) => item.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  useEffect(() => {
    if (!filteredPlaces.find((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(filteredPlaces[0]?.id ?? places[0].id);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const selectedPlace =
    filteredPlaces.find((place) => place.id === selectedPlaceId) ??
    places.find((place) => place.id === selectedPlaceId) ??
    places[0];

  const persona = personas.find((entry) => entry.id === personaId) ?? personas[0];
  const checklistTemplate = getChecklist(personaId);
  const checklist = checklistByPlace[selectedPlace.id] ?? checklistTemplate.map(() => false);
  const notes = notesByPlace[selectedPlace.id] ?? [];

  function toggleSaved(placeId: string) {
    setSavedPlaceIds((current) =>
      current.includes(placeId)
        ? current.filter((item) => item !== placeId)
        : [placeId, ...current],
    );
  }

  function toggleChecklist(index: number) {
    setChecklistByPlace((current) => {
      const existing = current[selectedPlace.id] ?? checklistTemplate.map(() => false);
      const next = existing.map((value, itemIndex) =>
        itemIndex === index ? !value : value,
      );

      return {
        ...current,
        [selectedPlace.id]: next,
      };
    });
  }

  function addNote() {
    const trimmed = noteDraft.trim();

    if (!trimmed) {
      return;
    }

    setNotesByPlace((current) => ({
      ...current,
      [selectedPlace.id]: [`Just now — ${trimmed}`, ...(current[selectedPlace.id] ?? [])],
    }));
    setNoteDraft("");
  }

  function resetDemo() {
    setPersonaId("resident");
    setFilter("All");
    setSearch("");
    setSelectedPlaceId(places[0].id);
    setSavedPlaceIds([]);
    setChecklistByPlace({});
    setNotesByPlace({});
    setNoteDraft("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topline}>
        <Link href="/" className={styles.backLink}>
          Back to gallery
        </Link>
        <button type="button" className={styles.resetLink} onClick={resetDemo}>
          Reset map state
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Free Meal Map SG</p>
          <h1>Explore meal support in a calmer, more local way.</h1>
        </div>
        <p className={styles.lede}>
          This prototype is map-led rather than directory-led. Start from the
          neighbourhood, then move into details, notes, and revisit plans.
        </p>
      </section>

      <section className={styles.controls}>
        <div className={styles.personaRow}>
          {personas.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`${styles.personaButton} ${
                personaId === entry.id ? styles.personaButtonActive : ""
              }`}
              onClick={() => setPersonaId(entry.id)}
            >
              <strong>{entry.name}</strong>
              <span>{entry.focus}</span>
            </button>
          ))}
        </div>

        <div className={styles.searchRow}>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by area, kind, or hint"
            className={styles.searchInput}
          />
          <div className={styles.filterRow}>
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.filterButton} ${
                  option === filter ? styles.filterButtonActive : ""
                }`}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.mapStage}>
          <div className={styles.mapHeader}>
            <div>
              <p>Map explorer</p>
              <h2>{persona.helper}</h2>
            </div>
            <span>{filteredPlaces.length} visible stops</span>
          </div>

          <div className={styles.mapCanvas}>
            <svg
              className={styles.mapOutline}
              viewBox="0 0 800 420"
              aria-hidden="true"
            >
              <path
                d="M124 146C170 108 216 84 276 72c82-16 135 2 200 18 64 16 126 44 162 95 37 53 28 114-3 152-28 34-69 56-111 70-86 28-169 22-254 5-70-13-136-44-173-98-31-46-31-110 3-164 25-39 78-57 176-80"
                pathLength="1"
              />
              <path
                d="M587 285c40 8 92 40 142 70"
                pathLength="1"
              />
            </svg>

            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={`${styles.hotspot} ${
                  place.id === selectedPlace.id ? styles.hotspotActive : ""
                }`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                onClick={() => setSelectedPlaceId(place.id)}
              >
                <span>{place.area}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.listRail}>
          <p>Visible places</p>
          <div className={styles.placeList}>
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={`${styles.placeRow} ${
                  selectedPlace.id === place.id ? styles.placeRowActive : ""
                }`}
                onClick={() => setSelectedPlaceId(place.id)}
              >
                <strong>{place.name}</strong>
                <span>
                  {place.kind} · {place.area}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={selectedPlace.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={styles.drawer}
        >
          <div className={styles.drawerLead}>
            <div>
              <p>{selectedPlace.kind}</p>
              <h2>{selectedPlace.name}</h2>
            </div>
            <button
              type="button"
              className={styles.saveButton}
              onClick={() => toggleSaved(selectedPlace.id)}
            >
              {savedPlaceIds.includes(selectedPlace.id) ? "Saved" : "Save stop"}
            </button>
          </div>

          <div className={styles.drawerMeta}>
            <span>{selectedPlace.area}</span>
            <span>{selectedPlace.hours}</span>
            <span>{selectedPlace.updated}</span>
          </div>

          <div className={styles.drawerGrid}>
            <div className={styles.storyCol}>
              <p>{selectedPlace.summary}</p>
              <ul className={styles.detailList}>
                <li>{selectedPlace.address}</li>
                <li>{selectedPlace.stock}</li>
                <li>{selectedPlace.nextStep}</li>
                <li>{selectedPlace.contact}</li>
              </ul>
            </div>

            <div className={styles.checklistCol}>
              <h3>Visit checklist</h3>
              <div className={styles.checklist}>
                {checklistTemplate.map((item, index) => (
                  <label key={item} className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={Boolean(checklist[index])}
                      onChange={() => toggleChecklist(index)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.notesCol}>
              <h3>Quick note</h3>
              <div className={styles.noteComposer}>
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Add a visit update or reminder"
                />
                <button type="button" onClick={addNote}>
                  Add note
                </button>
              </div>
              <div className={styles.notesFeed}>
                {notes.length ? (
                  notes.map((note) => <p key={note}>{note}</p>)
                ) : (
                  <p>No notes yet for this stop.</p>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
