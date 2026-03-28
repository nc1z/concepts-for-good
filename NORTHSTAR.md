## Project North Star

This document defines the **vision**, **goals**, and **constraints** for this repository in a way that both **humans** and **Codex agents** (like the PM agent) can understand and follow.

The PM agent (`pm.md` / `$pm-round`) should **always consult this file first** when:
- Triaging ADMIN issues
- Assigning priority labels (high / medium / low)
- Proposing new issues with the **PM** label

Fill in the sections below. Agents will treat them as the single source of truth unless you update this file.

---

### 1. Vision (What we are building)

**Human (you) should fill this in.**

- **One-sentence vision**:  
  _Example: "Turn this repo into an autonomous project manager that can triage, plan, implement, and QA work with minimal human oversight."_

- **Short paragraph (2–4 sentences)** describing:
  - Who this project is for
  - What pain it solves
  - What “done” or “success” looks like from your perspective

---

### 2. North Star Goal (Concrete outcome)

Define the **main outcome** you want in the next 1–3 months.

- **Primary goal** (1–2 sentences):  
  _Example: "Have a stable set of Codex automations (PM + Dev) that can reliably take an issue from ADMIN → READY → implemented PR with minimal manual intervention."_

- **Key capabilities required for this goal** (3–7 bullets):  
  - …
  - …

---

### 3. Principles and Guardrails

These are **rules and preferences** that shape how work should be done.

- **Quality bar**:  
  _Example: "Prefer small, well-scoped changes with clear tests over large, risky refactors."_

- **Risk tolerance**:  
  _Example: "Avoid destructive operations (force pushes, mass file deletions, schema drops) unless explicitly requested by the human."_

- **Style / UX preferences** (if applicable):  
  _Example: "Favor clear, simple UX over cleverness; consistent naming and file structure over ad-hoc organization."_

- **Communication tone** for comments/issues:  
  _Example: "Be concise, neutral, and factual. Avoid over-explaining unless specifically asked."_

---

### 4. Scope: In and Out

Clarify what is **in scope** and **out of scope** for this repo and its automations.

- **In scope** (what we want more of):
  - …
  - …

- **Out of scope** (what we should avoid or defer):
  - …
  - …

---

### 5. Priority Heuristics (high / medium / low)

- **high**:
  - Directly unblocks the North Star goal or a core capability
  - Fixes a critical bug or broken workflow
  - Prevents data loss, security problems, or major user pain

- **medium**:
  - Clearly improves the system in a noticeable way
  - Adds or refines capabilities that support the main workflows
  - Addresses non-critical bugs or UX rough edges

-- **low**:
  - Nice-to-have improvements or polish
  - Experiments, ideas, or refactors that are not currently blocking anything

---

### 6. Roadmap Themes (optional but helpful)

Group future work into a few **themes** so agents can cluster proposals.

For each theme you care about:
Name:
Short description (1–2 sentences):
Example tasks:

---

### 7. Known Constraints and Integrations

List any **hard constraints** or important external systems.

Tooling constraints (languages, runtimes, services that **must** or **must not** be used)
Integration points (e.g. GitHub, specific APIs, third-party services)
Performance / cost constraints (e.g. "avoid running very expensive CI jobs repeatedly")

