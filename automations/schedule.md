# How Often Each Automation Should Run

Use **multiple automations** with different schedules. Recommended cadences below are **intentionally conservative** to stay well within typical rate limits.

As a rough baseline from early testing on a new codebase (ChatGPT Plus plan, GPT‑5.1 Codex Max): running PM **hourly** and Dev **every 15 minutes** overnight for **7 hours** consumed about **30% of the weekly rate limits**. Based on that, it is better not to schedule automations too frequently, especially early on.

| Automation | Prompt file | Recommended schedule | Why |
|------------|-------------|----------------------|-----|
| **PM** | [pm.md](pm.md) | **Every 1–2 hours** | Single PM run: triage ADMIN issues (review, comment, add priority, remove ADMIN); post-merge cleanup; review existing issues and add/update priority labels; propose new issues (label PM + priority). Hourly or slower keeps PM behavior responsive without burning through rate limits. |
| **Dev** | [dev.md](dev.md) | **Every 2–4 hours** *(suggested for ≥2 Dev automations)* | Pick one READY issue **by priority** (high → medium → low); mark IN-PROGRESS, implement, open PR. If IN-PROGRESS exists, remediate that PR (CI, comments, rebase). Spacing Dev runs out to every few hours balances throughput with cost; Dev must reference the issue in the PR (e.g. Closes #42) so PM can remove IN-PROGRESS when the PR is merged. You can also clone the Dev automation (2–3 Devs) if you want more parallel implementation; in that case, this cadence is usually enough to keep up with PM-created work. |

---

## Order of operations (typical)

1. **PM** runs every 1–2 h → ADMIN issues triaged (comment + priority label, remove ADMIN); post-merge cleanup; existing issues get priority labels; new PM proposals with priority.
2. You add **READY** to issues you want implemented.
3. **Dev** runs every 2–4 h → if no IN-PROGRESS, picks one READY by priority (high, then medium, then low), marks IN-PROGRESS, implements, opens PR; if IN-PROGRESS exists, remediates that PR. If you have **only one Dev automation**, consider running Dev slightly more often than PM (for example Dev hourly, PM every 2 hours) so READY work doesn’t pile up as PM keeps creating issues.
4. You merge PRs. **PM** (next run) removes IN-PROGRESS from the linked issue and closes it. Dev must reference the issue in the PR body (e.g. Closes #42).

---

## Creating automations in the Codex App

1. **Automations** → New (two times: PM, Dev).
2. For each: select **this project**, choose **Worktree**, set the **schedule** from the table above, paste the prompt from the linked file.
3. Ensure these skills are loaded: **`$pm-round`**, **`$dev-round`** (from [../skills/public/](../skills/public/)).

Ensure the repo has (or PM will create) **priority labels**: **high**, **medium**, **low**.
