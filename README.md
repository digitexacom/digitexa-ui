# Digitexa UI

Kendi kopyala-yapıştır bileşen kitimiz. Bileşenler paket olarak değil, hedef projeye dosya olarak yazılır.
Next.js (App Router) + Tailwind v4 + Radix + class-variance-authority. shadcn'e bağımlılık yok: registry formatı ve CLI bizim.

## Geliştirme

```bash
npm run dev        # doküman sitesi → http://localhost:3000
npm run registry   # registry/registry.json → public/r/*.json + public/dx.mjs
npm run build      # registry + next build
```

## Yapı

| Yol | Ne |
|---|---|
| `app/tokens.css` | Token değerleri: light `:root`, dark ayrı (`prefers-color-scheme` + `[data-theme=dark]`), `[data-accent]` ile 6 vurgu |
| `app/theme.css` | Tailwind v4 eşlemesi (`bg-surface`, `text-fg-muted`, `bg-status-done` …) ve `dark:` varyantı |
| `components/ui/*` | Bileşenler |
| `registry/registry.json` | Kayıtlar: dosyalar, npm bağımlılıkları, `requires` (diğer kayıtlar) |
| `cli/dx.mjs` | Sıfır bağımlılıklı CLI (`dx list`, `dx add …`) |

## Başka projeye kurulum

```bash
curl -fsSL <site>/dx.mjs | node --input-type=module - add theme button --registry <site>/r
```

`--cwd <klasör>`, `--overwrite`, `--no-install`, `--alias ~/` desteklenir. Yerel klasörden de çalışır:
`node cli/dx.mjs add button --registry ./public/r --cwd ../baska-proje`.

Yeni bileşen: `components/ui/x.tsx` yaz → `registry/registry.json`'a kayıt ekle → `npm run registry`.
