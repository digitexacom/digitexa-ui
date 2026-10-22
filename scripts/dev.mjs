#!/usr/bin/env node
// `npm run dev`: builds the registry, rebuilds it whenever a shipped file changes, and runs next dev.
import { spawn, spawnSync } from "node:child_process";
import { watch } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const build = () => spawnSync(process.execPath, [join(root, "scripts", "build-registry.mjs")], { cwd: root, stdio: "inherit" });

build();

let timer;
const rebuild = () => {
  clearTimeout(timer);
  timer = setTimeout(build, 150);
};
for (const dir of ["components/ui", "lib", "registry", "cli"]) watch(join(root, dir), rebuild);
for (const file of ["app/tokens.css", "app/theme.css", "package.json"]) watch(join(root, file), rebuild);

const next = spawn("npx", ["next", "dev", ...process.argv.slice(2)], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
next.on("exit", (code) => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => next.kill(signal));
