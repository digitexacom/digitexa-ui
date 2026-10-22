import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col rounded-lg border border-border bg-surface text-fg shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex items-center justify-between gap-3 px-4 pt-3.5 pb-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-md font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-fg-muted", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-4 pb-4", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 border-t border-border px-4 py-2.5", className)}
      {...props}
    />
  );
}

/** A row of key numbers that share borders: <StatGroup><Stat …/><Stat …/></StatGroup> */
function StatGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-group"
      className={cn(
        // 1px gaps over a border-colored background draw the dividers for any column count
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-sm lg:grid-cols-4",
        "[&>*]:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

type StatProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
};

function Stat({ label, value, hint, className, ...props }: StatProps) {
  return (
    <div data-slot="stat" className={cn("flex flex-col gap-1 px-4 py-3.5", className)} {...props}>
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      {hint && <span className="text-xs text-fg-subtle">{hint}</span>}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatGroup, Stat };
