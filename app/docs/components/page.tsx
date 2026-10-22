import type { Metadata } from "next";
import Link from "next/link";

import { DocPage } from "../../_docs/doc-page";
import { componentGroups, sortedComponents } from "../../_docs/nav";

export const metadata: Metadata = { title: "Components", description: "Every component in the kit." };

const projectManagement = componentGroups.find((g) => g.title === "Project management")?.items ?? [];

function Grid({ items }: { items: { slug: string; title: string }[] }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
      {items.map((c) => (
        <Link key={c.slug} href={`/docs/components/${c.slug}`} className="text-lg font-medium hover:underline hover:underline-offset-4">
          {c.title}
        </Link>
      ))}
    </div>
  );
}

export default function ComponentsIndex() {
  const markdown = [
    "# Components",
    "",
    ...sortedComponents.map((c) => `- [${c.title}](/docs/components/${c.slug}): ${c.description}`),
    "",
  ].join("\n");
  return (
    <DocPage
      href="/docs/components"
      title="Components"
      description={`All ${sortedComponents.length} components in the kit. Each one is a file you add with the CLI and own from then on.`}
      markdown={markdown}
      markdownUrl="/llms.txt"
      toc={[
        { id: "project-management", text: "Project management", level: 2 },
        { id: "all-components", text: "All components", level: 2 },
      ]}
    >
      <h2 id="project-management" className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight">
        Project management
      </h2>
      <Grid items={projectManagement} />
      <h2 id="all-components" className="mt-14 scroll-mt-20 text-xl font-semibold tracking-tight">
        All components
      </h2>
      <Grid items={sortedComponents} />
    </DocPage>
  );
}
