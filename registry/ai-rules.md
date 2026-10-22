# Digitexa UI — rules for AI coding agents

You are working in a project that uses Digitexa UI: copy-paste React components (Next.js, Tailwind CSS v4,
Radix) whose source lives in the project, usually under `components/ui/` (see `dx.json` for the real paths).
Follow these rules when you write or change UI.

## Use what is there

- Before writing UI, look in `components/ui/` and reuse an existing component. Add missing ones with the CLI
  (`dx add <name>`) instead of hand-writing a copy. `dx list` shows everything available.
- Components are plain files the project owns. Change them in place when the design needs it; don't wrap a
  component just to override its styles.
- Import as `@/components/ui/<name>` and `@/lib/utils` (or the aliases in `dx.json`).
- Compose with `cn()` from `@/lib/utils` so later classes win: `className={cn("…", className)}`.

## Styling

- Never use raw colors (`#hex`, `rgb()`, `bg-blue-500`, `text-gray-600`). Use the semantic utilities, which follow
  light/dark mode and the accent automatically:
  - surfaces: `bg-bg`, `bg-bg-subtle`, `bg-surface`, `bg-surface-raised`, `bg-muted`, `bg-selected`
  - text: `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-fg-disabled`
  - lines: `border-border`, `border-border-strong`, `border-input`, `ring-ring`
  - brand: `bg-accent` + `text-accent-fg`; soft: `bg-accent-subtle` + `text-accent-subtle-fg`
  - semantic: `success`, `warning`, `danger`, `info` — solid `bg-danger`, tint `bg-danger-subtle`
  - work statuses: `status-backlog`, `status-todo`, `status-progress`, `status-review`, `status-done`
- Text placed on a `*-subtle` background must use the matching `*-fg` color (e.g. `bg-success-subtle text-success-fg`,
  `bg-status-review-subtle text-status-review-fg`, `bg-danger-subtle text-danger-fg-subtle`). These pairs are
  contrast-checked; other combinations are not.
- Sizes: controls use `h-(--dx-control-sm|md|lg)` (24 / 30 / 36px, smaller with `data-density="compact"`), table
  rows `h-(--dx-row-height)`. Don't hard-code `h-8`/`h-10` for controls.
- Type scale is dense: `text-2xs` 10.5, `text-xs` 11.5, `text-sm` 12.5, `text-base` 13 (default), `text-md` 14,
  `text-lg` 16, `text-xl` 19, `text-2xl` 24, `text-3xl` 30. Spacing is Tailwind's 4px scale.
- Radius: `rounded-sm` 4, `rounded-md` 6 (controls), `rounded-lg` 9 (cards, menus), `rounded-xl` 12.
- Shadows: `shadow-sm` (controls, cards), `shadow-md`, `shadow-lg` (menus, dialogs).
- Layering: `z-(--dx-z-sticky)`, `z-(--dx-z-dropdown)`, `z-(--dx-z-overlay)`, `z-(--dx-z-toast)`, `z-(--dx-z-tooltip)`.
- Motion: durations `duration-(--dx-motion-fast)` / `duration-(--dx-motion)`; they drop to 0 for reduced motion.

## Theming

- Theme, accent and density are attributes on `<html>`: `data-theme="light|dark"` (omit to follow the system),
  `data-accent="ember|cobalt|moss|plum|rose|graphite"`, `data-density="compact"`, `data-motion="reduce|full"`,
  `data-sidebar-density="compact"`, `data-sidebar="collapsed"`.
- `data-accent` and `data-density` also work on any element to restyle one region.
- Token values live in the theme stylesheet (`dx-tokens.css`). Change a value there rather than overriding it in
  components. Tokens are prefixed `--dx-`.

## Accessibility

- Icon-only buttons need `aria-label`; pair inputs with `<Label htmlFor>` or the `field` components.
- Use `aria-invalid` on inputs to show the error state; describe errors with `aria-describedby`.
- Buttons default to `type="button"`. Links rendered as buttons use `<Button asChild><a …/></Button>`; disable them
  with `aria-disabled`, not `disabled`.
- Keep Radix structure intact (Trigger/Content/Portal) so focus management and keyboard support keep working.

## Patterns

- App frame: `AppShell` + `Sidebar` (+ `SidebarTrigger` in the `Topbar`) from `sidebar`.
- Key numbers: `StatGroup` + `Stat` from `card`. Status: `StatusBadge` / `StatusIcon`. Breakdown bars: `Meter`.
- Menus: `DropdownMenu`; search and actions: `CommandDialog` with `useCommandShortcut()` for ⌘K.
- Confirm destructive actions with `AlertDialog` (or `Dialog`) and a `danger` button.
