---
title: Installation
description: Add the theme and your first components to a Next.js project.
---

Digitexa UI works with any React project that uses **Tailwind CSS v4** and an import alias. These steps use Next.js.

## Create a project

Skip this if you already have one. Tailwind and the `@/*` alias are set up by default.

```bash
npx create-next-app@latest my-app --ts --tailwind --app
```

## Add the theme

The theme is two stylesheets: `dx-tokens.css` (values) and `dx-theme.css` (Tailwind utilities like `bg-surface`
and `text-fg-muted`). The CLI imports both into your global stylesheet.

```bash
curl -fsSL {{site}}/dx.mjs | node --input-type=module - add theme
```

The first run detects your layout (including `src/`), reads the alias from `tsconfig.json` and writes `dx.json`.

> A fresh create-next-app project ships starter styles (`body { font-family: Arial … }` and a white `--background`)
> that would override the theme. The CLI removes them when they're untouched and tells you it did; styles you've
> edited are left alone.

## Add components

```bash
curl -fsSL {{site}}/dx.mjs | node --input-type=module - add button dialog
```

Each component brings what it needs: helpers like `utils`, other components it imports, and npm packages, installed
with the package manager your project already uses.

## Use them

```tsx app/page.tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button variant="primary">Create project</Button>;
}
```

## Pick a look

Theme, accent and density are attributes on `<html>`:

```tsx app/layout.tsx
<html lang="en" data-accent="cobalt" data-density="compact">
```

Leave `data-theme` off to follow the system, or set `data-theme="dark"`. See [Theming](/docs/theming) for every
option.

## Requirements

| | |
|---|---|
| Node | 20 or newer |
| Tailwind CSS | v4 |
| React | 19 (components use `ref` as a prop) |
| Import alias | e.g. `"@/*": ["./*"]` or `["./src/*"]` in `tsconfig.json` |
