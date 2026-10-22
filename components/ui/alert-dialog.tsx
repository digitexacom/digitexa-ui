"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-(--dx-z-overlay) bg-overlay",
        "data-[state=open]:animate-[dx-fade-in_var(--dx-motion)_var(--dx-motion-ease)]",
        "data-[state=closed]:animate-[dx-fade-out_var(--dx-motion-fast)_ease-in]",
        className,
      )}
      {...props}
    />
  );
}

type AlertDialogContentProps = React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg";
};

const contentSizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };

/** No close button and no outside-click dismiss: the user has to pick Cancel or the action. */
function AlertDialogContent({ className, size = "sm", ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-(--dx-z-overlay) flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
          "rounded-lg border border-border bg-surface-raised text-fg shadow-lg outline-none",
          // scale + opacity only: translate is already used for centring
          "data-[state=open]:animate-[dx-pop-in_var(--dx-motion)_var(--dx-motion-ease)]",
          "data-[state=closed]:animate-[dx-pop-out_var(--dx-motion-fast)_ease-in]",
          contentSizes[size],
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex shrink-0 flex-col gap-1 px-4 pt-4 pb-3", className)} {...props} />;
}

function AlertDialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-body" className={cn("flex min-h-0 flex-col gap-3 overflow-y-auto px-4 pb-4", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-border bg-bg-subtle rounded-b-[calc(var(--dx-radius-large)-1px)] px-4 py-2.5",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("text-md font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  /** `danger` for destructive confirmations (delete, archive, revoke). */
  variant?: "primary" | "danger";
  size?: "sm" | "md";
};

function AlertDialogAction({ className, variant = "primary", size = "md", ...props }: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & { size?: "sm" | "md" }) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "secondary", size }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
