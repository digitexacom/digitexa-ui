"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { docsSections, examples, sortedComponents } from "./nav";

function Item({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7.5 items-center rounded-md px-2.5 text-fg-muted hover:bg-muted hover:text-fg",
        active && "bg-muted font-medium text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <div className="px-2.5 pt-6 pb-1.5 text-sm text-fg-subtle first:pt-0">{children}</div>;
}

export function DocsSidebar() {
  return (
    <nav aria-label="Docs" className="flex flex-col pb-10">
      <Title>Sections</Title>
      {docsSections.map((s) => (
        <Item key={s.href} href={s.href}>
          {s.title}
        </Item>
      ))}
      <Title>Examples</Title>
      {examples.map((e) => (
        <Item key={e.href} href={e.href}>
          {e.title}
        </Item>
      ))}
      <Title>Components</Title>
      {sortedComponents.map((c) => (
        <Item key={c.slug} href={`/docs/components/${c.slug}`}>
          {c.title}
        </Item>
      ))}
    </nav>
  );
}
