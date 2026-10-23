"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-(--dx-z-overlay) bg-overlay",
        "data-[state=open]:animate-[dx-fade-in_var(--dx-motion)_var(--dx-motion-ease)]",
        "data-[state=closed]:animate-[dx-fade-out_var(--dx-motion)_ease-in]",
        className,
      )}
      {...props}
    />
  );
}

/*
 * Slide motion without extra keyframes: the panel enters with a `translate` transition from
 * @starting-style (`starting:`), and exits with the same transition on data-[state=closed].
 * The steps(1,end) fade keeps the panel opaque but gives Radix an animation to wait for
 * before unmounting. Durations follow --dx-motion*, so reduced motion makes it instant.
 */
const sheetVariants = cva(
  [
    "fixed z-(--dx-z-overlay) flex flex-col border-border bg-surface-raised text-fg shadow-lg outline-none",
    "transition-[translate] duration-(--dx-motion-slow) ease-out",
    "data-[state=closed]:duration-(--dx-motion) data-[state=closed]:ease-in",
    "data-[state=closed]:animate-[dx-fade-out_var(--dx-motion)_steps(1,end)]",
  ],
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-[calc(100%-2rem)] border-l starting:translate-x-full data-[state=closed]:translate-x-full",
        left: "inset-y-0 left-0 h-full w-[calc(100%-2rem)] border-r starting:-translate-x-full data-[state=closed]:-translate-x-full",
        top: "inset-x-0 top-0 max-h-[calc(100dvh-2rem)] border-b starting:-translate-y-full data-[state=closed]:-translate-y-full",
        bottom:
          "inset-x-0 bottom-0 max-h-[calc(100dvh-2rem)] rounded-t-xl border-t starting:translate-y-full data-[state=closed]:translate-y-full",
      },
      size: { sm: "", md: "", lg: "", xl: "" },
    },
    compoundVariants: [
      // width for side panels, max height for top/bottom
      { side: ["left", "right"], size: "sm", className: "max-w-sm" },
      { side: ["left", "right"], size: "md", className: "max-w-md" },
      { side: ["left", "right"], size: "lg", className: "max-w-xl" },
      { side: ["left", "right"], size: "xl", className: "max-w-3xl" },
      { side: ["top", "bottom"], size: "sm", className: "h-[30dvh]" },
      { side: ["top", "bottom"], size: "lg", className: "h-[70dvh]" },
      { side: ["top", "bottom"], size: "xl", className: "h-[calc(100dvh-2rem)]" },
    ],
    defaultVariants: { side: "right", size: "md" },
  },
);

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & {
    hideClose?: boolean;
    /** Dim the page behind the panel. Off for peek panels. */
    overlay?: boolean;
  };

function SheetContent({ className, children, side, size, hideClose = false, overlay = true, ...props }: SheetContentProps) {
  return (
    <SheetPortal>
      {overlay && <SheetOverlay />}
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-side={side ?? "right"}
        className={cn(sheetVariants({ side, size }), className)}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className={cn(
              "absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-sm text-fg-subtle",
              "hover:bg-muted hover:text-fg",
            )}
          >
            <XIcon className="size-3.5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-1 border-b border-border px-4 pt-4 pb-3 pr-10", className)}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex shrink-0 items-center justify-end gap-2 border-t border-border bg-bg-subtle px-4 py-2.5", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn("text-md font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-fg-muted", className)} {...props} />;
}

/*
 * Peek: a detail panel that floats over the page without blocking it, like opening a task from a list.
 * The page underneath doesn't reflow or lock; clicking another row keeps the panel open, so you swap
 * its content instead of reopening it. Esc and the close button still close it.
 *
 *   <Peek open={!!task} onOpenChange={(o) => !o && setTask(null)}>
 *     <PeekContent>…</PeekContent>
 *   </Peek>
 */
function Peek({ modal = false, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root modal={modal} {...props} />;
}

function PeekContent({ className, onInteractOutside, size = "lg", ...props }: Omit<SheetContentProps, "side" | "overlay">) {
  return (
    <SheetContent
      side="right"
      size={size}
      overlay={false}
      // floating card inset from the edges; the page keeps its full width underneath
      className={cn(
        "inset-y-2 right-2 h-auto rounded-xl border",
        // slide fully past the 8px inset
        "starting:translate-x-[calc(100%+1rem)] data-[state=closed]:translate-x-[calc(100%+1rem)]",
        className,
      )}
      onInteractOutside={(e) => {
        onInteractOutside?.(e);
        if (!e.defaultPrevented) e.preventDefault();
      }}
      {...props}
    />
  );
}

export {
  Peek,
  PeekContent,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
};
