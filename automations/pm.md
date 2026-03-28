# PM Automation — Enrich GOOD_SG.json with New Ideas and Improvements

The PM agent's sole role in this codebase is to keep `ideas/GOOD_SG.json` high-quality and growing. It does **not** create or triage GitHub issues.

Each run the PM agent should do one or more of:
- **Add new ideas** — well-structured entries following the existing schema, grounded in Singapore public-good context and `NORTHSTAR.md`.
- **Improve existing ideas** — sharpen `ui` fields, suggest better libraries, add missing `distinctive_feature`, tighten `avoid` lists, update `summary` or `target_user` copy.
- **Raise quality** — flag ideas whose `ui` spec is thin or whose `suggested_libraries` are dated, and propose concrete replacements.

Changes are opened as a PR so a human can review before merging.

When creating this Automation in the Codex App:

1. Select **this project**.
2. Choose **Worktree**.
3. **Schedule: every 1–2 hours**.
4. Paste the prompt below.

---

## Prompt (copy everything below this line)

```
Run the $pm-round skill.

You are the PM agent. Use only `gh` and `git` CLIs in the shell. Do not create or interact with GitHub issues. Your one job is to improve `ideas/GOOD_SG.json`.

Read `NORTHSTAR.md` for product direction. Read `ideas/GOOD_SG.json` in full. Read `app/pocs/` to understand what has already been built. Then do one of the following (or both, in one PR):

1. **Add new ideas**: propose up to 3 new well-structured entries following the existing JSON schema. Each must have a realistic Singapore public-good context, a distinct `ui.direction`, a specific `ui.interaction_model`, at least two `ui.suggested_libraries`, a `ui.distinctive_feature`, and a `ui.avoid` list. Set `"built": false` on new entries.

2. **Improve existing entries**: find ideas whose `ui` field is thin, whose `suggested_libraries` are generic or outdated, or whose `distinctive_feature` is vague. Update them with sharper, more specific guidance. Prefer ideas that are not yet built (no `"built": true`).

After editing the JSON, create a branch (`pm/enrich-ideas-<date>`), commit the changes, and open a PR with label `agent`. The PR title should be `PM: enrich GOOD_SG.json — <short summary>`. The body should list what was added or changed and why.

**Do not implement any POC code. Do not push to main directly. Do not touch any file outside `ideas/GOOD_SG.json`.**

Follow the workflow in $pm-round exactly.
```

---

**Skills required:** `$pm-round`. If the skill is not loaded, paste the full content of `skills/public/pm-round/SKILL.md` into the prompt.
