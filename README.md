# Substrate Hub

The internal front door to **Substrate**, the EOS design system
(`@aurora-ui/components-v2`). Understand its role, install it, find a
component or pattern, and see what is changing.

## Run

```bash
npm install
npm run sync   # regenerate src/data/substrate.json from ../aurora-ui
npm run dev    # http://localhost:4400
```

The catalog, coverage numbers, forms-pattern map, releases, and updates feed
are all generated from the real `aurora-ui` checkout by `scripts/sync-substrate.mjs`
(override the location with `AURORA_UI_WORKTREE`). The hub consumes the design
system directly — the buttons, inputs, selects, checkboxes, and accordions on
these pages are the real components, and Fig. 2 on the overview renders them
live.

## Replacement list (provisional values)

Marked visibly in the UI with a `provisional` tag; all live in
`src/config/site.ts`:

- **Support channel** — currently `#design-system`.
- **Authoritative planning source** — roadmap Next/Later items await confirmation.
- ~~Design library (Figma) link — tools page.~~ Row removed at the user's request (2026-08-26).
- **Events feed** — home + tools pages state none exist yet.
- **Published changelog** — releases page reports from source history until semantic-release publishes notes.
