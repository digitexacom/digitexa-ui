"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium text-fg-muted select-none",
    "transition-[background-color,border-color,color] duration-(--dx-motion-fast) ease-out",
    "not-disabled:hover:bg-muted not-disabled:hover:text-fg disabled:opacity-50",
    "data-[state=on]:bg-selected data-[state=on]:text-fg",
    "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border bg-surface shadow-sm not-disabled:hover:border-border-strong data-[state=on]:border-border-strong",
      },
      size: {
        xs: "h-(--dx-control-xs) gap-1 rounded-sm px-1.5 text-xs",
        sm: "h-(--dx-control-sm) px-2 text-xs",
        md: "h-(--dx-control-md) px-3 text-base",
        lg: "h-(--dx-control-lg) px-4 text-md",
        icon: "size-(--dx-control-md)",
        "icon-sm": "size-(--dx-control-sm)",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>;

/** Two-state button (aria-pressed). Icon-only toggles need an aria-label. */
function Toggle({ className, variant, size, ...props }: ToggleProps) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}

export { Toggle, toggleVariants, type ToggleProps };
