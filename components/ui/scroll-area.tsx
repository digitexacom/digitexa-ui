"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** which scrollbars to render */
  orientation?: "vertical" | "horizontal" | "both";
  viewportClassName?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
};

function ScrollArea({ className, children, orientation = "vertical", viewportClassName, viewportRef, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
          // Radix wraps content in display: table, which defeats truncation when only scrolling vertically
          orientation === "vertical" && "[&>div]:block!",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
      {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none p-0.5 select-none",
        "data-[state=visible]:animate-[dx-fade-in_var(--dx-motion-fast)_ease-out] data-[state=hidden]:animate-[dx-fade-out_var(--dx-motion)_ease-in]",
        orientation === "vertical" && "h-full w-2.5",
        orientation === "horizontal" && "h-2.5 flex-col",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border-strong transition-colors duration-(--dx-motion-fast) group-hover/scrollbar:bg-fg-subtle"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar, type ScrollAreaProps };
