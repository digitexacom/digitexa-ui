#!/usr/bin/env node
// dx — Digitexa UI CLI. Sıfır bağımlılık, Node 18+.
//
//   dx list
//   dx add button dialog [--overwrite] [--no-install]
//
// Seçenekler:
//   --registry <url|klasör>  varsayılan: $DX_REGISTRY ya da http://localhost:3000/r
//   --cwd <klasör>           hedef proje (varsayılan: çalışılan klasör)
//   --alias <önek>           "@/..." importlarını başka önekle değiştir (ör. "~/")
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--no-")) flags[a.slice(5)] = false;
  else if (a.startsWith("--")) {
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) flags[a.slice(2)] = argv[++i];
    else flags[a.slice(2)] = true;
  } else positional.push(a);
}

const [command, ...names] = positional;
const registry = String(flags.registry ?? process.env.DX_REGISTRY ?? "http://localhost:3000/r").replace(/\/$/, "");
const cwd = resolve(String(flags.cwd ?? process.cwd()));
const c = { dim: (s) => `\x1b[2m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m` };

async function fetchJson(name) {
  if (/^https?:\/\//.test(registry)) {
    const res = await fetch(`${registry}/${name}.json`);
    if (!res.ok) throw new Error(`${name}: ${res.status} ${res.statusText} (${registry}/${name}.json)`);
    return res.json();
  }
  return JSON.parse(await readFile(join(registry, `${name}.json`), "utf8"));
}

const exists = (p) => access(p).then(() => true, () => false);

async function resolveAll(requested) {
  const seen = new Set();
  const ordered = [];
  async function visit(name) {
    if (seen.has(name)) return;
    seen.add(name);
    const item = await fetchJson(name);
    for (const dep of item.requires ?? []) await visit(dep);
    ordered.push(item); // bağımlılıklar önce
  }
  for (const n of requested) await visit(n);
  return ordered;
}

function packageManager() {
  const locks = [["pnpm-lock.yaml", "pnpm"], ["yarn.lock", "yarn"], ["bun.lockb", "bun"], ["bun.lock", "bun"]];
  for (const [file, pm] of locks) if (existsSync(join(cwd, file))) return pm;
  return "npm";
}

async function add() {
  if (!names.length) throw new Error("Kullanım: dx add <bileşen...>");
  const items = await resolveAll(names);
  const deps = new Set();
  const notes = [];

  for (const item of items) {
    for (const d of item.dependencies ?? []) deps.add(d);
    if (item.notes) notes.push(`${item.name}: ${item.notes}`);
    for (const file of item.files) {
      const target = join(cwd, file.target);
      if ((await exists(target)) && !flags.overwrite) {
        console.log(c.dim(`  atlandı  ${file.target} (var; üzerine yazmak için --overwrite)`));
        continue;
      }
      let content = file.content;
      if (typeof flags.alias === "string") content = content.replaceAll(`from "@/`, `from "${flags.alias}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
      console.log(c.green(`  yazıldı  ${file.target}`));
    }
  }

  if (deps.size && flags.install !== false) {
    const pm = packageManager();
    const args = [pm === "npm" ? "install" : "add", ...deps];
    console.log(c.dim(`\n  ${pm} ${args.join(" ")}`));
    const r = spawnSync(pm, args, { cwd, stdio: "inherit" });
    if (r.status !== 0) throw new Error("Bağımlılık kurulumu başarısız.");
  } else if (deps.size) {
    console.log(c.yellow(`\n  Kurulmadı: ${[...deps].join(" ")}`));
  }

  if (notes.length) console.log(c.yellow(`\n${notes.join("\n")}`));
  console.log(`\n✓ ${items.map((i) => i.name).join(", ")}`);
}

async function list() {
  const index = await fetchJson("index");
  for (const item of index.items) console.log(`  ${item.name.padEnd(10)} ${c.dim(item.description ?? "")}`);
}

try {
  if (command === "add") await add();
  else if (command === "list") await list();
  else {
    console.log("dx list | dx add <bileşen...> [--registry url] [--cwd dir] [--overwrite] [--no-install] [--alias ~/]");
    process.exit(command ? 1 : 0);
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(1);
}
