---
name: Substrate Hub
description: Night-edition design-system portal — dark-first, editorial, hairline-ruled, with law-bound Aurora yellow.
colors:
  paper: "#09090b"
  paper-raised: "#0f0f12"
  surface: "#131317"
  ink: "#f4f4f5"
  ink-2: "#c9c9cf"
  muted: "#9c9ca6"
  rule: "#26262b"
  rule-soft: "#1b1b20"
  yellow: "#ffcc00"
  on-yellow: "#131316"
  yellow-hover: "#ffd633"
  amber: "#d9a514"
  live: "#00d3f2"
  live-bright: "#53eafd"
  ok: "#05df72"
  lego-red: "#e7000b"
  lego-red-highlight: "#ff6467"
  lego-blue: "#007595"
  lego-green: "#008236"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Archivo, sans-serif"
    fontSize: "clamp(3.1rem, 12.4vw, 13.5rem)"
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wght' 760, 'opsz' 96"
  headline:
    fontFamily: "Bricolage Grotesque, Archivo, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)"
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wght' 700"
  title:
    fontFamily: "Bricolage Grotesque, Archivo, sans-serif"
    fontSize: "1.65rem"
    lineHeight: 1.2
    letterSpacing: "-0.015em"
    fontVariation: "'wght' 640"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Spline Sans Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  chip: "2px"
  panel: "3px"
  stage: "4px"
spacing:
  gutter: "clamp(1.25rem, 3.5vw, 3rem)"
  rail-w: "15.5rem"
  column: "72ch"
  frame-max: "90rem"
  exhibit-gap: "2.2rem"
components:
  action:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "0.72rem 1.3rem"
  action-hover:
    backgroundColor: "{colors.surface}"
  action-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.chip}"
    padding: "0.72rem 1.3rem"
  action-primary-hover:
    backgroundColor: "{colors.yellow-hover}"
  new-signal:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.chip}"
    padding: "0.1rem 0.4rem"
  copy-btn:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.chip}"
    padding: "0.3rem 0.6rem"
  provisional:
    textColor: "{colors.amber}"
    rounded: "{rounded.chip}"
    padding: "0.05rem 0.4rem"
  rail-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  rail-num-active:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.chip}"
    padding: "0 0.25rem"
---

# Design System: Substrate Hub

## Overview

**Creative North Star: "The Night Portal"**

Substrate Hub is a night-edition design-system portal: dark-first, minimalist, editorial, slightly experimental. It keeps the grammar of a printed technical report — one hairline rule grid carries the hub, exhibits are captioned `FIG.` / `TABLE` in uppercase mono, numbers set in tabular figures — but prints it on a near-black canvas (`--paper`, #09090b, the same dark canvas the Substrate design system itself uses) with near-white ink. The display voice is Bricolage Grotesque, a variable face whose weight and optical size are themselves design material; everything else stays restrained: Archivo for UI and body, Spline Sans Mono for captions, code, and data.

The root route is the portal before the document: one full-viewport, pointer-responsive stage containing the dateline, monumental SUBSTRATE wordmark, positioning, four task-first actions led by yellow `Open overview`, and the install line. Its moving lamp, revealed grid, lower-right Star Burst, ghost parallax, and per-letter weight response form one authored invitation into `/overview`; they are a landing-only behavior, not a template for the numbered hub pages.

Below that invitation, the root continues into **System Construction**: a full-viewport, scroll-scrubbed 3D tour of a LEGO-like system pyramid. It rotates as the visitor scrolls, moves the camera into each tier in sequence, names that tier in a few words, returns to the complete architecture, and ends with a direct handoff into `/overview`.

Color is rationed by law. Aurora yellow (#ffcc00) appears exactly three times in the hub's own chrome: the one primary action on a surface, the tiny `new` signal, and the active section's number chip in the contents rail (user-extended 2026-08-26). Cyan (#00d3f2) appears only where something is genuinely live — a rendered-by-the-real-package figure, a recalc tick, a `feat` line in the feed. Everything else is drawn in a zinc ramp of inks, muteds, and hairlines. Status is never a colored badge: it is a small drawn mark (solid, dotted, half-filled, hollow, hatched) plus the word. Emphasis is achieved by inversion — active filters, selection, and the Substrate layer of the pyramid flip to ink-on-paper — not by adding color; the one sanctioned color emphasis is the rail's yellow active-number chip.

- **Key Characteristics:**
  - Dark-first (`color-scheme: dark`, html carries `.dark`); no light theme exists.
  - One hairline rule grid; borders do the structural work, not shadows or fills.
  - Editorial exhibit grammar: mono uppercase captions, ruled sections, numbered contents rail with keyboard direct address (1–7).
  - Variable-font display voice; the landing turns the `wght` axis into a direct response to light.
  - Accent color is law-bound (yellow = primary action + new + active-section chip; cyan = live; amber = provisional).
  - Real components rendered live from `@aurora-ui/substrate` are content and follow the DS's own palette, not the hub's laws.

## Colors

A zinc-neutral night ramp with three law-bound accents; the ground is the design system's own dark canvas, so live DS components sit on it natively.

### Primary
- **Aurora Yellow** (#ffcc00): the single primary action per surface (`.action-primary`), the `new` signal chip, and the active section's number chip in the contents rail. Electric on the night ground; its rarity is the point. Text on yellow is always **On-Yellow** (#131316), never white. Hover brightens to #ffd633 with a yellow-tinted glow.

### Secondary
- **Live Cyan** (#00d3f2): marks liveness only — the root landing's lamp-coordinate readout, the recalc tick in the playground readout, and `feat` entries in the feed. **Live Bright** (#53eafd) is its flash state during the recalc tick.

### Tertiary
- **Provisional Amber** (#d9a514): the `provisional · …` mark for values awaiting their real replacement (dashed border mixed 45% amber into paper). Amber means "unconfirmed", never "warning".
- **OK Green** (#05df72): one job — the `copied` confirmation state on copy buttons.

### Neutral
- **Paper** (#09090b): the page ground; matches the DS dark canvas.
- **Paper Raised** (#0f0f12): panels one step up — code blocks, actions at rest, playground shell, kbd.
- **Surface** (#131317): hover fills (rows, rail items, actions) and the pyramid base.
- **Ink** (#f4f4f5): headings, primary text, strong table rules, and the inversion fill for active states.
- **Ink-2** (#c9c9cf): ledes, body-secondary, code text.
- **Muted** (#9c9ca6): captions, datelines, dims, deprecated text.
- **Rule** (#26262b): the standard hairline — exhibit tops, masthead bottom, panel borders.
- **Rule Soft** (#1b1b20): the quieter hairline — row separators, rail borders, internal panel dividers.

### Named Rules
**The Yellow Law.** In hub chrome, #ffcc00 may appear only on the one primary action of a surface, on the `new` signal, and on the contents rail's active-section number chip. A dark yellow **wash** (22% Yellow into Paper) additionally grounds the pyramid's highest-leverage UX layer. Code panels use one restrained treatment: a 2% Yellow wash with a 24% Yellow Rule border. It keeps implementation material recognizable without competing with the primary action. Content rendered by `@aurora-ui/substrate` (e.g. the `eos` Button variant) is content, not chrome — its yellow is exempt.

**The Cyan-Live Rule.** Cyan marks things that are genuinely live or newly landed (landing coordinate readout, recalc tick, `feat` feed type). Never use it decoratively.

**The Inversion Rule.** Emphasis and selection flip ink and paper (`::selection`, `aria-pressed` filter, the Substrate pyramid layer) rather than introducing a new color; the rail's `aria-current` item instead fills Surface and carries the yellow number chip.

## Typography

**Display Font:** Bricolage Grotesque (variable `wght`/`opsz`; falls back to Archivo)
**Body Font:** Archivo (with system-ui, sans-serif)
**Label/Mono Font:** Spline Sans Mono (with SFMono-Regular, Consolas)

**Character:** A characterful, slightly experimental display voice over a deliberately plain UI face and a technical mono. Weight is set with `font-variation-settings` (760 / 700 / 640 / 620 steps), never plain `bold`, so the variable axis stays animatable.

### Hierarchy
- **Display** ('wght' 760 'opsz' 96, clamp(3.1rem, 12.4vw, 13.5rem), 0.92): the root landing's SUBSTRATE wordmark — monumental, uppercase, -0.03em, with an outline ghost twin at 'wght' 300. The `/overview` stage uses the larger incumbent display range (clamp(4.6rem, 16vw, 16.5rem)).
- **Headline** ('wght' 700, clamp(2.4rem, 5.2vw, 4.6rem), 1.02): inner-page cover `h1`, max 18ch, -0.025em.
- **Stage position** ('wght' 620, clamp(1.4rem, 2.4vw, 2.1rem), 1.15): the root landing's positioning line, max 26ch. The `/overview` stage uses clamp(1.5rem, 2.7vw, 2.3rem), also at 1.15, capped at 24ch.
- **Statement** ('wght' 700, clamp(2.1rem, 3.6vw, 3.3rem), 1.05): `h2.statement`, an exhibit heading promoted to a scroll peak (at most one per page — the `/overview` quick-start "Install once, import everywhere."), max 20ch, -0.022em.
- **Title** ('wght' 640, 1.65rem): exhibit `h2`, max 30ch. Sub-titles (`h3`) are 1.05rem weight 650 in Archivo.
- **Body** (400, 16px, 1.6): Archivo; paragraphs cap at 72ch (`--column`), ledes at 62ch and 1.08rem in Ink-2, notes at 0.86rem in Muted.
- **Label** (mono, 0.66–0.72rem, +0.06 to +0.16em tracking, UPPERCASE): exhibit captions, table headers, datelines, rail label, feed types, control legends. Always `font-variant-numeric: tabular-nums` where numbers appear.

### Named Rules
**The Mono Caption Rule.** Anything that names, numbers, or timestamps an exhibit is uppercase Spline Sans Mono at ~0.7rem with wide tracking and muted color. Data (versions, dates, counts, hashes) is always tabular-nums.

**The Variable Weight Rule.** Display weights are `font-variation-settings` steps (620–760), keeping the wordmark-settle animation possible; the masthead title runs 'wght' 700 at 1.02rem with +0.16em uppercase tracking.

## Layout

The root `/` route deliberately sits outside the document shell. Its landing stage is exactly one small viewport tall (`100svh`) on larger screens, clips overflow, and uses a vertical composition: ruled dateline, flexible centered wordmark field, then a seamless bottom body band. The band holds the pitch and actions at left and the live lamp-coordinate readout at right without drawing a divider through the illuminated grid. The primary `Open overview` action hands off to `/overview`; the other actions go directly to components, installation, and patterns.

Inside `/overview` and the numbered hub routes, the document frame is a two-column grid — a 15.5rem sticky contents rail plus a fluid page column — capped at 90rem and padded by a fluid gutter (`clamp(1.25rem, 3.5vw, 3rem)`). A sticky, blur-backed masthead (paper at 88% opacity, backdrop blur 10px, hairline bottom) sits above; the rail sticks at 3.4rem below it and carries the seven numbered sections (01–07) with a `kbd` hint — keys 1–7 navigate directly. A colophon footer reuses the frame grid with an empty rail cell.

Hub pages are stacks of **exhibits**: each opens with a 1px Rule top border, a mono caption row (designation left, meta/cross-link right), then content; 2.2rem separates exhibits and 2.8rem pads their bottoms. `/overview` preserves the original bordered, spotlit drafting stage before its pyramid, quick start, live playground, coverage, latest-source feed, and resources; other inner pages open with a **cover** (mono issue line, oversized h1, standfirst). Vertical rhythm is rem-based; there is no spacing scale beyond the gutter — hairline rules, not whitespace blocks, delimit content.

Responsive: at 64rem the playground, pyramid, roadmap, and resource columns collapse to one column. At 52rem the hub frame goes single-column, the rail flattens into a horizontal wrap (borders and hint dropped), the masthead subtitle and overview-stage ghost disappear, and feed rows shed their type and hash columns. At the same breakpoint the root landing becomes scroll-safe (`height: auto; min-height: 100svh`), hides its ghost and coordinate readout, gives the wordmark field a bounded 18–25rem / 43svh height, stacks the dateline, and turns actions into a two-column grid with the yellow primary spanning both columns. The install line fills the width and its command may scroll horizontally.

## Elevation & Depth

Effectively flat: depth is tonal (Paper → Paper Raised → Surface) plus hairline rules, and the masthead's translucency-with-blur. Shadows exist only as hover responses on actions.

### Shadow Vocabulary
- **Action hover** (`box-shadow: 0 3px 14px -6px rgba(0, 0, 0, 0.8)`): secondary actions lifting on hover.
- **Primary glow** (`box-shadow: 0 5px 22px -6px rgba(255, 204, 0, 0.45)`): the yellow action's hover, a yellow-tinted glow.
- **Tick glow** (`text-shadow: 0 0 14px rgba(83, 234, 253, 0.55)`): the cyan recalc flash, decaying over 700ms.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest; a shadow only ever answers a hover, and it is always soft, dark or accent-tinted, never an offset hard shadow.

## Shapes

Near-square geometry: radii run 2px (actions, chips, copy buttons, filter groups), 3px (code blocks, install line, playground panel, kbd), 4px (the hero stage) — corners read as machined, not friendly. Everything is bordered in 1px hairlines; the only dashed borders are meaningful (the provisional mark's amber dash, the pyramid's "product variants possible" layer). Focus is a 2px Ink outline offset 2px. Icons are drawn inline SVG strokes at a single weight (~1.2–1.4, `strokeLinecap: square`, 9–10px viewBox): the external-link arrow and the five status marks. Status is physical shape, not tint — solid square = stable, dotted square = proposed, half-filled = experimental, hollow = planned, hatched X = deprecated (deprecated rows also strike through in Muted).

**The Mark-Not-Tint Rule.** Status and link affordances are drawn marks in `currentColor`, never glyph-font icons, emoji, or color-coded badge pills.

## Components

### Actions (buttons/links styled as `.action`)
- **Shape:** near-square (2px radius), 1px hairline border.
- **Primary:** Aurora Yellow fill, On-Yellow text, 0.72rem × 1.3rem padding, 0.92rem/600 Archivo. One per surface (Yellow Law).
- **Secondary:** Paper Raised fill, Ink text, Rule border; hover fills Surface, border brightens to Muted, soft shadow appears.
- **Active:** `translateY(1px)` press. Transitions 150ms on the shared ease.
- External actions append the drawn `ExtArrow` SVG.

### Root landing stage (signature surface)
- **Composition:** no masthead, rail, or document frame. A `100svh` Paper stage carries the ruled dateline, the flexible wordmark field, and an unruled body band so the grid remains visually continuous. The body presents positioning, concise composite-layer copy, `Open overview` / `Browse components` / `Install Substrate` / `Explore patterns`, then the real CLI install command.
- **Lamp and grid:** two broad elliptical radial gradients follow `--lx` / `--ly`; the outer 140% × 120% gradient vignettes the edges while the brighter 82% × 68% Rule/Ink-mixed core opens onto the Paper ground. A 2.6rem two-axis zinc grid is visible only through a matching 120% × 100% elliptical radial mask centered on the lamp.
- **Pointer response:** pointer coordinates are eased toward at 7% per animation frame. Within a 220px radius, each display letter swells quadratically from 'wght' 760 toward 900; the outline ghost shifts against normalized pointer position, and the mono cyan readout reports rounded x/y coordinates. Letter centers are measured only when the root or wordmark resizes; font-weight and readout DOM writes occur only when their rounded values change.
- **Star Burst (user-specified 2026-08-27):** a transparent DPR-aware canvas adapted from Originkit's Star Burst replaces the drifting dust. Twenty-eight seeded Ink spokes radiate from the lower-right corner; each carries 15 additive, twinkling streak pulses over a concentrated flower bloom. Motion is time-based, drawing pauses while the document is hidden, and a `ResizeObserver` keeps the canvas fitted without obscuring the lamp or grid.
- **Touch:** when hover is unavailable, and before the first real pointer movement on hover-capable devices, the lamp follows a slow sinusoidal autopilot so the authored response remains visible without requiring a cursor.
- **Reduced motion:** the pointer animation loop never starts. The CSS defaults hold a static lamp at 30% / 24%, the Star Burst warms up to one still frame, the wordmark stays fully legible at 'wght' 760 / 'opsz' 96, the ghost does not parallax, and transitions collapse with the global reduced-motion rule.
- **Scope:** this orchestration belongs only to `/`. `/overview` receives the visitor into the established hub shell and uses a separate report-motion sequence: its stage recedes with scroll, then exhibit captions and genuine list structures typeset once as they enter.

### System Construction (landing continuation)
- **Composition:** a `760svh` runway (`680svh` at ≤52rem) holds one sticky `100svh` drafting plate. On desktop, the Three.js canvas is full-bleed across the plate and uses an off-axis camera composition that places the pyramid's center at 68% of the viewport width—the middle-right field—while allowing it to pass behind the framing copy and narrative; the four compact direct-address controls remain a ruled foreground layer above it. At ≤52rem the established centered mobile composition remains unchanged. The tour is meaningful bottom-to-top: Tokens establish shared decisions; Primitives are shareable components built once and reused instead of rebuilt product by product; Composites are complete, production-ready components; Products present one unified EOS experience across Chronos, Amun, Origin, Solaris, and Lumus.
- **Material:** the pyramid uses shared instanced box and stud geometry — 84 blocks and 336 studs in eight principal draw calls — instead of downloaded assets. Every tier is completely color-coded from base to studs: Tokens use Red (`#e7000b` / `#ff6467`), Primitives use Blue (`#007595` / Live `#00d3f2`), Composites use Green (`#008236` / OK `#05df72`), and Products use Yellow (`#ffcc00` / `#ffd633`). These colors encode the illustrated architecture rather than hub chrome, so the model is exempt from accent-rationing rules. Standard materials, a restrained grid, and three bounded lights provide form without shadows or a continuous render loop.
- **Scroll:** Anime.js's Three adapter animates the actual `Object3D` rotation, camera, look target, tier lift, and tier scale across one 10.7-second authored timeline: spin → zoom in → explain → zoom out, repeated once per tier, then one final zoom-out into the overview invitation. Wheel and trackpad movement remains fully native and proportional—no gesture is intercepted and no chapter advances on its own. The Scroll Observer follows the visitor's exact position with a `0.35` eased catch-up, smoothing camera and model motion without taking control away from the pointer. Once the first layer begins, the framing title remains greyed throughout every inter-layer transition and yields completely only to the final invitation.
- **Interaction:** pointer position adds a bounded orbit offset. Raycasting brightens the tier under the cursor; selecting a tier or using one of the four ruled layer buttons updates the highlighted layer and explanation in place, then eases the model toward a bounded index-based yaw of at most 4.5°. The page position and camera timeline do not move. Scrolling alone controls the spin and zoom choreography, clears the direct selection, and eases that selection yaw back to neutral; the buttons provide direct selection for keyboard and touch users.
- **Ending:** the final chapter recedes the pyramid and reveals “Ready to explore Substrate?” with the surface's yellow `Open the overview` action. Before the model becomes a fixed `100vw × 100svh` overlay, the interaction captures its rendered rectangle and active camera frustum; the expanded renderer composes that exact projection into the fullscreen field, so the assembled pyramid does not shift at the handoff. A 120ms still-frame breath makes that continuity perceptible, then all 84 LEGO bricks break apart individually over 1100ms using staggered smootherstep trajectories with zero start/end velocity: every brick receives a deterministic outward vector and three-axis spin while its four studs remain rigidly attached. The 3D grid is forced into a non-depth-writing background render pass and begins fading immediately, guaranteeing every departing brick paints above it. One shared progress value updates the existing instance matrices without adding draw calls or per-brick animation objects. The materials, backdrop, and interface use lengthened eased fades into pure black, followed by a 220ms cleared-screen hold before navigation to `/overview`.
- **Reduced motion:** sticky choreography is removed. The complete static Three.js pyramid, all four concise explanations, and the final overview action render as a normal document sequence; progress resolves to 100%, and the final action navigates immediately without the spatial disassembly. If WebGL cannot initialize, a semantic four-tier CSS pyramid remains visible and navigation remains immediate.

### Exhibit (the page's structural unit)
- 1px Rule top border; mono caption row: `strong` designation in Ink (e.g. "Fig. 2 — live render · Investment Case Selection Card" — compound names are spaced for the uppercase caption), meta flush right in Muted (often a numbered cross-link like "full index → 03"). The cyan `●` caption dot was retired at the user's request (2026-08-26); liveness now reads through the recalc tick alone.

### Contents Rail
- Sticky ordered list; each item is a hairline-separated row of mono two-digit number + Archivo title (0.9rem). Hover fills Surface; the current page fills Surface with a 650-weight title and its two-digit number set as a yellow chip (On-Yellow text, 2px radius, 0 0.25rem padding). Footer hint documents the 1–7 direct-address keys with bordered `kbd` caps.

### Code blocks & Install line
- **CopyBlock:** Paper Raised with the shared 2% Yellow wash, a 24% Yellow Rule border, and a 3px radius. Its mono uppercase label is a 45% Yellow mix into Ink-2; 0.82rem code uses Ink; the absolute `copy` button stays Paper with a Rule border. The button is mono uppercase 0.7rem; on success it turns OK Green and reads `copied` for 1.6s. The Get started agent prompt uses the same plate and copy behavior, but wraps in Archivo because it is an instruction to read and paste rather than source code.
- **InstallLine:** the compact single-command variant — inline flex on the same restrained 2% Yellow-washed Paper Raised panel with a 24% Yellow Rule border, a non-selectable muted `$` prompt, and a fixed-width inline copy button. Success reads `copied` for 1.6s and is announced politely; when the Clipboard API is unavailable, the command is selected in place and the button reads `selected` so manual copy remains obvious.

### Tables
- Full-width, collapsed borders, 0.9rem, tabular-nums. Headers are mono uppercase 0.66rem Muted over a 1px **Ink** rule (the strong rule); body rows separate with Rule Soft and hover-fill Surface. Numeric columns right-align (`.num`). Wide tables wrap in `.table-scroll` (min-width 40rem, contained overscroll). Deprecated rows strike through.

### Status marks
- `StatusMark` is a 9px physical mark used where status is part of the task, such as roadmap commitment versus exploration. The adjacent label names that route-specific state in mono Ink-2. Proposed metadata remains in source data but never renders as a page label.

### Feed (overview)
- Hairline-separated grid rows: mono date (Muted) · type tag (mono, cyan when `feat`) · summary (first entry gets the yellow `new` signal) · mono hash link. Collapses to date + summary at 52rem.

### Release notes
- The releases page shows only the current and immediately previous versions. Both use the full imported Markdown release-note format with a direct GitHub release link; source-history and multi-release log feeds do not appear on this route.

### Provisional mark
- Inline mono uppercase chip, Amber text, 1px dashed amber-mixed border, reading `provisional · <what>`. Every render corresponds to a TODO on the replacement list; it is honest signage, not decoration.

### Playground (signature component)
- Two-panel bordered figure: render stage (min 23rem, faint 2.2rem two-axis gridline wash over Paper Raised, centered live DS component) beside a controls column on Paper driven by real DS `Select`/`Input`/`Checkbox`. A mono readout bar states provenance ("rendered from @aurora-ui/substrate · dist") and stamps `recalc HH:MM:SS.mmm` in Live Cyan on every option change, flashing Live Bright. Below the controls, a generated import snippet mirrors the current props inside the same restrained 2% Yellow-washed Paper Raised panel with a 24% Yellow Rule border and 3px radius.

### Filter group (component gallery)
- Search and segmented mono-uppercase layer controls sit in one opaque sticky ruled bar above the gallery; pressed filters invert Ink-on-Paper. The flush-right mono `aria-live` readout reports the number of visible live specimens rather than the package export total.

### Component gallery
- `/components` is a live, code-free specimen wall rather than a source table. Every displayed object renders from `@aurora-ui/substrate`; labels and direct Storybook links sit in a separate ruled caption band so the components remain the visual subject.
- The wall uses a dense 12-column drafting grid with deliberately mixed 4-, 6-, and 8-column specimens. A hero composite, wider interaction families, and compact primitives create varied pacing without equal-card repetition. At 64rem the wall becomes two columns with the hero full width; at 52rem every specimen becomes a single column.
- Specimen stages use Paper Raised and the established drafting grid. The hub frames but does not visually rewrite package components. Search empty state offers one explicit gallery reset; no source rows or code snippets appear.
- Gallery interaction specimens stay functional: the slider is controlled and announces its live percentage, while the tabs use the package's line variant inside a ruled dark data panel with yellow active indication, compact mono navigation, and context/value/detail hierarchy.

### Forms pattern overview
- `/patterns` is deliberately singular: it presents Forms as the only established interaction pattern, renders the Storybook structure-and-grouping example with live package components, and sends deeper guidance directly to Storybook. Emerging task-area guidance does not appear on the index.
- `/patterns/forms` is a high-level, code-free pattern map. It renders three representative moments from `@aurora-ui/substrate` — ordinary entry, validation and recovery, and a sensitive confirmation — instead of duplicating Storybook's chapter, component, and example inventories.
- A full-width structure specimen leads; the two supporting states use a container-responsive `auto-fit` grid so they become one column whenever the document column cannot hold both. Every stage uses the established ruled Paper Raised field, while captions stay in separate bands and preserve lead → validation → sensitive DOM order.
- The specimens remain functional: visitors can repair the invalid market release and exercise the sensitive-action state. One final ruled handoff carries the page's yellow primary action and sends visitors to the complete Storybook chapters, examples, accessibility checks, and interaction tests.

### Pyramid (signature figure)
- Inline SVG report exhibit drawn entirely in the token palette via `var(--…)`: hollow-dashed top layer (products); a yellow-washed middle layer (fill 22% Yellow into Paper, Yellow stroke and title) for composite components and interaction patterns — **Substrate’s highest-leverage UX layer**; and a quieter 7% Yellow-tinted foundation for UI primitives and tokens. A yellow drafting bracket labeled `SUBSTRATE` spans both lower layers, showing that Substrate includes the foundation but doubles down on the UX core.
- **Interactive (user-accepted 2026-08-26; revised 2026-08-28):** each layer is an SVG anchor button (`.pyr-btn`, hover brightens 1.3, focus-visible 2px Ink outline) driving local client state (`PyramidFigure`) — no hash change and no scroll jump. Exactly one note is open at a time; **the UX core opens by default**. Notes mirror the pyramid order top-to-bottom. They explain where products differentiate, why composite components and interaction patterns are higher leverage than product-specific flows, and how the shared foundation supports that work. The exchange is a staged handoff (user-tuned 2026-08-26): the closing note collapses at 380/240ms, the opening one expands at 550/450ms after a 120ms delay, all on the shared ease; the open note's mono label inverts Ink-on-Paper (its own 260ms transition), and the selected SVG layer's stroke thickens to 2.3 via `aria-pressed`.

### Theming contract with the DS
- The hub imports `@aurora-ui/substrate/style.css` globally and pins `html.dark`, so DS components render in their own dark tokens on the shared #09090b ground. DS styles live in cascade layers; the hub's unlayered CSS wins specificity ties by design. DS-rendered visuals are content: never restyle them to hub laws, and never screenshot them — render the real package. **One user-granted exception (2026-08-26):** DS form controls (`input[data-slot='input']`, `[data-slot='select-trigger']`, `[data-slot='checkbox']`) carry the yellow family site-wide — border color 30% Yellow into Rule plus a 1px inset ring at 15% Yellow; fills stay DS-dark.

### Motion
All micro-transitions run 120–160ms on `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`). Motion is sparse and role-bound: identity uses the 1100ms variable-weight settle; the root stage adds direct lamp/Star Burst/letter response as one inseparable authored moment; System Construction uses proportional native scrolling with Anime.js `0.35` eased synchronization and its Three adapter for the four-chapter camera tour; `/overview` retains its 18s alternating ghost drift and adds a Motion-driven stage exit plus Anime.js caption/list assembly; the playground uses a 700ms cyan recalc flash; the contents rail answers navigation in ~200ms; and the pyramid uses its measured 380/240ms close then 550/450ms open handoff.

**The Authored Motion Rule.** New motion must justify itself as identity, atmosphere, liveness, or navigation feedback. Under `prefers-reduced-motion: reduce`, the root stage does not create its animation loop, System Construction becomes a static explorable document, the overview scroll choreography detaches and restores static content, all keyframes are disabled, smooth scroll turns off, and every transition collapses to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** start every content section as an `Exhibit`: 1px Rule top border, mono uppercase caption with designation left and meta right.
- **Do** keep exactly one yellow action per surface, reserve the `new-signal` chip for the newest item only, and let the rail mark the active section with its yellow number chip.
- **Do** set all captions, datelines, table headers, hashes, and counts in Spline Sans Mono, uppercase, wide-tracked, `tabular-nums`.
- **Do** express state by inversion (Ink fill, Paper text) for pressed filters and selection; the rail's active item uses Surface fill plus the yellow number chip.
- **Do** use physical status marks with explicit words only when the status helps the visitor act; never surface proposed as a page label.
- **Do** render DS components live from `@aurora-ui/substrate` and label their provenance in the readout/caption.
- **Do** mark every unconfirmed value with the amber `Provisional` chip and a matching replacement-list entry.
- **Do** keep the lamp, Star Burst, pointer/touch response, and per-letter weight behavior together on `/`; hand visitors into the document at `/overview`.

### Don't:
- **Don't** introduce a light theme or per-component background overrides; #09090b is the only ground.
- **Don't** use yellow, cyan, amber, or green outside their laws (primary/new/active-section chip, live, provisional, copied).
- **Don't** tint status with color, use glyph-font icons or emoji, or replace drawn SVG marks with badges.
- **Don't** add shadows at rest, radii above 4px, or borders heavier than 1px (the strong table rule stays 1px Ink).
- **Don't** generalize the root landing's pointer lamp, Star Burst canvas, or per-letter response into the numbered hub pages.
- **Don't** ship decorative motion that survives `prefers-reduced-motion: reduce`.
- **Don't** restyle DS-rendered content to hub chrome laws, and don't move hub CSS into cascade layers (unlayered hub CSS deliberately wins ties over the DS's layered styles).
