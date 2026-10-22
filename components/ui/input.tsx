import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-md border border-input bg-surface text-fg shadow-sm",
    "placeholder:text-fg-subtle",
    "transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-out",
    "outline-none hover:border-border-strong focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20",
    "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
    "disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-disabled",
    "file:mr-2 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg",
  ],
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7.5 px-2.5 text-base",
        lg: "h-9 px-3 text-md",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

function Input({ className, size, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants, type InputProps };
