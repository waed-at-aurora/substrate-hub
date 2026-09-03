---
target: the main first component on the landing page
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-09-03T17-45-53Z
slug: src-components-landing-stage-tsx
---
# Landing Stage Critique

Method: dual-agent (A: LandingDesignReview · B: LandingEvidence)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3/4 | Copy feedback is strong; continuation has no activation state. |
| 2 | Match system / real world | 2/4 | Positioning requires interpretation. |
| 3 | User control and freedom | 2/4 | No actionable continuation or fast path. |
| 4 | Consistency and standards | 4/4 | Night Portal rules are followed closely. |
| 5 | Error prevention | 2/4 | GitHub-authentication prerequisite is omitted. |
| 6 | Recognition rather than recall | 2/4 | Components, patterns, and EOS are unnamed. |
| 7 | Flexibility and efficiency | n/a | No repeated workflow in this Persuade-stage component. |
| 8 | Aesthetic and minimalist design | 3/4 | Distinct, but ambient effects compete with the next action. |
| 9 | Error recovery | 4/4 | Copy fallback and manual recovery are strong. |
| 10 | Help and documentation | n/a | Documentation is outside this stage. |
| **Total** | | **22/32** | **Acceptable; significant improvements remain.** |

## Design Specificity Verdict

Visually authored; propositionally generic. The variable wordmark, cursor lamp, drafting grid, ghost, shooting lines, dateline, and coordinate readout are specific to Substrate’s Night Portal. The text never explains that Substrate provides composite components and interaction patterns for EOS teams.

The deterministic detector returned `[]` with exit code 0: zero findings or false positives. Browser automation was unavailable, so no overlay was injected. HTTP fallback confirmed the rendered structure and compiled responsive, animation, and reduced-motion rules.

## Overall Impression

The component has a confident visual identity and strong technical craft. Its weakest moment is the bottom band: it promises meaning but neither explains Substrate concretely nor makes continuation unambiguous.

## What’s Working

1. `.landing-grid`, `.landing-word`, `.landing-ghost`, `.landing-starburst`, and the lamp response establish a distinctive illuminated-material metaphor.
2. Decorative semantics, visibility-paused motion, and reduced-motion behavior are responsible.
3. `InstallLine` handles accessible status, Clipboard API failure, manual selection, and mobile control sizing well.

## Cognitive Load

Three of eight checks fail: single focus, one thing at a time, and working memory. The viewport combines reactive identity, telemetry, install, and continuation; installation also relies on an unshown authentication prerequisite. No decision point exceeds four visible options.

## Emotional Journey

The monumental illuminated stage creates an immediate peak. The bottom band becomes an emotional valley because abstract positioning resolves into an unexplained private-repository command. The passive cue preserves spatial continuity but does not provide a decisive end beat.

## Priority Issues

### P1 — Passive cue masquerades as an action

`LandingScrollCue()` uses imperative text and an animated arrow in a plain `div`. Make it an anchor to System Construction with visible focus and native scrolling, or make the copy explicitly instructional and visually passive. Suggested command: `$impeccable clarify`.

### P1 — Centered cue does not reserve layout space

The absolute cue can overlap the long install line at medium widths or browser zoom. Use a three-column grid with a reserved center track and move the cue into normal flow at a content-driven breakpoint. Suggested command: `$impeccable adapt`.

### P1 — Proposition lacks product specificity

The stage no longer names composite components, interaction patterns, or EOS. Keep the poetic headline and replace the generic secondary line with one factual role statement. Suggested command: `$impeccable clarify`.

### P2 — Install affordance lacks readiness context

The CLI command is unlabeled and omits the documented `gh auth login` prerequisite. Add a compact authentication label and quiet Get started recovery link. Suggested command: `$impeccable harden`.

## Persona Red Flags

- Alex, mid-build EOS engineer: no authentication readiness or fast Components/Patterns path.
- Priya, EOS product designer: cannot recognize the composite/pattern scope within five seconds.
- Morgan, PM/leadership: sees polish before organizational meaning; mobile hides freshness metadata.
- Sam, accessibility-dependent visitor: cue communicates action visually but exposes no keyboard or screen-reader action.

## Minor Observations

- Cyan pointer telemetry receives more salience than product value.
- Cue and mobile dateline type are very small.
- Lowercase “substrate” conflicts with the product-name treatment elsewhere.
- Horizontal command overflow has no explicit continuation affordance.

## Questions to Consider

- Should the cue be a real jump action or an unmistakable passive instruction?
- What sentence should replace the task vocabulary lost with the removed links?
- Is pointer telemetry the best use of the hero’s only cyan emphasis?
- What fast path should exist for returning colleagues?
