"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** "On this page" with scroll spy: the heading nearest the top of the viewport is marked. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="flex flex-col gap-1 text-sm">
      <div className="pb-1 font-medium text-fg">On this page</div>
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          aria-current={active === i.id ? "location" : undefined}
          className={cn("py-0.5 text-fg-subtle hover:text-fg aria-[current=location]:text-fg", i.level === 3 && "pl-3")}
        >
          {i.text}
        </a>
      ))}
    </nav>
  );
}
