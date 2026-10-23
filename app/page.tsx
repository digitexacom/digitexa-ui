import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Showcase } from "./_home/showcase";
import { SiteHeader } from "./_docs/site-header";
import { JsonLd } from "./_docs/json-ld";
import { HOME_DESCRIPTION, pageMetadata, siteJsonLd } from "./_docs/seo";
import { repoUrl } from "./_docs/site";

export const metadata: Metadata = {
  ...pageMetadata({ path: "/", title: "Digitexa UI", description: HOME_DESCRIPTION, type: "website" }),
  title: { absolute: "Digitexa UI: open-source React component kit" },
};

export default function Home() {
  return (
    <div className="min-h-dvh">
      <JsonLd data={siteJsonLd(HOME_DESCRIPTION)} />
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <section className="flex flex-col items-center py-20 text-center sm:py-28">
          <Link
            href="/docs/components/kanban"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium hover:bg-muted-hover"
          >
            New: Kanban, Timeline and Calendar view <ArrowRightIcon className="size-3.5" />
          </Link>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            The component kit you copy, then own
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-balance text-fg-muted sm:text-xl">
            Dense, accessible React components with warm tokens and project-management views built in. Copy them into your
            project and shape them into your own design system.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Button asChild size="lg" variant="primary">
              <Link href="/docs/installation">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="soft">
              <Link href="/docs/components">View components</Link>
            </Button>
          </div>
        </section>

        <Showcase />

        <footer className="py-12 text-center text-sm text-fg-muted">
          Built by Digitexa. Open source under the MIT license
          {repoUrl ? (
            <>
              {" "}
              ·{" "}
              <a href={repoUrl} className="font-medium text-fg underline underline-offset-4">
                GitHub
              </a>
            </>
          ) : null}
          .
        </footer>
      </main>
    </div>
  );
}
