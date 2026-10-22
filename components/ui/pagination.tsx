import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ usePagination */

type PaginationEntry =
  | { type: "page"; page: number; selected: boolean }
  | { type: "ellipsis"; key: "start-ellipsis" | "end-ellipsis" };

type UsePaginationOptions = {
  /** current page, 1-based */
  page: number;
  pageCount: number;
  /** pages shown on each side of the current one (default 1) */
  siblings?: number;
  /** pages always shown at the start and end (default 1) */
  boundaries?: number;
};

const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);

function getPaginationEntries({ page, pageCount, siblings = 1, boundaries = 1 }: UsePaginationOptions): PaginationEntry[] {
  if (pageCount < 1) return [];
  const current = Math.min(Math.max(1, page), pageCount);
  const toEntry = (n: number): PaginationEntry => ({ type: "page", page: n, selected: n === current });

  // first + last boundaries, the sibling window, the current page and two ellipsis slots
  const slots = boundaries * 2 + siblings * 2 + 3;
  if (pageCount <= slots) return range(1, pageCount).map(toEntry);

  // keep the window a constant width so the control doesn't jump around
  const windowStart = Math.max(Math.min(current - siblings, pageCount - boundaries - siblings * 2 - 1), boundaries + 2);
  const windowEnd = Math.min(Math.max(current + siblings, boundaries + siblings * 2 + 2), pageCount - boundaries - 1);

  const entries: PaginationEntry[] = range(1, boundaries).map(toEntry);
  entries.push(windowStart > boundaries + 2 ? { type: "ellipsis", key: "start-ellipsis" } : toEntry(boundaries + 1));
  entries.push(...range(windowStart, windowEnd).map(toEntry));
  entries.push(windowEnd < pageCount - boundaries - 1 ? { type: "ellipsis", key: "end-ellipsis" } : toEntry(pageCount - boundaries));
  entries.push(...range(pageCount - boundaries + 1, pageCount).map(toEntry));
  return entries;
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12. */
function usePagination({ page, pageCount, siblings = 1, boundaries = 1 }: UsePaginationOptions) {
  return React.useMemo(() => getPaginationEntries({ page, pageCount, siblings, boundaries }), [page, pageCount, siblings, boundaries]);
}

/* ------------------------------------------------------------ primitives */

function Pagination({ className, "aria-label": ariaLabel = "Pagination", ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="pagination" aria-label={ariaLabel} className={cn("flex items-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-0.5", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ComponentProps<"a"> & {
  isActive?: boolean;
  /** render the child (router <Link> or <button>) with these styles */
  asChild?: boolean;
};

const linkClass = (isActive?: boolean) =>
  cn(buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "md" }), "min-w-(--dx-control-md) px-2 tabular-nums", isActive && "text-fg");

function PaginationLink({ className, isActive, asChild = false, ...props }: PaginationLinkProps) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(linkClass(isActive), className)}
      {...props}
    />
  );
}

type PaginationStepProps = Omit<PaginationLinkProps, "isActive"> & {
  /** hide the text label, keep the icon */
  iconOnly?: boolean;
};

// With asChild the child element carries the label, e.g. <Link href="?page=2">Next</Link>.
function PaginationStep({ direction, className, children, asChild = false, iconOnly, ...props }: PaginationStepProps & { direction: "previous" | "next" }) {
  const Comp = asChild ? Slot : "a";
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;
  const label = children ?? (direction === "previous" ? "Previous" : "Next");
  return (
    <Comp
      data-slot={`pagination-${direction}`}
      aria-label={`Go to ${direction} page`}
      className={cn(linkClass(), "gap-1", !iconOnly && (direction === "previous" ? "pr-2.5 pl-1.5" : "pr-1.5 pl-2.5"), className)}
      {...props}
    >
      {direction === "previous" && <Icon />}
      {asChild ? <Slottable>{children}</Slottable> : !iconOnly && <span>{label}</span>}
      {direction === "next" && <Icon />}
    </Comp>
  );
}

function PaginationPrevious(props: PaginationStepProps) {
  return <PaginationStep direction="previous" {...props} />;
}

function PaginationNext(props: PaginationStepProps) {
  return <PaginationStep direction="next" {...props} />;
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn("grid size-(--dx-control-md) place-items-center text-fg-subtle [&_svg]:size-3.5", className)}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/** "Page 3 of 12" */
function PaginationStatus({ page, pageCount, className, ...props }: React.ComponentProps<"span"> & { page: number; pageCount: number }) {
  return (
    <span data-slot="pagination-status" aria-live="polite" className={cn("px-2 text-sm whitespace-nowrap text-fg-muted tabular-nums", className)} {...props}>
      Page <span className="font-medium text-fg">{page}</span> of {pageCount}
    </span>
  );
}

/* ------------------------------------------------------------ controlled bar */

type PaginationControlsProps = Omit<React.ComponentProps<"nav">, "onChange"> &
  Omit<UsePaginationOptions, "page"> & {
    page: number;
    onPageChange: (page: number) => void;
    /** "pages" = numbered links, "compact" = Page 3 of 12 with arrows */
    variant?: "pages" | "compact";
  };

/** Ready-made client-side pagination with buttons. Use the primitives for URL-based paging. */
function PaginationControls({ page, pageCount, onPageChange, siblings, boundaries, variant = "pages", className, ...props }: PaginationControlsProps) {
  const entries = usePagination({ page, pageCount, siblings, boundaries });
  const current = Math.min(Math.max(1, page), Math.max(1, pageCount));
  const compact = variant === "compact";

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild iconOnly={compact} className={cn(compact && "px-0")}>
            <button type="button" disabled={current <= 1} onClick={() => onPageChange(current - 1)}>
              {!compact && "Previous"}
            </button>
          </PaginationPrevious>
        </PaginationItem>
        {compact ? (
          <PaginationItem>
            <PaginationStatus page={current} pageCount={Math.max(1, pageCount)} />
          </PaginationItem>
        ) : (
          entries.map((entry) =>
            entry.type === "ellipsis" ? (
              <PaginationItem key={entry.key}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry.page}>
                <PaginationLink asChild isActive={entry.selected}>
                  <button type="button" aria-label={`Page ${entry.page}`} onClick={() => onPageChange(entry.page)}>
                    {entry.page}
                  </button>
                </PaginationLink>
              </PaginationItem>
            ),
          )
        )}
        <PaginationItem>
          <PaginationNext asChild iconOnly={compact} className={cn(compact && "px-0")}>
            <button type="button" disabled={current >= pageCount} onClick={() => onPageChange(current + 1)}>
              {!compact && "Next"}
            </button>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationStatus,
  PaginationControls,
  usePagination,
  getPaginationEntries,
  type PaginationEntry,
  type PaginationLinkProps,
  type PaginationStepProps,
  type PaginationControlsProps,
  type UsePaginationOptions,
};
