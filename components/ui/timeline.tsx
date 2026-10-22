"use client";

import * as React from "react";

import { StatusIcon, statusIconLabels, type StatusIconStatus } from "@/components/ui/status-icon";
import { TooltipContent, TooltipRoot, TooltipTrigger } from "@/components/ui/tooltip";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

type TimelineItem = {
  id: string;
  label: React.ReactNode;
  /** Plain-text name for tooltips and aria labels when `label` isn't a string. */
  name?: string;
  /** Right side of the label column, e.g. an avatar. */
  meta?: React.ReactNode;
  start: Date;
  /** Inclusive. Ignored for milestones. */
  end?: Date;
  status?: StatusIconStatus;
  /** Draws a diamond on `start` instead of a bar. */
  milestone?: boolean;
  /** 0–100, shaded inside the bar. */
  progress?: number;
};

type TimelineProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: TimelineItem[];
  start: Date;
  end: Date;
  scale?: "day" | "week";
  /** Defaults to the client clock; the today line appears after hydration. */
  today?: Date;
  labelHeader?: React.ReactNode;
  onItemClick?: (item: TimelineItem) => void;
};

const DAY = 86_400_000;
const unitWidth = { day: 32, week: 14 } as const; // px per day
const labelWidth = 224;

const barColors: Record<StatusIconStatus, string> = {
  backlog: "bg-status-backlog-subtle text-status-backlog-fg border-status-backlog/45",
  todo: "bg-status-todo-subtle text-status-todo-fg border-status-todo/45",
  progress: "bg-status-progress-subtle text-status-progress-fg border-status-progress/50",
  review: "bg-status-review-subtle text-status-review-fg border-status-review/45",
  done: "bg-status-done-subtle text-status-done-fg border-status-done/45",
};
const fillColors: Record<StatusIconStatus, string> = {
  backlog: "bg-status-backlog/20",
  todo: "bg-status-todo/20",
  progress: "bg-status-progress/25",
  review: "bg-status-review/20",
  done: "bg-status-done/20",
};
const solidColors: Record<StatusIconStatus, string> = {
  backlog: "bg-status-backlog",
  todo: "bg-status-todo",
  progress: "bg-status-progress",
  review: "bg-status-review",
  done: "bg-status-done",
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function dayIndex(d: Date, origin: Date) {
  return Math.round((startOfDay(d).getTime() - origin.getTime()) / DAY);
}

const fmtDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fmtMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const fmtWeekday = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });

/** Gantt chart: a sticky label column, day or week header, bars per item, weekend shading and a today line. */
function Timeline({ items, start, end, scale = "day", today, labelHeader = "Name", onItemClick, className, ...props }: TimelineProps) {
  const now = useNow();
  const origin = startOfDay(start);
  const total = Math.max(1, dayIndex(end, origin) + 1);
  const w = unitWidth[scale];
  const days = Array.from({ length: total }, (_, i) => new Date(origin.getFullYear(), origin.getMonth(), origin.getDate() + i));
  const ref = today ?? now;
  const todayIdx = ref ? dayIndex(ref, origin) : -1;
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrolled = React.useRef(0); // the scale it last scrolled for

  // bring today into view once per scale, about a third from the left
  React.useEffect(() => {
    const el = scroller.current;
    if (!el || scrolled.current === w || todayIdx < 0 || todayIdx >= total) return;
    scrolled.current = w;
    const track = el.clientWidth - labelWidth;
    el.scrollLeft = Math.max(0, todayIdx * w - track / 3);
  }, [todayIdx, total, w]);

  // header bands: months on top, days or weeks below
  const months: { key: string; label: string; from: number; span: number }[] = [];
  const weeks: { key: string; label: string; from: number; span: number }[] = [];
  days.forEach((d, i) => {
    const mk = `${d.getFullYear()}-${d.getMonth()}`;
    if (months.at(-1)?.key === mk) months.at(-1)!.span++;
    else months.push({ key: mk, label: fmtMonth.format(d), from: i, span: 1 });
    if (i === 0 || d.getDay() === 1) weeks.push({ key: String(i), label: fmtDay.format(d), from: i, span: 1 });
    else weeks.at(-1)!.span++;
  });

  const trackWidth = total * w;
  const gridLines = {
    backgroundImage: "linear-gradient(to right, var(--dx-border) 1px, transparent 1px)",
    backgroundSize: `${scale === "day" ? w : w * 7}px 100%`,
    backgroundPosition: scale === "week" ? `${(weeks[1]?.from ?? 0) * w}px 0` : undefined,
  } satisfies React.CSSProperties;

  return (
    <div
      ref={scroller}
      data-slot="timeline"
      className={cn("overflow-x-auto rounded-lg border border-border bg-surface", className)}
      style={{ ["--dx-timeline-label" as string]: `${labelWidth}px` }}
      {...props}
    >
      <div role="table" aria-label="Timeline" className="relative" style={{ width: labelWidth + trackWidth }}>
        {/* header */}
        <div role="rowgroup">
          <div role="row" className="flex border-b border-border">
            <div
              role="columnheader"
              className="sticky left-0 z-20 flex w-(--dx-timeline-label) shrink-0 items-end border-r border-border bg-surface px-3 pb-1.5 text-xs font-medium text-fg-muted"
            >
              {labelHeader}
            </div>
            <div role="columnheader" className="relative" style={{ width: trackWidth }}>
              <div className="relative h-7 border-b border-border">
                {months.map((m) => (
                  <div
                    key={m.key}
                    className="absolute inset-y-0 flex items-center border-l border-border px-2 text-xs font-medium whitespace-nowrap first:border-l-0"
                    style={{ left: m.from * w, width: m.span * w }}
                  >
                    <span className="sticky left-[calc(var(--dx-timeline-label)+8px)] truncate">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-8">
                {scale === "day"
                  ? days.map((d, i) => {
                      const weekend = d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "absolute inset-y-0 flex flex-col items-center justify-center border-l border-border text-2xs leading-3 first:border-l-0",
                            weekend ? "bg-muted/60 text-fg-subtle" : "text-fg-muted",
                            i === todayIdx && "font-semibold text-accent-subtle-fg",
                          )}
                          style={{ left: i * w, width: w }}
                        >
                          <span aria-hidden>{fmtWeekday.format(d)}</span>
                          <span className="tabular-nums">{d.getDate()}</span>
                        </div>
                      );
                    })
                  : weeks.map((wk) => (
                      <div
                        key={wk.key}
                        className="absolute inset-y-0 flex items-center border-l border-border px-1.5 text-2xs whitespace-nowrap text-fg-muted first:border-l-0"
                        style={{ left: wk.from * w, width: wk.span * w }}
                      >
                        <span className="truncate tabular-nums">{wk.label}</span>
                      </div>
                    ))}
              </div>
              {todayIdx >= 0 && todayIdx < total && (
                <span
                  className="absolute bottom-0 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent"
                  style={{ left: todayIdx * w + w / 2 }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>

        {/* body */}
        <div role="rowgroup" className="relative">
          {/* background layer: grid, weekends, today */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0" style={{ left: labelWidth, width: trackWidth }}>
            {days.map((d, i) =>
              d.getDay() === 0 || d.getDay() === 6 ? <div key={i} className="absolute inset-y-0 bg-muted/60" style={{ left: i * w, width: w }} /> : null,
            )}
            <div className="absolute inset-0" style={gridLines} />
            {todayIdx >= 0 && todayIdx < total && <div className="absolute inset-y-0 z-10 w-px bg-accent" style={{ left: todayIdx * w + w / 2 }} />}
          </div>

          {items.map((item) => (
            <TimelineRow key={item.id} item={item} origin={origin} total={total} w={w} onItemClick={onItemClick} />
          ))}
          {items.length === 0 && <div className="px-3 py-6 text-center text-sm text-fg-subtle">Nothing scheduled in this range.</div>}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({
  item,
  origin,
  total,
  w,
  onItemClick,
}: {
  item: TimelineItem;
  origin: Date;
  total: number;
  w: number;
  onItemClick?: (item: TimelineItem) => void;
}) {
  const status = item.status ?? "todo";
  const name = item.name ?? (typeof item.label === "string" ? item.label : item.id);
  const s = dayIndex(item.start, origin);
  const e = item.milestone ? s : dayIndex(item.end ?? item.start, origin);
  const visible = e >= 0 && s < total;
  const from = Math.max(0, s);
  const to = Math.min(total - 1, e);
  const span = e - s + 1;
  const range = item.milestone ? fmtDay.format(item.start) : `${fmtDay.format(item.start)} – ${fmtDay.format(item.end ?? item.start)}`;
  const description = `${name}: ${range}${item.milestone ? " (milestone)" : `, ${span} ${span === 1 ? "day" : "days"}`}, ${statusIconLabels[status]}`;

  const tooltip = (
    <TooltipContent side="top" className="flex-col items-start gap-0.5">
      <span className="font-medium">{name}</span>
      <span className="opacity-80">
        {range}
        {!item.milestone && ` · ${span}d`} · {statusIconLabels[status]}
        {item.progress !== undefined && ` · ${Math.round(item.progress)}%`}
      </span>
    </TooltipContent>
  );

  return (
    <div role="row" data-slot="timeline-row" className="group/row relative flex h-(--dx-row-height) border-b border-border last:border-b-0">
      <div
        role="rowheader"
        className="sticky left-0 z-20 flex w-(--dx-timeline-label) shrink-0 items-center gap-2 border-r border-border bg-surface px-3 text-base"
      >
        <StatusIcon status={status} label="" />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {item.meta}
      </div>
      <div role="cell" className="relative flex-1 group-hover/row:bg-bg-subtle/60">
        {visible && (
          <TooltipRoot>
            <TooltipTrigger asChild>
              {item.milestone ? (
                <button
                  type="button"
                  aria-label={description}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                  className="absolute top-1/2 z-10 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm"
                  style={{ left: s * w + w / 2 }}
                >
                  <span className={cn("size-3 rotate-45 rounded-[2px] ring-2 ring-surface", solidColors[status])} />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label={description}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                  className={cn(
                    "absolute top-1/2 z-10 flex h-[calc(var(--dx-row-height)-14px)] -translate-y-1/2 items-center overflow-hidden rounded-sm border px-1.5 text-xs font-medium",
                    "transition-[filter] duration-(--dx-motion-fast) hover:brightness-95 dark:hover:brightness-110",
                    barColors[status],
                    s < 0 && "rounded-l-none border-l-0",
                    e >= total && "rounded-r-none border-r-0",
                  )}
                  style={{ left: from * w + 2, width: Math.max(w - 4, (to - from + 1) * w - 4) }}
                >
                  {item.progress !== undefined && (
                    <span aria-hidden className={cn("absolute inset-y-0 left-0", fillColors[status])} style={{ width: `${Math.min(100, item.progress)}%` }} />
                  )}
                  <span className="relative truncate">{name}</span>
                </button>
              )}
            </TooltipTrigger>
            {tooltip}
          </TooltipRoot>
        )}
      </div>
    </div>
  );
}

export { Timeline, type TimelineItem, type TimelineProps };
