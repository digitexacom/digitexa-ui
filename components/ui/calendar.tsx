"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

/*
 * Month calendar with single or range selection and full keyboard control:
 * ← → ↑ ↓ move by day/week, Home/End to the week's edges, PageUp/PageDown by month
 * (with Shift: by year), Enter/Space selects.
 *
 *   <Calendar selected={due} onSelect={setDue} min={new Date()} />
 *   <Calendar mode="range" selected={sprint} onSelect={setSprint} />
 */

type DateRange = { from?: Date; to?: Date };
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type CalendarBaseProps = Omit<React.ComponentProps<"div">, "onSelect" | "defaultValue"> & {
  /** Visible month (controlled). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Earliest and latest selectable days. */
  min?: Date;
  max?: Date;
  /** Days that can't be picked: a list or a predicate. */
  disabled?: Date[] | ((date: Date) => boolean);
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: Weekday;
  /** BCP 47 locale for month and weekday names. */
  locale?: string;
  showOutsideDays?: boolean;
  /** Focus the selected day (or today) on mount, e.g. inside a popover. */
  autoFocus?: boolean;
  labels?: { previousMonth?: string; nextMonth?: string };
};

type CalendarSingleProps = CalendarBaseProps & {
  mode?: "single";
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
  /** Clicking the selected day keeps it selected instead of clearing it. */
  required?: boolean;
};

type CalendarRangeProps = CalendarBaseProps & {
  mode: "range";
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  required?: boolean;
};

type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** Calendar options shared by DatePicker and DateRangePicker. */
type CalendarBaseOptions = Pick<CalendarBaseProps, "min" | "max" | "weekStartsOn" | "locale" | "showOutsideDays" | "labels">;

// ---------------------------------------------------------------- date math

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

/** Adds months, clamping the day (Jan 31 + 1 month = Feb 28/29). */
function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
}

const isSameDay = (a?: Date, b?: Date) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfWeek = (d: Date, weekStartsOn: Weekday) => addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));

// ---------------------------------------------------------------- component

type LooseProps = CalendarBaseProps & {
  mode?: "single" | "range";
  selected?: Date | DateRange;
  defaultSelected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  required?: boolean;
};

const formatterCache = new Map<string, ReturnType<typeof createFormatters>>();

function createFormatters(locale: string) {
  return {
    caption: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
    full: new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    weekdayShort: new Intl.DateTimeFormat(locale, { weekday: "short" }),
    weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long" }),
  };
}

// Intl formatters are costly to build; keep one set per locale
function formatters(locale: string) {
  let f = formatterCache.get(locale);
  if (!f) formatterCache.set(locale, (f = createFormatters(locale)));
  return f;
}

/** Renders once the client clock is known, so prerendered HTML never bakes in "today". */
function Calendar(props: CalendarProps) {
  const now = useNow();
  if (!now) {
    return (
      <div
        data-slot="calendar"
        aria-hidden
        className={cn("inline-block p-1", props.className)}
        style={{ width: "calc(var(--dx-control-md) * 7 + 0.5rem)", height: "calc(var(--dx-control-md) * 6 + 4rem)" }}
      />
    );
  }
  return <CalendarInner {...props} today={startOfDay(now)} />;
}

function CalendarInner({ today, ...calendarProps }: CalendarProps & { today: Date }) {
  const {
    mode = "single",
    selected: selectedProp,
    defaultSelected,
    onSelect,
    required = false,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    disabled,
    weekStartsOn = 1,
    locale = "en-US",
    showOutsideDays = true,
    autoFocus = false,
    labels,
    className,
    ...props
  } = calendarProps as LooseProps;

  const isRange = mode === "range";

  const [selectedState, setSelectedState] = React.useState(defaultSelected);
  const selected = "selected" in calendarProps ? selectedProp : selectedState;
  const single = !isRange ? (selected as Date | undefined) : undefined;
  const range = isRange ? (selected as DateRange | undefined) : undefined;

  const [monthState, setMonthState] = React.useState(() =>
    startOfMonth(defaultMonth ?? single ?? range?.from ?? (max && today > max ? max : min && today < min ? min : today)),
  );
  const month = monthProp ? startOfMonth(monthProp) : monthState;

  const [focused, setFocused] = React.useState<Date>(() => startOfDay(single ?? range?.from ?? today));
  const [hovered, setHovered] = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLTableElement>(null);
  const shouldFocus = React.useRef(autoFocus);
  const captionId = React.useId();

  const minDay = min && startOfDay(min);
  const maxDay = max && startOfDay(max);

  const isDisabled = (d: Date) =>
    (!!minDay && d < minDay) ||
    (!!maxDay && d > maxDay) ||
    (Array.isArray(disabled) ? disabled.some((x) => isSameDay(x, d)) : !!disabled?.(d));

  const fmt = formatters(locale);

  function changeMonth(next: Date) {
    const m = startOfMonth(next);
    if (!monthProp) setMonthState(m);
    onMonthChange?.(m);
  }

  function navigate(n: number) {
    changeMonth(addMonths(month, n));
    setFocused(addMonths(isSameMonth(focused, month) ? focused : month, n));
  }

  function moveFocus(next: Date) {
    if (minDay && next < minDay) next = minDay;
    if (maxDay && next > maxDay) next = maxDay;
    setFocused(next);
    if (!isSameMonth(next, month)) changeMonth(next);
    shouldFocus.current = true;
  }

  function select(day: Date) {
    if (isDisabled(day)) return;
    setFocused(day);
    if (!isSameMonth(day, month)) changeMonth(day);

    let next: Date | DateRange | undefined;
    if (!isRange) {
      next = isSameDay(day, single) && !required ? undefined : day;
    } else {
      const { from, to } = range ?? {};
      if (!from || to) next = { from: day, to: undefined };
      else if (isSameDay(day, from)) next = required ? { from, to: from } : undefined;
      else next = day < from ? { from: day, to: from } : { from, to: day };
    }
    if (!("selected" in calendarProps)) setSelectedState(next);
    onSelect?.(next);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, day: Date) {
    const weekStart = startOfWeek(day, weekStartsOn);
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => weekStart,
      End: () => addDays(weekStart, 6),
      PageUp: () => addMonths(day, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(day, e.shiftKey ? 12 : 1),
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    moveFocus(move());
  }

  // move DOM focus after keyboard navigation (and on mount with autoFocus)
  React.useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>("button[tabindex='0']")?.focus();
  });

  // the one tabbable day: the focused day if visible, else selected / today / the 1st
  const tabbable = [focused, single, range?.from, today].find((d): d is Date => !!d && isSameMonth(d, month)) ?? month;

  const gridStart = startOfWeek(month, weekStartsOn);
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)));

  // range shown while choosing the end day
  const preview = range?.from && !range.to && hovered ? (hovered < range.from ? { from: hovered, to: range.from } : { from: range.from, to: hovered }) : range;

  const prevDisabled = !!minDay && startOfMonth(minDay) >= month;
  const nextDisabled = !!maxDay && startOfMonth(maxDay) <= month;

  return (
    <div data-slot="calendar" className={cn("inline-flex w-fit flex-col gap-2 p-1 text-fg", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <div id={captionId} aria-live="polite" className="pl-1.5 text-base font-medium">
          {fmt.caption.format(month)}
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label={labels?.previousMonth ?? "Previous month"} disabled={prevDisabled} onClick={() => navigate(-1)}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={labels?.nextMonth ?? "Next month"} disabled={nextDisabled} onClick={() => navigate(1)}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <table ref={gridRef} role="grid" aria-labelledby={captionId} className="border-collapse" onPointerLeave={() => setHovered(null)}>
        <thead>
          <tr>
            {weeks[0].map((d) => (
              <th key={d.getDay()} scope="col" abbr={fmt.weekdayLong.format(d)} className="h-6 p-0 text-2xs font-medium text-fg-subtle">
                {fmt.weekdayShort.format(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={dayKey(week[0])}>
              {week.map((day) => {
                const outside = !isSameMonth(day, month);
                if (outside && !showOutsideDays) return <td key={dayKey(day)} role="presentation" className="p-0" />;

                const off = isDisabled(day);
                const from = preview?.from;
                const to = preview?.to ?? preview?.from;
                const isStart = isRange && isSameDay(day, from);
                const isEnd = isRange && isSameDay(day, to);
                const inRange = isRange && !!from && !!to && day > from && day < to;
                const isSelected = isRange ? isSameDay(day, range?.from) || isSameDay(day, range?.to) || (inRange && !!range?.to) : isSameDay(day, single);
                const solid = isRange ? isStart || isEnd : isSelected;
                const banded = isRange && !!from && !!to && !isSameDay(from, to) && (inRange || isStart || isEnd);

                return (
                  <td
                    key={dayKey(day)}
                    role="gridcell"
                    aria-selected={isSelected}
                    className={cn(
                      "p-0 text-center",
                      banded && "bg-accent-subtle first:rounded-l-md last:rounded-r-md",
                      banded && isStart && "rounded-l-md",
                      banded && isEnd && "rounded-r-md",
                    )}
                  >
                    <button
                      type="button"
                      data-date={dayKey(day)}
                      data-outside={outside || undefined}
                      data-today={isSameDay(day, today) || undefined}
                      tabIndex={isSameDay(day, tabbable) ? 0 : -1}
                      aria-label={fmt.full.format(day)}
                      aria-current={isSameDay(day, today) ? "date" : undefined}
                      aria-disabled={off || undefined}
                      onClick={() => select(day)}
                      onKeyDown={(e) => onKeyDown(e, day)}
                      onFocus={() => !isSameDay(day, focused) && setFocused(day)}
                      onPointerEnter={() => isRange && setHovered(day)}
                      className={cn(
                        "relative inline-flex size-(--dx-control-md) items-center justify-center rounded-md text-sm tabular-nums outline-none",
                        "transition-[background-color,color] duration-(--dx-motion-fast) ease-out",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
                        "data-today:font-semibold",
                        // today marker: a dot under the number
                        "data-today:after:absolute data-today:after:bottom-1 data-today:after:size-1 data-today:after:rounded-full data-today:after:bg-accent",
                        outside && "text-fg-subtle",
                        banded && !solid ? "text-accent-subtle-fg hover:bg-[color-mix(in_oklch,var(--dx-accent-subtle),var(--dx-accent)_12%)]" : "hover:bg-muted",
                        solid && "bg-accent text-accent-fg hover:bg-accent-hover data-today:after:bg-accent-fg",
                        off && "pointer-events-none text-fg-disabled line-through data-today:after:bg-fg-disabled",
                      )}
                    >
                      {fmt.day.format(day)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Calendar, type CalendarProps, type CalendarBaseOptions, type CalendarSingleProps, type CalendarRangeProps, type DateRange };
