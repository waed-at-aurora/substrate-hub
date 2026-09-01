# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js / React (user-chosen). Chosen so the hub can render live Substrate React components inline rather than only describing them.

## Users

Primary: EOS product engineers and product designers.

- Engineers arrive to install Substrate, find the right composite component or interaction pattern, and copy real usage code.
- Designers arrive to check what exists, read pattern guidance and design intent before specing work.

Secondary (confirmed): PMs and leadership who need to understand Substrate's role and what is changing on the roadmap.

## Product Purpose

Substrate Hub is the internal front door to the Substrate design system. It is a practical tool, not merely an explanation: a visitor should be able to (1) understand Substrate's role, (2) install it, (3) find an appropriate component or pattern, and (4) see what is changing.

Success: a visitor completes those four jobs without asking a colleague.

## Positioning

Substrate bridges UI primitives and complete product experiences. Its primary responsibility is the reusable composite-component and interaction-pattern layers that make EOS products consistent, high quality, and faster to build — while deliberately leaving room for product-level differentiation. The hub's job is to make that layer discoverable and adoptable, not to be a generic style guide.

## Operating Context

- Internal audience within the organization; visitors are colleagues building or specing EOS products.
- Typical visit is task-driven: mid-build lookup (engineer), pre-spec check (designer), or status/roadmap scan (PM/leadership).

## Capabilities and Constraints

- Confirmed IA (user-specified): Home, Get started, Components, Patterns, Releases, Roadmap, Tools & resources. The standalone Updates page is temporarily omitted; the homepage keeps the lightweight “what’s happening” source-history feed. Homepage sequence: positioning → primary actions → system pyramid → quick start → coverage → what's happening → resources.
- Substrate = the design system implemented at `~/repo/aurora-ui/packages/substrate` (`@aurora-ui/substrate`). The hub renders its components live; the interactive playground renders the `InvestmentCaseSelectionCard` composite (selection states default/selected/active; consumer-composed header, badges, and content).
- Forms is the one established pattern (`storybook-substrate/src/patterns/forms/FormPatterns.stories.tsx`); the Patterns surface leads with it.
- Component detail stays shallow: link into the exact Storybook docs, never duplicate API documentation maintained there.
- Roadmap: Now/Next/Later, distinguish commitments from exploration, link to the authoritative planning source.

## Brand Commitments

- Product name: Substrate; hub name: Substrate Hub. Serves the EOS product family at Aurora Energy Research.
- Astryx (Meta's design system) binds the **craft bar & tone** (big-company polish: confident, calm, precise) and the **IA/hub structure** (task-first front door). Otherwise loose inspiration: Substrate Hub keeps its own identity.
- EOS token language exists in the DS itself: Aurora yellow `#FFCC00` brand ramp, zinc neutrals, cyan/purple/green accents, light+dark themes (`packages/substrate/src/tokens/`).

## Evidence on Hand

Real, verified in `~/repo/aurora-ui`:

- Package `@aurora-ui/substrate` v0.0.1; workspace dep in-monorepo, private CodeArtifact registry outside. Import: `import { Button } from '@aurora-ui/substrate'` + `import '@aurora-ui/substrate/style.css'`. Published builds expose `dist/components.mjs` and `dist/styles.css`.
- Inventory: ~49 UI primitives (`src/ui/`), 9 composite patterns (`src/components/`: data-table, surface-toolbar, time-range-selector, timeline-scrubber, chart-toolbar, investment-case-selection-card, mode-activator-toggle-group, surface-panel, cms), charts layer, stable/alpha channels, experimental `ux-intent` track.
- Canonical Storybook: `storybook-substrate` (dev port 6007). Production: https://laughing-adventure-e2q2em3.pages.github.io/v2 (private GitHub Pages, auth required; confirmed by user 2026-08-26).
- CLI: `substrate-cli` (github.com/AuroraEnergyResearch/substrate-cli-v2, prototype) — installs the design system (`install`/`doctor`, real AWS/npm steps), raises feedback as GitHub issues, reads component docs offline from a bundled snapshot; agent-first (every prompt has a flag; `substrate skill install` ships an agent skill). Team path: `npx --yes github:AuroraEnergyResearch/substrate-cli-v2 …` (private repo, needs `gh auth login`). Separately, `atlas` (github.com/AuroraEnergyResearch/atlas) manages Aurora's materialized AI skills and shared context.
- Releases: semantic-release publishes versioned `packages/substrate/*` GitHub releases. The hub imports those notes automatically after the matching release workflow succeeds and retains path-filtered source history for the homepage feed.
- Support channel: not found — marked placeholder on replacement list.

No marketing claims, testimonials, or metrics were provided; none may be invented.

## Product Principles

1. **Front door, not brochure.** Every surface should end in a completed task — install, find, copy, or track — not just comprehension.
2. **The composite layer is the product.** Lead with composite components and interaction patterns; primitives and philosophy support them, never crowd them.
3. **Show the real thing.** Prefer live rendered components and real code over descriptions or screenshots; never present placeholder material as real.
4. **Consistency with room to differ.** Guidance should state what EOS products must share and where product-level differentiation is expected.
5. **Serve the mid-task visitor first.** Engineers and designers arrive mid-work; findability and copy-ability outrank narrative for every catalog surface.
