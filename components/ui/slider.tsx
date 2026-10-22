"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

/**
 * Pass one value for a single thumb, two for a range: <Slider defaultValue={[20, 80]} />.
 * Name each thumb with `thumbLabels` (or `aria-label` / `aria-labelledby` for a single one).
 */
type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels?: string[];
};

function Slider({ className, value, defaultValue, min = 0, max = 100, thumbLabels, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }: SliderProps) {
  const count = (value ?? defaultValue ?? [min]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="absolute bg-accent data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          aria-label={thumbLabels?.[i] ?? (count === 1 ? ariaLabel : undefined)}
          aria-labelledby={!thumbLabels?.[i] && count === 1 ? labelledBy : undefined}
          className={cn(
            "block size-4 shrink-0 rounded-full border-2 border-accent bg-surface shadow-sm",
            "transition-[box-shadow] duration-(--dx-motion-fast) ease-out",
            "outline-none hover:ring-4 hover:ring-accent/15 focus-visible:ring-4 focus-visible:ring-accent/25",
            "data-disabled:pointer-events-none",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider, type SliderProps };
