"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Collapsible(
  props: React.ComponentProps<typeof CollapsiblePrimitive.Root>,
) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

type CollapsibleTriggerProps = React.ComponentProps<
  typeof CollapsiblePrimitive.Trigger
> & {
  /** hide the leading chevron */
  hideIcon?: boolean;
};

/** Styled disclosure row with a rotating chevron. With `asChild` it passes through unstyled. */
function CollapsibleTrigger({
  className,
  children,
  asChild,
  hideIcon,
  ...props
}: CollapsibleTriggerProps) {
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger
        data-slot="collapsible-trigger"
        asChild
        className={className}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Trigger>
    );
  }
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "group/collapsible inline-flex h-(--dx-control-sm) items-center gap-1.5 rounded-sm px-1 text-sm font-medium text-fg-muted outline-none select-none",
        "transition-colors duration-(--dx-motion-fast) hover:text-fg disabled:opacity-50",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {!hideIcon && (
        <ChevronRightIcon className="text-fg-subtle transition-transform duration-(--dx-motion) ease-out group-data-[state=open]/collapsible:rotate-90" />
      )}
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden [--dx-collapse-height:var(--radix-collapsible-content-height)]",
        "data-[state=open]:animate-[dx-collapse-down_var(--dx-motion)_var(--dx-motion-ease)]",
        "data-[state=closed]:animate-[dx-collapse-up_var(--dx-motion-fast)_ease-in]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleTriggerProps,
};
