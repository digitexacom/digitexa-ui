import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyPage } from "./copy-page";
import { JsonLd } from "./json-ld";
import { docsOrder } from "./nav";
import { docJsonLd } from "./seo";
import { siteUrl } from "./site";
import { Toc, type TocItem } from "./toc";

type DocPageProps = {
  href: string;
  title: string;
  description?: string;
  markdown: string;
  markdownUrl: string;
  toc: TocItem[];
  children: React.ReactNode;
};

/** Content column + "On this page" column, shared by every docs page. */
export function DocPage({ href, title, description, markdown, markdownUrl, toc, children }: DocPageProps) {
  const index = docsOrder.findIndex((d) => d.href === href);
  const prev = index > 0 ? docsOrder[index - 1] : null;
  const next = index >= 0 && index < docsOrder.length - 1 ? docsOrder[index + 1] : null;
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

  const trail =
    href === "/docs"
      ? [{ name: "Docs", path: "/docs" }]
      : href.startsWith("/docs/components/")
        ? [{ name: "Docs", path: "/docs" }, { name: "Components", path: "/docs/components" }, { name: title, path: href }]
        : [{ name: "Docs", path: "/docs" }, { name: title, path: href }];

  return (
    <div className="flex min-w-0 flex-1 gap-12">
      <JsonLd data={docJsonLd({ path: href, title, description: description ?? "", trail })} />
      <article className="mx-auto w-full max-w-3xl min-w-0 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-1.5">
            <CopyPage markdown={markdown} markdownUrl={absolute(markdownUrl)} />
            {prev && (
              <Button asChild size="icon-sm" aria-label={`Previous: ${prev.title}`}>
                <Link href={prev.href}>
                  <ArrowLeftIcon />
                </Link>
              </Button>
            )}
            {next && (
              <Button asChild size="icon-sm" aria-label={`Next: ${next.title}`}>
                <Link href={next.href}>
                  <ArrowRightIcon />
                </Link>
              </Button>
            )}
          </div>
        </div>
        {description && <p className="mt-2 text-lg text-fg-muted">{description}</p>}
        <div className="mt-2">{children}</div>
        <div className="mt-14 flex justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Button asChild variant="ghost">
              <Link href={prev.href}>
                <ArrowLeftIcon /> {prev.title}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button asChild variant="ghost">
              <Link href={next.href}>
                {next.title} <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </div>
      </article>
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
