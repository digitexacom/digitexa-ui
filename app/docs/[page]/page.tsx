import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { docMarkdown, docPages, readDoc, type DocSlug } from "../../_docs/content";
import { DocPage } from "../../_docs/doc-page";
import { extractHeadings, Markdown } from "../../_docs/markdown";

const pages: DocSlug[] = docPages.filter((p) => p !== "introduction");

// prerendered for every page; see the note in docs/components/[slug]/page.tsx
export const instant = false;

export function generateStaticParams() {
  return pages.map((page) => ({ page }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[page]">): Promise<Metadata> {
  const { page } = await params;
  if (!pages.includes(page as DocSlug)) return {};
  const doc = await readDoc(page as DocSlug);
  const og = { title: `${doc.title} · Digitexa UI`, description: doc.description };
  return { title: doc.title, description: doc.description, openGraph: og, twitter: { card: "summary_large_image", ...og } };
}

export default function MarkdownPage({ params }: PageProps<"/docs/[page]">) {
  return <Content params={params} />;
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
