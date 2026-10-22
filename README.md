# Digitexa UI

An open-source, copy-paste component kit for dense, warm desktop interfaces.

Components aren't installed as a package — they're written into your project as files you own and edit.
Built on Next.js (App Router), Tailwind CSS v4, Radix primitives and `class-variance-authority`.
The registry format and CLI are our own; there is no dependency on any other component tool.

## Highlights

- **Token-first theming** — warm neutral palette, light and dark defined separately (not inverted).
- **Swappable accent** — `<html data-accent="ember | cobalt | moss | plum | rose | graphite">`.
- **Dark mode** — follows the system, or force it with `<html data-theme="dark | light">`.
- **Dense scale** — 13px base font, 24 / 30 / 36px controls, 4pt spacing.
- **Work statuses built in** — `backlog`, `todo`, `progress`, `review`, `done`.

## Install into your project

Requires a project with Tailwind CSS v4 and an `@/` import alias (or pass `--alias`).

```bash
curl -fsSL https://<site>/dx.mjs | node --input-type=module - add theme button dialog --registry https://<site>/r
```

Then add the theme to `globals.css`, below `@import "tailwindcss";`:

```css
@import "./dx-tokens.css";
@import "./dx-theme.css";
```

CLI options: `--cwd <dir>`, `--overwrite`, `--no-install`, `--alias ~/`, `--registry <url|dir>`.
`dx list` shows everything available.

## Components

| Name | Description |
|---|---|
| `button` | 6 variants (primary, secondary, soft, ghost, danger, link), 5 sizes, `asChild` |
| `input` | 3 sizes, error state via `aria-invalid` |
| `badge` | Semantic + work status variants, `StatusBadge` |
| `dialog` | Built on Radix Dialog; header / body / footer, 3 sizes |

## Development

```bash
npm install
npm run dev        # docs site → http://localhost:3000
npm run registry   # registry/registry.json → public/r/*.json + public/dx.mjs
npm run build      # registry + next build
```

| Path | What |
|---|---|
| `app/tokens.css` | Token values: light, dark, accents |
| `app/theme.css` | Tailwind v4 mapping (`bg-surface`, `text-fg-muted`, `bg-status-done` …) and the `dark:` variant |
| `components/ui/*` | Components |
| `registry/registry.json` | Registry items: files, npm dependencies, `requires` (other items) |
| `cli/dx.mjs` | Zero-dependency CLI |

### Adding a component

1. Write `components/ui/<name>.tsx` using the semantic tokens only (no raw colors).
2. Add an item to `registry/registry.json`.
3. Run `npm run registry` and add a demo to the docs site.

## License

[MIT](LICENSE) © Digitexa
