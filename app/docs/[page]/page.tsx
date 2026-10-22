import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { docMarkdown, docPages, readDoc, type DocSlug } from "../../_docs/content";
import { DocPage } from "../../_docs/doc-page";
import { extractHeadings, Markdown } from "../../_docs/markdown";

const pages: DocSlug[] = docPages.filter((p) => p !== "introduction");

export function generateStaticParams() {
  return pages.map((page) => ({ page }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[page]">): Promise<Metadata> {
  const { page } = await params;
  if (!pages.includes(page as DocSlug)) return {};
  const doc = await readDoc(page as DocSlug);
  return { title: doc.title, description: doc.description };
}

export default function MarkdownPage({ params }: PageProps<"/docs/[page]">) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/docs/[page]">["params"] }) {
  const { page } = await params;
  if (!pages.includes(page as DocSlug)) notFound();
  const doc = await readDoc(page as DocSlug);
  return (
    <DocPage
      href={`/docs/${page}`}
      title={doc.title}
      description={doc.description}
      markdown={docMarkdown(doc)}
      markdownUrl={`/md/${page}.md`}
      toc={extractHeadings(doc.body)}
    >
      <Markdown source={doc.body} />
    </DocPage>
  );
}
