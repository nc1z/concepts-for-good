# Codex Anti-Patterns

This file exists to block a recurring failure mode in Codex-driven frontend work: literal implementation instructions leaking into the visible product.

These are hard rules for any user-facing UI in this repository.

## Never leak the brief into the interface

The user should see a product, not the agent's working notes.

Do not place any of these in visible UI copy:

- summaries of the design brief such as "Large text. Large buttons. No rushing."
- statements that restate internal constraints such as "one screen at a time", "made for seniors", or "designed to be calm"
- implementation promises such as "easy to use", "simple to follow", "low stimulation", or "touch-friendly" unless the user genuinely needs that instruction right now
- anything that sounds like a checklist item, prompt instruction, acceptance criterion, or design rationale
- phrases that explain the interface instead of helping the user do the task in front of them

## The key test

Before keeping any line of UI copy, ask:

Would a real user say they needed this sentence in order to complete the task?

If the answer is no, remove it.

## Common Codex failure patterns

- writing helper copy that paraphrases the design brief instead of helping the user
- turning internal quality goals into visible slogans
- adding reassurance lines that explain the UI rather than advancing the flow
- exposing words that belong in planning docs, not product copy
- placing "instruction about the experience" where a task instruction should be

## Good replacement pattern

Instead of describing the interface, describe the next user action.

- Bad: "Large text. Large buttons. No rushing."
- Good: "Choose what you want help with today."

- Bad: "One screen at a time."
- Good: "Tap Next when you are ready."

- Bad: "Made possible with AI."
- Good: Put process notes outside the main task flow if they must exist at all.

## Enforcement

For user-facing work, treat this file as an extension of `FRONTEND_IDEATION.md` and `CONTENT_RULES.md`.
If a sentence reads like it came from the build prompt, remove it before pushing.
