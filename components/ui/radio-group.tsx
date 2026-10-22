"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />;
}

/** Classic radio dot; pair with <Label htmlFor>. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer grid size-4 shrink-0 place-items-center rounded-full border border-input bg-surface shadow-sm",
        "hover:border-border-strong data-[state=checked]:border-accent disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-accent" />
    </RadioGroupPrimitive.Item>
  );
}

/** A whole card is the radio: <RadioCard value="dark">…preview…</RadioCard>. Shows a check when selected. */
function RadioCard({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      className={cn(
        "group/card relative flex flex-col gap-2 rounded-lg border border-border bg-surface p-2 text-left shadow-sm",
        "transition-[border-color,box-shadow] duration-(--dx-motion-fast)",
        "hover:border-border-strong disabled:opacity-50",
        "data-[state=checked]:border-accent data-[state=checked]:ring-3 data-[state=checked]:ring-accent/15",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="absolute right-2.5 bottom-2.5 grid size-4 place-items-center rounded-full border border-input group-data-[state=checked]/card:border-accent group-data-[state=checked]/card:bg-accent"
      >
        <CheckIcon className="hidden size-2.5 text-accent-fg group-data-[state=checked]/card:block" strokeWidth={3.5} />
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioCard };
