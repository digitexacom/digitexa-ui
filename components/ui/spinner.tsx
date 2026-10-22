import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("shrink-0 animate-spin", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      md: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
  },
  defaultVariants: { size: "md" },
});

type SpinnerProps = Omit<React.ComponentProps<"svg">, "children"> &
  VariantProps<typeof spinnerVariants> & {
    /** Accessible name. Pass `aria-hidden` instead when a visible label sits next to it. */
    label?: string;
  };

/**
 * Inherits the text color. With reduced motion the global rule stops the rotation,
 * leaving a static arc that still reads as "busy".
 */
function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  const hidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";
  return (
    <svg
      data-slot="spinner"
      viewBox="0 0 24 24"
      fill="none"
      role={hidden ? undefined : "status"}
      aria-label={hidden ? undefined : label}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M21.5 12A9.5 9.5 0 0 0 12 2.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export { Spinner, spinnerVariants, type SpinnerProps };
