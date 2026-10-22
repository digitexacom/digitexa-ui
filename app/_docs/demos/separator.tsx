"use client";

import { Separator } from "@/components/ui/separator";

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <span className="font-medium">Website redesign</span>
      <Separator />
      <div className="flex h-4 items-center gap-3 text-sm text-fg-muted">
        Board <Separator orientation="vertical" /> List <Separator orientation="vertical" /> Timeline
      </div>
    </div>
  );
}
