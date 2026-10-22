import * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-4.5 min-w-4.5 items-center justify-center gap-0.5 rounded-sm border border-border bg-bg-subtle px-1",
        "font-sans text-2xs font-medium text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
