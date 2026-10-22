import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex h-(--dx-control-xs) shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-1.5 text-xs font-medium",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-muted text-fg-muted",
        outline: "border border-border text-fg-muted",
        accent: "bg-accent-subtle text-accent-subtle-fg",
        success: "bg-success-subtle text-success-fg",
        warning: "bg-warning-subtle text-warning-fg",
        danger: "bg-danger-subtle text-danger-fg-subtle",
        info: "bg-info-subtle text-info-fg",
        // work statuses
        backlog: "bg-status-backlog-subtle text-status-backlog-fg",
        todo: "bg-status-todo-subtle text-status-todo-fg",
        progress: "bg-status-progress-subtle text-status-progress-fg",
        review: "bg-status-review-subtle text-status-review-fg",
        done: "bg-status-done-subtle text-status-done-fg",
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

const dotColors: Partial<Record<NonNullable<VariantProps<typeof badgeVariants>["variant"]>, string>> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  backlog: "bg-status-backlog",
  todo: "bg-status-todo",
  progress: "bg-status-progress",
  review: "bg-status-review",
  done: "bg-status-done",
};

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Adds a small colored dot on the left. */
    dot?: boolean;
  };

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className={cn("size-1.5 rounded-full", dotColors[variant ?? "neutral"] ?? "bg-current")} />}
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
