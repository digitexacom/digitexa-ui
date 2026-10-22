import * as React from "react";

import { CopyButton } from "./install-command";

// Small renderer for our own docs markdown: headings (with ids), paragraphs, lists, ``` code ```,
// tables, > notes, `code`, **bold** and [links](…). Enough for the docs; not a general parser.

export type Heading = { id: string; text: string; level: 2 | 3 };

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/`|\*\*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** h2/h3 headings for the "On this page" list. */
export function extractHeadings(source: string): Heading[] {
  const out: Heading[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = line.match(/^(##|###) (.*)/);
    if (m) out.push({ id: slugify(m[2]), text: m[2].replace(/`|\*\*/g, ""), level: m[1].length as 2 | 3 });
  }
  return out;
}

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("`")) {
      out.push(
        <code key={k} className="rounded-sm bg-muted px-1 py-px font-mono text-[0.9em] whitespace-nowrap">
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("**")) {
      out.push(
        <b key={k} className="font-semibold text-fg">
          {t.slice(2, -2)}
        </b>,
      );
    } else {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(
        <a key={k} href={href} className="font-medium text-fg underline underline-offset-4 decoration-border-strong hover:decoration-fg">
          {inline(label, k)}
        </a>,
      );
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function CodeBlock({ code, lang, title }: { code: string; lang?: string; title?: string }) {
  return (
    <div className="group/code relative mt-4 overflow-hidden rounded-lg border border-border bg-bg-subtle">
      {title && <div className="border-b border-border px-3 py-1.5 font-mono text-xs text-fg-muted">{title}</div>}
      <pre className="overflow-x-auto p-3.5 pr-12 font-mono text-xs leading-5 text-fg">
        <code data-lang={lang}>{code}</code>
      </pre>
      <CopyButton value={code} label="Copy code" className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100" />
    </div>
  );
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code
    const fence = line.match(/^```(\w*)\s*(.*)$/);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={i} code={body.join("\n")} lang={fence[1]} title={fence[2] || undefined} />);
      continue;
    }

    // headings
    const h = line.match(/^(#{1,3}) (.*)/);
    if (h) {
      const level = h[1].length;
      if (level > 1) {
        const id = slugify(h[2]);
        const cls = level === 2 ? "mt-10 scroll-mt-20 text-xl font-semibold tracking-tight" : "mt-7 scroll-mt-20 text-md font-semibold";
        blocks.push(
          React.createElement(
            `h${level}`,
            { key: i, id, className: cls },
            <a href={`#${id}`} className="no-underline">
              {inline(h[2], `h${i}`)}
            </a>,
          ),
        );
      }
      i++;
      continue;
    }

    // tables
    if (line.trim().startsWith("|") && lines[i + 1]?.match(/^\s*\|?\s*:?-{2,}/)) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={i} className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-bg-subtle">
              <tr>
                {head.map((c, n) => (
                  <th key={n} className="border-b border-border px-3 py-2 text-left font-medium">
                    {inline(c, `th${i}-${n}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, n) => (
                <tr key={n} className="border-b border-border last:border-0">
                  {r.map((c, m) => (
                    <td key={m} className="px-3 py-2 align-top text-fg-muted">
                      {inline(c, `td${i}-${n}-${m}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // note
    if (line.startsWith("> ")) {
      let text = "";
      while (i < lines.length && lines[i].startsWith(">")) text += " " + lines[i++].replace(/^>\s?/, "");
      blocks.push(
        <div key={i} className="mt-4 rounded-lg border border-border bg-bg-subtle px-4 py-3 text-fg-muted">
          {inline(text.trim(), `n${i}`)}
        </div>,
      );
      continue;
    }

    // lists (one level of nesting)
    if (/^\s*(-|\d+\.) /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line);
      const items: { text: string; nested: string[] }[] = [];
      while (i < lines.length && /^\s*(-|\d+\.) /.test(lines[i])) {
        const nested = /^\s{2,}(-|\d+\.) /.test(lines[i]);
        let full = lines[i].replace(/^\s*(-|\d+\.) /, "");
        let j = i + 1;
        while (j < lines.length && /^\s{2,}\S/.test(lines[j]) && !/^\s*(-|\d+\.) /.test(lines[j])) {
          full += " " + lines[j].trim();
          j++;
        }
        if (nested && items.length) items[items.length - 1].nested.push(full);
        else items.push({ text: full, nested: [] });
        i = j;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={i} className={`mt-4 flex flex-col gap-2 pl-5 marker:text-fg-subtle ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((it, n) => (
            <li key={n} className="pl-1">
              {inline(it.text, `li${i}-${n}`)}
              {it.nested.length > 0 && (
                <ul className="mt-1.5 flex list-[circle] flex-col gap-1.5 pl-5">
                  {it.nested.map((t, m) => (
                    <li key={m}>{inline(t, `li${i}-${n}-${m}`)}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </List>,
      );
      continue;
    }

    // paragraph
    let para = line;
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|\s*(-|\d+\.) |```|\||> )/.test(lines[i])) {
      para += " " + lines[i].trim();
      i++;
    }
    blocks.push(
      <p key={i} className="mt-4 leading-7 text-fg-muted">
        {inline(para, `p${i}`)}
      </p>,
    );
  }
  return <div className="text-md">{blocks}</div>;
}
