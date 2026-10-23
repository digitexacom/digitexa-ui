import type { Metadata } from "next";

import { docMarkdown, readDoc } from "../_docs/content";
import { DocPage } from "../_docs/doc-page";
import { extractHeadings, Markdown } from "../_docs/markdown";
import { pageMetadata } from "../_docs/seo";

export const metadata: Metadata = pageMetadata({
  path: "/docs",
  title: "Introduction",
  description: "Digitexa UI is a set of open-source React components you copy into your project and own: tokens, dark mode, accents and project-management views.",
});

export default async function IntroductionPage() {
  const doc = await readDoc("introduction");
  return (
    <DocPage href="/docs" title={doc.title} description={doc.description} markdown={docMarkdown(doc)} markdownUrl="/md/introduction.md" toc={extractHeadings(doc.body)}>
      <Markdown source={doc.body} />
    </DocPage>
  );
}
