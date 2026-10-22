import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const fillVariants = cva("h-full rounded-full transition-[width] duration-(--dx-motion-slow) ease-out", {
  variants: {
    tone: {
      accent: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
      info: "bg-info",
      neutral: "bg-fg-subtle",
    },
  },
  defaultVariants: { tone: "accent" },
});

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof fillVariants> & {
    value: number;
    max?: number;
    /** Accessible name, e.g. "Website redesign progress". */
    label?: string;
  };

function Progress({ value, max = 100, tone, label, className, ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div className={fillVariants({ tone })} style={{ width: `${pct}%` }} />
    </div>
  );
}

export { Progress };
