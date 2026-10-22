import * as React from "react";

import { cn } from "@/lib/utils";

type Status = "backlog" | "todo" | "progress" | "review" | "done";

const labels: Record<Status, string> = {
  backlog: "Backlog",
  todo: "To do",
  progress: "In progress",
  review: "In review",
  done: "Done",
};

const colors: Record<Status, string> = {
  backlog: "text-status-backlog",
  todo: "text-status-todo",
  progress: "text-status-progress",
  review: "text-status-review",
  done: "text-status-done",
};

// Pie fill per status: the icon itself shows how far along the work is.
const fill: Record<Status, number> = { backlog: 0, todo: 0, progress: 0.5, review: 0.75, done: 1 };

function pie(fraction: number) {
  const r = 3.5;
  if (fraction >= 1) return null;
  const angle = fraction * 2 * Math.PI;
  const x = 8 + r * Math.sin(angle);
  const y = 8 - r * Math.cos(angle);
  return `M8 8 L8 ${8 - r} A${r} ${r} 0 ${fraction > 0.5 ? 1 : 0} 1 ${x.toFixed(3)} ${y.toFixed(3)} Z`;
}

type StatusIconProps = Omit<React.ComponentProps<"svg">, "children"> & {
  status: Status;
  /** Visible label for screen readers; pass "" when a text label sits next to the icon. */
  label?: string;
};

/** Small circular status glyph: dashed for backlog, ring for to do, pie for progress/review, check for done. */
function StatusIcon({ status, label, className, ...props }: StatusIconProps) {
  const name = label ?? labels[status];
  const f = fill[status];
  return (
    <svg
      data-slot="status-icon"
      viewBox="0 0 16 16"
      fill="none"
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      className={cn("size-3.5 shrink-0", colors[status], className)}
      {...props}
    >
      {status === "done" ? (
        <>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d="M5 8.2 7 10.2 11 6" stroke="var(--dx-surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle
            cx="8"
            cy="8"
            r="6.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={status === "backlog" ? "1.6 2.3" : undefined}
          />
          {f > 0 && <path d={pie(f) ?? ""} fill="currentColor" />}
        </>
      )}
    </svg>
  );
}

export { StatusIcon, labels as statusIconLabels, type Status as StatusIconStatus };
