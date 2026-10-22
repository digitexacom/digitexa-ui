"use client";

import { Kbd } from "@/components/ui/kbd";

export default function Demo() {
  return (
    <div className="flex items-center gap-4 text-sm text-fg-muted">
      <span className="flex items-center gap-1">
        Search <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span className="flex items-center gap-1">
        New task <Kbd>C</Kbd>
      </span>
    </div>
  );
}
