import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { readExample, readRegistryItem } from "../../../_docs/content";
import { Demo } from "../../../_docs/demos";
import { DocPage } from "../../../_docs/doc-page";
import { CommandLine } from "../../../_docs/install-command";
import { CodeBlock } from "../../../_docs/markdown";
import { allComponents } from "../../../_docs/nav";
import { installCommand } from "../../../_docs/site";

// Every slug is prerendered. Don't wrap the body in <Suspense> to silence the "params outside Suspense"
// hint: with cacheComponents that left the demos un-hydrated (static HTML, no interactivity).
export const instant = false;

export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = allComponents.find((c) => c.slug === slug);
  if (!item) return {};
  const og = { title: `${item.title} · Digitexa UI`, description: item.description };
  return { title: item.title, description: item.description, openGraph: og, twitter: { card: "summary_large_image", ...og } };
}

export default function ComponentPage({ params }: PageProps<"/docs/components/[slug]">) {
  return <ComponentDoc params={params} />;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-20 text-xl font-semibold tracking-tight">
      <a href={`#${id}`}>{children}</a>
    </h2>
  );
}

const exportsOf = (content: string) => {
  const m = content.match(/export \{([\s\S]*?)\};?\s*$/m);
  return m ? m[1].split(",").map((x) => x.trim()).filter((x) => x && !x.startsWith("type ")) : [];
};

async function ComponentDoc({ params }: { params: PageProps<"/docs/components/[slug]">["params"] }) {
  const { slug } = await params;
  const meta = allComponents.find((c) => c.slug === slug);
  if (!meta) notFound();
  const [{ item, markdown }, example] = await Promise.all([readRegistryItem(slug), readExample(slug)]);
  const source = item.files[0];
  const exported = item.files.flatMap((f) => exportsOf(f.content));
  const importLine = `import { ${exported.join(", ")} } from "@/components/ui/${slug}";`;
  const deps = item.dependencies.map((d) => d.replace(/(?<=.)@[^@]*$/, ""));

  return (
    <DocPage
      href={`/docs/components/${slug}`}
      title={meta.title}
      description={meta.description}
      markdown={markdown}
      markdownUrl={`/r/${slug}.md`}
      toc={[
        { id: "preview", text: "Preview", level: 2 },
        { id: "installation", text: "Installation", level: 2 },
        { id: "usage", text: "Usage", level: 2 },
      ]}
    >
      <div id="preview" className="mt-8 scroll-mt-20">
        <Tabs defaultValue="preview">
          <TabsList variant="underline">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" forceMount className="data-[state=inactive]:hidden">
            <div className="mt-4 flex min-h-72 items-center justify-center overflow-x-auto rounded-lg border border-border bg-surface p-8">
              <div className="w-full">
                <Demo slug={slug} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">{example && <CodeBlock code={example} lang="tsx" />}</TabsContent>
        </Tabs>
      </div>

      <H2 id="installation">Installation</H2>
      <Tabs defaultValue="cli" className="mt-4">
        <TabsList variant="underline">
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="cli" className="mt-4 flex flex-col gap-2">
          <CommandLine command={installCommand(slug)} />
          <p className="text-sm text-fg-muted">
            Also adds {item.requires.join(", ")}
            {deps.length > 0 && <> and installs {deps.join(", ")}</>}.
          </p>
        </TabsContent>
        <TabsContent value="manual">
          <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-fg-muted">
            {deps.length > 0 && (
              <li>
                Install the dependencies:
                <CodeBlock code={`npm install ${deps.join(" ")}`} lang="bash" />
              </li>
            )}
            {item.requires.length > 0 && <li>Add {item.requires.join(", ")} (each has its own page).</li>}
            <li>
              Copy this into <code className="rounded-sm bg-muted px-1 font-mono text-xs">{source.target.replace(/^ui\//, "components/ui/")}</code>:
              <div className="[&_pre]:max-h-[28rem]">
                <CodeBlock code={source.content} lang="tsx" title={source.target.replace(/^ui\//, "components/ui/")} />
              </div>
            </li>
          </ol>
        </TabsContent>
      </Tabs>

      <H2 id="usage">Usage</H2>
      <CodeBlock code={importLine} lang="tsx" />
      {example && (
        <p className="mt-4 text-fg-muted">
          The <b className="font-medium text-fg">Code</b> tab above shows a complete example.
        </p>
      )}
    </DocPage>
  );
}
