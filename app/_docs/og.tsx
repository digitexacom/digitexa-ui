import { ImageResponse } from "next/og";

// Shared Open Graph card. Satori (next/og) can't read our oklch tokens, so these are the dark
// theme's values in hex. Rendered at build time; one per page that exports an opengraph-image.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const c = {
  bg: "#191715",
  surface: "#211f1c",
  raised: "#282522",
  border: "#34302c",
  fg: "#f1eee9",
  muted: "#a9a39b",
  subtle: "#7d776f",
  accent: "#d97a45",
  accentFg: "#2a1608",
  todo: "#6f9de6",
  progress: "#e3a64d",
  review: "#a98ae2",
  done: "#5db783",
};

const columns = [
  { title: "To do", color: c.todo, cards: [["STR-150", 0.82], ["DRV-91", 0.6]] },
  { title: "In progress", color: c.progress, cards: [["STR-142", 0.9], ["PRC-31", 0.7], ["DRV-90", 0.5]] },
  { title: "Done", color: c.done, cards: [["HLP-12", 0.75]] },
] as const;

function Board() {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {columns.map((col) => (
        <div
          key={col.title}
          style={{ display: "flex", flexDirection: "column", gap: 10, width: 168, padding: 12, borderRadius: 14, background: c.surface, border: `1px solid ${c.border}` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, color: c.fg }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, border: `2.5px solid ${col.color}` }} />
            {col.title}
            <span style={{ color: c.subtle }}>{col.cards.length}</span>
          </div>
          {col.cards.map(([id, w]) => (
            <div
              key={id}
              style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, borderRadius: 10, background: c.raised, border: `1px solid ${c.border}` }}
            >
              <span style={{ fontSize: 12, color: c.subtle }}>{id}</span>
              <div style={{ height: 9, width: `${w * 100}%`, borderRadius: 999, background: c.muted, opacity: 0.55 }} />
              <div style={{ height: 9, width: `${w * 60}%`, borderRadius: 999, background: c.muted, opacity: 0.3 }} />
              <div style={{ display: "flex", height: 6, borderRadius: 999, background: c.border }}>
                <div style={{ width: `${w * 100}%`, borderRadius: 999, background: col.color }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function renderOg({ title, description: rawDescription, kicker }: { title: string; description: string; kicker?: string }) {
  // the bundled font has no ⌘ glyph
  const description = rawDescription.replace(/⌘/g, "Cmd ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: 64,
          background: c.bg,
          color: c.fg,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28 }}>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, background: c.accent, color: c.accentFg, fontSize: 22 }}
            >
              dx
            </div>
            Digitexa UI
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {kicker && <div style={{ fontSize: 24, color: c.accent }}>{kicker}</div>}
            <div style={{ fontSize: title.length > 18 ? 64 : 80, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
            <div style={{ fontSize: 28, lineHeight: 1.35, color: c.muted }}>{description}</div>
          </div>
          <div style={{ fontSize: 24, color: c.subtle }}>ui.digitexa.com</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Board />
        </div>
      </div>
    ),
    ogSize,
  );
}
