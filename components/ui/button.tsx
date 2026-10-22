import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow] duration-[var(--motion-fast)] ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg shadow-sm hover:bg-accent-hover",
        secondary: "border border-border bg-surface text-fg shadow-sm hover:bg-muted hover:border-border-strong",
        soft: "bg-accent-subtle text-accent-subtle-fg hover:bg-[color-mix(in_oklch,var(--accent-subtle),var(--accent)_12%)]",
        ghost: "text-fg-muted hover:bg-muted hover:text-fg",
        danger: "bg-danger text-danger-fg shadow-sm hover:bg-[color-mix(in_oklch,var(--danger),black_10%)]",
        link: "h-auto px-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7.5 px-3 text-base",
        lg: "h-9 px-4 text-md",
        icon: "size-7.5",
        "icon-sm": "size-6",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Passes the styles to the child element (e.g. <a>). */
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
