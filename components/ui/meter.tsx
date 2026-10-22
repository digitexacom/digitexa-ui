import * as React from "react";

import { cn } from "@/lib/utils";

type Segment = {
  label: string;
  value: number;
  /** Any background utility, e.g. "bg-status-done". */
  className: string;
};

type MeterProps = Omit<React.ComponentProps<"div">, "children"> & {
  segments: Segment[];
  /** Total the bar represents. Defaults to the sum, so the bar is always full. */
  max?: number;
  label?: string;
};

/** Stacked distribution bar: status breakdowns, workload, capacity. */
function Meter({ segments, max, label, className, ...props }: MeterProps) {
  const total = max ?? segments.reduce((sum, s) => sum + s.value, 0);
  const summary = segments.map((s) => `${s.label} ${s.value}`).join(", ");
  return (
    <div
      data-slot="meter"
      role="img"
      aria-label={label ? `${label}: ${summary}` : summary}
      className={cn("flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      {total > 0 &&
        segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              title={`${s.label}: ${s.value}`}
              className={cn("h-full first:rounded-l-full last:rounded-r-full", s.className)}
              style={{ width: `${(s.value / total) * 100}%` }}
            />
          ))}
    </div>
  );
}

export { Meter, type Segment };
