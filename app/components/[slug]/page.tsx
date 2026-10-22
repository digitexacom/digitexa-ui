import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Demo } from "../../_docs/demos";
import { Code, DocsShell, Section } from "../../_docs/docs-shell";
import { CommandLine, CopyButton } from "../../_docs/install-command";
import { allComponents } from "../../_docs/nav";
import { installCommand } from "../../_docs/site";

export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = allComponents.find((c) => c.slug === slug);
  return item ? { title: item.title, description: item.description } : {};
}

// Registry files only change at build time, so the read is cached for good.
async function readRegistryItem(slug: string) {
  "use cache";
  cacheLife("max");
  const json = await readFile(join(process.cwd(), "public", "r", `${slug}.json`), "utf8");
  return JSON.parse(json) as {
    dependencies: string[];
    requires: string[];
    files: { target: string; content: string }[];
  };
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const index = allComponents.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const item = allComponents[index];
  const reg = await readRegistryItem(slug);
  const prev = allComponents[index - 1];
  const next = allComponents[index + 1];

  return (
    <DocsShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-1 text-md text-fg-muted">{item.description}</p>
      </div>

      <Section id="preview" title="Preview">
        <div className="rounded-lg border border-border bg-surface p-6">
          <Demo slug={slug} />
        </div>
      </Section>

      <Section id="install" title="Installation">
        <div className="flex flex-col gap-2">
          <CommandLine command={installCommand(slug)} />
          <p className="text-sm text-fg-muted">
            Also adds{" "}
            {reg.requires.map((r, i) => (
              <span key={r}>
                {i > 0 && ", "}
                <Code>{r}</Code>
              </span>
            ))}
            {reg.dependencies.length > 0 && (
              <>
                {" "}and installs{" "}
                {reg.dependencies.map((d, i) => (
                  <span key={d}>
                    {i > 0 && ", "}
                    <Code>{d}</Code>
                  </span>
                ))}
              </>
            )}
            .
          </p>
        </div>
      </Section>

      <Section id="source" title="Source" description="This is the file the CLI writes into your project. It's yours to change.">
        {reg.files.map((f) => (
          <div key={f.target} className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-bg-subtle py-1 pr-1 pl-3">
              <span className="font-mono text-xs text-fg-muted">{f.target.replace(/^ui\//, "components/ui/")}</span>
              <CopyButton value={f.content} label="Copy source" />
            </div>
            <pre className="max-h-96 overflow-auto bg-surface p-3 font-mono text-xs leading-5 text-fg">
              <code>{f.content}</code>
            </pre>
          </div>
        ))}
      </Section>

      <nav className="flex justify-between border-t border-border pt-4 text-sm">
        {prev ? (
          <Link href={`/components/${prev.slug}`} className="text-fg-muted hover:text-fg">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/components/${next.slug}`} className="text-fg-muted hover:text-fg">
            {next.title} →
          </Link>
        )}
      </nav>
    </DocsShell>
  );
}
