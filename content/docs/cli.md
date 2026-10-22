---
title: CLI
description: Add components to your project with dx.
---

`dx` is a zero-dependency Node script served by the docs site. Run it with `curl` and `node`; nothing is installed
globally.

```bash
curl -fsSL {{site}}/dx.mjs | node --input-type=module - <command>
```

## init

Detects the project layout and writes `dx.json`. `add` runs it for you the first time.

```bash
dx init
```

It finds `src/`, the import alias in `tsconfig.json` or `jsconfig.json`, and your global stylesheet.

## add

```bash
dx add button dialog data-table
```

Writes each item and everything it needs, in dependency order: helpers like `utils`, the theme, other components it
imports. Installs missing npm packages with the package manager your project uses (detected from the lockfile,
including monorepo roots).

Existing files are skipped unless you pass `--overwrite`.

## list

```bash
dx list
```

## Options

| Option | |
|---|---|
| `--cwd <dir>` | Project folder (default: current directory) |
| `--overwrite` | Replace files that already exist |
| `--skip-install` | Don't install npm packages; print them instead |
| `--registry <url or dir>` | Read items from another registry |
| `-y`, `--yes` | Don't print the detected settings |
| `-h`, `--help` | Show help |

## dx.json

```json dx.json
{
  "registry": "{{site}}/r",
  "paths": { "ui": "src/components/ui", "lib": "src/lib", "styles": "src/app" },
  "css": "src/app/globals.css",
  "aliases": { "ui": "@/components/ui", "lib": "@/lib" }
}
```

Edit it if detection guessed wrong. Imports inside the copied files are rewritten to these aliases.

## Safety

The CLI only writes inside your project: targets with `..`, absolute paths or unknown roots are refused, so a
compromised registry can't write elsewhere.
