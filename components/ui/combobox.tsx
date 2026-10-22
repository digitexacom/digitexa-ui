"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { inputVariants } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/*
 * Searchable select built on Popover + Command.
 *
 *   <Combobox options={members} value={owner} onValueChange={setOwner} placeholder="Assign owner" />
 *   <Combobox multiple options={labels} value={tags} onValueChange={setTags} />
 *
 * Extra props go to the trigger button, so it works inside <FieldControl>.
 */

type ComboboxOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  /** Extra words to match while searching. */
  keywords?: string[];
  disabled?: boolean;
};

type ComboboxBaseProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange"> & {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Popover alignment against the trigger. */
  align?: "start" | "center" | "end";
};

type ComboboxSingleProps = ComboboxBaseProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Chips shown in the trigger before collapsing into "+N". */
  maxChips?: number;
};

type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

type LooseProps = ComboboxBaseProps & {
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  maxChips?: number;
};

function Combobox(comboboxProps: ComboboxProps) {
  const {
    options,
    multiple = false,
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = multiple ? "Select options…" : "Select an option…",
    searchPlaceholder = "Search…",
    emptyText = "No results",
    size = "md",
    align = "start",
    maxChips = 2,
    className,
    disabled,
    ...props
  } = comboboxProps as LooseProps;

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(defaultValue);
  const value = "value" in comboboxProps ? valueProp : state;

  const values = multiple ? ((value as string[] | undefined) ?? []) : value ? [value as string] : [];
  const chosen = values.map((v) => options.find((o) => o.value === v)).filter((o): o is ComboboxOption => !!o);

  function commit(next: string | string[] | undefined) {
    if (!("value" in comboboxProps)) setState(next);
    onValueChange?.(next);
  }

  function choose(option: ComboboxOption) {
    if (multiple) {
      commit(values.includes(option.value) ? values.filter((v) => v !== option.value) : [...values, option.value]);
    } else {
      commit(values[0] === option.value ? undefined : option.value);
      setOpen(false);
    }
  }

  const visible = chosen.slice(0, maxChips);
  const hidden = chosen.length - visible.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="combobox-trigger"
          data-placeholder={chosen.length === 0 || undefined}
          disabled={disabled}
          className={cn(
            inputVariants({ size }),
            "items-center justify-between gap-2 text-left data-placeholder:text-fg-subtle",
            "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
            className,
          )}
          {...props}
        >
          {chosen.length === 0 ? (
            <span className="truncate">{placeholder}</span>
          ) : multiple ? (
            <span className="flex min-w-0 items-center gap-1 overflow-hidden">
              {visible.map((o) => (
                <Badge key={o.value} className="min-w-0">
                  {o.icon}
                  <span className="truncate">{o.label}</span>
                </Badge>
              ))}
              {hidden > 0 && <Badge variant="outline">+{hidden}</Badge>}
            </span>
          ) : (
            <span className="flex min-w-0 items-center gap-2 [&_svg]:text-fg-subtle">
              {chosen[0].icon}
              <span className="truncate">{chosen[0].label}</span>
            </span>
          )}
          <ChevronsUpDownIcon className="text-fg-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent data-slot="combobox-content" align={align} className="w-(--radix-popover-trigger-width) min-w-56 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="text-base" />
          <CommandList aria-multiselectable={multiple || undefined} className="max-h-64">
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => {
              const checked = values.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  keywords={[option.label, ...(option.keywords ?? [])]}
                  disabled={option.disabled}
                  data-checked={checked || undefined}
                  onSelect={() => choose(option)}
                  className="h-(--dx-control-md) pr-1.5"
                >
                  {option.icon}
                  <span className="flex-1 truncate">{option.label}</span>
                  <CheckIcon aria-hidden className={cn("ml-auto", !checked && "invisible")} />
                  {checked && <span className="sr-only">(selected)</span>}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox, type ComboboxOption, type ComboboxProps, type ComboboxSingleProps, type ComboboxMultipleProps };
