# Taste — How to Build Apps That Don't Look Like AI Built Them

This file captures the design thinking behind the best POCs in this repository. It is not about rules. It is about judgment. Read it before any significant design decision.

> Adapted from "How to build taste using AI in 2026" by [@av1dlive](https://x.com/av1dlive/status/2027074800431370564).

---

## The problem this file exists to solve

AI raises the floor. Every agent can now ship a 7/10 app in minutes. The result: 7/10 is the new mediocre. Being above average is no longer enough. The only meaningful delta is in the top 25% — the part that requires specificity, elimination, and a willingness to name what is wrong.

The failure mode is not incompetence. It is stopping early. An agent that generates one design direction and ships it is producing statistical taste: the safest, most averaged version of good. It is the purple-to-blue gradient on a white background. The bold claim plus three bullet points. The polite, corporate lede. Not wrong. Just interchangeable.

This file is about how to not stop early.

---

## What taste actually is

Taste is distinction under uncertainty. It is walking into a room of ten options and knowing which one is different, knowing exactly why, and articulating it in a way that changes how others see it.

It is not a credential. It is not a strong opinion about fonts. It atrophies when you stop observing and start coasting on prior conclusions.

In practice, taste is:

- **Specificity** — the design feels like it could only be this app, for this concept, built at this moment. You cannot swap another concept's content in and have it still work.
- **Elimination** — every element that could be something else has been removed. What remains is the irreducible version.
- **Resistance** — something about the default output bothers you. You sit with that friction instead of scrolling past it. That friction is raw material.

The specificity test: read every design decision and ask — could this be from any other app ever made? If yes, it has no taste. Rethink it.

---

## The core loop: generate, then destroy

Do not generate one direction and ship it. Generate many, then build a rejection vocabulary.

For every major design decision — palette, layout, typography, interaction model, first-screen copy — ask:

> "This fails because..."

Name it structurally, not cosmetically. "It looks generic" is not enough. "It fails because the layout rhythm is identical to the last three POCs" or "it fails because the copy could be for any app about any topic" — that is the level of specificity that produces taste.

The muscle being trained is precise rejection. That precision accumulates into a design sensibility that cannot be derived from a dataset.

---

## How the best POCs in this repo were designed

The process behind the apps that feel genuinely distinct — not the ones that are merely competent — follows the same pattern:

### 1. Start with what is wrong with the default

Before deciding what a POC should look like, name what it should not look like. What would an average AI produce for this concept? A card grid? A sidebar + content body? A white background with a hero? Name those defaults explicitly. Then build the opposite.

The "Train Your Eye" POC began here: the concept was about escaping AI-generated mediocrity. The design had to demonstrate that escape, not just describe it. So: dark background (opposite of every recent light POC), hard edges (opposite of the rounded-corner default), monospace input (precision, rawness), amber accent chosen specifically because it is not a gradient.

### 2. Let the concept motivate every decision

The best design decisions are motivated by the concept, not by convention or personal taste.

Ask: what is the core experience this concept delivers? Then ask: what design decisions make that experience tangible?

For a critique-based app, the distinctive feature was weak phrase highlights — because the gap between AI output and what you actually want needed to be made visible. The amber underlines are not decoration. They are the thesis.

For a medication reminder built around daily rhythm, a 24-hour clock face was the right interaction model — because the concept is about time, and a clock makes time spatial and navigable.

For a carpark availability app, pulsing pins were the right choice — because availability is a live, anxious thing, and static pins would lie about its nature.

The concept tells you what the distinctive feature should be. If you cannot trace a design decision back to the concept, it is a default. Remove it or replace it.

### 3. Choose palette by what is wrong with the current defaults

Do not pick a colour scheme because it "looks nice". Pick it by auditing what the last five POCs used and finding the gap.

More importantly: pick it by asking what the concept deserves. A taste-training app should not use the same colours as a caregiver scheduling tool. The palette is not decoration — it sets the cultural register.

Dark palettes signal: precision, editorial authority, deliberateness. Light palettes signal: approachability, civic warmth. Neither is better. Both are wrong when they are chosen by default rather than by intent.

The amber in "Train Your Eye" — #E8A020 — was chosen because amber is the colour of things underlined, of things marked, of attention directed. It is not an accent chosen because it is attractive. It is an accent chosen because it means something in the context of the app.

### 4. Choose typography by cultural register, not by availability

Typography signals who made this and who it is for.

A serif says: editorial authority, considered, worth reading slowly. Use it for content that deserves that weight — critique specimens, long-form claims, anything where the reader should feel they are encountering something made with care.

A monospace says: precision, rawness, the act of naming things exactly. Use it for input fields that require that precision, for critique prompts, for anything where the voice should feel technical and unsentimental.

A geometric sans says: contemporary, neutral, functional. Use it for UI chrome — navigation, labels, buttons. It should not carry weight; it should carry the user.

Never pick a font because it is the first one that comes to mind. Ask: what does this concept's voice sound like? Then find the typeface that sounds like it.

### 5. The first screen is the whole argument

The first screen — before any scroll — must make the entire case for why this app exists, for whom, and what to do first. It should answer these three things in under five seconds without any explanation.

The failure mode is a landing page that explains itself. An app that needs to explain itself has not made its case through design.

"Train Your Eye" opens directly on the first challenge. No hero. No feature list. The left panel shows AI-written content, the right panel shows a prompt. The argument is made through the interface, not through text about the interface.

Ask: if someone covered all the text on the first screen, would the layout alone communicate what kind of experience this is? If not, the layout is not doing its job.

### 6. The distinctive feature must be the thesis made tangible

Every POC must have one thing that feels genuinely crafted — something that could not have been generated by a first-pass AI prompt. This is not the "most technically complex" feature. It is the feature that most precisely embodies the concept's core insight.

Find that insight first. Then ask: what would make it visible, spatial, interactive, or felt?

The clock face in the medication POC makes daily time navigable and spatial. The amber highlights in the critique POC make the gap between statistical and curated taste visible. The animated match glow in the volunteer POC makes the moment of alignment felt.

If the distinctive feature could be described as "a chart" or "a map" or "a list with filters" — it is not distinctive enough. It needs to be specific to this concept, this thesis, this moment.

---

## The specificity test — run this on everything

Before shipping any POC, read the copy, the palette choices, the layout decision, and the distinctive feature. For each one, ask:

> **Could this be from any other app ever made?**

If yes — it lacks taste. It is statistical. It is the averaged version of good.

If no — you are getting somewhere.

The answer should be no for:
- The first-screen copy (it should only work for this app)
- The distinctive feature (it should only make sense for this concept)
- The palette (it should feel motivated by what the concept is, not by what looks safe)
- The layout rhythm (it should feel unlike the last five POCs)

It is acceptable to answer yes for neutral infrastructure: the back link, the typography scale, the responsive breakpoints. Those are load-bearing and should not carry meaning.

---

## What statistical taste looks like — avoid all of these

These patterns appear when an agent or builder stops early. They are not wrong. They are just interchangeable.

- White or light grey background, sans-serif headline, card grid below
- Purple-to-blue gradient on the hero
- Bold claim, three bullet points, one CTA button
- Polite, corporate lede: "Discover", "Explore", "Empowering communities"
- A "seamless experience" that is described rather than felt
- A chart or map that is the only visually interesting element on an otherwise generic page
- Rounded corners and soft shadows on everything
- The same layout rhythm as the last POC, just with different content inside

When you notice yourself reaching for any of these: stop. Ask what this concept deserves instead. Generate the alternative. Reject the default.

---

## The final shift

Before AI, mediocre work took effort to produce. The effort created noise that could be mistaken for quality.

After AI, the process is easier. That noise is gone. The gap between "first AI output" and "genuinely good" is now fully visible, and it is entirely the builder's responsibility to close it.

The people who close that gap are not doing more work. They are doing more precise rejection. They are sitting with friction longer. They are naming what is wrong before they name what is right.

That is the whole thing. That is taste.
