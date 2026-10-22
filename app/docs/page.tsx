import type { Metadata } from "next";

import { docMarkdown, readDoc } from "../_docs/content";
import { DocPage } from "../_docs/doc-page";
import { extractHeadings, Markdown } from "../_docs/markdown";

export const metadata: Metadata = { title: "Introduction" };

export default async function IntroductionPage() {
  const doc = await readDoc("introduction");
  return (
    <DocPage href="/docs" title={doc.title} description={doc.description} markdown={docMarkdown(doc)} markdownUrl="/md/introduction.md" toc={extractHeadings(doc.body)}>
      <Markdown source={doc.body} />
    </DocPage>
  );
}
