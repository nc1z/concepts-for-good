# Concepts for Good

A `Next.js` gallery of Singapore-for-good proof-of-concept apps.

The current app is a polished landing page with three placeholder concept cards and route-ready detail pages. The longer-term goal is to expand this into a browsable collection of small public-good POCs built from the local planning dataset in `ideas/GOOD_SG.json`.

## What is in the repo

- `app/`: the `Next.js` app router site
- `lib/pocs.ts`: placeholder gallery card data
- `ideas/GOOD_SG.json`: local idea bank for future Singapore-focused POCs
- `NORTHSTAR.md`: product and PM planning brief
- `skills/` and `automations/`: Codex automation instructions for backlog triage and implementation

## Getting started

### Requirements

- Node.js 18.20+ or newer
- npm

### Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Quality checks

```bash
npm run lint
npm run build
```

## Notes

- The current version is intentionally a foundation release: gallery shell first, richer POCs later.
- Planning and issue generation should stay aligned with `NORTHSTAR.md`.
