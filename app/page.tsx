import Link from "next/link";

import { Code, DocsShell, Section } from "./_docs/docs-shell";
import { CommandLine } from "./_docs/install-command";
import { componentGroups } from "./_docs/nav";
import { installCommand, siteUrl } from "./_docs/site";

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
];

export default function Home() {
  return (
    <DocsShell>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Digitexa UI</h1>
        <p className="mt-2 text-md text-fg-muted">
          An open-source, copy-paste component kit for dense, warm desktop interfaces. Not a package: components are
          written into your project as files you own and edit. Next.js, Tailwind CSS v4 and Radix.
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href="/examples/overview"
            className="inline-flex h-(--dx-control-md) items-center rounded-md bg-accent px-3 font-medium text-accent-fg shadow-sm hover:bg-accent-hover"
          >
            See the example app
          </Link>
          <Link
            href="/components/button"
            className="inline-flex h-(--dx-control-md) items-center rounded-md border border-border bg-surface px-3 font-medium shadow-sm hover:bg-muted"
          >
            Browse components
          </Link>
        </div>
      </div>

      <Section
        id="installation"
        title="Installation"
        description="Needs a project with Tailwind CSS v4 and an import alias such as @/* in tsconfig.json. src/ layouts are detected."
      >
        <ol className="flex flex-col gap-4">
          <li className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">1. Add the theme and the components you want</span>
            <CommandLine command={installCommand("theme", "button", "dialog")} />
            <span className="text-sm text-fg-muted">
              The first run writes <Code>dx.json</Code> with the detected paths, imports the theme into your global
              stylesheet, and installs npm dependencies with your package manager.
            </span>
          </li>
          <li className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">2. Pick an accent, theme and density</span>
            <span className="text-sm text-fg-muted">
              <Code>&lt;html data-accent=&quot;cobalt&quot; data-theme=&quot;dark&quot; data-density=&quot;compact&quot;&gt;</Code>.
              Leave <Code>data-theme</Code> off to follow the system. Accent and density also work on any element.
            </span>
          </li>
          <li className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Other commands</span>
            <CommandLine command={`curl -fsSL ${siteUrl}/dx.mjs | node --input-type=module - list`} />
          </li>
        </ol>
      </Section>

      <Section id="tokens" title="Tokens" description="Warm neutral palette. Light and dark are designed separately; every text/background pair passes WCAG contrast.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {swatches.map((token) => (
            <div key={token} className="overflow-hidden rounded-md border border-border bg-surface">
              <div className="h-10 border-b border-border" style={{ background: `var(--dx-${token})` }} />
              <div className="truncate px-2 py-1.5 font-mono text-2xs text-fg-muted">--dx-{token}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-muted">
          <span>
            Base font <b className="font-medium text-fg">13px</b>
          </span>
          <span>
            Controls <b className="font-medium text-fg">20 / 24 / 30 / 36px</b>
          </span>
          <span>
            Spacing <b className="font-medium text-fg">4pt</b>
          </span>
          <span>
            Radius <b className="font-medium text-fg">4 / 6 / 9 / 12px</b>
          </span>
        </div>
      </Section>

      <Section id="components" title="Components">
        <div className="grid gap-6 sm:grid-cols-2">
          {componentGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1.5 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{group.title}</h3>
              <ul className="flex flex-col">
                {group.items.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/components/${c.slug}`} className="group flex items-baseline gap-2 rounded-sm py-1 hover:text-accent-subtle-fg">
                      <span className="font-medium">{c.title}</span>
                      <span className="truncate text-sm text-fg-subtle group-hover:text-fg-muted">{c.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </DocsShell>
  );
}
