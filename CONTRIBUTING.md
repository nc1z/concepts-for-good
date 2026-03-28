# Contributing

Contributions are welcome. Please read this before opening anything.

---

## Issues

Open an issue if you've found a bug, a broken interaction, or have a well-scoped suggestion. Good issues include:

- A clear description of the problem or idea
- Steps to reproduce (for bugs)
- Why it matters for the target user of that concept

Vague issues ("this looks off", "make it better") will be closed without action.

---

## Pull requests

PRs are welcome for:

- Bug fixes in existing POCs
- Accessibility or usability improvements
- New POCs that follow the design and content rules

Before opening a PR for a new concept, check `ideas/GOOD_SG.json` — it may already be planned. If it is, your implementation should match the `ui` field in that entry.

**Every PR must:**

- Pass `npm run build` and `npm run lint` locally
- Follow `rules/FRONTEND_IDEATION.md` for any UI work
- Follow `rules/CONTENT_RULES.md` for any user-facing copy
- Be scoped to one concept or one fix — not a catch-all

PRs that don't meet the bar will be closed with feedback, not merged in a broken state.

---

## Design bar

The biggest reason PRs get rejected: the UI looks like a generic dashboard.

Each concept must feel designed for its specific use case. A stranger opening the page should understand the point within 3 seconds. If it looks like a card grid with a header and a filter row, it needs a rethink.

Read `rules/ANTIPATTERNS_CODEX.md` before writing any UI.

---

## Scope

This project is intentionally small and focused. Out of scope:

- Production backends, real auth, or multi-user sync
- Ideas outside Singapore public-good themes
- Speculative features without a clear user need

---

Questions? Open an issue or reach out on [LinkedIn](https://www.linkedin.com/in/neil-c).
