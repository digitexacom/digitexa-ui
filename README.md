# Digitexa UI

An open-source, copy-paste component kit for dense, warm desktop interfaces.

**Docs:** https://ui.digitexa.com

Components aren't installed as a package. They're written into your project as files you own and edit.
Built on Next.js (App Router), Tailwind CSS v4, Radix primitives and `class-variance-authority`.
The registry format and the CLI are part of this repo; there's no dependency on any other component tool.

## Highlights

- **Token-first theming.** Warm neutral palette, light and dark designed separately with `light-dark()`.
  Every text/background pair is checked against WCAG in CI.
- **Swappable accent.** `<html data-accent="ember | cobalt | moss | plum | rose | graphite">`, also per element.
- **Dark mode.** Follows the system, or force it with `<html data-theme="dark | light">`.
- **Dense scale.** 13px base font, 20 / 24 / 30 / 36px controls, 4pt spacing, and `data-density="compact"`
  (or `data-sidebar-density="compact"` for just the sidebar). `data-motion="reduce"` turns animations off.
- **Work statuses built in.** `backlog`, `todo`, `progress`, `review`, `done`, as badges, icons and meters.
- **No collisions.** All tokens are prefixed `--dx-*`, so the kit can live next to other design systems.

## Install into your project

Requirements: Tailwind CSS v4, Node 20+, and an import alias such as `"@/*": ["./*"]` (or `["./src/*"]`) in `tsconfig.json`.

```bash
curl -fsSL https://ui.digitexa.com/dx.mjs | node --input-type=module - add theme button dialog
```

The first run detects your layout (including `src/`), writes `dx.json`, adds the theme imports to your global
stylesheet, and installs the npm dependencies with your package manager.

| Command | |
|---|---|
| `dx add <item...>` | Add items and everything they need |
| `dx list` | List registry items |
| `dx init` | Only detect the layout and write `dx.json` |

Options: `--cwd <dir>`, `--overwrite`, `--skip-install`, `--registry <url|dir>`, `-y`, `-h`.

`dx.json` holds the paths (`ui`, `lib`, `styles`), your global stylesheet and the import aliases. Edit it if
detection got something wrong.

## Components

53 components, each with a docs page (live preview, example code, install command and source):

- **Forms:** button, input, input-group, textarea, label, field, checkbox, radio-group, switch, select, combobox,
  slider, toggle, toggle-group, date-picker
- **Data display:** badge, status-icon, avatar, kbd, card (+ stat), table, data-table, pagination, progress, meter, calendar
- **Overlays:** dialog, alert-dialog, sheet, command, popover, hover-card, dropdown-menu, context-menu, tooltip
- **Feedback:** alert, toast, spinner, skeleton, empty-state
- **Layout:** sidebar (app shell), tabs, accordion, collapsible, breadcrumb, scroll-area, separator
- **Project management:** task-row, kanban, timeline, calendar-view, activity-feed, priority

Example apps live at `/examples/overview` and `/examples/settings`.

## For AI agents

The build publishes `/llms.txt`, `/llms-full.txt` (rules, tokens, and every component's API, example and source),
`/r/<name>.md` per component and `/md/<page>.md` per docs page. The rules live in `registry/ai-rules.md`.

## Browser support

Current Chrome, Edge, Firefox and Safari. Tailwind's build turns `light-dark()` into a fallback, so older
Safari versions work too.

## Development

```bash
npm install
npm run dev            # docs at http://localhost:3000
npm run check          # lint, typecheck, contrast check and build (what CI runs)
```

To deploy the docs and registry, set `NEXT_PUBLIC_SITE_URL` and `SITE_URL` to the public URL before building, so
the published CLI points at your registry.

| Path | What |
|---|---|
| `app/tokens.css` | Token values |
| `app/theme.css` | Tailwind v4 mapping and base styles |
| `components/ui/*` | Components |
| `registry/registry.json` | Registry items; dependencies are derived from imports |
| `scripts/build-registry.mjs` | Validates and builds `public/r/*.json` and `public/dx.mjs` |
| `scripts/check-contrast.mjs` | WCAG check for every token pair |
| `content/docs/*.md` | Docs pages (Introduction, Installation, Theming, CLI) |
| `app/_docs/demos/*.tsx` | One demo per component; also published as the usage example |
| `cli/dx.mjs` | Zero-dependency CLI |

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a component.

## License

[MIT](LICENSE) © Digitexa
