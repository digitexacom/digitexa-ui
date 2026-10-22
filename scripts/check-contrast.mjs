#!/usr/bin/env node
// WCAG 2.x contrast check for the token pairs components actually render.
// Parses app/tokens.css (tokens are --dx-* prefixed; pairs below omit the prefix), resolves each token for light + dark and every accent,
// and fails if a text/background pair falls below its required ratio.
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(join(root, "app", "tokens.css"), "utf8");

// [foreground, background, minimum ratio]. 4.5 = body text, 3 = large/bold UI text and icons.
const PAIRS = [
  ["fg", "bg", 4.5],
  ["fg", "surface", 4.5],
  ["fg-muted", "bg", 4.5],
  ["fg-muted", "surface", 4.5],
  ["fg-muted", "muted", 4.5],
  ["fg-subtle", "surface", 3],
  ["accent-fg", "accent", 4.5],
  ["accent-subtle-fg", "accent-subtle", 4.5],
  ["accent", "surface", 3],
  ["danger-fg", "danger", 4.5],
  ["danger", "surface", 4.5],
  ["success-fg", "success-subtle", 4.5],
  ["warning-fg", "warning-subtle", 4.5],
  ["danger-fg-subtle", "danger-subtle", 4.5],
  ["info-fg", "info-subtle", 4.5],
  ...["backlog", "todo", "progress", "review", "done"].map((s) => [`status-${s}-fg`, `status-${s}-subtle`, 4.5]),
];

// --- parse blocks: selector → { token: value } ---
function parseBlocks(text) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const m of text.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(re)) {
    const selector = m[1].trim();
    const decls = {};
    for (const d of m[2].matchAll(/--(?:dx-)?([\w-]+)\s*:\s*([^;]+);/g)) decls[d[1]] = d[2].trim();
    blocks.push({ selector, decls });
  }
  return blocks;
}

const blocks = parseBlocks(css);
const accents = [...new Set([...css.matchAll(/\[data-accent="([\w-]+)"\]/g)].map((m) => m[1]))];

function tokensFor(accent) {
  const t = {};
  for (const b of blocks) {
    const sels = b.selector.split(",").map((s) => s.trim());
    const applies = sels.some((s) => s === ":root" || s === `[data-accent="${accent}"]` || s === `:root[data-accent="${accent}"]`);
    if (applies) Object.assign(t, b.decls);
  }
  return t;
}

// --- light-dark() + oklch → sRGB luminance ---
function splitTopLevel(s) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function resolve(tokens, name, scheme, seen = new Set()) {
  let v = tokens[name];
  if (v == null) return null;
  if (seen.has(name)) throw new Error(`cycle at --${name}`);
  seen.add(name);
  const ld = v.match(/^light-dark\((.*)\)$/s);
  if (ld) v = splitTopLevel(ld[1])[scheme === "light" ? 0 : 1];
  const ref = v.match(/^var\(--(?:dx-)?([\w-]+)\)$/);
  if (ref) return resolve(tokens, ref[1], scheme, seen);
  return v;
}

function oklchToLuminance(str) {
  const m = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return null;
  let [L, C, H] = m.slice(1).map(Number);
  if (str.includes("%")) L /= 100;
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const [l, mm, s] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const r = clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl; // linear sRGB → relative luminance
}

const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

let failures = 0;
let checked = 0;
const rows = [];
for (const accent of accents) {
  const tokens = tokensFor(accent);
  for (const scheme of ["light", "dark"]) {
    for (const [fg, bg, min] of PAIRS) {
      // accent-independent pairs only need checking once
      if (accent !== accents[0] && !fg.startsWith("accent") && !bg.startsWith("accent")) continue;
      const f = resolve(tokens, fg, scheme);
      const b = resolve(tokens, bg, scheme);
      if (!f || !b) { rows.push(`  ? missing --${!f ? fg : bg}`); failures++; continue; }
      const r = ratio(oklchToLuminance(f), oklchToLuminance(b));
      checked++;
      if (r < min) {
        failures++;
        rows.push(`  ✗ ${scheme.padEnd(5)} ${accent.padEnd(9)} --${fg} on --${bg}: ${r.toFixed(2)} (needs ${min})`);
      }
    }
  }
}

if (rows.length) console.log(rows.join("\n"));
console.log(failures ? `✗ ${failures} contrast failures (${checked} pairs checked)` : `✓ ${checked} pairs pass WCAG contrast`);
process.exit(failures ? 1 : 0);
