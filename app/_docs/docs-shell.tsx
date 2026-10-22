import Link from "next/link";

import { DocsMobileNav, DocsSidebar } from "./docs-nav";
import { repoUrl } from "./site";
import { ThemeSwitcher } from "./theme-switcher";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <span className="grid size-5 place-items-center rounded-sm bg-accent text-2xs font-bold text-accent-fg">dx</span>
      Digitexa UI
    </Link>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-(--dx-z-sticky) border-b border-border bg-bg/85 backdrop-blur">
        <div className="flex h-(--dx-topbar-height) items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="rounded-sm bg-muted px-1.5 text-2xs text-fg-muted">v0.2</span>
          </div>
          <div className="flex items-center gap-3">
            {repoUrl && (
              <a href={repoUrl} className="text-sm text-fg-muted hover:text-fg max-sm:hidden">
                GitHub
              </a>
            )}
            <ThemeSwitcher />
          </div>
        </div>
        <DocsMobileNav />
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="sticky top-(--dx-topbar-height) hidden h-[calc(100dvh-var(--dx-topbar-height))] w-52 shrink-0 overflow-y-auto border-r border-border p-3 md:block">
          <DocsSidebar />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-10 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

export function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-fg-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-sm bg-muted px-1 font-mono text-xs">{children}</code>;
}
