---
priority: HIGHEST — read before any UI decision
mandatory: true
---

# Design Diversity — Mandatory Rotation Rules

> ⚠️ HIGHEST PRIORITY. These rules override default layout instincts and override any "safe" UI choice.
> Read this file **completely** before reading `FRONTEND_IDEATION.md`.
> If any rule here conflicts with your default approach, **this rule wins**.

---

## Why this file exists

The last several POCs have been too visually similar despite having different "themes". They are all still rectangular web pages with content areas, headings, and interactive elements arranged in the same rhythm. A "diagram-first" POC and a "map-first" POC still feel like siblings if the underlying page structure, font weight, and interaction grammar are the same.

The root cause: agents default to "web app with creative data presentation". The fix: agents must first pick **what kind of app this is** before deciding how to present data.

---

## ⚠️ MANDATORY STEP — run before any design decision

1. Read `ideas/GOOD_SG.json` and extract the last 5 entries where `"built": true` (reverse order — most recent first).
2. For each, note:
   - `ui.direction`
   - `ui.interaction_model`
   - The dominant structural pattern: did it use cards? a grid? a board? a timeline? a map?
   - Was it primarily static (user reads) or dynamic (user plays/drags/gestures)?
   - How was the title/headline positioned — top-left? centered? large hero?
3. Build a **"forbidden patterns"** list for the new POC. It must not repeat any of these.
4. From `APP_TYPE_POOL` below, pick the type **furthest** from the last 5 builds.
5. Write down your chosen `app_type` before writing a single line of code.

---

## APP_TYPE_POOL

Every new POC must be assigned exactly one type from this pool.
The chosen type **must not appear** in the last 5 built POCs' dominant patterns.

| app_type | What it looks like | Structural tell | Key libraries to consider |
|---|---|---|---|
| `game` | Browser game with score, lives, win/lose states, levels | No traditional page structure — full viewport play area | `framer-motion`, canvas, custom CSS |
| `mobile-shell` | Looks exactly like a native iOS or Android app inside a phone frame | Phone bezel rendered in browser, thumb-zone-aware layout, bottom nav bar | `framer-motion`, CSS perspective |
| `interactive-map` | Spatial canvas IS the entire UI — zones, pins, overlays | No content below the fold — map fills the viewport | SVG, canvas, `leaflet`, `react-map-gl` |
| `gamified-learning` | 2D drag/match/sort/reveal educational experience with XP, streaks, badges | Progress bar, stage/level indicator, celebration moments | `framer-motion`, canvas, custom scoring |
| `animation-heavy` | Three.js, WebGL, or canvas animation as the primary surface | The moving thing IS the content, not decoration | `three.js`, `react-three-fiber`, `@react-spring/three` |
| `social-feed` | Looks like Reddit, Twitter, or Instagram — scrollable content feed with votes/reactions | Feed cards but in a social product shell, not a dashboard | Custom CSS, `framer-motion` |
| `parallax-story` | Scroll-driven storytelling — sections animate in as the user scrolls | The page tells a story; scrolling IS the interaction | `framer-motion`, CSS scroll-driven, `gsap` |
| `terminal-console` | Monospace font, CLI aesthetic, typed output, command-style inputs | Dark background, no rounded corners, text IS the UI | Custom CSS, `xterm.js` or hand-rolled |
| `chat-conversation` | Conversational UI — message bubbles, a bot/assistant voice, back-and-forth | No forms — user responds to questions through a thread | `framer-motion`, custom CSS |
| `kiosk-immersive` | Full-screen, single-focus, oversized targets — designed for a physical kiosk or tablet | One thing per screen, huge typography, no dense UI chrome | `framer-motion`, CSS viewport units |
| `data-art` | Data visualization designed as art — generative, ambient, or aesthetic | The visual IS the data; no tables, no cards | `d3`, `three.js`, canvas, `react-spring` |
| `radial-explorer` | Central node with branching radial navigation, spider/web layout | Content organised as a graph, not a list | SVG, `d3-force`, `framer-motion` |
| `splitscreen-compare` | Two or more panels that react to each other — drag divider, mirror state | Viewport split — the comparison IS the interface | CSS grid, `framer-motion` |
| `editorial-longform` | Magazine layout — full-bleed images, pull quotes, reading rhythm | Scrolling article structure, not an app shell | CSS grid, custom typography |
| `ambient-display` | The UI breathes — it is meant to be glanced at, not interacted with | Minimal interaction, time-driven animation, live feel | CSS animation, `framer-motion`, `recharts` |

---

## Typography rotation — mandatory

Before picking fonts, note what the previous POC used. Do not repeat:

- Font family (if previous used `Inter`, try `Space Grotesk`, `DM Sans`, `Sora`, `Outfit`, `Plus Jakarta Sans`, `Bricolage Grotesque`, `Cabinet Grotesk`, or a serif)
- Font weight pattern (if previous was bold headline + light body, try monospace, or all-caps small, or oversized display)
- Heading size relationship (if previous had a large hero H1, try a small-label-above + oversized number, or no H1 at all)

---

## Layout composition rotation — mandatory

Before placing any element, note how the previous POC positioned the title and primary content. Then rotate:

| If previous did this… | You must try one of these instead |
|---|---|
| Title top-left, content below | Title centered with large visual, or title bottom-left, or no visible title (icon-first) |
| Centered hero layout | Left-aligned editorial flow, or right-anchored panel with left canvas |
| Card grid (even if themed) | Full-screen single element, or horizontal scroll strip, or radial layout |
| Top nav + content body | Bottom nav (mobile-shell), or no nav (single page), or left margin nav |
| White/light background | Dark background, or full-bleed color, or textured/gradient canvas |
| Sans-serif headline | Serif, monospace, or display typeface |
| Rounded corners and soft shadows | Hard borders, no radius, flat color, or glass-morphism |

---

## Structural anti-patterns — banned if overused

These are banned whenever they appeared in **any** of the last 3 built POCs:

- A grid or row of cards (even styled differently)
- A "planner" grid layout with time slots
- A horizontal strip/storyboard of items
- A two-panel left-nav + right-content structure
- A progress bar as the primary interactive element

If in doubt: **choose the option that would surprise someone who browsed the last 5 POCs**.

---

## The "opposite game" — use this when stuck

Look at the most recently built POC. For each of its dominant traits, do the opposite:

| Most recent POC had… | New POC should try… |
|---|---|
| Many small elements | One giant element |
| Light / pastel palette | Dark or saturated palette |
| Lots of interactivity | Mostly ambient / observational |
| Horizontal layout | Vertical or radial layout |
| Text-heavy | Almost no text — icon or visual-first |
| Static layout | Heavy animation |
| Standard web font | Display, monospace, or hand-crafted typography |
| Flat / 2D | Perspective, depth, or 3D |
| Top-aligned content | Center or bottom-aligned |

---

## Spawning subagents for design research

If you are unsure whether your planned layout feels distinct enough, you **may spawn a subagent** to:
- Read the last 3 POC files in `app/pocs/` and return a structural description
- Check whether your planned `app_type` has been used in the last 5 builds
- Research how a specific library (`three.js`, `framer-motion`) is typically used for the chosen app type

Do not spawn subagents to write implementation code. The implementation stays in the main agent.

---

## Sign-off checklist — before writing any code

Answer all of these before touching a single file:

- [ ] What are the last 5 built POC `app_type` categories?
- [ ] What is my chosen `app_type` for the new POC, and why is it different?
- [ ] What font family will this use — and has it been used in the last 3 POCs?
- [ ] Where is the title positioned? Is that different from the last POC?
- [ ] Does my layout avoid every item in the "forbidden patterns" list?
- [ ] What is the one thing that would genuinely surprise someone who has seen the last 5 POCs?

**If you cannot answer all 6 questions, you are not ready to design.**
