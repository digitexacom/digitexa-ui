"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar, type CalendarBaseOptions, type DateRange } from "@/components/ui/calendar";
import { inputVariants } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/*
 *   <DatePicker value={due} onValueChange={setDue} placeholder="Due date" />
 *   <DateRangePicker value={sprint} onValueChange={setSprint} />
 *
 * Extra props go to the trigger button, so it works inside <FieldControl>.
 */

type PickerOptions = CalendarBaseOptions & {
  placeholder?: string;
  /** Intl options for the trigger text (default: { dateStyle: "medium" }). */
  formatOptions?: Intl.DateTimeFormatOptions;
  size?: "sm" | "md" | "lg";
  /** Days that can't be picked (the trigger's own `disabled` disables the whole control). */
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"];
  /** Popover alignment against the trigger. */
  align?: "start" | "center" | "end";
};

type TriggerProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange">;

type DatePickerProps = TriggerProps &
  PickerOptions & {
    value?: Date;
    defaultValue?: Date;
    onValueChange?: (date: Date | undefined) => void;
  };

type DateRangePickerProps = TriggerProps &
  PickerOptions & {
    value?: DateRange;
    defaultValue?: DateRange;
    onValueChange?: (range: DateRange | undefined) => void;
  };

function useControllable<T>(value: T | undefined, defaultValue: T | undefined, controlled: boolean, onChange?: (v: T | undefined) => void) {
  const [state, setState] = React.useState(defaultValue);
  const current = controlled ? value : state;
  const set = (v: T | undefined) => {
    if (!controlled) setState(v);
    onChange?.(v);
  };
  return [current, set] as const;
}

function PickerTrigger({ className, size, empty, children, ...props }: TriggerProps & { size?: PickerOptions["size"]; empty: boolean }) {
  return (
    <button
      type="button"
      data-slot="date-picker-trigger"
      data-placeholder={empty || undefined}
      className={cn(
        inputVariants({ size }),
        "items-center gap-2 text-left data-placeholder:text-fg-subtle",
        "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <CalendarIcon className="text-fg-subtle" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function splitOptions<T extends PickerOptions>(props: T) {
  const {
    placeholder,
    formatOptions = { dateStyle: "medium" },
    size,
    disabledDates,
    align = "start",
    min,
    max,
    weekStartsOn,
    locale = "en-US",
    showOutsideDays,
    labels,
    ...rest
  } = props;
  return {
    placeholder,
    formatOptions,
    size,
    align,
    locale,
    calendar: { min, max, weekStartsOn, locale, showOutsideDays, labels, disabled: disabledDates },
    rest,
  };
}

function DatePicker(props: DatePickerProps) {
  const { placeholder = "Pick a date", formatOptions, size, align, locale, calendar, rest } = splitOptions(props);
  const { value: valueProp, defaultValue, onValueChange, ...trigger } = rest;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControllable(valueProp, defaultValue, "value" in props, onValueChange);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PickerTrigger size={size} empty={!value} {...trigger}>
          {value ? new Intl.DateTimeFormat(locale, formatOptions).format(value) : placeholder}
        </PickerTrigger>
      </PopoverTrigger>
      <PopoverContent data-slot="date-picker-content" align={align} className="w-auto p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Calendar
          {...calendar}
          autoFocus
          selected={value}
          onSelect={(d) => {
            setValue(d);
            if (d) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function DateRangePicker(props: DateRangePickerProps) {
  const { placeholder = "Pick a date range", formatOptions, size, align, locale, calendar, rest } = splitOptions(props);
  const { value: valueProp, defaultValue, onValueChange, ...trigger } = rest;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControllable(valueProp, defaultValue, "value" in props, onValueChange);

  const fmt = new Intl.DateTimeFormat(locale, formatOptions);
  const label = !value?.from ? placeholder : value.to ? fmt.formatRange(value.from, value.to) : `${fmt.format(value.from)} – …`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PickerTrigger size={size} empty={!value?.from} {...trigger}>
          {label}
        </PickerTrigger>
      </PopoverTrigger>
      <PopoverContent data-slot="date-range-picker-content" align={align} className="w-auto p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Calendar
          {...calendar}
          mode="range"
          autoFocus
          selected={value}
          onSelect={(r) => {
            setValue(r);
            if (r?.from && r.to) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, DateRangePicker, type DatePickerProps, type DateRangePickerProps };
