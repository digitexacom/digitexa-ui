import { DocsSidebar } from "../_docs/docs-sidebar";
import { SiteHeader } from "../_docs/site-header";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border/60 py-10 pr-4 md:block">
          <DocsSidebar />
        </aside>
        {children}
      </div>
    </div>
  );
}
