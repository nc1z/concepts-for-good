# How Often Each Automation Should Run

Use **three automations** with different schedules. Cadences below are intentionally conservative.

| Automation | Prompt file | Recommended schedule | What it does |
|------------|-------------|----------------------|--------------|
| **PM** | [pm.md](pm.md) | **Every 1–2 hours** | Adds new ideas to `ideas/GOOD_SG.json`, improves existing `ui` specs, suggests better libraries. Opens a PR labelled `agent` for human review. |
| **Dev** | [dev.md](dev.md) | **Every 2–4 hours** | Picks the first unbuilt idea from `ideas/GOOD_SG.json` (no `"built": true`), builds the POC in `app/pocs/`, opens a PR labelled `agent`. |
| **Security** | [security.md](security.md) | **Every 6–12 hours** | Runs `npm audit`, scans source for XSS/secrets/open-redirects/etc. Opens PRs for auto-fixable issues, GitHub issues for findings needing human judgement. All output is labelled `security_bot`. |

---

## Order of operations

1. **PM** runs → edits `ideas/GOOD_SG.json` on a branch, opens a PR.
2. You review and merge the PM PR if the ideas look good.
3. **Dev** runs → reads `ideas/GOOD_SG.json`, finds the first entry without `"built": true`, implements it, marks it `"built": true` in the JSON, opens a PR labelled `agent`.
4. You review and merge the Dev PR. The POC is live on the gallery.

---

## Conventions

- **No GitHub issues** — the idea bank (`ideas/GOOD_SG.json`) is the sole backlog.
- **`"built": true`** on a JSON entry means that POC is done; Dev skips it.
- **PR label `agent`** marks all automatically opened PRs.
- **PR/issue labels `security_bot` + `security`** mark all Security agent output.
- **Bot co-author** — Dev commits include a `Co-Authored-By:` line with a random Greek or astro bot name (e.g. `Apollo_bot`, `Orion_bot`) to distinguish automated commits. Security commits use `Co-Authored-By: security_bot <security_bot@concepts-for-good>`.

---

## Creating automations in the Codex App

1. **Automations** → New (twice: PM and Dev).
2. For each: select **this project**, choose **Worktree**, set the schedule above, paste the prompt from the linked file.
3. Ensure skills are loaded: **`$pm-round`**, **`$dev-round`**, **`$frontend-plan-first`** (from `skills/public/`).
4. Ensure the `agent` label exists in the repo (PM or Dev will create it if missing: `gh label create agent --color "0075ca"`).
5. The Security agent creates its own labels (`security_bot`, `security`) on first run if they don't exist.
