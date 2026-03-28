"use client";

import { useEffect, useMemo, useState } from "react";

import {
  filterOptions,
  personas,
  places,
  type MealSupportPlace,
  type PersonaId,
} from "./data";
import styles from "./free-meal-map-sg.module.css";

type UpdateRecord = {
  note: string;
  postedAt: string;
  label: string;
};

type SavedState = {
  personaId: PersonaId;
  selectedPlaceId: string;
  savedPlaceIds: string[];
  checklistByPlace: Record<string, boolean[]>;
  updatesByPlace: Record<string, UpdateRecord[]>;
};

const STORAGE_KEY = "cfg-free-meal-map-sg";

function getDefaultChecklist(place: MealSupportPlace, personaId: PersonaId) {
  const base =
    personaId === "resident"
      ? ["Check opening hours", "Save to my plan", "Share with family"]
      : personaId === "volunteer"
        ? ["Confirm stock", "Add a visit note", "Mark refill needed"]
        : ["Review location", "Plan route", "Follow up later today"];

  return base.map((label, index) => ({
    label,
    done: index === 0 && place.kind === "Community fridge",
  }));
}

export default function FreeMealMapPage() {
  const [personaId, setPersonaId] = useState<PersonaId>("resident");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0].id);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const [checklistByPlace, setChecklistByPlace] = useState<
    Record<string, boolean[]>
  >({});
  const [updatesByPlace, setUpdatesByPlace] = useState<
    Record<string, UpdateRecord[]>
  >({});
  const [updateDraft, setUpdateDraft] = useState("");
  const [updateTone, setUpdateTone] = useState("Checked in");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored) as Partial<SavedState>;
      if (parsed.personaId) setPersonaId(parsed.personaId);
      if (parsed.selectedPlaceId) setSelectedPlaceId(parsed.selectedPlaceId);
      if (parsed.savedPlaceIds) setSavedPlaceIds(parsed.savedPlaceIds);
      if (parsed.checklistByPlace) setChecklistByPlace(parsed.checklistByPlace);
      if (parsed.updatesByPlace) setUpdatesByPlace(parsed.updatesByPlace);
    } catch {
      // Ignore malformed local state and fall back to defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const payload: SavedState = {
      personaId,
      selectedPlaceId,
      savedPlaceIds,
      checklistByPlace,
      updatesByPlace,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    checklistByPlace,
    hydrated,
    personaId,
    savedPlaceIds,
    selectedPlaceId,
    updatesByPlace,
  ]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        !query ||
        [place.name, place.kind, place.area, place.address, place.summary]
          .concat(place.tags)
          .some((value) => value.toLowerCase().includes(query));

      const matchesFilter =
        selectedFilter === "All" ||
        (selectedFilter === "Open now"
          ? place.tags.includes("Open now")
          : place.kind === selectedFilter);

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter]);

  useEffect(() => {
    if (!filteredPlaces.length) return;

    const stillVisible = filteredPlaces.some(
      (place) => place.id === selectedPlaceId,
    );

    if (!stillVisible) {
      setSelectedPlaceId(filteredPlaces[0].id);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const selectedPlace =
    filteredPlaces.find((place) => place.id === selectedPlaceId) ??
    places.find((place) => place.id === selectedPlaceId) ??
    filteredPlaces[0] ??
    places[0];

  const persona = personas.find((entry) => entry.id === personaId) ?? personas[0];

  const checklist = checklistByPlace[selectedPlace.id] ?? [];
  const updates = updatesByPlace[selectedPlace.id] ?? [];

  const checklistTemplate = useMemo(
    () => getDefaultChecklist(selectedPlace, personaId),
    [personaId, selectedPlace],
  );

  const toggleChecklistItem = (index: number) => {
    setChecklistByPlace((current) => {
      const existing = current[selectedPlace.id] ?? checklistTemplate.map((item) => item.done);
      const next = existing.map((value, itemIndex) =>
        itemIndex === index ? !value : value,
      );

      return { ...current, [selectedPlace.id]: next };
    });
  };

  const toggleSavedPlace = () => {
    setSavedPlaceIds((current) =>
      current.includes(selectedPlace.id)
        ? current.filter((id) => id !== selectedPlace.id)
        : [selectedPlace.id, ...current],
    );
  };

  const submitUpdate = () => {
    if (!updateDraft.trim()) return;

    const record: UpdateRecord = {
      note: updateDraft.trim(),
      postedAt: "Just now",
      label: updateTone,
    };

    setUpdatesByPlace((current) => ({
      ...current,
      [selectedPlace.id]: [record, ...(current[selectedPlace.id] ?? [])],
    }));
    setUpdateDraft("");
  };

  const resetDemo = () => {
    setSavedPlaceIds([]);
    setChecklistByPlace({});
    setUpdatesByPlace({});
    setPersonaId("resident");
    setSelectedFilter("All");
    setSearch("");
    setSelectedPlaceId(places[0].id);
    setUpdateDraft("");
    setUpdateTone("Checked in");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>SG Concepts for Good</p>
          <h1>Free Meal Map SG</h1>
          <p className={styles.lede}>
            Find meal support points and community fridges across Singapore in
            one calm, browser-only directory.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <div>
            <span className={styles.heroPanelLabel}>Current view</span>
            <strong>{persona.name}</strong>
            <p>{persona.focus}</p>
          </div>
          <button type="button" className={styles.resetButton} onClick={resetDemo}>
            Reset demo state
          </button>
        </div>
      </section>

      <section className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <div className={styles.panel}>
            <p className={styles.panelLabel}>Choose a role</p>
            <div className={styles.personaList}>
              {personas.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`${styles.personaButton} ${
                    entry.id === personaId ? styles.personaButtonActive : ""
                  }`}
                  onClick={() => setPersonaId(entry.id)}
                >
                  <span>{entry.name}</span>
                  <small>{entry.role}</small>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Filters</p>
            <div className={styles.filterList}>
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.filterButton} ${
                    option === selectedFilter ? styles.filterButtonActive : ""
                  }`}
                  onClick={() => setSelectedFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Search</p>
            <label className={styles.searchField}>
              <span className={styles.srOnly}>Search locations</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by place, area, or tag"
              />
            </label>
          </div>
        </aside>

        <section className={styles.listing}>
          <div className={styles.listHeader}>
            <div>
              <p className={styles.panelLabel}>Directory</p>
              <h2>{filteredPlaces.length} places near Singapore communities</h2>
            </div>
            <p className={styles.listHint}>
              Saved plan: {savedPlaceIds.length} stop
              {savedPlaceIds.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className={styles.cardGrid}>
            {filteredPlaces.map((place) => {
              const active = place.id === selectedPlace.id;
              const saved = savedPlaceIds.includes(place.id);

              return (
                <button
                  key={place.id}
                  type="button"
                  className={`${styles.placeCard} ${
                    active ? styles.placeCardActive : ""
                  }`}
                  onClick={() => setSelectedPlaceId(place.id)}
                >
                  <div className={styles.placeCardTop}>
                    <span className={styles.kind}>{place.kind}</span>
                    {saved ? <span className={styles.savedTag}>Saved</span> : null}
                  </div>
                  <h3>{place.name}</h3>
                  <p>{place.summary}</p>
                  <div className={styles.placeMeta}>
                    <span>{place.area}</span>
                    <span>{place.hoursLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className={styles.detailPane}>
          <div className={styles.panel}>
            <p className={styles.panelLabel}>Selected place</p>
            <div className={styles.detailHeader}>
              <div>
                <h2>{selectedPlace.name}</h2>
                <p>{selectedPlace.summary}</p>
              </div>
              <button
                type="button"
                className={`${styles.saveButton} ${
                  savedPlaceIds.includes(selectedPlace.id) ? styles.saveButtonActive : ""
                }`}
                onClick={toggleSavedPlace}
              >
                {savedPlaceIds.includes(selectedPlace.id) ? "Saved to plan" : "Save to plan"}
              </button>
            </div>

            <dl className={styles.detailFacts}>
              <div>
                <dt>Area</dt>
                <dd>{selectedPlace.area}</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{selectedPlace.hours}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>{selectedPlace.contact}</dd>
              </div>
              <div>
                <dt>Stock</dt>
                <dd>{selectedPlace.stock}</dd>
              </div>
            </dl>

            <div className={styles.tagRow}>
              {selectedPlace.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Update panel</p>
            <div className={styles.updateControls}>
              <label>
                <span>Quick note</span>
                <select
                  value={updateTone}
                  onChange={(event) => setUpdateTone(event.target.value)}
                >
                  <option>Checked in</option>
                  <option>Needs refill</option>
                  <option>All clear</option>
                  <option>Route planned</option>
                </select>
              </label>
              <label className={styles.textareaField}>
                <span>Add a short update</span>
                <textarea
                  value={updateDraft}
                  onChange={(event) => setUpdateDraft(event.target.value)}
                  placeholder="Example: fridge is tidy, fruit shelf still needs support by evening."
                  rows={4}
                />
              </label>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={submitUpdate}
              >
                Submit update
              </button>
            </div>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Checklist</p>
            <div className={styles.checklist}>
              {checklistTemplate.map((item, index) => {
                const checked = checklist[index] ?? item.done;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`${styles.checklistItem} ${
                      checked ? styles.checklistItemChecked : ""
                    }`}
                    onClick={() => toggleChecklistItem(index)}
                  >
                    <span className={styles.checkmark} aria-hidden="true">
                      {checked ? "✓" : ""}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.panel}>
            <p className={styles.panelLabel}>Recent updates</p>
            <div className={styles.updateFeed}>
              {updates.length ? (
                updates.map((entry, index) => (
                  <article key={`${entry.postedAt}-${index}`} className={styles.updateItem}>
                    <span>{entry.label}</span>
                    <p>{entry.note}</p>
                    <small>{entry.postedAt}</small>
                  </article>
                ))
              ) : (
                <p className={styles.emptyState}>
                  No local updates yet. Submit a note to create one.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
