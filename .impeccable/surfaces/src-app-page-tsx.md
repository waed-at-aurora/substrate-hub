---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/layout.tsx","src/app/globals.css"]
---

# Surface: Substrate Hub home (/)

Scope: the overview/front-door route; its visual world governs all 8 hub routes.
Visitor mode: Persuade at the stage (landing experience), Operate below (mid-task lookup).

Audience & job: EOS engineers (install, find, copy), designers (check what exists, read intent), PMs/leadership (role + what's changing). Success = understand, install, find, track without asking a colleague.

Chosen direction (user-pinned, 2026-08-26, supersedes seed 564a1789's light Market Report rendition): **Night Portal** — Astryx-energy: dark-first, minimalist, editorial, slightly experimental. DS dark canvas #09090B ground, near-white ink, hairline zinc rule grid with mono FIG./TABLE captions carried over from the report grammar; Bricolage Grotesque display (variable wght/opsz) over Archivo UI and Spline Sans Mono. Laws: Aurora yellow #FFCC00 only for primary action + new-signal; cyan marks live figures; status is a physical mark.

Hero (user-pinned requirements): self-contained stage framed by rules; SUBSTRATE wordmark at viewport-cropping scale with a one-time variable-weight settle and a slow-drifting outline ghost (both disabled under prefers-reduced-motion); positioning line "The shared layer behind consistent EOS experiences."; supporting copy on composite components + interaction patterns; three actions (yellow Install leading, Open Storybook, Explore patterns); compact copyable `npm install @aurora-ui/components-v2` line.

Memorable moment: the stage itself, plus FIG. 2 — the live InvestmentCaseSelectionCard playground (active state by default) rendering the real installed package with a cyan recalc tick per option change.

Landing continuation (user-redesigned 2026-08-28): a full-viewport sticky Three.js tour presents a LEGO pyramid from Tokens → Primitives → Composites → Products. Anime.js Scroll Observer and its Three adapter spin the model, zoom into each tier, reveal one concise explanation, zoom back out, then advance. Pointer orbit, raycast tier selection, keyboard/touch layer controls, live counts, and a final “Ready to explore Substrate?” overview action complete the interaction. Reduced motion becomes a static document with the full pyramid, all explanations, and the same action.

Hub overview order after the landing route: system pyramid → quick start → coverage → what's happening → resources; all data synced from the real aurora-ui repo (`npm run sync`).

Constraints: DS components used directly (html.dark drives their real dark theme); never duplicate Storybook API docs; provisional values stay visibly marked (README replacement list).

Unresolved: support channel, planning source, Figma link, published changelog; light edition retired unless requested.
