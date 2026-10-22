import * as React from "react";

// Tiny renderer for our own docs markdown (headings, lists, paragraphs, `code`, **bold**, [links](…)).
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("`")) out.push(<code key={k} className="rounded-sm bg-muted px-1 font-mono text-xs">{t.slice(1, -1)}</code>);
    else if (t.startsWith("**")) out.push(<b key={k} className="font-semibold">{t.slice(2, -2)}</b>);
    else {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(<a key={k} href={href} className="text-accent-subtle-fg underline underline-offset-2">{label}</a>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,3}) (.*)/);
    if (h) {
      const level = h[1].length;
      const cls = level === 1 ? "hidden" : level === 2 ? "mt-8 border-b border-border pb-2 text-lg font-semibold" : "mt-5 text-md font-semibold";
      blocks.push(React.createElement(`h${level}`, { key: i, className: cls }, inline(h[2], `h${i}`)));
      i++;
      continue;
    }
    if (/^\s*- /.test(line)) {
      const items: { text: string; nested: string[] }[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) {
        const nested = /^\s{2,}- /.test(lines[i]);
        const text = lines[i].replace(/^\s*- /, "");
        // continuation lines indented under a bullet
        let j = i + 1;
        let full = text;
        while (j < lines.length && /^\s{2,}\S/.test(lines[j]) && !/^\s*- /.test(lines[j])) {
          full += " " + lines[j].trim();
          j++;
        }
        if (nested && items.length) items[items.length - 1].nested.push(full);
        else items.push({ text: full, nested: [] });
        i = j;
      }
      blocks.push(
        <ul key={i} className="mt-3 flex list-disc flex-col gap-1.5 pl-5 marker:text-fg-subtle">
          {items.map((it, n) => (
            <li key={n}>
              {inline(it.text, `li${i}-${n}`)}
              {it.nested.length > 0 && (
                <ul className="mt-1 flex list-[circle] flex-col gap-1 pl-5">
                  {it.nested.map((t, m) => <li key={m}>{inline(t, `li${i}-${n}-${m}`)}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    let para = line;
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|\s*- )/.test(lines[i])) {
      para += " " + lines[i].trim();
      i++;
    }
    blocks.push(<p key={i} className="mt-3 text-fg-muted">{inline(para, `p${i}`)}</p>);
  }
  return <div className="max-w-3xl leading-[1.6]">{blocks}</div>;
}
