# Substrate Hub

The internal front door to **Substrate**, the EOS design system
(`@aurora-ui/substrate`). Understand its role, install it, find a
component or pattern, and see what is changing.

## Run

```bash
npm install
npm run sync   # regenerate from a clean ../aurora-ui checkout at origin/release
npm run dev    # http://localhost:4400
```

The catalog, coverage numbers, forms-pattern map, and updates feed are generated
from the real `aurora-ui` checkout by `scripts/sync-substrate.mjs` (override the
location with `AURORA_UI_WORKTREE`). Versioned notes come from the matching
`packages/substrate/*` GitHub releases through `scripts/sync-releases.mjs`.
The hub consumes the design system directly — the buttons, inputs, selects,
checkboxes, and accordions on these pages are the real components, and Fig. 2
on the overview renders them live.

## Replacement list (provisional values)

Marked visibly in the UI with a `provisional` tag; all live in
`src/config/site.ts`:

- **Support channel** — currently `#design-system`.
- **Authoritative planning source** — roadmap Next/Later items await confirmation.
- ~~Design library (Figma) link — tools page.~~ Row removed at the user's request (2026-08-26).
- **Events feed** — the home page states none exist yet.

## Design-system updates and deployment

Run **Sync published Substrate release** manually with a published tag such as
`packages/substrate/1.0.0`. The workflow checks out that exact tag,
regenerates both data feeds, builds the static site, and opens an auto-merge PR.
It also accepts a `substrate-released` repository dispatch if a source-side
notifier is configured later; this repository does not modify `aurora-ui`.

Required `substrate-hub` repository secrets:

- `AURORA_UI_TOKEN`, with read access to the private
  `AuroraEnergyResearch/aurora-ui` repository and its releases.
- `SUBSTRATE_HUB_AUTOMATION_TOKEN`, with contents and pull-request write access
  to this repository. Using an installation or service token, rather than the
  workflow `GITHUB_TOKEN`, allows bot PRs and merges to run normal checks and
  deployment workflows.

The repository must allow GitHub Actions to create pull requests and have
auto-merge enabled. The published website is the legacy `gh-pages` branch; a
release update is built against the exact design-system SHA recorded in
`src/data/substrate.json` before that static export is published.
