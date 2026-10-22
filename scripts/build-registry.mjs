#!/usr/bin/env node
// registry/registry.json → public/r/index.json + public/r/<name>.json (+ public/dx.mjs)
//
// Each item embeds its file contents, so the CLI installs it with one request.
// npm dependencies (pinned to the ranges in package.json) and `requires` are derived
// from imports, so the registry can't drift from the code. Everything is built and
// validated in memory first; nothing is written unless the whole registry is valid.
//
//   SITE_URL=https://ui.example.com npm run registry   → CLI defaults to that registry
import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "r");
const registry = JSON.parse(await readFile(join(root, "registry", "registry.json"), "utf8"));
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const versions = { ...pkg.dependencies, ...pkg.devDependencies };

const TYPES = new Set(["style", "lib", "component", "block"]);
const ROOTS = new Set(["ui", "lib", "styles"]);
// provided by the host app, never installed by the CLI
const PEERS = new Set(["react", "react-dom", "next"]);

const errors = [];
const fail = (msg) => errors.push(msg);

// where each source file lands in the user's project
function defaultTarget(src) {
  if (src.startsWith("components/ui/")) return `ui/${src.slice("components/ui/".length)}`;
  if (src.startsWith("lib/")) return src;
  return null;
}

// "@/components/ui/button" → item that ships that file; "@/lib/utils" → utils
const fileOwner = new Map();
for (const item of registry.items) for (const f of item.files) fileOwner.set(f.src.replace(/\.(tsx?|css)$/, ""), item.name);

function packageOf(spec) {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const names = new Set();
const targets = new Set();
const built = [];

for (const item of registry.items) {
  if (!/^[a-z0-9-]+$/.test(item.name)) fail(`${item.name}: name must be kebab-case`);
  if (names.has(item.name)) fail(`${item.name}: duplicate name`);
  names.add(item.name);
  if (!TYPES.has(item.type)) fail(`${item.name}: unknown type "${item.type}"`);
  if (!item.description) fail(`${item.name}: missing description`);

  const deps = new Set();
  const requires = new Set(item.requires ?? []);
  const files = [];

  for (const f of item.files) {
    const target = f.target ?? defaultTarget(f.src);
    if (!target) { fail(`${item.name}: ${f.src} needs an explicit target`); continue; }
    const norm = posix.normalize(target);
    if (norm !== target || target.startsWith("/") || target.includes("..")) fail(`${item.name}: unsafe target "${target}"`);
    if (!ROOTS.has(target.split("/")[0])) fail(`${item.name}: target "${target}" must start with ${[...ROOTS].join("/, ")}/`);
    if (targets.has(target)) fail(`${item.name}: target "${target}" is shipped twice`);
    targets.add(target);

    const path = join(root, f.src);
    if (!existsSync(path)) { fail(`${item.name}: missing source ${f.src}`); continue; }
    const content = await readFile(path, "utf8");
    files.push({ target, content });

    for (const [, spec] of content.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g)) {
      if (spec.startsWith(".")) fail(`${item.name}: relative import "${spec}" in ${f.src}; use @/ so the CLI can rewrite it`);
      else if (spec.startsWith("@/")) {
        const owner = fileOwner.get(spec.slice(2));
        if (!owner) fail(`${item.name}: ${f.src} imports "${spec}", which no registry item ships`);
        else if (owner !== item.name) requires.add(owner);
      } else {
        const name = packageOf(spec);
        if (PEERS.has(name)) continue;
        if (!versions[name]) fail(`${item.name}: ${f.src} imports "${name}", which isn't in package.json`);
        else deps.add(`${name}@${versions[name]}`);
      }
    }
  }

  // every component is styled with the theme's tokens
  if (item.type === "component" || item.type === "block") requires.add("theme");
  built.push({ ...item, files, dependencies: [...deps].sort(), requires: [...requires] });
}

for (const item of built) for (const r of item.requires) if (!names.has(r)) fail(`${item.name}: unknown requires "${r}"`);

if (errors.length) {
  console.error(`✗ registry is invalid:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
for (const item of built) {
  const out = {
    name: item.name,
    type: item.type,
    description: item.description,
    dependencies: item.dependencies,
    requires: item.requires,
    files: item.files,
  };
  await writeFile(join(outDir, `${item.name}.json`), JSON.stringify(out, null, 2) + "\n");
}
await writeFile(
  join(outDir, "index.json"),
  JSON.stringify(
    { name: registry.name, items: built.map(({ name, type, description, requires }) => ({ name, type, description, requires })) },
    null,
    2,
  ) + "\n",
);

// Publish the CLI too: curl -fsSL <site>/dx.mjs | node --input-type=module - add button
const site = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const cli = await readFile(join(root, "cli", "dx.mjs"), "utf8");
await writeFile(join(root, "public", "dx.mjs"), site ? cli.replace("__DX_REGISTRY__", `${site}/r`) : cli);

// ------------------------------------------------------------------ docs demo map
// app/_docs/demos/<slug>.tsx → app/_docs/demos.gen.tsx, so a new demo file needs no manual wiring.
const demoDir = join(root, "app", "_docs", "demos");
const demoFiles = existsSync(demoDir) ? (await readdir(demoDir)).filter((f) => /^[a-z0-9-]+\.tsx$/.test(f)).sort() : [];
const ident = (slug) => "Demo_" + slug.replace(/-/g, "_");
await writeFile(
  join(root, "app", "_docs", "demos.gen.tsx"),
  `"use client";\n// Generated by scripts/build-registry.mjs. Do not edit.\nimport type * as React from "react";\n\n` +
    demoFiles.map((f) => `import ${ident(f.slice(0, -4))} from "./demos/${f.slice(0, -4)}";`).join("\n") +
    `\n\nexport const demos: Record<string, React.ComponentType> = {\n` +
    demoFiles.map((f) => `  "${f.slice(0, -4)}": ${ident(f.slice(0, -4))},`).join("\n") +
    `\n};\n`,
);

// ------------------------------------------------------------------ docs for AI agents
// /llms.txt (index), /llms-full.txt (everything in one file), /r/<name>.md (one item).
const docsBase = site || "http://localhost:3000";
const rules = await readFile(join(root, "registry", "ai-rules.md"), "utf8");
const installLine = (...names) => `curl -fsSL ${docsBase}/dx.mjs | node --input-type=module - add ${names.join(" ")}`;
const exportsOf = (content) => {
  const m = content.match(/export \{([\s\S]*?)\};?\s*$/m);
  if (!m) return [];
  return m[1].split(",").map((x) => x.trim()).filter((x) => x && !x.startsWith("type "));
};
const fence = (lang, code) => "```" + lang + "\n" + code.trimEnd() + "\n```";

async function itemMarkdown(item, { withSource }) {
  const lines = [`## ${item.name}`, "", item.description, ""];
  lines.push(`Install: \`${installLine(item.name)}\``);
  if (item.requires.length) lines.push(`Also adds: ${item.requires.join(", ")}`);
  if (item.dependencies.length) lines.push(`npm: ${item.dependencies.join(" ")}`);
  if (item.type === "component") {
    const exp = item.files.flatMap((f) => exportsOf(f.content));
    if (exp.length) lines.push("", fence("tsx", `import { ${exp.join(", ")} } from "@/components/ui/${item.name}";`));
    const demo = join(demoDir, `${item.name}.tsx`);
    if (existsSync(demo)) {
      let code = (await readFile(demo, "utf8")).replace(/^"use client";\n\n?/, "");
      // inline the docs-only helpers so the example stands on its own
      if (code.includes('from "./_shared"')) {
        const shared = (await readFile(join(demoDir, "_shared.tsx"), "utf8"))
          .replace(/^import .*\n/gm, "")
          .replace(/^export /gm, "")
          .trim();
        code = code.replace(/^import \{[^}]*\} from "\.\/_shared";\n/m, "").replace(/\nexport default/, `\n${shared}\n\nexport default`);
        if (!/import \* as React/.test(code) && shared.includes("React.")) code = `import * as React from "react";\n` + code;
      }
      lines.push("", "### Example", "", fence("tsx", code));
    }
  }
  if (withSource) {
    for (const f of item.files) {
      const lang = f.target.endsWith(".css") ? "css" : "tsx";
      lines.push("", `### Source: ${f.target}`, "", fence(lang, f.content));
    }
  }
  return lines.join("\n");
}

const header = `# Digitexa UI\n\n> Open-source, copy-paste React components for dense, warm desktop interfaces (Next.js, Tailwind CSS v4, Radix). Components are installed as source files with the \`dx\` CLI and styled only with semantic --dx-* tokens.\n`;
// docs pages as Markdown too: /md/<page>.md
const mdDir = join(root, "public", "md");
await rm(mdDir, { recursive: true, force: true });
await mkdir(mdDir, { recursive: true });
const contentDir = join(root, "content", "docs");
const docFiles = existsSync(contentDir) ? (await readdir(contentDir)).filter((f) => f.endsWith(".md")) : [];
for (const f of docFiles) {
  let md = (await readFile(join(contentDir, f), "utf8")).replaceAll("{{site}}", docsBase);
  const front = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (front) {
    const title = front[1].match(/title:\s*(.*)/)?.[1] ?? f.slice(0, -3);
    const description = front[1].match(/description:\s*(.*)/)?.[1] ?? "";
    md = `# ${title}\n\n${description}\n${md.slice(front[0].length)}`;
  }
  await writeFile(join(mdDir, f), md);
}
await writeFile(join(mdDir, "changelog.md"), await readFile(join(root, "CHANGELOG.md"), "utf8"));

const index = [
  header,
  "## Start here",
  "",
  `- [Rules for AI agents](${docsBase}/docs/ai): how to write UI with this kit`,
  `- [Full reference](${docsBase}/llms-full.txt): rules, tokens, and every component's API, example and source in one file`,
  ...docFiles.map((f) => `- [${f.slice(0, -3)}](${docsBase}/md/${f})`),
  `- [changelog](${docsBase}/md/changelog.md)`,
  "",
  "## Components",
  "",
  ...built.map((i) => `- [${i.name}](${docsBase}/r/${i.name}.md): ${i.description}`),
  "",
].join("\n");
await writeFile(join(root, "public", "llms.txt"), index);

const full = [header, rules, "", "# Components", ""];
for (const item of built) {
  const md = await itemMarkdown(item, { withSource: true });
  await writeFile(join(outDir, `${item.name}.md`), `${header}\n${md}\n`);
  full.push(md, "");
}
await writeFile(join(root, "public", "llms-full.txt"), full.join("\n"));

console.log(`✓ ${built.length} items → public/r/, CLI → public/dx.mjs${site ? ` (registry: ${site}/r)` : ""}, ${demoFiles.length} demos, llms.txt`);
