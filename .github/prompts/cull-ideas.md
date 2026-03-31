# Cull Ideas

Perform a strict quality filter on `ideas/GOOD_SG.json`. Remove the weakest unbuilt ideas until the file reaches the target count. Never remove an idea that is built (`built: true`) or has a directory under `app/pocs/`.

## How to run

Tell me the target number, e.g.:

> "Cull ideas down to 60"
> "Filter ideas to 50, remove the weakest ones"
> "Cut ideas to 70 — keep only the most distinctive"

If no number is given, default to removing ~20% of current unbuilt ideas.

---

## What counts as a bad idea (remove these first)

Work through these in order — the earlier the category, the stronger the signal to cut.

### 1. Duplicate of a built POC
The concept is already shipped. Remove it.

- **Keep:** `Rent Split Planner` (built)
- **Cut:** `Bills Due Map` — same cost-of-living budget breakdown, no new angle

### 2. Generic utility with no SG angle
Could exist anywhere. Has no Singapore-specific context, community, or public-good hook.

- **Cut:** `Water Reminder` — basic hydration nudge, identical to a thousand iOS apps
- **Cut:** `Shared Chore Rhythm` — generic household task manager, not a public-good concept
- **Keep:** `ComCare Renewal Calendar` — deadline pressure is specific to Singapore's welfare system

### 3. Near-duplicate of another idea in the same file
Two ideas doing essentially the same job for the same user.

- **Cut:** `Swap Errands with Neighbours` — covered by `Neighbour Help Request`
- **Cut:** `Cook for a Neighbour` — covered by `Community Cooking Circle` (built)
- **Cut:** `Pantry Meal Rescue` — same user, same job as `Leftover Lunch Planner`

### 4. Niche is over-represented
When a category has 5+ ideas, keep only the most distinctive. Cut the rest.

- Housing had 8 ideas → kept `HDB Move Checklist`, `Corridor Garden Schedule` (distinctive formats), cut 6 trivial admin entries
- School support had 7 → kept `Parent Teacher Prep`, `After School Meal Map`, `School Supplies Pool`, cut 4 logistics/niche ones
- Migrant worker / inclusion had 5 → kept `Migrant Worker Wellbeing Check`, `Support for Domestic Workers`, cut 3 overlaps

### 5. Trivially narrow
The use case is so specific it barely qualifies as a public-good concept. Very few people would ever encounter it.

- **Cut:** `Wheelchair Car Transfer` — addresses one exact physical transfer scenario
- **Cut:** `Nursing Room` — single-amenity finder, no broader value
- **Cut:** `Playground Shade Guide` — shade timing at playgrounds

### 6. Low social impact / hobby
More of a pastime or nice-to-have than a genuine public-good tool.

- **Cut:** `Pollinator Spotter` — hobby logging, no direct community benefit
- **Cut:** `Tea Meetup Board` — social triviality
- **Cut:** `Calmer MRT Tips` — personal note-saving, no impact

---

## What to always keep

- Any idea with `built: true` or a directory in `app/pocs/` — never touch these
- Ideas that address **urgent or underserved needs**: legal aid, domestic worker rights, caregiver burnout, dementia care, flood/dengue preparedness, scam awareness, escape planning (safety from violence)
- Ideas with a **visually distinctive format** that no other idea in the file shares — even if low-reach, these are valuable for the design diversity mandate
- Ideas that are **Singapore-specific** in a way that can't be replicated elsewhere: HDB systems, hawker culture, town council processes, NEA/CDC schemes

---

## Process

1. Read `ideas/GOOD_SG.json` fully — note total count, built count, category distribution
2. List all built ideas (via `built: true` AND directories in `app/pocs/`) — these are off-limits
3. Group remaining unbuilt ideas by category
4. Apply the removal criteria above, starting from category 1
5. Propose the removal list to the user **before editing** — show ID, title, and one-line reason
6. After approval, remove them from the JSON array and update `idea_count`
7. Verify: `jq '.ideas | length'` matches the target

---

## After culling

Check for any ideas that have a directory in `app/pocs/` but `built: null` — update those to `built: true`.
