"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenIcon, BotIcon, BoxIcon, FileTextIcon, LayoutTemplateIcon, MenuIcon, MonitorIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, useCommandShortcut } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { docsSections, examples, sortedComponents } from "./nav";
import { repoUrl } from "./site";
import { accents, setHtmlAttr, useHtmlAttr } from "./theme-switcher";

const links = [
  { href: "/", title: "Home", match: (p: string) => p === "/" },
  { href: "/docs", title: "Docs", match: (p: string) => p.startsWith("/docs") && !p.startsWith("/docs/components") && !p.startsWith("/docs/ai") },
  { href: "/docs/components", title: "Components", match: (p: string) => p.startsWith("/docs/components") },
  { href: "/examples/overview", title: "Examples", match: (p: string) => p.startsWith("/examples") },
  { href: "/docs/ai", title: "AI", match: (p: string) => p.startsWith("/docs/ai") },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="grid size-6 place-items-center rounded-md bg-accent text-2xs font-bold text-accent-fg">dx</span>
      <span className="max-sm:hidden">Digitexa UI</span>
    </Link>
  );
}

function GitHubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function ThemeMenu() {
  const theme = useHtmlAttr("data-theme", "system");
  const accent = useHtmlAttr("data-accent", "ember");
  const density = useHtmlAttr("data-density", "default");
  const Icon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : MonitorIcon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Appearance">
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setHtmlAttr("data-theme", v === "system" ? null : v, "dx-theme")}>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Accent</DropdownMenuLabel>
        <div role="radiogroup" aria-label="Accent" className="flex gap-1.5 px-2 pb-2">
          {accents.map((a) => (
            <button
              key={a}
              role="radio"
              aria-checked={accent === a}
              aria-label={a}
              title={a}
              onClick={() => setHtmlAttr("data-accent", a, "dx-accent")}
              data-accent={a}
              className={cn("size-5 rounded-full bg-accent ring-offset-2 ring-offset-surface-raised", accent === a && "ring-2 ring-accent")}
            />
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={(v) => setHtmlAttr("data-density", v === "compact" ? v : null, "dx-density")}>
          <DropdownMenuRadioItem value="default">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DocsSearch() {
  const [open, setOpen] = useCommandShortcut();
  const router = useRouter();
  const go = (href: string) => () => {
    setOpen(false);
    router.push(href);
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-(--dx-control-md) w-full items-center gap-2 rounded-md bg-muted px-2.5 text-fg-subtle hover:bg-muted-hover sm:w-56 lg:w-64"
      >
        <SearchIcon className="size-3.5" />
        <span className="flex-1 truncate text-left">Search documentation…</span>
        <Kbd className="max-sm:hidden">⌘K</Kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search documentation">
        <CommandInput placeholder="Search docs and components…" />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandGroup heading="Docs">
            {docsSections.map((s) => (
              <CommandItem key={s.href} onSelect={go(s.href)}>
                {s.href === "/docs/ai" ? <BotIcon /> : <FileTextIcon />} {s.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {sortedComponents.map((c) => (
              <CommandItem key={c.slug} onSelect={go(`/docs/components/${c.slug}`)} keywords={[c.slug, c.description]}>
                <BoxIcon /> {c.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Examples">
            {examples.map((e) => (
              <CommandItem key={e.href} onSelect={go(e.href)}>
                <LayoutTemplateIcon /> {e.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const item = (href: string, title: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      aria-current={pathname === href ? "page" : undefined}
      className="flex h-(--dx-control-md) items-center rounded-md px-2 text-fg-muted hover:bg-muted hover:text-fg aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-fg"
    >
      {title}
    </Link>
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Menu" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" size="sm">
        <SheetHeader>
          <SheetTitle>Digitexa UI</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-4">
          <div className="flex flex-col">{links.map((l) => item(l.href, l.title))}</div>
          <div className="flex flex-col">
            <span className="px-2 pb-1 text-xs text-fg-subtle">Sections</span>
            {docsSections.map((s) => item(s.href, s.title))}
          </div>
          <div className="flex flex-col">
            <span className="px-2 pb-1 text-xs text-fg-subtle">Components</span>
            {sortedComponents.map((c) => item(`/docs/components/${c.slug}`, c.title))}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-(--dx-z-sticky) border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 sm:px-6">
        <MobileMenu />
        <Logo className="mr-3" />
        <nav aria-label="Main" className="flex items-center gap-0.5 max-md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.match(pathname) ? "page" : undefined}
              className="flex h-(--dx-control-md) items-center rounded-md px-2.5 font-medium text-fg-muted hover:bg-muted hover:text-fg aria-[current=page]:text-fg"
            >
              {l.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          <DocsSearch />
          {repoUrl && (
            <Button asChild size="icon" variant="ghost" aria-label="GitHub">
              <a href={repoUrl}>
                <GitHubIcon className="size-4" />
              </a>
            </Button>
          )}
          <ThemeMenu />
          <Button asChild variant="primary" className="max-sm:hidden">
            <Link href="/docs/installation">
              <BookOpenIcon /> Get started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

