"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /** "segmented" = pill switcher, "underline" = page-level tabs */
  variant?: "segmented" | "underline";
};

function TabsList({ className, variant = "segmented", ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs inline-flex items-center",
        variant === "segmented" && "h-(--dx-control-md) gap-0.5 rounded-md border border-border bg-bg-subtle p-0.5",
        variant === "underline" && "h-(--dx-control-lg) gap-4 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-full items-center gap-1.5 text-base font-medium whitespace-nowrap text-fg-muted outline-none",
        "hover:text-fg disabled:opacity-50 [&_svg]:size-3.5",
        "group-data-[variant=segmented]/tabs:rounded-sm group-data-[variant=segmented]/tabs:px-2.5",
        "group-data-[variant=segmented]/tabs:data-[state=active]:bg-surface group-data-[variant=segmented]/tabs:data-[state=active]:text-fg group-data-[variant=segmented]/tabs:data-[state=active]:shadow-sm",
        "group-data-[variant=underline]/tabs:-mb-px group-data-[variant=underline]/tabs:border-b-2 group-data-[variant=underline]/tabs:border-transparent",
        "group-data-[variant=underline]/tabs:data-[state=active]:border-fg group-data-[variant=underline]/tabs:data-[state=active]:text-fg",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
