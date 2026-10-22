#!/usr/bin/env node
// registry/registry.json → public/r/index.json + public/r/<name>.json
// Her kayıt dosya içeriklerini gömülü taşır; CLI ağdan tek istekle kurabilir.
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
    if (!names.has(dep)) errors.push(`${item.name}: bilinmeyen requires "${dep}"`);
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
  console.log(`  r/${item.name}.json  (${files.length} dosya)`);
}

await writeFile(
  join(outDir, "index.json"),
  JSON.stringify({ name: registry.name, items: index }, null, 2) + "\n",
);
// CLI'ı da yayınla: curl -fsSL <site>/dx.mjs | node --input-type=module - add button
await copyFile(join(root, "cli", "dx.mjs"), join(root, "public", "dx.mjs"));
console.log(`✓ ${index.length} kayıt → public/r/, CLI → public/dx.mjs`);
