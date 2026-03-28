## Project North Star

This repository is the planning and automation home for a future `Next.js` website that showcases many Singapore-focused public-good POCs in one place.

The PM agent (`automations/pm.md` / `$pm-round`) should treat this file as the primary product brief. The local dataset reference at `ideas/GOOD_SG.json` is the source material for selecting and scoping candidate POCs.

---

### 1. Vision (What we are building)

- **One-sentence vision**:
  Build a `Next.js` gallery of small, fast, useful proof-of-concept apps that support Singapore for good.

- **Short paragraph**:
  This project is for people in Singapore who could benefit from practical digital tools around access, care, resilience, inclusion, and community support, and for collaborators who want a clear idea bank to build from. The website should feel like a curated gallery of credible POCs, not a single monolithic product. Success means the repo can continuously turn good Singapore-focused ideas into well-scoped issues, then into lightweight demoable web apps that are easy to browse from one landing page.

---

### 2. North Star Goal (Concrete outcome)

- **Primary goal**:
  In the next 1 to 3 months, define and sequence the work needed to launch the first version of a `Next.js` site with a landing-page gallery plus the first set of Singapore-for-good POC app pages. The current phase is product definition and issue generation, not app scaffolding yet.

- **Key capabilities required for this goal**:
  - Define the gallery information architecture for listing many POCs from a shared catalog.
  - Decide how each POC gets its own route, metadata, and lightweight demo expectations.
  - Convert `ideas/GOOD_SG.json` into a disciplined backlog of platform stories and app-specific stories.
  - Establish clear acceptance criteria for browser-only POCs that use seeded demo data and local-first storage.
  - Prioritize a first batch of POCs that prove the concept across a few Singapore public-good categories.
  - Keep PM and Dev automation aligned so issues are small, buildable, and non-duplicative.

---

### 3. Principles and Guardrails

- **Quality bar**:
  Prefer small, independently shippable slices with explicit acceptance criteria over broad “build the whole app” tasks.

- **Risk tolerance**:
  Early work should optimize for fast learning and believable demos, not production infrastructure. Avoid committing the project to heavy backend, compliance, or operational complexity before concept validation.

- **Style / UX preferences**:
  The eventual site should feel intentional and curated. The landing page is a gallery of POCs. Each app should have a focused user flow, Singapore-relevant seed data, and a clear “what this concept proves” story. Do not default to card-heavy dashboards or one repeated design pattern across all concepts. Different ideas must adopt different visual languages, interaction models, and supporting libraries. Two POCs that look similar have failed the design bar.

- **Communication tone**:
  Be concise, direct, and product-minded. Comments and issues should explain the user problem, the smallest useful scope, and why the work matters now.

- **Frontend ideation rule**:
  Treat `FRONTEND_IDEATION.md` as a mandatory implementation brief for user-facing work. The UI should not expose builder language, should not force every feature into a card, and must deliberately explore different design directions. Each concept in `ideas/GOOD_SG.json` now has a `ui` field specifying the exact visual direction, interaction model, required libraries, and distinctive feature for that concept. These are requirements, not suggestions. Any agent implementing UI must read both `FRONTEND_IDEATION.md` and the concept's `ui` field before writing any code, answer all 7 questions in the mandatory pre-build checklist, and run `npm install` for required libraries.

- **Content quality rule**:
  Treat `CONTENT_RULES.md` as a mandatory brief for any user-facing copy. Copy must be written for the target user named in the idea, not for a developer audience. The first screen of every app must communicate what it does and what to do first in under 5 seconds. No developer language, no explanatory sections about what the prototype proves, no components that exist only for structural completeness. Every element must earn its place.

- **The recurring failure pattern to avoid**:
  White background + header + filter row + card grid is not a design. It is the absence of a design decision. If a POC looks like a generic SaaS dashboard, it must be rebuilt. The standard is: a stranger opening the page should understand the concept's point of view within 3 seconds, and the layout should feel unmistakably designed for that specific concept.

---

### 4. Scope: In and Out

- **In scope**:
  - Product planning for a central `Next.js` gallery website.
  - Story generation from `ideas/GOOD_SG.json`.
  - Work breakdown for shared platform pieces such as landing page, routing, content model, and reusable POC scaffolding.
  - Work breakdown for individual Singapore public-good POCs.
  - POCs that are browser-first, simulation-friendly, and easy to demo with seeded local data.

- **Out of scope**:
  - Setting up the actual `Next.js` app in this phase unless a human explicitly asks for it.
  - Production backend systems, real auth, and complex multi-user synchronization for initial POCs.
  - Large compliance-heavy domains or anything that requires substantial offline operations before a demo is useful.
  - Issues that assume all 100 ideas should be built at once.

---

### 5. Priority Heuristics (high / medium / low)

- **high**:
  - Unblocks the first launch path for the gallery site or the first batch of POCs.
  - Defines shared architecture needed by many POCs, such as routing, metadata shape, catalog structure, or seeded-demo conventions.
  - Sharpens ambiguous product direction into buildable stories with clear acceptance criteria.

- **medium**:
  - Advances one specific POC from the dataset into a well-scoped implementation slice.
  - Improves PM or Dev automation so the backlog is more reliable and less repetitive.
  - Adds useful but non-critical planning detail around taxonomy, categorization, or contributor workflow.

- **low**:
  - Nice-to-have polish, speculative expansion, or broad brainstorming without a near-term implementation path.
  - Additional POC ideas when the first-launch platform work is still unclear.

---

### 6. Roadmap Themes

Name:
Gallery Foundation
Short description:
Define the structure of the landing page, routing model, catalog data shape, and what every POC card/page must contain.
Example tasks:
Landing page IA, route conventions, POC metadata schema, contributor instructions for adding a new POC.

Name:
Dataset-to-Backlog Triage
Short description:
Turn `ideas/GOOD_SG.json` into a manageable pipeline of issues without flooding the repo with duplicates or vague work.
Example tasks:
Category prioritization, first-batch selection, issue templates for app-specific work, triage rules for platform versus app stories.

Name:
POC Build Conventions
Short description:
Keep each app small, browser-based, and demoable by one person with seeded data and fake state transitions where needed.
Example tasks:
Persona switch pattern, local storage conventions, resettable demo state, seeded data requirements.

Name:
First Singapore-for-Good Apps
Short description:
Select and ship an initial set of POCs that represent the value of the gallery across different public-good themes.
Example tasks:
Pick first 3 to 5 ideas, break each into small deliverable stories, define success signals for each concept.

---

### 7. Known Constraints and Integrations

- **Primary source material**:
  - `ideas/GOOD_SG.json` is the local idea bank reference for PM triage and issue creation.

- **Product constraints from the dataset**:
  - All current ideas are `website` ideas and should map to a `Next.js` implementation.
  - All `GOOD_SG` entries are `poc` stage, not full production MVPs.
  - Initial POCs should prefer `localStorage`, use `IndexedDB` only when justified, and avoid a server database.
  - Real auth is not part of the initial concept; multi-sided flows should usually use persona-switch buttons.
  - Seeded demo data and resettable fake state are preferred over live integrations.

- **PM issue-generation rules**:
  - Prefer creating issues that are small enough for one implementation pass.
  - When proposing app-specific work from the dataset, cite the exact idea ID and title from `ideas/GOOD_SG.json`.
  - Do not create more than a few new issues per run, and avoid flooding the backlog before the gallery foundation is defined.
