"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { componentGroups } from "./nav";

const guides = [
  { href: "/", title: "Introduction" },
  { href: "/#installation", title: "Installation" },
  { href: "/#tokens", title: "Tokens" },
];
const examples = [
  { href: "/examples/overview", title: "Workspace overview" },
  { href: "/examples/settings", title: "Settings" },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7 shrink-0 items-center rounded-sm px-2 whitespace-nowrap text-fg-muted hover:bg-muted hover:text-fg",
        active && "bg-selected font-medium text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <div className="px-2 pt-4 pb-1 text-2xs font-medium tracking-wide text-fg-subtle uppercase first:pt-1">{children}</div>;
}

export function DocsSidebar() {
  return (
    <nav aria-label="Docs" className="flex flex-col">
      <GroupTitle>Getting started</GroupTitle>
      {guides.map((g) => (
        <NavLink key={g.href} href={g.href}>{g.title}</NavLink>
      ))}
      <GroupTitle>Examples</GroupTitle>
      {examples.map((g) => (
        <NavLink key={g.href} href={g.href}>{g.title}</NavLink>
      ))}
      {componentGroups.map((group) => (
        <Fragment key={group.title}>
          <GroupTitle>{group.title}</GroupTitle>
          {group.items.map((c) => (
            <NavLink key={c.slug} href={`/components/${c.slug}`}>{c.title}</NavLink>
          ))}
        </Fragment>
      ))}
    </nav>
  );
}

/** Below md the sidebar is replaced by a horizontally scrolling strip. */
export function DocsMobileNav() {
  return (
    <nav aria-label="Docs" className="flex gap-1 overflow-x-auto border-b border-border px-3 py-1.5 md:hidden">
      <NavLink href="/">Intro</NavLink>
      <NavLink href="/examples/overview">Example</NavLink>
      {componentGroups.flatMap((g) => g.items).map((c) => (
        <NavLink key={c.slug} href={`/components/${c.slug}`}>{c.title}</NavLink>
      ))}
    </nav>
  );
}
