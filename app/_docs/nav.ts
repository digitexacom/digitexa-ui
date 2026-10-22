import registry from "@/registry/registry.json";

export type DocItem = { slug: string; title: string; description: string };

const titles: Record<string, string> = {
  "dropdown-menu": "Dropdown menu",
  "toggle-group": "Toggle group",
  "status-icon": "Status icon",
  "radio-group": "Radio group",
  "input-group": "Input group",
  "date-picker": "Date picker",
  "alert-dialog": "Alert dialog",
  "empty-state": "Empty state",
  "hover-card": "Hover card",
  "context-menu": "Context menu",
  "scroll-area": "Scroll area",
  "data-table": "Data table",
  "task-row": "Task row",
  "calendar-view": "Calendar view",
  "activity-feed": "Activity feed",
};
const titleFor = (slug: string) => titles[slug] ?? slug[0].toUpperCase() + slug.slice(1);

const groups: { title: string; slugs: string[] }[] = [
  {
    title: "Forms",
    slugs: ["button", "input", "input-group", "textarea", "label", "field", "checkbox", "radio-group", "switch", "select", "combobox", "slider", "toggle", "toggle-group", "date-picker"],
  },
  { title: "Data display", slugs: ["badge", "status-icon", "avatar", "kbd", "card", "table", "data-table", "pagination", "progress", "meter", "calendar"] },
  { title: "Overlays", slugs: ["dialog", "alert-dialog", "sheet", "command", "popover", "hover-card", "dropdown-menu", "context-menu", "tooltip"] },
  { title: "Feedback", slugs: ["alert", "toast", "spinner", "skeleton", "empty-state"] },
  { title: "Layout", slugs: ["sidebar", "tabs", "accordion", "collapsible", "breadcrumb", "scroll-area", "separator"] },
  { title: "Project management", slugs: ["task-row", "kanban", "timeline", "calendar-view", "activity-feed", "priority"] },
];

const bySlug = new Map(registry.items.map((i) => [i.name, i]));

export const componentGroups = groups.map((g) => ({
  title: g.title,
  items: g.slugs.map((slug) => {
    const item = bySlug.get(slug);
    if (!item) throw new Error(`nav: "${slug}" is not in registry.json`);
    return { slug, title: titleFor(slug), description: item.description };
  }),
}));

export const allComponents: DocItem[] = componentGroups.flatMap((g) => g.items);

/** Left sidebar "Sections" and the top-level docs order (prev/next follows it). */
export const docsSections = [
  { href: "/docs", title: "Introduction" },
  { href: "/docs/components", title: "Components" },
  { href: "/docs/installation", title: "Installation" },
  { href: "/docs/theming", title: "Theming" },
  { href: "/docs/cli", title: "CLI" },
  { href: "/docs/ai", title: "For AI agents" },
  { href: "/docs/changelog", title: "Changelog" },
];

export const sortedComponents = [...allComponents].sort((a, b) => a.title.localeCompare(b.title));

export const examples = [
  { href: "/examples/overview", title: "Workspace overview" },
  { href: "/examples/settings", title: "Settings" },
];

/** Every docs page in reading order, for prev/next links. */
export const docsOrder = [
  ...docsSections.map((s) => ({ href: s.href, title: s.title })),
  ...sortedComponents.map((c) => ({ href: `/docs/components/${c.slug}`, title: c.title })),
];
