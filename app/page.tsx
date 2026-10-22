import { BadgeDemo, ButtonDemo, DialogDemo, InputDemo } from "./_docs/demos";
import { InstallCommand } from "./_docs/install-command";
import { ThemeSwitcher } from "./_docs/theme-switcher";

const components = [
  { id: "button", title: "Button", description: "6 variants, 5 sizes. Default height is 30px.", Demo: ButtonDemo },
  { id: "input", title: "Input", description: "3 sizes, error state via aria-invalid.", Demo: InputDemo },
  { id: "badge", title: "Badge", description: "Work statuses and semantic colors. StatusBadge fills in its own label.", Demo: BadgeDemo },
  { id: "dialog", title: "Dialog", description: "Built on Radix Dialog: focus trap, Esc and outside click handled.", Demo: DialogDemo },
];

const swatches = [
  "bg",
  "surface",
  "muted",
  "border",
  "fg-muted",
  "fg",
  "accent",
  "accent-subtle",
  "success",
  "warning",
  "danger",
  "info",
  "status-backlog",
  "status-todo",
  "status-progress",
  "status-review",
  "status-done",
] as const;

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-fg-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-bg/85 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-sm bg-accent text-2xs font-bold text-accent-fg">dx</span>
          <span className="font-semibold">Digitexa UI</span>
          <span className="rounded-sm bg-muted px-1.5 text-2xs text-fg-muted">v0.1</span>
        </div>
        <ThemeSwitcher />
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <nav className="sticky top-12 hidden h-[calc(100dvh-3rem)] w-48 shrink-0 flex-col gap-0.5 border-r border-border p-3 md:flex">
          <span className="px-2 pt-1 pb-1.5 text-2xs font-medium tracking-wide text-fg-subtle uppercase">Getting started</span>
          <a href="#installation" className="rounded-sm px-2 py-1 text-fg-muted hover:bg-muted hover:text-fg">Installation</a>
          <a href="#tokens" className="rounded-sm px-2 py-1 text-fg-muted hover:bg-muted hover:text-fg">Tokens</a>
          <span className="px-2 pt-3 pb-1.5 text-2xs font-medium tracking-wide text-fg-subtle uppercase">Components</span>
          {components.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="rounded-sm px-2 py-1 text-fg-muted hover:bg-muted hover:text-fg">
              {c.title}
            </a>
          ))}
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-12 px-6 py-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight">Digitexa UI</h1>
            <p className="mt-1 text-md text-fg-muted">
              An open-source, copy-paste component kit. Not a package: components are written into your project as
              files you own and edit. Next.js + Tailwind v4 + Radix.
            </p>
          </div>

          <Section id="installation" title="Installation" description="Add the theme first (tokens + Tailwind mapping), then any component. npm dependencies are installed for you.">
            <div className="flex flex-col gap-2">
              <InstallCommand name="theme" />
              <p className="text-sm text-fg-muted">
                Then, in <code className="rounded-sm bg-muted px-1 font-mono text-xs">globals.css</code>, below{" "}
                <code className="rounded-sm bg-muted px-1 font-mono text-xs">@import &quot;tailwindcss&quot;;</code> add{" "}
                <code className="rounded-sm bg-muted px-1 font-mono text-xs">@import &quot;./dx-tokens.css&quot;; @import &quot;./dx-theme.css&quot;;</code>
                . Accent: <code className="rounded-sm bg-muted px-1 font-mono text-xs">&lt;html data-accent=&quot;cobalt&quot;&gt;</code>, theme:{" "}
                <code className="rounded-sm bg-muted px-1 font-mono text-xs">data-theme=&quot;dark&quot;</code>.
              </p>
            </div>
          </Section>

          <Section id="tokens" title="Tokens" description="Warm neutral palette, light and dark defined separately. Accent and focus ring follow data-accent.">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {swatches.map((token) => (
                <div key={token} className="overflow-hidden rounded-md border border-border bg-surface">
                  <div className="h-10 border-b border-border" style={{ background: `var(--${token})` }} />
                  <div className="px-2 py-1.5 font-mono text-2xs text-fg-muted">--{token}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-muted">
              <span>Base font <b className="font-medium text-fg">13px</b></span>
              <span>Controls <b className="font-medium text-fg">24 / 30 / 36px</b></span>
              <span>Spacing <b className="font-medium text-fg">4pt</b></span>
              <span>Radius <b className="font-medium text-fg">4 / 6 / 9px</b></span>
            </div>
          </Section>

          {components.map(({ id, title, description, Demo }) => (
            <Section key={id} id={id} title={title} description={description}>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-surface p-6">
                  <Demo />
                </div>
                <div className="border-t border-border bg-bg-subtle p-2">
                  <InstallCommand name={id} />
                </div>
              </div>
            </Section>
          ))}
        </main>
      </div>
    </div>
  );
}
