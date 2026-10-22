"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  /** "plain" = divided list, "card" = bordered surface */
  variant?: "plain" | "card";
};

function Accordion({ className, variant = "plain", children, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn("group/accordion w-full", variant === "card" && "rounded-lg border border-border bg-surface shadow-sm", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border group-data-[variant=card]/accordion:px-4 group-data-[variant=card]/accordion:last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex min-h-(--dx-row-height) flex-1 items-center justify-between gap-3 py-2 text-left text-md font-medium text-fg outline-none",
          "transition-colors duration-(--dx-motion-fast) hover:text-fg-muted disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:size-3.5 [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-fg-subtle transition-transform duration-(--dx-motion) ease-out group-data-[state=open]/trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-base text-fg-muted [--dx-collapse-height:var(--radix-accordion-content-height)]",
        "data-[state=open]:animate-[dx-collapse-down_var(--dx-motion)_var(--dx-motion-ease)]",
        "data-[state=closed]:animate-[dx-collapse-up_var(--dx-motion-fast)_ease-in]",
      )}
      {...props}
    >
      <div className={cn("pb-3", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, type AccordionProps };
