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
typography:
  display:
    fontFamily: "Bricolage Grotesque, Archivo, sans-serif"
    fontSize: "clamp(4.2rem, 13.6vw, 12.5rem)"
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
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Substrate Hub

## Overview

**Creative North Star: "The Night Portal"**

Substrate Hub is a night-edition design-system portal: dark-first, minimalist, editorial, slightly experimental. It keeps the grammar of a printed technical report — one hairline rule grid carries every page, exhibits are captioned `FIG.` / `TABLE` in uppercase mono, numbers set in tabular figures — but prints it on a near-black canvas (`--paper`, #09090b, the same dark canvas the Substrate design system itself uses) with near-white ink. The display voice is Bricolage Grotesque, a variable face whose weight and optical size are themselves design material (the wordmark literally settles from thin to heavy on load); everything else stays restrained: Archivo for UI and body, Spline Sans Mono for captions, code, and data.

Color is rationed by law. Aurora yellow (#ffcc00) appears exactly twice in the hub's own chrome: the one primary action on a surface, and the tiny `new` signal. Cyan (#00d3f2) appears only where something is genuinely live — a rendered-by-the-real-package figure, a recalc tick, a `feat` line in the feed. Everything else is drawn in a zinc ramp of inks, muteds, and hairlines. Status is never a colored badge: it is a small drawn mark (solid, dotted, half-filled, hollow, hatched) plus the word. Emphasis is achieved by inversion — active nav items, active filters, selection, and the Substrate layer of the pyramid all flip to ink-on-paper — not by adding color.

- **Key Characteristics:**
  - Dark-first (`color-scheme: dark`, html carries `.dark`); no light theme exists.
  - One hairline rule grid; borders do the structural work, not shadows or fills.
  - Editorial exhibit grammar: mono uppercase captions, ruled sections, numbered contents rail with keyboard direct address (1–8).
  - Variable-font display voice; type animation is an authored moment, not decoration.
  - Accent color is law-bound (yellow = primary action + new; cyan = live; amber = provisional).
  - Real components rendered live from `@aurora-ui/components-v2` are content and follow the DS's own palette, not the hub's laws.

## Colors

A zinc-neutral night ramp with three law-bound accents; the ground is the design system's own dark canvas, so live DS components sit on it natively.

### Primary
- **Aurora Yellow** (#ffcc00): the single primary action per surface (`.action-primary`) and the `new` signal chip. Electric on the night ground; its rarity is the point. Text on yellow is always **On-Yellow** (#131316), never white. Hover brightens to #ffd633 with a yellow-tinted glow.

### Secondary
- **Live Cyan** (#00d3f2): marks liveness only — the `●` dot in a live exhibit caption, the recalc tick in the playground readout, and `feat` entries in the feed. **Live Bright** (#53eafd) is its flash state during the recalc tick.

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
**The Yellow Law.** In hub chrome, #ffcc00 may appear only on the one primary action of a surface and on the `new` signal. Content rendered by `@aurora-ui/components-v2` (e.g. the `eos` Button variant) is content, not chrome — its yellow is exempt.

**The Cyan-Live Rule.** Cyan marks things that are genuinely live or newly landed (live render dot, recalc tick, `feat` feed type). Never use it decoratively.

**The Inversion Rule.** Emphasis and selection flip ink and paper (`::selection`, `aria-current` rail item, `aria-pressed` filter, the Substrate pyramid layer) rather than introducing a new color.

## Typography

**Display Font:** Bricolage Grotesque (variable `wght`/`opsz`; falls back to Archivo)
**Body Font:** Archivo (with system-ui, sans-serif)
**Label/Mono Font:** Spline Sans Mono (with SFMono-Regular, Consolas)

**Character:** A characterful, slightly experimental display voice over a deliberately plain UI face and a technical mono. Weight is set with `font-variation-settings` (760 / 700 / 640 / 620 steps), never plain `bold`, so the variable axis stays animatable.

### Hierarchy
- **Display** ('wght' 760 'opsz' 96, clamp(4.2rem, 13.6vw, 12.5rem), 0.92): the SUBSTRATE stage wordmark only — viewport-cropping, uppercase, -0.03em. Its outline ghost twin runs 'wght' 300 at the same size.
- **Headline** ('wght' 700, clamp(2.4rem, 5.2vw, 4.6rem), 1.02): inner-page cover `h1`, max 18ch, -0.025em.
- **Stage position** ('wght' 620, clamp(1.35rem, 2.3vw, 1.9rem), 1.2): the positioning line inside the hero stage, max 24ch.
- **Title** ('wght' 640, 1.65rem): exhibit `h2`, max 30ch. Sub-titles (`h3`) are 1.05rem weight 650 in Archivo.
- **Body** (400, 16px, 1.6): Archivo; paragraphs cap at 72ch (`--column`), ledes at 62ch and 1.08rem in Ink-2, notes at 0.86rem in Muted.
- **Label** (mono, 0.66–0.72rem, +0.06 to +0.16em tracking, UPPERCASE): exhibit captions, table headers, datelines, rail label, feed types, control legends. Always `font-variant-numeric: tabular-nums` where numbers appear.

### Named Rules
**The Mono Caption Rule.** Anything that names, numbers, or timestamps an exhibit is uppercase Spline Sans Mono at ~0.7rem with wide tracking and muted color. Data (versions, dates, counts, hashes) is always tabular-nums.

**The Variable Weight Rule.** Display weights are `font-variation-settings` steps (620–760), keeping the wordmark-settle animation possible; the masthead title runs 'wght' 700 at 1.02rem with +0.16em uppercase tracking.

## Layout

The document frame is a two-column grid — a 15.5rem sticky contents rail plus a fluid page column — capped at 90rem and padded by a fluid gutter (`clamp(1.25rem, 3.5vw, 3rem)`). A sticky, blur-backed masthead (paper at 88% opacity, backdrop blur 10px, hairline bottom) sits above; the rail sticks at 3.4rem below it and carries the eight numbered sections (01–08) with a `kbd` hint — keys 1–8 navigate directly. A colophon footer reuses the frame grid with an empty rail cell.

Pages are stacks of **exhibits**: each opens with a 1px Rule top border, a mono caption row (designation left, meta/cross-link right), then content; 2.2rem separates exhibits and 2.8rem pads their bottoms. The homepage opens with the hero **stage** (bordered, radial-gradient ground from #17171d, cropped wordmark); inner pages open with a **cover** (mono issue line, oversized h1, standfirst). Vertical rhythm is rem-based; there is no spacing scale beyond the gutter — hairline rules, not whitespace blocks, delimit content.

Responsive: at 64rem the playground, pyramid, roadmap, and resource columns collapse to one column; at 52rem the frame goes single-column, the rail flattens into a horizontal wrap (borders and hint dropped), the masthead subtitle and stage ghost disappear, and feed rows shed their type and hash columns.

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

### Exhibit (the page's structural unit)
- 1px Rule top border; mono caption row: `strong` designation in Ink (e.g. "Fig. 2 — live render · Button"), meta flush right in Muted (often a numbered cross-link like "full index → 03"). A live exhibit prefixes a cyan `●` dot.

### Contents Rail
- Sticky ordered list; each item a hairline-separated row of mono two-digit number + Archivo title (0.9rem). Hover fills Surface; the current page inverts to Ink-on-Paper. Footer hint documents the 1–8 direct-address keys with bordered `kbd` caps.

### Code blocks & Install line
- **CopyBlock:** Paper Raised panel, 3px radius, mono uppercase label, 0.82rem code in Ink-2, absolute `copy` button top-right. The button is mono uppercase 0.7rem on Paper; on success it turns OK Green and reads `copied` for 1.6s.
- **InstallLine:** the compact single-command variant — inline flex, translucent Paper Raised (80% via color-mix), non-selectable muted `$` prompt, inline copy button.

### Tables
- Full-width, collapsed borders, 0.9rem, tabular-nums. Headers are mono uppercase 0.66rem Muted over a 1px **Ink** rule (the strong rule); body rows separate with Rule Soft and hover-fill Surface. Numeric columns right-align (`.num`). Wide tables wrap in `.table-scroll` (min-width 40rem, contained overscroll). Deprecated rows strike through.

### Status marks
- `Status` = 9px drawn mark + lowercase status word in mono 0.72rem Ink-2. Shapes per the Mark-Not-Tint Rule; color is inherited, never semantic.

### Feed (updates/releases)
- Hairline-separated grid rows: mono date (Muted) · type tag (mono, cyan when `feat`) · summary (first entry gets the yellow `new` signal) · mono hash link. Collapses to date + summary at 52rem.

### Provisional mark
- Inline mono uppercase chip, Amber text, 1px dashed amber-mixed border, reading `provisional · <what>`. Every render corresponds to a TODO on the replacement list; it is honest signage, not decoration.

### Playground (signature component)
- Two-panel bordered figure: render stage (min 21rem, faint 2.2rem horizontal gridline wash over Paper Raised, centered live DS component) beside a controls column on Paper driven by real DS `Select`/`Input`/`Checkbox`. A mono readout bar states provenance ("rendered from @aurora-ui/components-v2 · dist") and stamps `recalc HH:MM:SS.mmm` in Live Cyan on every option change, flashing Live Bright. Below the controls, a generated import snippet mirrors the current props.

### Filter group (catalog)
- Segmented mono-uppercase buttons in one hairline-bordered strip; pressed state inverts Ink-on-Paper. Count readout (`n / total entries`) sits flush right in mono, `aria-live`.

### Pyramid (signature figure)
- Inline SVG report exhibit drawn entirely in the token palette via `var(--…)`: hollow-dashed top layer (products), inverted Ink Substrate layer, Surface base, with a mono dimension callout ("THIS SYSTEM") in drafting style.

### Theming contract with the DS
- The hub imports `@aurora-ui/components-v2/style.css` globally and pins `html.dark`, so DS components render in their own dark tokens on the shared #09090b ground. DS styles live in cascade layers; the hub's unlayered CSS wins specificity ties by design. DS-rendered visuals are content: never restyle them to hub laws, and never screenshot them — render the real package.

### Motion (the three authored moments)
All micro-transitions run 120–160ms on `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`); the only authored animations are:
1. **Wordmark settle** — one-time, 1100ms: the stage word animates `font-variation-settings` from 'wght' 240 / 'opsz' 14 (opacity 0.2) to 'wght' 760 / 'opsz' 96.
2. **Ghost drift** — the outline twin translates −9% over 30s, ease-in-out, alternating forever.
3. **Recalc tick** — 700ms flash from Live Bright with cyan text-glow back to Live Cyan on every playground change.

**The Three Moments Rule.** No new keyframe animation enters the hub without the same justification these three have (identity, atmosphere, liveness). Under `prefers-reduced-motion` all three are disabled, smooth scroll turns off, and every transition collapses to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** start every content section as an `Exhibit`: 1px Rule top border, mono uppercase caption with designation left and meta right.
- **Do** keep exactly one yellow action per surface and reserve the `new-signal` chip for the newest item only.
- **Do** set all captions, datelines, table headers, hashes, and counts in Spline Sans Mono, uppercase, wide-tracked, `tabular-nums`.
- **Do** express state by inversion (Ink fill, Paper text) for active nav, pressed filters, and selection.
- **Do** use the five physical status marks plus the status word; deprecated rows also strike through.
- **Do** render DS components live from `@aurora-ui/components-v2` and label their provenance in the readout/caption.
- **Do** mark every unconfirmed value with the amber `Provisional` chip and a matching replacement-list entry.

### Don't:
- **Don't** introduce a light theme or per-component background overrides; #09090b is the only ground.
- **Don't** use yellow, cyan, amber, or green outside their laws (primary/new, live, provisional, copied).
- **Don't** tint status with color, use glyph-font icons or emoji, or replace drawn SVG marks with badges.
- **Don't** add shadows at rest, radii above 4px, or borders heavier than 1px (the strong table rule stays 1px Ink).
- **Don't** author new keyframe animation outside the three moments, or ship any motion that survives `prefers-reduced-motion: reduce`.
- **Don't** restyle DS-rendered content to hub chrome laws, and don't move hub CSS into cascade layers (unlayered hub CSS deliberately wins ties over the DS's layered styles).
