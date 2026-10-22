import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Breadcrumb({ "aria-label": ariaLabel = "Breadcrumb", ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label={ariaLabel} {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex min-w-0 flex-wrap items-center gap-1 text-base break-words text-fg-muted", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex min-w-0 items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0", className)} {...props} />;
}

type BreadcrumbLinkProps = React.ComponentProps<"a"> & {
  /** render the child (e.g. Next.js <Link>) with these styles */
  asChild?: boolean;
};

function BreadcrumbLink({ className, asChild = false, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("inline-flex min-w-0 items-center gap-1.5 truncate rounded-sm transition-colors duration-(--dx-motion-fast) hover:text-fg", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("inline-flex min-w-0 items-center gap-1.5 truncate font-medium text-fg", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("inline-flex items-center text-fg-subtle [&_svg]:size-3", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

/** Collapsed middle segments. Wrap in a DropdownMenuTrigger (asChild on a button) to reveal them. */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn("inline-grid size-(--dx-control-sm) place-items-center rounded-sm [&_svg]:size-3.5", className)}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbLinkProps,
};
