# Frontend Ideation Rules

This file is mandatory reading for any agent implementing UI in this repository.

## Core rule

Do not default to repetitive card-grid SaaS UI. Public-facing concepts in this repo should feel intentionally designed for people, not for developers.

## Mandatory implementation rules

- Do not put every feature, section, metric, or interaction in a card.
- Do not mirror the issue prompt or implementation instructions in the visible copy.
- Do not assume every concept should share the same layout, interaction model, or visual system.
- Every concept should have a clear visual point of view, chosen on purpose for the idea.
- Prefer a few strong interactions over many generic panels.
- Use whitespace, rhythm, typography, diagrams, maps, timelines, flows, and full-bleed sections when they fit better than boxes.
- Build for a general audience first. The UI should feel understandable without exposing developer language.
- Keep the concept believable as a browser-only POC, but do not confuse “POC” with “unstyled”.

## Required ideation pass before building

Before implementing, explicitly choose:

1. A visual direction
2. An interaction pattern
3. A small set of libraries or primitives only if they materially improve the concept

Document those choices briefly in your working notes, PR body, or implementation summary.

## Visual direction options

Pick a design language that matches the concept. Examples:

- minimalist
- warm civic
- monochrome
- brutalist
- neo-brutalist
- editorial
- futuristic
- playful utility
- calm institutional
- data-dense operations
- tactile kiosk
- map-first
- timeline-first
- diagram-first

Do not keep reusing the same style across concepts unless the issue explicitly asks for system consistency.

## Interaction and layout variety

Consider alternatives to stacked cards:

- split-screen layouts
- sticky side panels
- map-led interfaces
- journey flows
- step-based wizards
- interactive timelines
- node graphs
- comparison tables
- guided canvases
- control rooms
- feed plus detail panes
- story-led longform sections
- lightweight simulations

At least one part of a new concept should feel distinctive relative to the other concepts already in the repo.

## Allowed enhancement toolkit

You have freedom to use tools that strengthen the concept when justified, including:

- `framer-motion`
- `three.js` / `react-three-fiber`
- `shadcn/ui`
- chart and graph libraries
- tree or node-based interaction libraries
- map libraries
- timeline components
- `react-hook-form`
- animation libraries
- gesture libraries
- canvas or SVG-driven visualizations

Do not add libraries as decoration. Add them when they create a better demo, stronger clarity, or a more unique interaction model.

## Content rules

- Copy should be short, public-facing, and specific to the concept.
- Avoid verbose builder language such as “POC card”, “component”, “concept slice”, “implementation scaffold”, or “generated flow”.
- Show usefulness through the interface itself, not through meta explanation.

## Quality bar

- The result should feel crafted, not template-generated.
- The first screen should communicate a point of view within a few seconds.
- If the UI looks like a generic dashboard with cards everywhere, it is not done yet.
