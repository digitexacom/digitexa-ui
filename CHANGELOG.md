# Changelog

## Unreleased

- Sidebar: `SidebarSearch` (filter box; a search button in the icon rail), collapsible `SidebarGroup`
  (`collapsible`, `storageKey`, `forceOpen`), `SidebarProfile` (two-line workspace / user button),
  `SidebarItem show="rail" | "expanded"`, exported `whenRail` / `whenExpanded` / `useIsRail`. The scrollbar shows
  on hover only.

- Docs site rebuilt: homepage with a live showcase, `/docs` with sections and components sidebar, "On this page",
  Copy page (Markdown, open in Claude/ChatGPT), ⌘K search, Installation/Theming/CLI pages, `/docs/components` index.
- 28 new components: slider, toggle, field, input-group, calendar, date-picker, combobox, alert, alert-dialog,
  sheet, toast, spinner, empty-state, hover-card, context-menu, accordion, collapsible, breadcrumb, pagination,
  scroll-area, data-table, priority, task-row, kanban, timeline, calendar-view, activity-feed, plus `use-now`.
- AI docs: `/llms.txt`, `/llms-full.txt`, `/r/<name>.md`, `/md/<page>.md` and the For AI agents page.
- Button `loading`, Avatar `status`.
- Sheet: `Peek` / `PeekContent` for list detail panels that float without blocking or reflowing the page; `overlay` prop.
- Fix: menus, selects and popovers now open above dialogs and sheets.
- Fix: docs demos rendered as static HTML without hydrating.
- Kanban on mobile: below 768px columns take 88% of the board and snap, with column chips (counts) to jump
  between them. Touch drag starts on a ~250ms long press, so swiping a card scrolls the page; boards auto-scroll
  at the edges while dragging. Touch screens also get a Move button that opens a bottom sheet of columns
  (`labels={{ move: "Taşı", moveTitle: "Taşı" }}` to translate).
- Kanban: `moveKanbanItem()` helper and a "Saving to a server" example: optimistic move, roll back the card
  if the request fails, toast with Retry.

- Example settings screen (`/examples/settings`): theme cards, accent, interface and sidebar density, motion,
  workspace and profile forms, notification switches.
- New components: `radio-group` (with `RadioCard`), `command` (⌘K palette).
- `data-motion="reduce|full"` overrides the OS reduced-motion setting; `data-sidebar-density="compact"` tightens
  only the sidebar.
- Collapsible sidebar (icon rail, ⌘B, mobile drawer), workspace switcher, account menu and notifications in the
  example app.

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
