# Contributing

Thanks for helping. Digitexa UI is small on purpose, so a few rules keep it coherent.

## Setup

```bash
npm install
npm run dev     # docs at http://localhost:3000
npm run check   # lint, typecheck, contrast and build: what CI runs
```

## Adding a component

1. Write `components/ui/<name>.tsx`.
   - Style only with the semantic utilities (`bg-surface`, `text-fg-muted`, `bg-status-done`, …). No raw colors.
   - Heights come from `h-(--dx-control-*)`, so compact density works.
   - Import other kit files as `@/components/ui/…` and `@/lib/…` (the CLI rewrites these). No relative imports.
   - Text on a `*-subtle` background uses the matching `*-fg` token.
2. Add an entry to `registry/registry.json`. npm dependencies and `requires` are derived from imports;
   `npm run registry` fails if anything doesn't add up.
3. Add a demo to `app/_docs/demos.tsx` and the slug to a group in `app/_docs/nav.ts`.

## Changing tokens

Every color in `app/tokens.css` is `light-dark(<light>, <dark>)`. Run `npm run check:contrast` after any change.
If you add a token meant for text, add its pair to `scripts/check-contrast.mjs`.

## Pull requests

Keep them focused, describe what changed visually, and include a screenshot in light and dark.
