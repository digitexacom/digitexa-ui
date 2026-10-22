---
title: Introduction
description: A set of well-made components you copy into your project, then make your own.
---

Digitexa UI is not a component library you install and live with. It's the starting point for your own: every
component is copied into your project as a plain source file. You read it, change it, and ship it like the rest of
your code.

## Why copy, not install

A package hides its code behind a version number. The day your design needs a different focus ring, a denser
table or one more variant, you're writing overrides against something you can't see.

With Digitexa UI the code is in `components/ui/`. Want a `tertiary` button? Add it to the `cva` variants. Need the
dialog footer on the left? Move it. Nothing to fork, nothing to override.

## What you get

- **Tokens first.** Every color, size and motion value is a `--dx-*` token. Light and dark are designed separately,
  six accents can be swapped at runtime, and every text/background pair is checked against WCAG.
- **Dense by default.** A 13px base, 30px controls and a 4pt grid, built for tools people use all day. Switch to
  `data-density="compact"` to fit more.
- **Accessible.** Built on Radix primitives: focus management, keyboard support and ARIA are handled.
- **Project management built in.** Status badges and icons, a kanban board, a timeline, a calendar view and task
  rows, on top of the usual buttons, menus and forms.
- **Ready for AI.** `llms.txt`, `llms-full.txt` and a Markdown page per component, so coding agents use the kit the
  way it's meant to be used. See [For AI agents](/docs/ai).

## How it works

1. `dx add theme` writes two stylesheets (tokens and the Tailwind mapping) and wires them into your global CSS.
2. `dx add button dialog` writes the component files, the helpers they need, and installs their npm dependencies.
3. From there it's your code. Run `dx add` again with `--overwrite` only when you want the upstream version back.

Read [Installation](/docs/installation) to set it up, or browse [Components](/docs/components).
