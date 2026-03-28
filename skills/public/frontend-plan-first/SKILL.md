---
name: frontend-plan-first
description: Use when asked to implement or redesign any new user-facing POC, page, or route in this repository. Before touching code, read the repo's frontend rules, inspect strong existing POCs, draft a concrete visual and technical plan, and stop until the user explicitly approves the plan.
---

# Frontend Plan First

This skill is mandatory for new user-facing frontend work in this repository.
It exists because agents have been faking variety with the same underlying layout: cards, chips, side panels, charts, and thin visual changes.

## Hard rule

**Do not implement anything until the user has approved the plan.**

That means:
- no file edits
- no new route folders
- no component scaffolding
- no library installation
- no partial implementation "to show direction"

If the user asked for a new POC or significant redesign, your job is to plan first and stop.

## Required reading before planning

Read these before writing the plan:
- `FRONTEND_IDEATION.md`
- `CONTENT_RULES.md`
- `ANTIPATTERNS_CODEX.md`
- the concept entry in `challenge/GOOD_SG.json`, especially its `ui` field

Also inspect at least two existing POCs that already feel specific and intentional.
Start with:
- `app/pocs/medication-reminder-sg/page.tsx`
- `app/pocs/senior-check-in-sg/page.tsx`

Do not copy them. Use them as the quality bar for concept-specific design.

## What the plan must contain

Reply with a concrete plan in these sections:

1. `Concept read`
   - the idea title
   - target user
   - what the first screen must communicate

2. `Theme and style`
   - visual direction
   - palette/material feel
   - typography direction
   - motion tone

3. `Interaction model`
   - primary layout
   - primary interaction
   - what makes this unlike the other POCs already in the repo

4. `Tech stack`
   - route files to create or edit
   - libraries to install and why
   - any SVG/canvas/chart/form/motion choice and why it belongs here

5. `Anti-repetition check`
   - name the existing POCs most likely to be accidentally repeated
   - explain how this design will avoid that resemblance
   - explicitly state why this is not "just cards/chips/chart/map again"

6. `Approval gate`
   - end with a clear stop line asking for approval

## Specific enforcement

- Changing only color, copy, or iconography does **not** count as a new design direction.
- If the structure could survive with the content swapped to another POC, the plan fails.
- If the main experience can be summarized as "a card list with filters and a detail panel", the plan fails.
- If the main visual difference is just "this one uses a chart" or "this one uses a map", the plan fails.
- The user must be able to imagine the page from the plan alone. If the plan is vague, rewrite it.

## After approval

Only after explicit approval may you move on to implementation.
When implementation starts, keep the approved plan visible in your working notes and do not drift into a safer generic layout.
