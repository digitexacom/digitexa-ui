import * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "rounded-md bg-muted",
        "bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--dx-surface)_70%,transparent),transparent)] bg-size-[200%_100%] bg-no-repeat",
        "animate-[dx-shimmer_1.4s_ease-in-out_infinite] motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
