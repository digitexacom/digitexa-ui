import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const emptyStateVariants = cva("flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center", {
  variants: {
    variant: {
      default: "",
      dashed: "rounded-lg border border-dashed border-border-strong bg-bg-subtle",
    },
  },
  defaultVariants: { variant: "default" },
});

type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    /** A lucide icon element, e.g. <InboxIcon />. */
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Buttons or links, laid out in a row. */
    actions?: React.ReactNode;
  };

function EmptyState({ className, variant, icon, title, description, actions, children, ...props }: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn(emptyStateVariants({ variant }), className)} {...props}>
      {icon && (
        <div
          aria-hidden
          className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-fg-subtle shadow-sm [&_svg]:size-5"
        >
          {icon}
        </div>
      )}
      <div className="flex max-w-sm flex-col gap-1">
        <h3 data-slot="empty-state-title" className="text-md font-semibold text-fg">
          {title}
        </h3>
        {description && (
          <p data-slot="empty-state-description" className="text-sm text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {children}
      {actions && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}

export { EmptyState, emptyStateVariants, type EmptyStateProps };
