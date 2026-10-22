#!/usr/bin/env node
// dx — Digitexa UI CLI. Zero dependencies, Node 20+.
//
//   dx init                 detect project layout and write dx.json
//   dx add <item...>        copy components (and what they need) into the project
//   dx list                 show everything in the registry
//
// Run `dx --help` for options.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, relative, sep, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";

// scripts/build-registry.mjs replaces the placeholder with the site the CLI is served from.
const BUILT_REGISTRY = "__DX_REGISTRY__";
const DEFAULT_REGISTRY = BUILT_REGISTRY.startsWith("__") ? "http://localhost:3000/r" : BUILT_REGISTRY;
const CONFIG_FILE = "dx.json";

const HELP = `dx — Digitexa UI

Usage
  dx init                      detect project layout and write ${CONFIG_FILE}
  dx add <item...>             add components, e.g. dx add theme button dialog
  dx list                      list registry items

Options
  --registry <url|dir>         registry to read from (default: ${CONFIG_FILE}, $DX_REGISTRY, or the site this CLI came from)
  --cwd <dir>                  project folder (default: current directory)
  --overwrite                  replace files that already exist
  --skip-install               don't install npm dependencies
  -y, --yes                    accept detected settings without printing them
  -h, --help                   show this help`;

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

let args;
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      registry: { type: "string" },
      cwd: { type: "string" },
      overwrite: { type: "boolean", default: false },
      "skip-install": { type: "boolean", default: false },
      yes: { type: "boolean", short: "y", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
} catch (err) {
  console.error(c.red(`✗ ${err.message}`));
  console.error(HELP);
  process.exit(1);
}

const { values: flags, positionals } = args;
const [command, ...names] = positionals;
const cwd = resolve(flags.cwd ?? process.cwd());

// ---------------------------------------------------------------- helpers

const exists = (p) => access(p).then(() => true, () => false);

async function readJsonc(path) {
  const text = await readFile(path, "utf8");
  // tsconfig allows comments and trailing commas; strip them (strings are left intact)
  const stripped = text
    .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str ?? "")
    .replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(stripped);
}

/** Resolve a path inside the project; refuse anything that escapes it. */
function inside(base, target) {
  if (isAbsolute(target)) throw new Error(`refusing absolute path from registry: ${target}`);
  const full = resolve(base, target);
  const rel = relative(base, full);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error(`refusing path outside the project: ${target}`);
  return full;
}

const toPosix = (p) => p.split(sep).join("/");

// ---------------------------------------------------------------- config

async function detectConfig() {
  const hasSrc =
    existsSync(join(cwd, "src", "app")) || existsSync(join(cwd, "src", "components")) || existsSync(join(cwd, "src", "pages"));
  const base = hasSrc ? "src" : ".";

  // the stylesheet that imports tailwindcss
  const cssCandidates = ["app/globals.css", "styles/globals.css", "app/global.css", "styles/global.css", "index.css", "app.css"].map(
    (p) => toPosix(join(base, p)),
  );
  let css = null;
  for (const candidate of cssCandidates) {
    if (await exists(join(cwd, candidate))) {
      css = candidate;
      break;
    }
  }

  // import alias from tsconfig/jsconfig paths, e.g. "@/*": ["./src/*"]
  let alias = null;
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const p = join(cwd, file);
    if (!(await exists(p))) continue;
    try {
      const paths = (await readJsonc(p)).compilerOptions?.paths ?? {};
      for (const [key, targets] of Object.entries(paths)) {
        if (!key.endsWith("/*") || !targets?.[0]) continue;
        const dir = toPosix(targets[0].replace(/\/?\*$/, "")).replace(/^\.\/?/, "");
        alias = { prefix: key.slice(0, -1), dir: dir || "." };
        break;
      }
    } catch {}
    if (alias) break;
  }

  const ui = toPosix(join(base, "components", "ui"));
  const lib = toPosix(join(base, "lib"));
  const styles = css ? toPosix(dirname(css)) : toPosix(join(base, "app"));

  const importPath = (dir) => {
    if (!alias) return null;
    const rel = toPosix(relative(alias.dir, dir));
    return rel.startsWith("..") ? null : alias.prefix + rel;
  };

  return {
    registry: flags.registry ?? process.env.DX_REGISTRY ?? DEFAULT_REGISTRY,
    paths: { ui, lib, styles },
    css,
    aliases: { ui: importPath(ui), lib: importPath(lib) },
  };
}

async function loadConfig({ write } = { write: false }) {
  const file = join(cwd, CONFIG_FILE);
  if (await exists(file)) {
    const config = JSON.parse(await readFile(file, "utf8"));
    if (flags.registry) config.registry = flags.registry;
    return config;
  }
  const config = await detectConfig();
  if (!config.aliases.ui || !config.aliases.lib) {
    const root = config.paths.ui.startsWith("src/") ? "./src/*" : "./*";
    throw new Error(
      `couldn't find an import alias that covers ${config.paths.ui}. Add "paths": { "@/*": ["${root}"] } to tsconfig.json, or write ${CONFIG_FILE} by hand.`,
    );
  }
  if (write) {
    await writeFile(file, JSON.stringify(config, null, 2) + "\n");
    console.log(c.green(`  wrote    ${CONFIG_FILE}`));
  }
  if (!flags.yes) {
    console.log(
      c.dim(
        `  ui → ${config.paths.ui} (${config.aliases.ui}), lib → ${config.paths.lib} (${config.aliases.lib}), css → ${config.css ?? "not found"}`,
      ),
    );
  }
  return config;
}

// ---------------------------------------------------------------- registry

async function fetchItem(registry, name) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`invalid item name: ${name}`);
  if (/^https?:\/\//.test(registry)) {
    const url = `${registry.replace(/\/$/, "")}/${name}.json`;
    let res;
    try {
      res = await fetch(url);
    } catch (err) {
      throw new Error(`can't reach ${url}: ${err.cause?.message ?? err.message}`);
    }
    if (res.status === 404) throw new Error(`no item called "${name}" in ${registry} (try \`dx list\`)`);
    if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`);
    return res.json();
  }
  const path = join(resolve(registry), `${name}.json`);
  if (!(await exists(path))) throw new Error(`no item called "${name}" in ${registry} (try \`dx list\`)`);
  return JSON.parse(await readFile(path, "utf8"));
}

async function resolveAll(registry, requested) {
  const seen = new Set();
  const ordered = [];
  async function visit(name) {
    if (seen.has(name)) return;
    seen.add(name);
    const item = await fetchItem(registry, name);
    for (const dep of item.requires ?? []) await visit(dep);
    ordered.push(item); // dependencies first
  }
  for (const n of requested) await visit(n);
  return ordered;
}

// ---------------------------------------------------------------- install

function packageManager() {
  const agent = process.env.npm_config_user_agent ?? "";
  for (const pm of ["pnpm", "yarn", "bun"]) if (agent.startsWith(pm)) return pm;
  const locks = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"],
  ];
  // walk up so workspaces in a monorepo pick the root's package manager
  for (let dir = cwd; ; dir = dirname(dir)) {
    for (const [file, pm] of locks) if (existsSync(join(dir, file))) return pm;
    if (dirname(dir) === dir) return "npm";
  }
}

const packageName = (spec) => spec.replace(/(?<=.)@.*$/, "");

async function missingDeps(deps) {
  const pkgPath = join(cwd, "package.json");
  if (!(await exists(pkgPath))) return deps;
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  const installed = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  return deps.filter((spec) => !(packageName(spec) in installed));
}

function install(deps) {
  const pm = packageManager();
  const cmd = [pm === "npm" ? "install" : "add", ...deps];
  console.log(c.dim(`\n  ${pm} ${cmd.join(" ")}`));
  // .cmd shims on Windows need a shell (Node ≥ 18.20 / 20.12)
  const r = spawnSync(pm, cmd, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.error) throw new Error(`couldn't run ${pm}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${pm} exited with code ${r.status}`);
}

// ---------------------------------------------------------------- commands

function rewriteImports(content, config) {
  return content.replaceAll(`"@/components/ui/`, `"${config.aliases.ui}/`).replaceAll(`"@/lib/`, `"${config.aliases.lib}/`);
}

async function wireStylesheet(config, sheets) {
  if (!sheets.length) return null;
  if (!config.css) return `Import ${sheets.join(" and ")} in your main stylesheet, after @import "tailwindcss".`;
  const cssPath = inside(cwd, config.css);
  let css = await readFile(cssPath, "utf8");
  const lines = sheets
    .map((f) => {
      let rel = toPosix(relative(dirname(cssPath), join(cwd, f)));
      if (!rel.startsWith(".")) rel = `./${rel}`;
      return `@import "${rel}";`;
    })
    .filter((line) => !css.includes(line));
  const before = css;
  if (lines.length) {
    const anchor = css.match(/^@import\s+["']tailwindcss["'][^;]*;[^\n]*$/m);
    if (!anchor) return `Add to ${config.css}, after @import "tailwindcss":\n  ${lines.join("\n  ")}`;
    const at = anchor.index + anchor[0].length;
    css = css.slice(0, at) + "\n" + lines.join("\n") + css.slice(at);
  }

  // create-next-app ships unlayered body/:root styles that always beat the theme; drop them when untouched
  let removed = 0;
  for (const block of STARTER_BLOCKS) {
    if (block.test(css)) {
      css = css.replace(block, "");
      removed++;
    }
  }
  css = css.replace(/\n{3,}/g, "\n\n");
  if (css === before) return null;
  await writeFile(cssPath, css);
  console.log(c.green(`  updated  ${config.css}`));
  if (removed) console.log(c.dim(`           removed ${removed} create-next-app starter style block(s) that override the theme`));
  return null;
}

// The exact starter styles from create-next-app; anything the user changed is left alone.
const STARTER_BLOCKS = [
  /:root\s*\{\s*--background:\s*#ffffff;\s*--foreground:\s*#171717;\s*\}\s*/,
  /@theme inline\s*\{\s*--color-background:\s*var\(--background\);\s*--color-foreground:\s*var\(--foreground\);\s*--font-sans:\s*var\(--font-geist-sans\);\s*--font-mono:\s*var\(--font-geist-mono\);\s*\}\s*/,
  /@media \(prefers-color-scheme: dark\)\s*\{\s*:root\s*\{\s*--background:\s*#0a0a0a;\s*--foreground:\s*#ededed;\s*\}\s*\}\s*/,
  /body\s*\{\s*background:\s*var\(--background\);\s*color:\s*var\(--foreground\);\s*font-family:\s*Arial, Helvetica, sans-serif;\s*\}\s*/,
];

async function add() {
  if (!names.length) throw new Error("usage: dx add <item...>  (see `dx list`)");
  const config = await loadConfig({ write: true });
  const items = await resolveAll(config.registry, names);
  const deps = new Set();
  const notes = [];
  const sheets = [];

  for (const item of items) {
    for (const d of item.dependencies ?? []) deps.add(d);
    for (const file of item.files) {
      // targets look like "ui/button.tsx", "lib/utils.ts", "styles/dx-tokens.css"
      const [root, ...rest] = String(file.target).split("/");
      const dir = config.paths[root];
      if (!dir || !rest.length) throw new Error(`${item.name}: unknown target "${file.target}"`);
      if (rest.some((part) => part === ".." || part === "." || part === "" || part.includes("\\")))
        throw new Error(`${item.name}: refusing unsafe target "${file.target}"`);
      const relTarget = toPosix(join(dir, ...rest));
      const target = inside(cwd, relTarget);
      if (relTarget.endsWith(".css")) sheets.push(relTarget);
      if ((await exists(target)) && !flags.overwrite) {
        console.log(c.dim(`  skipped  ${relTarget} (exists; --overwrite to replace)`));
        continue;
      }
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, rewriteImports(file.content, config));
      console.log(c.green(`  wrote    ${relTarget}`));
    }
  }

  const note = await wireStylesheet(config, sheets);
  if (note) notes.push(note);

  const toInstall = await missingDeps([...deps]);
  if (toInstall.length && !flags["skip-install"]) install(toInstall);
  else if (toInstall.length) notes.push(`Install: ${toInstall.join(" ")}`);

  if (notes.length) console.log(c.yellow(`\n${notes.join("\n")}`));
  console.log(`\n✓ ${items.map((i) => i.name).join(", ")}`);
}

async function init() {
  const file = join(cwd, CONFIG_FILE);
  if ((await exists(file)) && !flags.overwrite) {
    console.log(c.dim(`  ${CONFIG_FILE} already exists (--overwrite to detect again)`));
    return;
  }
  if (flags.overwrite && (await exists(file))) {
    const { rm } = await import("node:fs/promises");
    await rm(file);
  }
  await loadConfig({ write: true });
  console.log(`\n✓ ready. Next: dx add theme button`);
}

async function list() {
  const registry = (await exists(join(cwd, CONFIG_FILE)))
    ? (await loadConfig()).registry
    : (flags.registry ?? process.env.DX_REGISTRY ?? DEFAULT_REGISTRY);
  const index = await fetchItem(registry, "index");
  const width = Math.max(...index.items.map((i) => i.name.length)) + 2;
  for (const item of index.items) console.log(`  ${item.name.padEnd(width)} ${c.dim(item.description ?? "")}`);
}

try {
  if (flags.help || !command || command === "help") console.log(HELP);
  else if (command === "add") await add();
  else if (command === "init") await init();
  else if (command === "list") await list();
  else throw new Error(`unknown command "${command}" (see dx --help)`);
} catch (err) {
  console.error(c.red(`✗ ${err.message}`));
  process.exit(1);
}
