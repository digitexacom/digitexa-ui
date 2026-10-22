import registry from "@/registry/registry.json";

export type DocItem = { slug: string; title: string; description: string };

const titles: Record<string, string> = { "dropdown-menu": "Dropdown menu", "toggle-group": "Toggle group", "status-icon": "Status icon" };
const titleFor = (slug: string) => titles[slug] ?? slug[0].toUpperCase() + slug.slice(1);

const groups: { title: string; slugs: string[] }[] = [
  { title: "Forms", slugs: ["button", "input", "textarea", "label", "checkbox", "switch", "select", "toggle-group"] },
  { title: "Data display", slugs: ["badge", "status-icon", "avatar", "kbd", "card", "table", "progress", "meter"] },
  { title: "Overlays", slugs: ["dialog", "popover", "dropdown-menu", "tooltip"] },
  { title: "Layout & feedback", slugs: ["sidebar", "tabs", "separator", "skeleton"] },
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
