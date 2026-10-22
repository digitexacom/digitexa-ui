import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-1.5 text-xs font-medium",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-muted text-fg-muted",
        outline: "border border-border text-fg-muted",
        accent: "bg-accent-subtle text-accent-subtle-fg",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-danger-subtle text-danger",
        info: "bg-info-subtle text-info",
        // work statuses
        backlog: "bg-status-backlog-subtle text-status-backlog",
        todo: "bg-status-todo-subtle text-status-todo",
        progress: "bg-status-progress-subtle text-status-progress",
        review: "bg-status-review-subtle text-status-review",
        done: "bg-status-done-subtle text-status-done",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

const statusLabels = {
  backlog: "Backlog",
  todo: "To do",
  progress: "In progress",
  review: "In review",
  done: "Done",
} as const;

type Status = keyof typeof statusLabels;

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Adds a small colored dot on the left. */
    dot?: boolean;
  };

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Status badge: <StatusBadge status="review" /> — the label is filled in for you. */
function StatusBadge({ status, children, ...props }: Omit<BadgeProps, "variant"> & { status: Status }) {
  return (
    <Badge variant={status} dot {...props}>
      {children ?? statusLabels[status]}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants, statusLabels, type BadgeProps, type Status };
