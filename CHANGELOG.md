# Changelog

## 0.2.0

- Tokens rewritten with `light-dark()` and prefixed `--dx-*`, so they don't collide with other kits.
- Readable `*-fg` text tokens; every text/background pair passes WCAG (`npm run check:contrast`).
- Density (`data-density="compact"`), reduced motion, z-index and layout tokens.
- 20 new components: textarea, label, checkbox, switch, select, toggle-group, tabs, status-icon, avatar, kbd,
  card/stat, table, progress, meter, separator, skeleton, tooltip, popover, dropdown-menu, sidebar.
- Fixes: dialog drifted off-centre while animating, the `link` button variant never applied, buttons submitted
  forms by default, badge text contrast.
- CLI: `dx init`, src/ and tsconfig alias detection, auto-wires the theme into your stylesheet, path safety,
  Windows support, proper flag parsing, `--help`.
- Registry: dependencies pinned from package.json and derived from imports, validated before writing.
- Docs: a page per component with source, mobile navigation, and a full example app.

## 0.1.0

- First release: theme, button, input, badge, dialog, registry and CLI.
