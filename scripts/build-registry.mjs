#!/usr/bin/env node
// registry/registry.json → public/r/index.json + public/r/<name>.json
// Each item embeds its file contents, so the CLI installs it with a single request.
import { readFile, writeFile, mkdir, rm, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "r");
const registry = JSON.parse(await readFile(join(root, "registry", "registry.json"), "utf8"));

const names = new Set(registry.items.map((i) => i.name));
const errors = [];
for (const item of registry.items) {
  for (const dep of item.requires ?? []) {
    if (!names.has(dep)) errors.push(`${item.name}: unknown requires "${dep}"`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const index = [];
for (const item of registry.items) {
  const files = await Promise.all(
    item.files.map(async (f) => ({
      target: f.target,
      content: await readFile(join(root, f.src), "utf8"),
    })),
  );
  const out = {
    name: item.name,
    type: item.type,
    description: item.description,
    dependencies: item.dependencies ?? [],
    requires: item.requires ?? [],
    files,
    ...(item.notes ? { notes: item.notes } : {}),
  };
  await writeFile(join(outDir, `${item.name}.json`), JSON.stringify(out, null, 2) + "\n");
  index.push({ name: item.name, type: item.type, description: item.description });
  console.log(`  r/${item.name}.json  (${files.length} files)`);
}

await writeFile(
  join(outDir, "index.json"),
  JSON.stringify({ name: registry.name, items: index }, null, 2) + "\n",
);
// Publish the CLI too: curl -fsSL <site>/dx.mjs | node --input-type=module - add button
await copyFile(join(root, "cli", "dx.mjs"), join(root, "public", "dx.mjs"));
console.log(`✓ ${index.length} items → public/r/, CLI → public/dx.mjs`);
