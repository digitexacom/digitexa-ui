import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";

import { siteUrl } from "./site";

export type Doc = { slug: string; title: string; description: string; body: string };

/** Markdown pages under content/docs (plus the changelog), read at build time. */
export const docPages = ["introduction", "installation", "theming", "cli", "changelog"] as const;
export type DocSlug = (typeof docPages)[number];

export async function readDoc(slug: DocSlug): Promise<Doc> {
  "use cache";
  cacheLife("max");
  const file = slug === "changelog" ? join(process.cwd(), "CHANGELOG.md") : join(process.cwd(), "content", "docs", `${slug}.md`);
  let raw = (await readFile(file, "utf8")).replaceAll("{{site}}", siteUrl);
  let title = slug[0].toUpperCase() + slug.slice(1);
  let description = "";
  const front = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (front) {
    for (const line of front[1].split("\n")) {
      const [k, ...v] = line.split(":");
      if (k.trim() === "title") title = v.join(":").trim();
      if (k.trim() === "description") description = v.join(":").trim();
    }
    raw = raw.slice(front[0].length);
  }
  if (slug === "changelog") {
    raw = raw.replace(/^# Changelog\n/, "");
    title = "Changelog";
    description = "What changed in each release.";
  }
  return { slug, title, description, body: raw.trim() };
}

/** The page as Markdown, for "Copy page" and AI agents. */
export const docMarkdown = (doc: Doc) => `# ${doc.title}\n\n${doc.description}\n\n${doc.body}\n`;

/** A component's demo source with the docs-only helpers inlined, so it stands on its own. */
export async function readExample(slug: string): Promise<string | null> {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "app", "_docs", "demos");
  let code: string;
  try {
    code = await readFile(join(dir, `${slug}.tsx`), "utf8");
  } catch {
    return null;
  }
  code = code.replace(/^"use client";\n\n?/, "");
  if (code.includes('from "./_shared"')) {
    const shared = (await readFile(join(dir, "_shared.tsx"), "utf8")).replace(/^import .*\n/gm, "").replace(/^export /gm, "").trim();
    code = code.replace(/^import \{[^}]*\} from "\.\/_shared";\n/m, "").replace(/\nexport default/, `\n${shared}\n\nexport default`);
    if (!/import \* as React/.test(code) && shared.includes("React.")) code = `import * as React from "react";\n` + code;
  }
  return code.trim();
}

type RegistryItem = { name: string; description: string; dependencies: string[]; requires: string[]; files: { target: string; content: string }[] };

export async function readRegistryItem(slug: string): Promise<{ item: RegistryItem; markdown: string }> {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "public", "r");
  const [json, markdown] = await Promise.all([readFile(join(dir, `${slug}.json`), "utf8"), readFile(join(dir, `${slug}.md`), "utf8")]);
  return { item: JSON.parse(json), markdown };
}
