import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { BotIcon, FileTextIcon, ListIcon } from "lucide-react";

import { DocPage } from "../../_docs/doc-page";
import { CommandLine, CopyButton } from "../../_docs/install-command";
import { extractHeadings, Markdown } from "../../_docs/markdown";
import { pageMetadata } from "../../_docs/seo";
import { siteUrl } from "../../_docs/site";

export const metadata: Metadata = pageMetadata({
  path: "/docs/ai",
  title: "For AI agents",
  description: "Rules, llms.txt and Markdown references so coding agents like Claude and Cursor build UI with Digitexa UI correctly.",
});

async function readRules() {
  "use cache";
  cacheLife("max");
  return readFile(join(process.cwd(), "registry", "ai-rules.md"), "utf8");
}

const files = [
  { href: "/llms.txt", title: "llms.txt", icon: ListIcon, text: "Index of every page and component, in the llmstxt.org format." },
  { href: "/llms-full.txt", title: "llms-full.txt", icon: FileTextIcon, text: "Rules, tokens, and each component's import, example and source in one file." },
  { href: "/r/button.md", title: "/r/<name>.md", icon: BotIcon, text: "One component at a time. Every page's Copy page menu links its own." },
];

export default async function AiDocsPage() {
  const rules = (await readRules()).replace(/^# .*\n/, "");
  const snippet = `This project uses Digitexa UI. Before writing UI, read ${siteUrl}/llms-full.txt and follow its rules: reuse components in components/ui, add missing ones with the dx CLI, and style only with the semantic --dx tokens.`;

  return (
    <DocPage
      href="/docs/ai"
      title="For AI agents"
      description="Coding agents (Claude, Cursor, Copilot, v0 …) build better UI when they know the kit. Point them at these files, or paste the snippet into your project."
      markdown={rules}
      markdownUrl="/llms-full.txt"
      toc={[
        { id: "machine-readable-docs", text: "Machine-readable docs", level: 2 },
        { id: "project-snippet", text: "Project snippet", level: 2 },
        ...extractHeadings(rules),
      ]}
    >
      <h2 id="machine-readable-docs" className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight">
        Machine-readable docs
      </h2>
      <p className="mt-4 leading-7 text-fg-muted">Generated from the registry on every build, so they never drift from the code.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {files.map(({ href, title, icon: Icon, text }) => (
          <a key={href} href={href} className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-4 shadow-sm hover:border-border-strong">
            <Icon className="size-4 text-fg-subtle" />
            <span className="font-mono text-sm font-medium">{title}</span>
            <span className="text-sm text-fg-muted">{text}</span>
          </a>
        ))}
      </div>
      <div className="mt-4">
        <CommandLine command={`curl -fsSL ${siteUrl}/llms-full.txt`} />
      </div>

      <h2 id="project-snippet" className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight">
        Project snippet
      </h2>
      <p className="mt-4 leading-7 text-fg-muted">
        Paste into <code className="rounded-sm bg-muted px-1 font-mono text-[0.9em]">AGENTS.md</code>,{" "}
        <code className="rounded-sm bg-muted px-1 font-mono text-[0.9em]">CLAUDE.md</code> or{" "}
        <code className="rounded-sm bg-muted px-1 font-mono text-[0.9em]">.cursor/rules</code>.
      </p>
      <div className="relative mt-4 rounded-lg border border-border bg-bg-subtle p-4 pr-12 text-sm leading-6">
        {snippet}
        <CopyButton value={snippet} label="Copy snippet" className="absolute top-2 right-2" />
      </div>

      <Markdown source={rules} />
    </DocPage>
  );
}
