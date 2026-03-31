# Content Rules — Mandatory Brief for All User-Facing Copy

This file is authoritative. All other files that reference content quality point here. **Read this file completely before writing a single word of user-facing copy.**
Also read `rules/ANTIPATTERNS_CODEX.md` before writing helper text, reassurance copy, or any line near the hero/first screen.

Every rule in this file is a hard rule. Vague rules ("write clearly", "be user-friendly") are not here. These are specific, testable, enforceable rules.

---

## A. The One-Sentence Rule

Every app page must answer "what does this do and for whom?" in one sentence that appears on the first screen — visible without scrolling, in plain language, for the target user named in the idea entry.

**If you cannot write that sentence before you build, you are not ready to build.**

Write the sentence now. Put it on the first screen. The rest of the page serves it.

### Test
Open the page. Cover everything below the fold with your hand. Can a member of the target audience — not a developer, not a PM, but the actual person this is for — read the one visible sentence and know exactly what this is for them?

If yes: pass.
If no: the page fails. Rewrite the headline and lede before pushing.

### Real examples from this repo

**Bad hero lede:**
> "This prototype is map-led rather than directory-led. Start from the neighbourhood, then move into details, notes, and revisit plans."

This sentence explains the app's architecture to a developer. A resident who needs a meal does not care that the app is "map-led rather than directory-led". They care where they can get food today.

**Good:**
> "Find places near you where free meals and community food support are available."

**Bad hero lede:**
> "A browser-only operations board for watch zones, live pickup windows, and volunteer assignment across Singapore neighbourhoods."

"Browser-only operations board" is builder language. "Watch zones" is internal jargon. "Live pickup windows" is unexplained. A volunteer reading this first line does not know what to do.

**Good:**
> "Coordinate tonight's food rescue runs from hawker centres across your area."

---

## B. The First-Screen Test

The first screen — above the fold, before any scroll — must contain **only**:

1. What this app does (one line, plain language, no jargon)
2. Who it is for (implicit in the copy, not a label saying "For: volunteers")
3. The single first action the user should take

**Nothing else.** Not a feature list. Not an "about this tool" section. Not an onboarding paragraph. Not a persona switcher. Not a reset button. Not a developer footer.

### What fails this test

Every one of these has appeared in this repo's POC pages and must never appear on the first screen:

- Any text that explains the architecture, technology, or design rationale of the app
- A "persona switcher" row at the top — this is a developer testing tool, not a user feature
- A "Reset map state" or "Reset planner" or "Reset dispatch state" button in the header
- A kicker that just restates the app's technical name with no human framing
- A lede that begins with "This prototype..." or "A browser-only..." or "A guided planner for..."
- A helper line that simply repeats the internal brief, such as "Large text. Large buttons. No rushing."

### What passes this test

- A headline that names the benefit or task, not the tool: "Find food support near you" not the internal app name
- A lede that speaks to the user's situation, not the app's features: "If you or someone you know needs a free or low-cost meal, this shows you what is available near you." not "Map-led rather than directory-led"
- A single prominent action: "Search by area", "Start planning", "See tonight's runs"

---

## C. Component Justification Rule

Every UI component, section, panel, and button must pass this test:

> **"Would the target user, right now, want this?"**

If the answer is "maybe", "probably", or "a developer would want this" — remove it.

The question is not "is this technically useful" or "does this make the demo easier to test". The question is whether the **target user named in the idea entry** — a food volunteer, an elderly resident, a caregiver — would want this at this moment in their task.

### Components that fail this test and must be removed

These have all appeared in this repo's POC pages:

| Component | Why it fails | What to do instead |
|---|---|---|
| "Reset map state" button in header | The target user (a resident finding food) never wants to reset the app state. This is a developer testing tool. | Remove from user-facing UI. If needed for demos, put it behind a developer URL param or a hidden gesture. |
| "Reset planner" button in header | A household planner does not want to destroy their saved plans from the top of every page. | Remove. If the user wants to start over, they will naturally do so. |
| "Reset dispatch state" button in sidebar | A food rescue coordinator does not want a "Demo controls" panel. This is a developer testing tool. | Remove the entire "Demo controls" section from user-facing UI. |
| "Demo controls" panel | This section exists to tell a developer "you can reset the demo here". It is not a user feature. | Remove entirely. |
| "Simulate alert" button | A coordinator does not press a button to simulate an alert. Alerts come from real events. | Remove from user-facing UI. |
| Persona switcher strip | Users do not switch personas. Users are who they are. Persona buttons are developer testing tools. | Remove from user-facing UI. If role-based views are needed, use onboarding or a profile setting. |
| "About this tool" section | End users do not need an explanation of what a tool proves. They need the tool to work. | Remove entirely. |
| "What this proves" section | Same as above. | Remove entirely. |
| "No saved plans yet." empty state | This tells the user nothing useful. | Rewrite: "Save a basket plan here to compare options later." |
| "No notes yet for this stop." empty state | This tells the user nothing useful. | Rewrite: "Add a note about your visit — hours, what was available, or when to return." |
| "Visible places" label above a list | This label names the data structure, not the user task. | Use a task-oriented label: "Nearby food stops" or just remove the label. |
| "Map explorer" section header | Internal name for the map component. | Remove or replace with context-appropriate copy: "Your area" or just let the map speak for itself. |
| "Current plan" label above results | Names the data structure. | Replace with copy that states the outcome: "Your week" or "This week's basket". |
| Feature list in hero | A list of what the app contains is not a reason for the user to use it. | Replace with the one-sentence user benefit. |

---

## D. Language Rules — Strict Vocabulary

### Banned words

These words must **never** appear in user-facing copy — in headings, labels, buttons, placeholder text, empty states, tooltips, or anywhere a user can read:

```
POC
prototype
demo
seed data
simulation
simulate
persona
component
scaffold
implementation
concept
generated
placeholder
mock
fake
test data
browser-only
```

**No exceptions.** If a button says "Simulate alert", rename it or remove it. If the hero lede says "This prototype", rewrite it. If a panel says "Demo controls", remove it.

### Write as if this is a real product

The app is not a demo. The app is not a prototype. The app is not a concept. For the user, it is a tool. Write accordingly.

Every piece of copy should read as if this app is live, used by real people in Singapore today, and was designed specifically for them.
If a sentence sounds like it came from the build prompt, design checklist, or implementation brief, remove it.

### Every label, button, and heading must be task-oriented

The user does something. Labels name what the user does, not what the section contains.

| Instead of (data-oriented) | Write (task-oriented) |
|---|---|
| "Saved plans" (empty) | "Save a plan to compare options" |
| "Visible places" | "Nearby stops" |
| "Map explorer" | Remove it, or use: "Your area" |
| "Current plan" | "Your week" or "This week" |
| "Dispatch lane" | "Tonight's runs" |
| "Watch settings" | "Areas you cover" |
| "Volunteer roster" | "Available tonight" |
| "Demo controls" | Remove entirely |
| "Persona" | Remove — or use role directly: "You are a coordinator" |
| "Generate weekly basket" | "Build my week" |
| "Copy summary" | "Copy this plan" |
| "Reset planner" | Remove |
| "Reset map state" | Remove |
| "Reset dispatch state" | Remove |

### Singapore-appropriate language

Use the specific words that Singapore residents and volunteers use. Do not use generic substitutes.

| Generic (wrong) | Singapore-appropriate (right) |
|---|---|
| "Community center" | "CC" or "community centre" |
| "Public housing" | "HDB flat" or "HDB block" |
| "Community space" | "void deck" |
| "Government assistance" | "ComCare", "CDC vouchers" |
| "Food bank" | "food bank" (this one is fine — it's the common term) |
| "Neighbourhood" | "neighbourhood" (British spelling — Singapore uses this) |
| "Program" | "programme" (British spelling) |

---

## E. Audience-First Writing Rule

Before writing any copy for any component, answer three questions:

1. **Who is reading this?** Name the specific person from the idea entry's `target_user` field.
2. **What do they already know?** Do not explain things they already know. Do not assume things they don't.
3. **What do they need to know right now?** Only say that. Nothing else.

### Concrete examples of audience-first failures in this repo

**Failure: lede copy written for a developer**

Example hero lede:
> "A browser-only operations board for watch zones, live pickup windows, and volunteer assignment across Singapore neighbourhoods."

- Who is reading this? A food rescue volunteer or coordinator.
- What do they already know? They know what they are trying to do: rescue food.
- What do they need from the first screen? They need to know if this tool will help them do that tonight.
- "Browser-only" — the volunteer does not care about this. This is for a developer worried about offline dependencies.
- "Operations board" — this is internal product language.
- "Watch zones" — unexplained jargon.
- "Pickup windows" — unexplained jargon.

**Correct lede for a volunteer:**
> "See which hawker centres have food ready for pickup tonight, and take or assign a run."

**Failure: empty state written for no one**

Example saved plans empty state:
> "No saved plans yet."

- Who is reading this? A household trying to plan meals on a budget.
- What do they need to know? What to do next.
- "No saved plans yet" tells them nothing. It describes the current state of the data.

**Correct empty state for this user:**
> "Save a basket plan here to compare a few options before you shop."

**Failure: a system-internal alert shown to users**

Example alert shown when switching views:
> "Coordinator board loaded. Assignment controls and watch zones are active."

- Who is reading this? A coordinator using the app.
- This message is written for a developer verifying that state has loaded correctly, not for a coordinator trying to dispatch food runs.

**Correct alert for a coordinator — or just remove it:**
No alert is needed when the user switches view. If anything: "Showing coordinator view." — but even this is unnecessary. The interface itself should show what changed.

---

## F. The Empty State Rule

Empty states must not describe the absence of data. They must tell the user what to do next.

The pattern is: **what the user should do to fill this state, in one plain sentence.**

| Bad empty state | Good empty state |
|---|---|
| "No saved plans yet." | "Save a basket plan here to compare options before you shop." |
| "No notes yet for this stop." | "Add a note about your visit — hours, what was available, or when to return." |
| "No records found." | "No stops match this search. Try a different area or remove a filter." |
| "Nothing here yet." | (specific to context — never use this) |
| "No results." | "No food stops found in this area. Try widening your search." |

The empty state is a moment of guidance. It is the one moment when the user is most in need of direction. Use it.

---

## G. The Sector Jargon Rule

Every POC is about a real-world domain — caregiving, legal aid, food rescue, health, housing. Each domain has its own professional vocabulary. **That vocabulary is for practitioners, not for users.** The target user is almost never a trained professional speaking in that field's terminology. They are a resident, a family member, an elder, a volunteer.

Before writing any copy, ask: **"Is this a word the target user would use when talking to a friend?"** If not, replace it.

### Sector jargon patterns found in this repo — and their plain replacements

These words and phrases have all appeared in POC copy and caused confusion or felt alienating to real users:

| Jargon (do not use) | Plain alternative |
|---|---|
| "Legal help route" | "where to get help", "who to contact", "your options" |
| "Support route" | "type of help", "where to go", "the right place" |
| "Eligibility route" | "who qualifies", "whether you qualify" |
| "Case intake" | "Getting started", "Let's start", "Your situation" |
| "Handoff" (caregiving) | "step in", "take over", "send a note", "pass on" |
| "Care shifts" | "Family caregiving", "Caring for someone", "Helping at home" |
| "Escort coverage" | "company to the clinic", "going with them" |
| "Scheme eligibility" | "whether this applies to you", "if you qualify" |
| "Refer" / "referral" | "send them to", "point them to", "connect with" |
| "Intake form" | "a few questions", "tell us about your situation" |
| "Discharge" | "leaving the hospital", "going home" |
| "Client" | "the person you're helping", "your family member", "them" |
| "Beneficiary" | use the actual person — "resident", "elder", "family member" |
| "Caregiver" (as a label) | fine in context, but never as a persona switch button |
| "Dispatch" | "tonight's runs", "who is going where" |
| "Rostering" | "who is available", "the schedule" |

### The "say it aloud" test

Read every sentence of copy aloud as if you are saying it to a resident who has never heard of the app before. If it sounds like something a social worker writes in a case file, or a lawyer writes in a letter, or a hospital admin puts on a form — rewrite it in the words that person would use when describing the problem to a friend.

**Bad (sounds like a professional document):**
> "See which legal help route may fit before you make the call."

**Good (sounds like a friend explaining it):**
> "Find out where to get legal help before you make the call."

**Bad:**
> "Find the right helper before the next handoff."

**Good:**
> "Find the right helper before someone needs to step in."

**Bad:**
> "Pick the closest match so I can point you to the right support route."

**Good:**
> "Pick the closest match and I'll point you to the right place."

### Jargon can appear in headings too

Eyebrow text, chip labels, section headers, and badge text are all user-facing. They must pass the same test.

**Bad eyebrow:** "Care shifts" — sounds like a scheduling category for care workers.
**Good eyebrow:** "Family caregiving"

**Bad section label:** "Case folder" — sounds like a file in a legal practice management system.
**Good:** "Your documents" or "What to bring"

**Bad badge:** "Mostly ready" referring to document readiness — acceptable but on the edge.
**Bad badge:** "Gather next" — vague; sounds like a system status, not a user action.
**Good:** "Still missing a few things" or just list what's missing.

---

## H. The Label Test

Every label, heading, and button must pass this test:

> **"Would a real user understand this without having read any documentation?"**

If the answer is no — or even "probably" — rewrite it. If you cannot rewrite it without removing it, remove it.

### Apply this test to every string you write

Before committing any user-facing text, read it as the target user. Do not read it as a developer who built it and knows what it means. Read it as a food volunteer opening the app for the first time on their phone at 9pm outside a hawker centre.

Does it make sense? Does it tell them what to do? Would they click it without hesitation?

If not, rewrite or remove.

---

## H. What Must Never Appear on Any POC Page

These things must never appear anywhere a user can read them:

- Any text that identifies the page as a proof of concept, prototype, or demo
- "Data is stored in localStorage" or any mention of the storage mechanism
- "Switch persona to see..." or any instruction to use the persona switcher
- "Seeded with demo data" or any mention of seed records or simulated data
- "Reset to defaults" or "Reset demo" or "Reset [anything]" as a visible button for end users
- "About this concept" as a section heading
- "What this proves" as a section heading
- "Demo controls" as a section heading
- Any button or section that exists only to allow a developer to test the app
- "Simulate [anything]" as a visible button
- A feature list describing what the app contains instead of what the user can do
- Any text that reads as if it is explaining the app to a developer rather than guiding a user

### Specifically: visible developer-only controls

Example:
```
Demo controls
Reset or rerun the night
[Reset dispatch state button]
```

This entire section must be removed from user-facing UI. It is a developer testing panel, not a real feature.

### Specifically: persona switcher buttons

Visible persona switcher rows expose the multi-persona system directly to the user. Real users do not switch personas. A volunteer does not press "Switch to coordinator view" because they are a volunteer, not a coordinator.

If role-based views are needed, use onboarding (ask who they are on first visit) or a profile/settings menu — not a prominently placed button strip on the main page.

---

## I. The Progressive Disclosure Rule

Show only what the user needs for their current step. Do not front-load everything.

### The core principle

The user has one task right now. Show them what they need for that task. Nothing else.

When they complete that task, show them the next step.

### What this means in practice

**Bad:** A planner page that shows the scenario selector, budget slider, people slider, pantry options, kitchen time options, and an output panel all at once on first load. The user does not know where to start.

**Good:** The first thing visible is: "How much do you have to spend this week?" with a single slider. After they set a budget, the next control appears. The output updates in real time.

**Bad:** A map page that shows a persona switcher, a search bar, filter buttons, a map canvas, a list rail, and a detail drawer all on first load.

**Good:** The map is the first thing visible. It shows stops near them. Tapping a stop shows its details. Search and filters are available but not the dominant first element.

### The two-interaction rule

The user's first useful outcome must require at most two interactions. If it requires more, the first screen is showing too much or hiding the entry point.

- A map-led support app should let the user tap an area and see relevant details within two taps. The filter row should not dominate the first screen.
- A meal-planning app should show a sensible default week immediately, without forcing a submit click first. The output should feel live.
- A coordination app should show the active runs immediately. Secondary controls like filters and rosters should come later.

---

## J. Quality Checklist — Run on Every Page Before Pushing

Run this checklist on every user-facing page before pushing. If any item fails, fix it before opening a PR.

- [ ] Can a stranger read the first screen and know exactly what to do in under 5 seconds? (Have a non-developer read it and describe what they would do first.)
- [ ] Is there any developer language visible anywhere on the page? (Scan for: POC, prototype, demo, seed, simulation, simulate, persona, component, scaffold, browser-only, generated, placeholder, mock, fake, test.)
- [ ] Does every visible button serve an action the target user would want to take right now? (Read each button label. Would the named target user — a volunteer, a resident, a caregiver — press this button as part of doing their task?)
- [ ] Is there any section that exists only to explain the app, not to let the user do something? ("About this tool", "Demo controls", "What this proves", "How it works" — remove them.)
- [ ] Does every empty state tell the user what to do next, not describe what the app cannot currently show?
- [ ] Is the first action obvious without reading any instructions?
- [ ] Would a member of the target audience (not a developer) feel this was made for them?
- [ ] Does the lede sentence describe the app's benefit to the user, not the app's architecture or technology?
- [ ] Are all buttons and labels in task-oriented language (what the user does), not data-oriented language (what the section contains)?
- [ ] Have all "Reset" buttons been removed from user-facing UI?
- [ ] Has the persona switcher been removed from the main user flow and replaced with an appropriate onboarding or profile pattern?
- [ ] Is every piece of copy written for the target user named in the idea entry, not for a developer reading the code?
- [ ] Does any copy use sector or domain jargon the target user would not naturally say? (Read each sentence aloud. If it sounds like a professional form, legal document, or internal system — rewrite it. See Section G.)
- [ ] Are all apostrophes in JSX escaped as `&apos;`? (Unescaped `'` characters in JSX cause build failures.)
- [ ] Does the app title pass the one-friend test (Section K)? Would the target user say these exact words to a friend? Does it use any banned pattern (`-Planner`, `-Notes` as a finder, `-Relay`, `-Flow`, `-Pulse`, `-Board`, `-Explorer`, `-Helper`, `-Builder`, `-Pack`, `Chance`/`Window`/`Pulse` as abstract nouns, clinical terms, two-word cryptic combos)?
- [ ] Does the card summary in `lib/pocs.ts` describe what the user does or gets — not the app's architecture or feature list?

**All 16 items must be checked before a PR can be considered complete for any user-facing page.**

---

## K. App Title and Card Copy Rules

The `title` in `lib/pocs.ts` and in `GOOD_SG.json` is the first — and often only — thing a visitor reads. It must pass the same plain-language test as all other copy. **If the idea's title field fails these rules, rename it in both `lib/pocs.ts` and `GOOD_SG.json` before pushing.**

### The naming test

Read the title aloud as if you are telling a neighbour on the street what the app is for. Would a resident, caregiver, or volunteer naturally say those words?

**Bad:** No one says "I used the Rain Window Planner" or "I checked Carpark Chance" or "I opened the Accessible Toilet Notes."
**Good:** They say "I checked when to leave in the rain" or "I found a carpark" or "I looked for accessible toilets near me."

If the title sounds like an internal product name, a startup brand, or a government form — it fails.

### Banned title patterns

These patterns have shipped in this repo and must not recur:

| Pattern | Example | Problem |
|---|---|---|
| `-Planner` suffix | Rest Day Planner, Rain Window Planner, Block Potluck Planner | "Planner" is generic filler — says nothing about who or what |
| `-Notes` when it's a finder | Accessible Toilet Notes | Notes implies writing. If the user finds things, say so. |
| `-Relay`, `-Flow`, `-Pulse` | Garden Task Relay, Device Donation Flow, HDB Resale Pulse | Ops/product jargon |
| `-Board` | Errand Swap Board | App-builder speak |
| `-Explorer` | Cause Explorer | Tech product name language |
| `-Helper`, `-Builder`, `-Pack` | Market Trip Helper, Care Package Builder, Clinic Visit Pack | AI-slop suffixes — says nothing concrete |
| `-Taster` | Apprenticeship Taster | Unusual; not Singapore speech |
| Abstract noun for a real action | Carpark Chance | "Chance" means nothing here |
| `Multi-` prefix | Multi-Language Help Card | Buries the actual purpose |
| Technical or scientific terms | PM2.5 Care Guide | Target users don't say "PM2.5" |
| Clinical / social-work terms | Respite Day Planner, Sibling Care Rotation, Textile Reuse | Professional register the user wouldn't use in speech |
| Two-word cryptic phrases | Item Life, Bench Rest | No context, no meaning without explanation |
| `Chance`, `Window`, `Pulse` as standalone nouns | Rain Window Planner, Carpark Chance | Metaphorical filler that obscures the function |

### Good title patterns

These work because they describe the task in words the user would actually say:

| Pattern | Example | Why it works |
|---|---|---|
| Verb phrase — what you do | Split the Rent, Visit a Senior, Find a Carpark, Walk Together | Direct, task-shaped, human |
| "Near You" phrasing | Accessible Toilets Near You, Find a Shaded Bench | Clear, spatial, honest about what it does |
| Plain noun phrase with specificity | Quiet Places, Senior Check-In, Blood Donation Reminder | Simple; no jargon; clear audience or action |
| "What to…" question form | What to Do on a Hazy Day, What to Bring to the Clinic | Conversational; answers a real felt need |
| "For…" with beneficiary | Support for Domestic Workers, Meals for New Parents | Names the person; avoids clinical labels |

### The one-friend test

Before registering any title, ask: **"Would the target user use these exact words when describing this app to a friend?"**

If no — rewrite until they would. This test overrides all other considerations.

### Card summary rules

The `summary` field in `lib/pocs.ts` must:
- Be one sentence in plain English
- Describe what the user gets or does — not the app's architecture or feature list
- Sound like something a real person would say, not a product brief or design document
- Never use any word from the banned list in Section D
- Name the action or benefit, not the mechanism

| Bad summary | Good summary |
|---|---|
| "A browser-only ambient board for caregiver trip planning." | "Check if it is dry enough to leave now before heading to your appointment." |
| "A kanban-style task relay for volunteer garden coordination." | "Coordinate watering and chores in a shared garden without anyone missing their turn." |
| "A respite scheduling tool for caregiver rotation windows." | "Coordinate short breaks so caregivers can rest without everything falling apart." |

---

## Appendix: Before/After Rewrites

These are representative bad-to-good rewrites for patterns that commonly fail the rules above.

| Location | Bad copy | Good copy |
|---|---|---|
| Hero lede | "This prototype is map-led rather than directory-led." | "Find food support near you." |
| Header button | "Reset map state" | Remove entirely |
| Section header | "Map explorer" | "Your area" or remove entirely |
| List label | "Visible places" | "Nearby stops" |
| Empty state | "No saved plans yet." | "Save a basket here to compare a few options before you shop." |
| Submit button | "Generate weekly basket" | "Build my week" or remove if the output updates live |
| Output label | "Current plan" | "Your week" |
| Copy button | "Copy summary" | "Copy this plan" |
| Persona strip | [Role buttons visible on the main page] | Remove from the main UI and use onboarding or profile settings instead |
| Dispatch button | "Simulate alert" | Remove entirely |
| Sidebar section | "Demo controls / Reset or rerun the night / [Reset state]" | Remove entirely |
| System alert | "Coordinator board loaded. Assignment controls are active." | Remove and let the interface speak for itself |
| Page eyebrow | "Care shifts" | "Family caregiving" |
| Hero headline | "Find the right helper before the next handoff." | "Find the right helper before someone needs to step in." |
| Intake label | "Case intake" | "Getting started" |
| Hero headline | "See which legal help route may fit before you make the call." | "Find out where to get legal help before you make the call." |
| Helper text | "Pick the closest match so I can point you to the right support route." | "Pick the closest match and I'll point you to the right place." |
| Route summary | "Strongest fit when the issue is salary, dismissal, or contract trouble at work." | "The right place if your issue is about pay, dismissal, or problems at work." |
| Route summary | "A likely fit when income is lower and the matter needs formal legal help." | "A good option if your household income is lower and you need formal legal help." |
| Action button | "Share handoff" | "Send note" |
| Seed data field | "Grab fallback" (as a relationship label) | "Backup driver" |
| Availability text | "Reply before 15 minutes" | "Usually replies within 15 min" |
| Coverage summary | "Pickup and escort coverage" | "Pickup and company to the clinic" |
| Pending state | "Answer the first question and your best first call route will settle here with the papers to bring." | "Answer the first question and your best option will appear here, along with what to bring." |
