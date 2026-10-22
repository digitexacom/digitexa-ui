import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-surface px-2.5 py-1.5 text-base text-fg shadow-sm",
        "placeholder:text-fg-subtle",
        "transition-[border-color,box-shadow] duration-(--dx-motion-fast) ease-out",
        "outline-none hover:border-border-strong focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-disabled",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
