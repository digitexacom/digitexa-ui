"use client";

import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ContextMenu = MenuPrimitive.Root;
const ContextMenuGroup = MenuPrimitive.Group;
const ContextMenuSub = MenuPrimitive.Sub;
const ContextMenuRadioGroup = MenuPrimitive.RadioGroup;

/** Right-click (or long-press) area. Pair it with a visible menu button so keyboard users can reach the same actions. */
function ContextMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

const panel = "dx-float z-(--dx-z-dropdown) min-w-44 overflow-hidden rounded-lg border border-border bg-surface-raised p-1 text-fg shadow-lg outline-none";

const item = [
  "relative flex h-(--dx-control-md) cursor-pointer items-center gap-2 rounded-sm px-2 text-base outline-none select-none",
  "data-highlighted:bg-muted data-disabled:pointer-events-none data-disabled:text-fg-disabled",
  "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-fg-subtle",
];

function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content data-slot="context-menu-content" className={cn(panel, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

type ContextMenuItemProps = React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "danger" };

function ContextMenuItem({ className, variant = "default", ...props }: ContextMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="context-menu-item"
      className={cn(item, variant === "danger" && "text-danger-fg-subtle data-highlighted:bg-danger-subtle [&_svg]:text-current", className)}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(item, "pl-7", className)} {...props}>
      <MenuPrimitive.ItemIndicator className="absolute left-2 grid place-items-center">
        <CheckIcon className="text-fg!" />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn(item, "pl-7", className)} {...props}>
      <MenuPrimitive.ItemIndicator className="absolute left-2.5 grid place-items-center">
        <span className="size-1.5 rounded-full bg-fg" />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn("px-2 pt-1.5 pb-1 text-2xs font-medium tracking-wide text-fg-subtle uppercase", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto pl-4 text-xs text-fg-subtle", className)} {...props} />;
}

function ContextMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return (
    <MenuPrimitive.SubTrigger className={cn(item, "data-[state=open]:bg-muted", className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent className={cn(panel, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
