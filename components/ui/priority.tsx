import * as React from "react";

import { cn } from "@/lib/utils";

type Priority = "urgent" | "high" | "medium" | "low" | "none";

/** Highest first, the order a priority picker or sort should use. */
const priorities = ["urgent", "high", "medium", "low", "none"] as const satisfies readonly Priority[];

const labels: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No priority",
};

// How many of the three bars are filled.
const level: Record<Priority, number> = { urgent: 3, high: 3, medium: 2, low: 1, none: 0 };

type PriorityIconProps = Omit<React.ComponentProps<"svg">, "children"> & {
  priority: Priority;
  /** Visible label for screen readers; pass "" when a text label sits next to the icon. */
  label?: string;
};

/** Bar glyph: three ascending bars for low/medium/high, a filled alert square for urgent, dashes for none. */
function PriorityIcon({ priority, label, className, ...props }: PriorityIconProps) {
  const name = label ?? labels[priority];
  return (
    <svg
      data-slot="priority-icon"
      data-priority={priority}
      viewBox="0 0 16 16"
      fill="none"
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      className={cn("size-3.5 shrink-0", priority === "urgent" ? "text-danger" : "text-fg-muted", className)}
      {...props}
    >
      {priority === "urgent" ? (
        <>
          <rect x="1" y="1" width="14" height="14" rx="3.5" fill="currentColor" />
          <path d="M8 4.25v4.5" stroke="var(--dx-surface)" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="8" cy="11.4" r="1.05" fill="var(--dx-surface)" />
        </>
      ) : priority === "none" ? (
        [2, 6.5, 11].map((x) => <rect key={x} x={x} y="7.25" width="3" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />)
      ) : (
        [0, 1, 2].map((i) => (
          <rect
            key={i}
            x={1.5 + i * 4.75}
            y={10 - i * 3.5}
            width="3.5"
            height={4.5 + i * 3.5}
            rx="1"
            fill="currentColor"
            opacity={i < level[priority] ? 1 : 0.25}
          />
        ))
      )}
    </svg>
  );
}

type PriorityLabelProps = React.ComponentProps<"span"> & {
  priority: Priority;
};

/** Icon plus text: <PriorityLabel priority="high" />. */
function PriorityLabel({ priority, children, className, ...props }: PriorityLabelProps) {
  return (
    <span data-slot="priority-label" className={cn("inline-flex items-center gap-1.5 text-fg-muted", className)} {...props}>
      <PriorityIcon priority={priority} label="" />
      {children ?? labels[priority]}
    </span>
  );
}

export { PriorityIcon, PriorityLabel, priorities, labels as priorityLabels, type Priority };
