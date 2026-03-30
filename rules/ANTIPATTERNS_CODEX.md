# Codex Anti-Patterns — Hard Rules

This file blocks the most common failure modes in agent-built frontend work in this repo. Every rule is based on patterns that have actually shipped. **Read this before writing any CSS or JSX.**

---

## 1. The Cards-and-Pills Problem

**The single most repeated failure in this repo:** every section, panel, card, button, badge, and metadata element becomes a rounded rectangle with `border: 1px solid rgba(...); border-radius: 20-30px; box-shadow: 0 18px 36px rgba(...); background: rgba(255,255,255,0.8)`. Interactive elements default to pills (`border-radius: 999px`).

The result: 90% of the visible UI is nested boxes. Every POC looks like the same SaaS dashboard in a different colour.

**Hard rules:**

- Do not apply the same `border + border-radius + box-shadow + background` formula to more than 2 element types per page. If your hero panel, content panel, sidebar, cards, and footer all share the same visual treatment — you are building the anti-pattern.
- Do not use `border-radius: 999px` on more than one element type. If your badges, buttons, metadata spans, and tags are all pills — you are building the anti-pattern.
- Before pushing, count how many CSS classes have `border-radius` above `16px`. If the answer is more than 4, you have a problem.

## 2. Boxes Inside Boxes

Agent-built layouts nest 4-5 levels of containers, each with its own border, padding, background, and radius. The result is a page that looks like a set of matryoshka dolls — rounded rectangles inside rounded rectangles inside rounded rectangles.

**Hard rules:**

- Maximum 2 levels of visible container nesting. A card inside a panel is fine. A card inside a panel inside a section inside a wrapper, all with visible borders, is not.
- Not every grouping needs a visible container. Use spacing, typography, and colour to separate content — not another box with a border.
- If you are about to write a new CSS class with `border` + `border-radius` + `padding` + `background`, check how many classes already have that combination. If the answer is more than 3, use a different visual treatment: a divider line, a background colour shift, whitespace, or nothing.

## 3. Visual Monotony Across Sections

When every section on the page uses the same border thickness, the same shadow depth, the same radius, and the same semi-transparent background — the page has no visual hierarchy. Nothing is primary. Nothing is secondary. Everything is the same importance level rendered as the same box.

**Hard rules:**

- Sections must look visually different from each other. Use contrast: one section can be a card, another can be full-bleed with a background colour, another can be borderless with generous whitespace.
- Vary at least 3 of these across sections: border treatment, background, shadow, spacing, typography scale, alignment.
- The hero/primary section must be visually dominant. If it looks the same as a metadata card in the footer, the hierarchy is broken.

## 4. Zero Structural Risk

Agent-built layouts are always perfectly aligned grids. No asymmetry. No overlap. No offset. No diagonal. No full-bleed element breaking the grid. No element positioned outside the expected flow. The result is technically correct and completely forgettable.

**Hard rules:**

- At least one element on the page must break the grid — overlap another element, bleed to the edge, use asymmetric positioning, or span an unexpected width.
- Not every layout needs to be a grid or flexbox with equal columns. Try: a single oversized element with smaller elements beside it, a staggered layout, offset positioning, or a viewport-spanning element between grid sections.
- If every section on your page is `display: grid` or `display: flex` with uniform children, you are building the anti-pattern.

## 5. Leaking the Brief Into the Interface

The user should see a product, not the agent's working notes.

Do not place any of these in visible UI copy:

- Summaries of the design brief ("Large text. Large buttons. No rushing.")
- Internal constraints restated as copy ("one screen at a time", "designed to be calm")
- Implementation promises ("easy to use", "simple to follow", "touch-friendly")
- Anything that reads like a checklist item, prompt instruction, or design rationale
- Phrases that explain the interface instead of helping the user do the task

**Test:** Would a real user need this sentence to complete the task? If no, remove it.

## 6. The Self-Check

Before pushing any frontend work, answer these honestly:

1. **Cover test:** Screenshot the page. Blur it. Can you tell it apart from the last 3 POCs, or does it look like the same layout in a different colour? If same — redesign.
2. **Box count:** How many CSS classes have `border-radius` > 16px? If more than 4 — reduce.
3. **Nesting count:** What is the deepest level of visible bordered containers? If more than 2 — flatten.
4. **Pill count:** How many element types use `border-radius: 999px`? If more than 1 — vary.
5. **Grid break:** Is there at least one element that breaks the grid, overlaps, bleeds, or is asymmetric? If no — add one.
6. **Section sameness:** Do all major sections share the same border/shadow/background treatment? If yes — differentiate them.
