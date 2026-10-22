import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/*
 * An input with icons and text addons inside one bordered box. Children render in order,
 * so an icon or addon before the input leads and one after it trails.
 *
 *   <InputGroup>
 *     <InputGroupAddon>https://</InputGroupAddon>
 *     <InputGroupInput placeholder="acme.digitexa.app" />
 *     <InputGroupIcon><GlobeIcon /></InputGroupIcon>
 *   </InputGroup>
 */

const inputGroupVariants = cva(
  [
    "flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md border border-input bg-surface px-(--dx-ig-px) text-fg shadow-sm [--dx-ig-px:--spacing(2.5)]",
    "transition-[border-color,box-shadow] duration-(--dx-motion-fast) ease-out",
    "hover:border-border-strong focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20 focus-within:hover:border-accent",
    "has-[[aria-invalid=true]]:border-danger has-[[aria-invalid=true]]:focus-within:ring-danger/20",
    "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-muted has-[input:disabled]:text-fg-disabled",
  ],
  {
    variants: {
      size: {
        sm: "h-(--dx-control-sm) gap-1.5 text-xs [--dx-ig-px:--spacing(2)]",
        md: "h-(--dx-control-md) text-base",
        lg: "h-(--dx-control-lg) text-md [--dx-ig-px:--spacing(3)]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type InputGroupProps = React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>;

function InputGroup({ className, size, ...props }: InputGroupProps) {
  return <div data-slot="input-group" role="group" className={cn(inputGroupVariants({ size }), className)} {...props} />;
}

/** The kit's Input without its own box; font size follows the group. */
function InputGroupInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-input"
      className={cn(
        "h-full flex-1 rounded-none border-0 bg-transparent px-0 text-[length:inherit] shadow-none",
        "hover:border-0 focus-visible:ring-0 disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

type InputGroupAddonProps = React.ComponentProps<"span"> & {
  /** "segment" gives the addon its own tinted cell at the edge of the group. */
  variant?: "inline" | "segment";
};

/** Text prefix or suffix such as "https://", "USD" or "@digitexa.com". */
function InputGroupAddon({ className, variant = "inline", ...props }: InputGroupAddonProps) {
  return (
    <span
      data-slot="input-group-addon"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center whitespace-nowrap text-fg-subtle select-none",
        variant === "segment" &&
          "self-stretch bg-muted px-(--dx-ig-px) text-fg-muted first:-ml-(--dx-ig-px) first:border-r last:-mr-(--dx-ig-px) last:border-l",
        className,
      )}
      {...props}
    />
  );
}

/** Decorative leading or trailing icon. */
function InputGroupIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-icon"
      aria-hidden
      className={cn("flex shrink-0 items-center text-fg-subtle [&_svg]:pointer-events-none [&_svg]:size-3.5", className)}
      {...props}
    />
  );
}

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupIcon, inputGroupVariants, type InputGroupProps };
