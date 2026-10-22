"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/*
 * Form field: label, control, description and error, with the ids wired for you.
 *
 *   <Field invalid={!!error}>
 *     <FieldLabel>Project name</FieldLabel>
 *     <FieldControl><Input /></FieldControl>
 *     <FieldDescription>Shown in the sidebar.</FieldDescription>
 *     <FieldError>{error}</FieldError>
 *   </Field>
 *
 * FieldControl passes id, aria-describedby and aria-invalid to its child. For custom
 * controls, spread useField().controlProps instead. A rendered FieldError marks the field invalid.
 */

type FieldContextValue = {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  hasDescription: boolean;
  hasError: boolean;
  register: (part: "description" | "error") => () => void;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useField() {
  const ctx = React.useContext(FieldContext);
  if (!ctx) throw new Error("useField must be used inside <Field>");
  const describedBy = [ctx.hasDescription && ctx.descriptionId, ctx.hasError && ctx.errorId].filter(Boolean).join(" ");
  return {
    ...ctx,
    controlProps: {
      id: ctx.id,
      "aria-describedby": describedBy || undefined,
      "aria-invalid": ctx.invalid || undefined,
    },
  };
}

type FieldProps = React.ComponentProps<"div"> & {
  /** Marks the control invalid. Defaults to true while a FieldError is rendered. */
  invalid?: boolean;
  /** Places label and control side by side, for checkboxes and switches. */
  orientation?: "vertical" | "horizontal";
  /** Id for the control; generated when omitted. */
  controlId?: string;
};

function Field({ className, invalid, orientation = "vertical", controlId, ...props }: FieldProps) {
  const autoId = React.useId();
  const id = controlId ?? `${autoId}-control`;
  const [parts, setParts] = React.useState({ description: 0, error: 0 });

  const register = React.useCallback((part: "description" | "error") => {
    setParts((p) => ({ ...p, [part]: p[part] + 1 }));
    return () => setParts((p) => ({ ...p, [part]: p[part] - 1 }));
  }, []);

  const value: FieldContextValue = {
    id,
    descriptionId: `${autoId}-description`,
    errorId: `${autoId}-error`,
    invalid: invalid ?? parts.error > 0,
    hasDescription: parts.description > 0,
    hasError: parts.error > 0,
    register,
  };

  return (
    <FieldContext.Provider value={value}>
      <div
        data-slot="field"
        data-orientation={orientation}
        data-invalid={value.invalid || undefined}
        className={cn(
          "flex gap-1.5",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-center gap-x-2.5 [&>[data-slot=field-description],&>[data-slot=field-error]]:basis-full",
          className,
        )}
        {...props}
      />
    </FieldContext.Provider>
  );
}

function FieldLabel({ className, htmlFor, ...props }: React.ComponentProps<typeof Label>) {
  const { id } = useField();
  return <Label data-slot="field-label" htmlFor={htmlFor ?? id} className={className} {...props} />;
}

/** Passes id, aria-describedby and aria-invalid to its only child. */
function FieldControl(props: React.ComponentProps<typeof Slot>) {
  const { controlProps } = useField();
  return <Slot data-slot="field-control" {...controlProps} {...props} />;
}

function FieldDescription({ className, id, ...props }: React.ComponentProps<"p">) {
  const { descriptionId, register } = useField();
  React.useEffect(() => register("description"), [register]);
  return <p data-slot="field-description" id={id ?? descriptionId} className={cn("text-xs text-fg-muted", className)} {...props} />;
}

/** Renders only when it has children, so `<FieldError>{error}</FieldError>` is safe. */
function FieldError({ children, ...props }: React.ComponentProps<"p">) {
  if (children == null || children === false || children === "") return null;
  return <FieldErrorMessage {...props}>{children}</FieldErrorMessage>;
}

function FieldErrorMessage({ className, id, ...props }: React.ComponentProps<"p">) {
  const { errorId, register } = useField();
  React.useEffect(() => register("error"), [register]);
  return <p data-slot="field-error" role="alert" id={id ?? errorId} className={cn("text-xs font-medium text-danger-fg-subtle", className)} {...props} />;
}

/** Stacks several fields with consistent spacing. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError, FieldGroup, useField, type FieldProps };
