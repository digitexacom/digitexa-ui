#!/usr/bin/env node
// registry/registry.json → public/r/index.json + public/r/<name>.json (+ public/dx.mjs)
//
// Each item embeds its file contents, so the CLI installs it with one request.
// npm dependencies (pinned to the ranges in package.json) and `requires` are derived
// from imports, so the registry can't drift from the code. Everything is built and
// validated in memory first; nothing is written unless the whole registry is valid.
//
//   SITE_URL=https://ui.example.com npm run registry   → CLI defaults to that registry
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
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

console.log(`✓ ${built.length} items → public/r/, CLI → public/dx.mjs${site ? ` (registry: ${site}/r)` : ""}`);
