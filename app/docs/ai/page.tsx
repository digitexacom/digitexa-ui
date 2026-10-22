import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { BotIcon, FileTextIcon, ListIcon } from "lucide-react";

import { Code, DocsShell, Section } from "../../_docs/docs-shell";
import { CommandLine, CopyButton } from "../../_docs/install-command";
import { Markdown } from "../../_docs/markdown";
import { siteUrl } from "../../_docs/site";

export const metadata: Metadata = {
  title: "For AI agents",
  description: "Rules and machine-readable references so coding agents build UI with Digitexa UI correctly.",
};

async function readRules() {
  "use cache";
  cacheLife("max");
  return readFile(join(process.cwd(), "registry", "ai-rules.md"), "utf8");
}

const files = [
  { href: "/llms.txt", title: "llms.txt", icon: ListIcon, text: "Index of every page and component, in the llmstxt.org format." },
  { href: "/llms-full.txt", title: "llms-full.txt", icon: FileTextIcon, text: "Everything in one file: rules, tokens, and each component's import, example and source." },
  { href: "/r/button.md", title: "/r/<name>.md", icon: BotIcon, text: "One component at a time, e.g. button. Every docs page links its own." },
];

export default async function AiDocsPage() {
  const rules = await readRules();
  const snippet = `This project uses Digitexa UI. Before writing UI, read ${siteUrl}/llms-full.txt (or the rules at ${siteUrl}/docs/ai) and follow them: reuse components in components/ui, add missing ones with the dx CLI, and style only with the semantic --dx tokens.`;

  return (
    <DocsShell>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">For AI agents</h1>
        <p className="mt-2 text-md text-fg-muted">
          Coding agents (Claude, Cursor, Copilot, v0 …) build better UI when they know the kit. Point them at these files,
          or paste the snippet into your project&apos;s <Code>AGENTS.md</Code>, <Code>CLAUDE.md</Code> or <Code>.cursor/rules</Code>.
        </p>
      </div>

      <Section title="Machine-readable docs" description="Generated from the registry on every build, so they never drift from the code.">
        <div className="grid gap-3 sm:grid-cols-3">
          {files.map(({ href, title, icon: Icon, text }) => (
            <a key={href} href={href} className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-4 shadow-sm hover:border-border-strong">
              <Icon className="size-4 text-fg-subtle" />
              <span className="font-mono text-sm font-medium">{title}</span>
              <span className="text-sm text-fg-muted">{text}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section title="Project snippet" description="Paste into AGENTS.md / CLAUDE.md / .cursor/rules.">
        <div className="relative rounded-lg border border-border bg-bg-subtle p-4 pr-12 text-sm">
          {snippet}
          <CopyButton value={snippet} label="Copy snippet" className="absolute top-2 right-2" />
        </div>
      </Section>

      <Section title="Fetch everything" description="For agents that can run commands.">
        <CommandLine command={`curl -fsSL ${siteUrl}/llms-full.txt`} />
      </Section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">The rules</h2>
          <CopyButton value={rules} label="Copy rules as Markdown" />
        </div>
        <Markdown source={rules} />
      </section>
    </DocsShell>
  );
}
