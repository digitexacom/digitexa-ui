"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Demo() {
  return (
    <div className="flex max-w-sm items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
