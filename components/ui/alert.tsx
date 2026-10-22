import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-base",
    "[&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        neutral: "border-border bg-bg-subtle text-fg [&>svg]:text-fg-muted",
        info: "border-[color-mix(in_oklch,var(--dx-info)_25%,transparent)] bg-info-subtle text-info-fg",
        success: "border-[color-mix(in_oklch,var(--dx-success)_25%,transparent)] bg-success-subtle text-success-fg",
        warning: "border-[color-mix(in_oklch,var(--dx-warning)_30%,transparent)] bg-warning-subtle text-warning-fg",
        danger: "border-[color-mix(in_oklch,var(--dx-danger)_25%,transparent)] bg-danger-subtle text-danger-fg-subtle",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const defaultIcons: Record<AlertVariant, React.ComponentType<React.ComponentProps<"svg">>> = {
  neutral: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  danger: CircleAlertIcon,
};

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /** Replaces the variant's icon; `false` hides it. */
    icon?: React.ReactNode | false;
    /** Right-aligned slot, e.g. a small button. */
    action?: React.ReactNode;
    /** Shows a close button when set. */
    onDismiss?: () => void;
    dismissLabel?: string;
  };

function Alert({ className, variant, icon, action, onDismiss, dismissLabel = "Dismiss", role, children, ...props }: AlertProps) {
  const v = variant ?? "neutral";
  const Icon = defaultIcons[v];
  return (
    <div
      data-slot="alert"
      data-variant={v}
      // urgent variants interrupt; the rest are announced politely
      role={role ?? (v === "danger" || v === "warning" ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon === false ? null : (icon ?? <Icon aria-hidden />)}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>
      {action && <div className="-my-0.5 flex shrink-0 items-center gap-1.5 self-center">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "-my-0.5 -mr-1 grid size-6 shrink-0 place-items-center rounded-sm opacity-70",
            "transition-[opacity,background-color] duration-(--dx-motion-fast) hover:bg-current/10 hover:opacity-100",
          )}
        >
          <XIcon className="size-3.5" aria-hidden />
          <span className="sr-only">{dismissLabel}</span>
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("font-medium", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  // stays on the variant's -fg color; muted text would fail contrast on the tinted backgrounds
  return <div data-slot="alert-description" className={cn("text-sm [&_a]:font-medium [&_a]:underline", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps };
