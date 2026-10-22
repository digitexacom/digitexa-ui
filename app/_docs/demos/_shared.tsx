import * as React from "react";

export const statuses = ["backlog", "todo", "progress", "review", "done"] as const;

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{label}</span>
      {children}
    </div>
  );
}
