"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "@/lib/utils";

/** Segmented control. Arrow keys move between items; one tab stop for the whole group. */
function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("inline-flex h-(--dx-control-md) items-center gap-0.5 rounded-md border border-border bg-bg-subtle p-0.5", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-full min-w-6 items-center justify-center gap-1.5 rounded-sm px-2 text-sm font-medium text-fg-subtle",
        "hover:text-fg disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
        "data-[state=on]:bg-surface data-[state=on]:text-fg data-[state=on]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
