---
title: Theming
description: Tokens, dark mode, accents, density and motion.
---

Every visual decision in the kit is a CSS custom property prefixed `--dx-`. Components never use raw colors, so
changing a token changes every component that uses it.

## How tokens are layered

1. `dx-tokens.css` holds the values. Colors are written as `light-dark(<light>, <dark>)`: both themes are designed
   by hand, never inverted.
2. `dx-theme.css` maps them to Tailwind utilities. `--dx-surface` becomes `bg-surface`, `--dx-fg-muted` becomes
   `text-fg-muted`, and so on.

## Color tokens

| Group | Utilities |
|---|---|
| Surfaces | `bg-bg`, `bg-bg-subtle`, `bg-surface`, `bg-surface-raised`, `bg-muted`, `bg-selected` |
| Text | `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-fg-disabled` |
| Lines | `border-border`, `border-border-strong`, `border-input`, `ring-ring` |
| Accent | `bg-accent` + `text-accent-fg`, `bg-accent-subtle` + `text-accent-subtle-fg` |
| Semantic | `success`, `warning`, `danger`, `info`, each with `-subtle` and `-fg` |
| Statuses | `status-backlog`, `status-todo`, `status-progress`, `status-review`, `status-done` |

> Text on a `*-subtle` background uses the matching `*-fg` token, e.g. `bg-success-subtle text-success-fg`. Those
> pairs are contrast-checked in CI; other combinations are not.

## Dark mode

The theme follows the operating system. Force it with an attribute:

```html
<html data-theme="dark">
```

## Accent

Six accents ship with the kit: `ember` (default), `cobalt`, `moss`, `plum`, `rose` and `graphite`. The accent drives
primary buttons, focus rings, selection and links.

```html
<html data-accent="cobalt">
```

`data-accent` also works on any element, so one region of a page can use a different accent.

## Density

| Token | Default | Compact |
|---|---|---|
| `--dx-control-sm` | 24px | 22px |
| `--dx-control-md` | 30px | 26px |
| `--dx-control-lg` | 36px | 32px |
| `--dx-row-height` | 40px | 32px |

Set `data-density="compact"` on `<html>` (or any element), or `data-sidebar-density="compact"` to tighten only the
sidebar. Use `h-(--dx-control-md)` instead of fixed heights so your own UI follows along.

## Motion

Durations are tokens too (`--dx-motion-fast`, `--dx-motion`, `--dx-motion-slow`). They drop to zero when the OS
asks for reduced motion. `data-motion="reduce"` forces that, `data-motion="full"` opts out.

## Adding an accent

Add a block to `dx-tokens.css` with light and dark values, then use it with `data-accent="teal"`:

```css dx-tokens.css
[data-accent="teal"] {
  --dx-accent: light-dark(oklch(0.52 0.1 195), oklch(0.72 0.11 195));
  --dx-accent-hover: light-dark(oklch(0.47 0.1 195), oklch(0.77 0.1 195));
  --dx-accent-fg: light-dark(oklch(0.99 0.01 195), oklch(0.18 0.04 195));
  --dx-accent-subtle: light-dark(oklch(0.95 0.03 195), oklch(0.29 0.05 195));
  --dx-accent-subtle-fg: light-dark(oklch(0.43 0.09 195), oklch(0.84 0.08 195));
}
```
