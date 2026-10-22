import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow] duration-(--dx-motion-fast) ease-out",
    "disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg shadow-sm not-disabled:hover:bg-accent-hover",
        secondary:
          "border border-border bg-surface text-fg shadow-sm not-disabled:hover:border-border-strong not-disabled:hover:bg-muted",
        soft: "bg-accent-subtle text-accent-subtle-fg not-disabled:hover:bg-[color-mix(in_oklch,var(--dx-accent-subtle),var(--dx-accent)_12%)]",
        ghost: "text-fg-muted not-disabled:hover:bg-muted not-disabled:hover:text-fg",
        danger: "bg-danger text-danger-fg shadow-sm not-disabled:hover:bg-danger-hover",
        link: "text-accent-subtle-fg underline-offset-4 not-disabled:hover:underline",
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
    // link buttons sit inline with text: no box, whatever size is asked for
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Passes the styles to the child element (e.g. <a>). Links can't be `disabled`;
     * set `aria-disabled` on them instead.
     */
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      // never submit a surrounding form by accident
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
