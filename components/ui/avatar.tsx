"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted select-none", {
  variants: {
    size: {
      xs: "size-4 text-[8px]",
      sm: "size-5 text-[9px]",
      md: "size-6 text-2xs",
      lg: "size-8 text-xs",
      xl: "size-10 text-sm",
    },
  },
  defaultVariants: { size: "md" },
});

// Stable tint per name, so the same person always gets the same color.
const tints = ["todo", "progress", "review", "done", "backlog"] as const;
const tintClasses: Record<(typeof tints)[number], string> = {
  todo: "bg-status-todo-subtle text-status-todo-fg",
  progress: "bg-status-progress-subtle text-status-progress-fg",
  review: "bg-status-review-subtle text-status-review-fg",
  done: "bg-status-done-subtle text-status-done-fg",
  backlog: "bg-status-backlog-subtle text-status-backlog-fg",
};

function tintFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tintClasses[tints[h % tints.length]];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    name: string;
    src?: string;
  };

function Avatar({ name, src, size, className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" className={cn(avatarVariants({ size }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        // undefined (not 0) renders the initials on the server too; with an image, wait briefly before showing them
        delayMs={src ? 400 : undefined}
        className={cn("grid size-full place-items-center font-semibold tracking-tight", tintFor(name))}
        aria-label={name}
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/** Overlapping stack: <AvatarGroup max={3}>{people.map(…)}</AvatarGroup> */
function AvatarGroup({ children, max, className, ...props }: React.ComponentProps<"div"> & { max?: number }) {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  return (
    <div data-slot="avatar-group" className={cn("flex items-center -space-x-1.5 [&>*]:ring-2 [&>*]:ring-surface", className)} {...props}>
      {shown}
      {rest > 0 && (
        <span className="inline-grid size-6 place-items-center rounded-full bg-muted text-2xs font-medium text-fg-muted">+{rest}</span>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup, avatarVariants };
