"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type StatusIconStatus } from "@/components/ui/status-icon";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  /** Inclusive; the event repeats on every day up to it. */
  end?: Date;
  status?: StatusIconStatus;
  /** Shown before the title, e.g. "14:00". */
  time?: string;
};

type CalendarViewProps<E extends CalendarEvent> = Omit<React.ComponentProps<"div">, "onChange"> & {
  events: E[];
  /** Any day inside the visible month (controlled). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Pills shown per day before "+N more". */
  maxEvents?: number;
  today?: Date;
  locale?: string;
  onEventClick?: (event: E) => void;
  onDayClick?: (date: Date, events: E[]) => void;
};

const pillColors: Record<StatusIconStatus, string> = {
  backlog: "bg-status-backlog-subtle text-status-backlog-fg",
  todo: "bg-status-todo-subtle text-status-todo-fg",
  progress: "bg-status-progress-subtle text-status-progress-fg",
  review: "bg-status-review-subtle text-status-review-fg",
  done: "bg-status-done-subtle text-status-done-fg",
};
const dotColors: Record<StatusIconStatus, string> = {
  backlog: "bg-status-backlog",
  todo: "bg-status-todo",
  progress: "bg-status-progress",
  review: "bg-status-review",
  done: "bg-status-done",
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Month grid for scheduled work: always 6 weeks, events as status-colored pills. Not a date picker. */
function CalendarView<E extends CalendarEvent>({
  events,
  month,
  defaultMonth,
  onMonthChange,
  weekStartsOn = 1,
  maxEvents = 3,
  today,
  locale = "en-US",
  onEventClick,
  onDayClick,
  className,
  ...props
}: CalendarViewProps<E>) {
  const now = useNow();
  const current = today ?? now;
  const [innerMonth, setInnerMonth] = React.useState<Date | undefined>(defaultMonth);
  // with no month given, the grid waits for the client clock (an empty frame is prerendered)
  const visible = month ?? innerMonth ?? current;
  const year = visible?.getFullYear() ?? 0;
  const m = visible?.getMonth() ?? 0;

  const go = (next: Date) => {
    if (month === undefined) setInnerMonth(next);
    onMonthChange?.(next);
  };

  // 42 days starting on the configured weekday
  const first = new Date(year, m, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const days = Array.from({ length: 42 }, (_, i) => new Date(year, m, 1 - offset + i));

  const byDay = React.useMemo(() => {
    const map = new Map<string, E[]>();
    for (const ev of events) {
      const s = startOfDay(ev.date);
      const e = startOfDay(ev.end ?? ev.date);
      for (let d = s, n = 0; d <= e && n < 62; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1), n++) {
        const k = dayKey(d);
        map.set(k, [...(map.get(k) ?? []), ev]);
      }
    }
    return map;
  }, [events]);

  const fmtTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const fmtWeekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const fmtFull = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const weekdays = days.slice(0, 7).map((d) => fmtWeekday.format(d));
  const titleId = React.useId();

  return (
    <div
      data-slot="calendar-view"
      role="region"
      aria-labelledby={titleId}
      className={cn("flex flex-col overflow-hidden rounded-lg border border-border bg-surface", className)}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <h2 id={titleId} aria-live="polite" className="flex-1 text-md font-semibold">
          {visible ? fmtTitle.format(visible) : "\u00a0"}
        </h2>
        <Button size="sm" onClick={() => go(current ?? new Date())}>
          Today
        </Button>
        <div className="flex">
          <Button size="icon-sm" variant="ghost" aria-label="Previous month" onClick={() => go(new Date(year, m - 1, 1))}>
            <ChevronLeftIcon />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Next month" onClick={() => go(new Date(year, m + 1, 1))}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div aria-hidden className="grid grid-cols-7 border-b border-border bg-bg-subtle">
        {weekdays.map((w) => (
          <div key={w} className="px-2 py-1.5 text-2xs font-medium tracking-wide text-fg-subtle uppercase">
            {w}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {days.map((d, i) => {
          if (!visible) return <div key={i} className={cn("min-h-[calc(var(--dx-row-height)*2.6)] border-border", i % 7 !== 6 && "border-r", i < 35 && "border-b")} />;
          const list = byDay.get(dayKey(d)) ?? [];
          const outside = d.getMonth() !== m;
          const isToday = current ? sameDay(d, current) : false;
          // keep a slot for "+N more" so rows stay even
          const shown = list.length > maxEvents ? list.slice(0, maxEvents - 1) : list;
          const rest = list.length - shown.length;
          const full = fmtFull.format(d);
          return (
            <div
              key={i}
              data-slot="calendar-day"
              data-outside={outside || undefined}
              data-today={isToday || undefined}
              className={cn(
                "flex min-h-[calc(var(--dx-row-height)*2.6)] min-w-0 flex-col gap-0.5 border-border p-1",
                i % 7 !== 6 && "border-r",
                i < 35 && "border-b",
                outside && "bg-bg-subtle",
              )}
            >
              <button
                type="button"
                aria-label={`${full}${list.length ? `, ${list.length} ${list.length === 1 ? "event" : "events"}` : ""}`}
                aria-current={isToday ? "date" : undefined}
                onClick={onDayClick ? () => onDayClick(d, list) : undefined}
                disabled={!onDayClick}
                className={cn(
                  "mb-0.5 grid size-(--dx-control-xs) place-items-center self-end rounded-full text-xs tabular-nums disabled:cursor-default",
                  onDayClick && "hover:bg-muted",
                  outside ? "text-fg-subtle" : "text-fg-muted",
                  isToday && "bg-accent font-semibold text-accent-fg hover:bg-accent-hover",
                )}
              >
                {d.getDate()}
              </button>
              {shown.map((ev) => (
                <EventPill key={ev.id} event={ev} onClick={onEventClick ? () => onEventClick(ev) : undefined} />
              ))}
              {rest > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label={`${rest} more on ${full}`}
                      className="h-(--dx-control-xs) rounded-sm px-1.5 text-left text-xs text-fg-muted hover:bg-muted hover:text-fg"
                    >
                      +{rest} more
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-60 flex-col gap-1 p-2">
                    <span className="px-1 pb-1 text-xs font-medium text-fg-muted">{full}</span>
                    {list.map((ev) => (
                      <EventPill key={ev.id} event={ev} onClick={onEventClick ? () => onEventClick(ev) : undefined} />
                    ))}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventPill({ event, onClick }: { event: CalendarEvent; onClick?: () => void }) {
  const status = event.status ?? "todo";
  const content = (
    <>
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dotColors[status])} />
      {event.time && <span className="shrink-0 tabular-nums opacity-80">{event.time}</span>}
      <span className={cn("truncate", status === "done" && "line-through")}>{event.title}</span>
    </>
  );
  const classes = cn(
    "flex h-(--dx-control-xs) min-w-0 shrink-0 items-center gap-1 rounded-sm px-1.5 text-left text-xs font-medium",
    pillColors[status],
  );
  return onClick ? (
    <button type="button" data-slot="calendar-event" onClick={onClick} title={event.title} className={cn(classes, "hover:brightness-95 dark:hover:brightness-110")}>
      {content}
    </button>
  ) : (
    <span data-slot="calendar-event" title={event.title} className={classes}>
      {content}
    </span>
  );
}

export { CalendarView, type CalendarEvent, type CalendarViewProps };
