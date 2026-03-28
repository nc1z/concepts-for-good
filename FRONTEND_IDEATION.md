# Frontend Ideation Rules

This file is mandatory reading for any agent implementing UI in this repository.
**Read this file completely before writing a single line of UI code.**
You must also read `ANTIPATTERNS_CODEX.md` before writing any user-facing UI copy or helper text.

---

## The core problem this file exists to solve

Previous agents have repeatedly built the same output: a white background, a header, a filter row, and a grid of cards with title + description + button. This is not acceptable. It does not matter what the concept is — every concept gets the same generic SaaS dashboard treatment.

Another repeated failure is fake variety: one page becomes "the chart one", another becomes "the map one", another becomes "the card one", but the underlying layout rhythm and product feel stay the same. This also fails.

This is the wrong mental model. **The question is not "how do I present this data?" The question is "what kind of experience does this concept deserve?"**

---

## Hard rules — no exceptions

- **Do not build a card grid unless the concept's `ui.interaction_model` explicitly says card grid.** If you default to cards without reading the UI spec, you have failed before you started.
- **Do not repeat a layout you used in any previous POC in this repo.** Each concept must feel like it was designed for that concept specifically.
- **Do not fake novelty with a single different widget.** A chart, map, node graph, or set of chips does not make the UI unique if the surrounding page still looks like the last five POCs.
- **Do not use a sidebar + header + content body template.** This is the default Next.js dashboard shell. It is not a design. It is an absence of design.
- **Do not put builder language in the UI.** Words like "POC", "component", "scaffold", "slice", "implementation", "concept", or "generated" must never appear in the user-facing interface. Write as if this is a real product.
- **Do not leak prompt or brief language into the UI.** If a line sounds like it came from the design brief, checklist, or agent instructions, it does not belong in the product.
- **Do not use forms as the primary UI unless the concept's interaction model says form-led.** A form is an input mechanism. It is not an experience.
- **Do not skip library installation.** If the concept spec lists `framer-motion`, `recharts`, `three.js`, or any other library — install it and use it. These are not suggestions. They exist because a concept without them will be flat.
- **Do not implement before plan approval.** For any new user-facing route or major redesign, you must first draft a concrete plan covering theme, style, interaction model, and library choices, then stop and wait for explicit approval.

---

## Mandatory pre-build checklist

Before this checklist, you must complete a planning step and get approval.
Use `skills/public/frontend-plan-first/SKILL.md` whenever the task is to build or redesign a user-facing POC.

Before writing any UI code, you must answer ALL of these questions. Write down your answers in your working notes or PR description.

1. **What is the `ui.direction` for this concept?** (from `ideas/GOOD_SG.json`) Write out what this design language means visually and how it will show up in this UI.
2. **What is the `ui.interaction_model`?** Write out the specific layout and primary interaction this concept requires.
3. **What libraries does `ui.suggested_libraries` require?** Have you run `npm install` for each? If not, do it now.
4. **What is `ui.distinctive_feature`?** This is the one thing that must feel crafted. If you do not build this, the POC is not done.
5. **What is in `ui.avoid`?** Have you checked your implementation against this list? If any of these anti-patterns appear in your code, remove them.
6. **What does the first screen communicate?** Can a stranger understand the concept's point of view within 3 seconds of opening the page? If not, redesign the first screen.
7. **Is this concept's visual direction different from all other POCs already in the repo?** Check what exists. Do not reuse the same palette, layout rhythm, or animation style.

**If you cannot answer all 7 questions before building, you are not ready to build.**

## Repo quality references

When planning a new route, inspect existing POCs that already feel native to their domain rather than "a generic web app with different data".

Strong examples in this repo:
- `app/pocs/medication-reminder-sg/page.tsx` — the interaction, geometry, and tone feel like a medication product
- `app/pocs/senior-check-in-sg/page.tsx` — the streak ring system, warmth, and pacing feel built for community care

These are examples of specificity, not templates to copy.

---

## Visual direction options

Pick one and commit to it. Different concepts must use different directions.

| Direction | What it looks like | Example concepts |
|---|---|---|
| minimalist | extreme whitespace, single focal point, almost no chrome | ambient tools, quiet-place finders |
| warm civic | large friendly type, rounded forms, community colors | check-in tools, care networks, welcome packs |
| monochrome | black/white/gray only, type as texture | emergency tools, formal guides |
| brutalist | heavy borders, raw layout, bold block text | ops tools, dispatch boards |
| neo-brutalist | bold but designed, high contrast, unexpected color | youth-facing, activism, social tools |
| editorial | magazine-quality layout, reading rhythm, pull quotes | guides, stories, long-form tools |
| futuristic | dark background, glow, data-like precision | environmental monitors, health data |
| playful utility | illustrated icons, streak mechanics, celebration moments | habit trackers, games, kids-adjacent |
| calm institutional | muted palette, clear hierarchy, no clutter | health guides, legal aid, eligibility tools |
| data-dense operations | ops console feel, live data, counters, status indicators | dispatch boards, volunteer ops |
| tactile kiosk | oversized type, large tap targets, one thing per screen | senior tools, multilingual tools |
| map-first | spatial canvas is primary UI, everything else is secondary | location finders, route planners |
| timeline-first | chronological flow is the primary structure | logs, history, lifecycle tools |
| diagram-first | SVG or canvas diagram is the main interaction surface | decision trees, route diagrams, floor plans |

---

## Interaction models — pick one per concept

These are the patterns available. Your concept's `ui.interaction_model` will specify which one. **Do not default to stacked cards + filter panel.**

- **ops dispatch board** — live-feeling board with status columns, volunteer/item assignment, countdown timers
- **SVG map with zone interaction** — clickable zone map, no external map API needed
- **circular/radial visualization** — clock faces, streak rings, network diagrams, wheel charts
- **decision tree flowchart** — branching SVG with highlighted path to result
- **step wizard, one screen at a time** — one action per screen, horizontal slide transitions
- **drag-to-reorder interface** — user physically arranges items in priority order
- **live calculator** — sliders/inputs update output in real time, no submit button
- **card flip / reveal mechanic** — front and back content, 3D flip animation
- **timeline with expanding entries** — vertical or horizontal timeline as primary structure
- **game or quiz mechanic** — drag-and-drop, score, progress, win state
- **ambient sensory interface** — the UI itself demonstrates the concept (calm UI for calm concept)
- **split-screen matching** — two panels where items on each side connect to each other
- **radial explorer / node graph** — central node with branching exploration
- **floor plan / diagram** — top-down or side-view spatial diagram as primary canvas
- **route planner diagram** — animated SVG path connecting stops in sequence

---

## Library usage — required when specified

These libraries exist to make concepts distinctive. If a concept spec lists them, use them.

| Library | What it enables |
|---|---|
| `framer-motion` | Smooth animations, drag interactions, layout transitions, gesture responses |
| `recharts` | Bar charts, line charts, radar/spider charts, live-updating data visualization |
| `three.js` / `react-three-fiber` | 3D scenes, particle effects, interactive 3D objects |
| `react-hook-form` | Complex multi-step forms with validation |
| Canvas / SVG (native) | Custom diagrams, maps, floor plans, timeline drawings |

**Do not add libraries as decoration.** Add them because the concept needs the interaction they enable.
**Do not skip libraries because you are unfamiliar with them.** Look them up. The concept requires them.

---

## What good looks like — specific examples

### Example: A map-first concept
**Bad:** A page with a small map image at the top, then a list of locations as cards below.
**Good:** The map fills most of the viewport. Zones or pins are interactive SVG elements. Clicking a zone slides in a drawer with location details. The list only exists inside that drawer.

### Example: A calm / mental health concept
**Bad:** A white page with a gray header, then a grid of resource cards with icons and description text.
**Good:** Very generous whitespace. One thing visible at a time. Gentle fade transitions. The palette communicates the concept before the user reads anything.

### Example: An ops / dispatch concept
**Bad:** A table of records with a filter row and an edit button per row.
**Good:** A split screen with live-feeling status columns. Items move between columns. Countdown timers. The interface feels like something is happening.

### Example: A calculator / planner concept
**Bad:** A form with inputs, a submit button, and a results section below.
**Good:** Sliders and inputs that update the output in real time. The output panel animates its values as inputs change. No submit button needed.

### Example: A quiz / game concept
**Bad:** A multiple-choice form with a final score page.
**Good:** Items visually drop or slide in. The user drags them to categories. Wrong answers trigger an explanation that teaches. The interaction IS the lesson.

---

## Content rules

- Copy should be short, public-facing, and specific to the concept.
- Avoid verbose builder language: "POC card", "component", "concept slice", "implementation scaffold", "generated flow", "placeholder data".
- Show usefulness through the interface itself, not through meta explanation.
- Labels, section headings, and button text should read like a real product for people — not like developer documentation.
- If you are not sure what a real user would call something, describe the task, not the data: "Find a shelter" not "View Shelter Records", "Plan your week" not "Meal Plan Generator".

---

## Content and copy rules

**Full rules are in [`CONTENT_RULES.md`](./CONTENT_RULES.md). Read it completely before writing any copy.** The summary below is mandatory reading, but `CONTENT_RULES.md` is the authoritative source.
Also read [`ANTIPATTERNS_CODEX.md`](./ANTIPATTERNS_CODEX.md) for Codex-specific instruction leakage failures.

### The one-sentence rule
Before building, write one sentence that answers "what does this do and for whom?" in plain language for the target user. That sentence must appear on the first screen. If you cannot write it, you are not ready to build.

### The first-screen test
Above the fold must contain only: what this does (one line, no jargon), who it is for (implicit), and the single first action. Nothing else. No persona switcher. No "about this tool" section. No reset buttons. No feature lists.

### Banned words — never in user-facing copy
`POC`, `prototype`, `demo`, `seed data`, `simulation`, `simulate`, `persona`, `component`, `scaffold`, `implementation`, `concept`, `generated`, `placeholder`, `mock`, `fake`, `test`, `browser-only`

### Component justification rule
Every component must pass: "Would the target user, right now, want this?" Remove anything that fails. This means removing: "Demo controls" sections, "Reset [anything]" buttons, "Simulate alert" buttons, persona switcher strips, "About this concept" sections, and empty states that describe data absence instead of prompting action.

### Audience-first rule
Write for the target user named in the idea entry — a food volunteer, an elderly resident, a caregiver. Not for a developer. Do not explain architecture. Do not mention storage mechanisms. Do not describe what the prototype proves. Write as if the app is real and already used by real people.

### Empty state rule
Empty states must prompt the next action, not describe the absence of data. "No saved plans yet." → bad. "Save a basket here to compare options before you shop." → good.

### Task-oriented labels
Every label, button, and heading must describe what the user does, not what the section contains. "Visible places" → "Nearby stops". "Current plan" → "Your week". "Reset planner" → remove.

### Content quality checklist — run before every push
- [ ] First screen: can a stranger understand what to do in under 5 seconds?
- [ ] No developer language anywhere on the page?
- [ ] Every button serves an action the target user would want right now?
- [ ] No sections that exist only to explain the app?
- [ ] Empty states prompt action rather than describe data absence?
- [ ] First action obvious without reading instructions?
- [ ] Would the target audience (not a developer) feel this was made for them?

See `CONTENT_RULES.md` for the full rules, before/after rewrites from existing POC pages, and the complete 12-item checklist.

---

## Quality bar

The result must pass all of these:

- [ ] The first screen communicates a point of view within 3 seconds — a stranger can tell what this concept is for
- [ ] The interaction model is distinctive — it does not look like any other POC in the repo
- [ ] `ui.distinctive_feature` is implemented and feels crafted
- [ ] No card grid where another layout model was specified
- [ ] No builder language in the visible copy
- [ ] Suggested libraries are installed and in use
- [ ] The design direction from `ui.direction` is visible in the palette, type choices, and layout rhythm

**If the UI looks like a generic dashboard with cards everywhere, it is not done yet.**
**If the UI could belong to any concept in the repo, it is not done yet.**
**If the only novelty is "this page has a map/chart/graph", it is not done yet.**
**If you could swap another concept's copy into the same layout and it would still work, it is not done yet.**
