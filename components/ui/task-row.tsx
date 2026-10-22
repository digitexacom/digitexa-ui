"use client";

import * as React from "react";
import { ChevronRightIcon, PlusIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PriorityIcon, priorityLabels, type Priority } from "@/components/ui/priority";
import { StatusIcon, statusIconLabels, type StatusIconStatus } from "@/components/ui/status-icon";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ tags & dates */

type TagColor = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | StatusIconStatus;

const tagDotColors: Record<TagColor, string> = {
  neutral: "bg-fg-subtle",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  backlog: "bg-status-backlog",
  todo: "bg-status-todo",
  progress: "bg-status-progress",
  review: "bg-status-review",
  done: "bg-status-done",
};

type Person = { name: string; src?: string };

const DAY = 86_400_000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Local YYYY-MM-DD (toISOString would shift to UTC). */
function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Whole calendar days from `today` to `date` (negative = past). DST-safe. */
function daysFrom(date: Date, today: Date) {
  return Math.round((startOfDay(date).getTime() - startOfDay(today).getTime()) / DAY);
}

type DueState = "overdue" | "today" | "soon" | "later";

/** Label and urgency of a due date. Without `today` (server render) it falls back to a plain short date. */
function dueInfo(date: Date, today: Date | null, done = false) {
  const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  if (!today) return { text: short, state: "later" as DueState, full: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date) };
  const diff = daysFrom(date, today);
  const label = date.getFullYear() === today.getFullYear() ? short : `${short}, ${date.getFullYear()}`;
  const text = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : diff === -1 ? "Yesterday" : label;
  const state: DueState = done ? "later" : diff < 0 ? "overdue" : diff === 0 ? "today" : diff <= 3 ? "soon" : "later";
  return { text, state, full: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date) };
}

const dueColors: Record<DueState, string> = {
  overdue: "text-danger-fg-subtle",
  today: "text-warning-fg",
  soon: "text-fg-muted",
  later: "text-fg-subtle",
};

type DueDateProps = Omit<React.ComponentProps<"time">, "children"> & {
  date: Date;
  /** Reference day; defaults to the client clock (see useNow). */
  today?: Date;
  /** Completed work is never shown as overdue. */
  done?: boolean;
};

/** "Today" in warning, past dates in danger, otherwise a short date. */
function DueDate({ date, today, done, className, ...props }: DueDateProps) {
  const now = useNow();
  const info = dueInfo(date, today ?? now, done);
  return (
    <time
      data-slot="due-date"
      data-state={info.state}
      dateTime={isoDay(date)}
      title={`Due ${info.full}`}
      className={cn("shrink-0 text-xs whitespace-nowrap tabular-nums", dueColors[info.state], info.state === "overdue" && "font-medium", className)}
      {...props}
    >
      {info.text}
    </time>
  );
}

/** Colored dot + name, for projects or labels. */
function ProjectTag({ name, color = "neutral", className, ...props }: React.ComponentProps<"span"> & { name: string; color?: TagColor }) {
  return (
    <span
      data-slot="project-tag"
      className={cn("inline-flex h-(--dx-control-xs) max-w-40 min-w-0 items-center gap-1.5 rounded-sm border border-border px-1.5 text-xs text-fg-muted", className)}
      {...props}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", tagDotColors[color])} />
      <span className="truncate">{name}</span>
    </span>
  );
}

/* ---------------------------------------------------------------- task row */

type TaskRowProps = Omit<React.ComponentProps<"div">, "title" | "onClick"> & {
  title: React.ReactNode;
  status: StatusIconStatus;
  /** Short key shown before the status, e.g. "STR-142". */
  identifier?: string;
  /** Called from the status toggle with the next status (done ↔ to do by default). */
  onStatusChange?: (next: StatusIconStatus) => void;
  project?: { name: string; color?: TagColor };
  priority?: Priority;
  assignee?: Person;
  due?: Date;
  today?: Date;
  selected?: boolean;
  /** Makes the whole row clickable (via the title button, so the row stays one tab stop). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Extra content between title and meta, e.g. labels. */
  children?: React.ReactNode;
};

function TaskRow({
  title,
  status,
  identifier,
  onStatusChange,
  project,
  priority,
  assignee,
  due,
  today,
  selected = false,
  onClick,
  className,
  children,
  ...props
}: TaskRowProps) {
  const done = status === "done";
  const plainTitle = typeof title === "string" ? title : identifier ?? "task";

  return (
    <div
      data-slot="task-row"
      role="listitem"
      data-selected={selected || undefined}
      data-status={status}
      className={cn(
        "group/task relative flex h-(--dx-row-height) items-center gap-2.5 border-b border-border px-3 text-base",
        "transition-colors duration-(--dx-motion-fast) ease-out",
        onClick && "hover:bg-bg-subtle",
        "data-selected:bg-selected",
        className,
      )}
      {...props}
    >
      {priority && <PriorityIcon priority={priority} label={`Priority: ${priorityLabels[priority]}`} />}
      {identifier && <span className="w-16 shrink-0 truncate text-xs text-fg-subtle tabular-nums">{identifier}</span>}

      {onStatusChange ? (
        <button
          type="button"
          aria-label={done ? `Mark ${plainTitle} as not done` : `Mark ${plainTitle} as done`}
          aria-pressed={done}
          onClick={() => onStatusChange(done ? "todo" : "done")}
          className="relative z-1 -m-1 grid shrink-0 place-items-center rounded-full p-1 transition-transform duration-(--dx-motion-fast) hover:scale-110"
        >
          <StatusIcon status={status} label="" />
        </button>
      ) : (
        <StatusIcon status={status} label={statusIconLabels[status]} />
      )}

      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-current={selected || undefined}
          // stretched over the whole row; the other controls sit above it with z-1
          className="min-w-0 flex-1 truncate text-left outline-none after:absolute after:inset-0 focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
        >
          <TaskTitle done={done}>{title}</TaskTitle>
        </button>
      ) : (
        <span className="min-w-0 flex-1 truncate">
          <TaskTitle done={done}>{title}</TaskTitle>
        </span>
      )}

      {children}
      {project && <ProjectTag name={project.name} color={project.color} className="hidden sm:inline-flex" />}
      {due && <DueDate date={due} today={today} done={done} className="w-16 text-right" />}
      {assignee ? (
        <Avatar name={assignee.name} src={assignee.src} size="sm" title={assignee.name} />
      ) : (
        <span aria-label="Unassigned" role="img" className="size-5 shrink-0 rounded-full border border-dashed border-border-strong" />
      )}
    </div>
  );
}

function TaskTitle({ done, children }: { done: boolean; children: React.ReactNode }) {
  return <span className={cn(done ? "text-fg-subtle line-through" : "text-fg")}>{children}</span>;
}

/* --------------------------------------------------------------- task list */

/** Bordered container. Holds TaskGroups, or TaskRows directly with role="list". */
function TaskList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="task-list" className={cn("flex flex-col overflow-hidden rounded-lg border border-border bg-surface", className)} {...props} />;
}

type TaskGroupProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  status?: StatusIconStatus;
  count?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shows a + button in the header. */
  onAdd?: () => void;
};

/** Collapsible group with a sticky-looking header: status, title, count. Children are TaskRows. */
function TaskGroup({ title, status, count, defaultOpen = true, open, onOpenChange, onAdd, className, children, ...props }: TaskGroupProps) {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const contentId = React.useId();
  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const label = typeof title === "string" ? title : status ? statusIconLabels[status] : "group";

  return (
    <section data-slot="task-group" data-state={isOpen ? "open" : "closed"} aria-label={label} className={cn("flex flex-col", className)} {...props}>
      <div className="flex h-(--dx-control-lg) items-center gap-1 border-b border-border bg-bg-subtle pr-2 pl-1.5">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setOpen(!isOpen)}
          className="flex h-(--dx-control-sm) min-w-0 flex-1 items-center gap-2 rounded-sm px-1.5 text-left text-base font-medium"
        >
          <ChevronRightIcon
            aria-hidden
            className={cn("size-3.5 shrink-0 text-fg-subtle transition-transform duration-(--dx-motion) ease-out", isOpen && "rotate-90")}
          />
          {status && <StatusIcon status={status} label="" />}
          <span className="truncate">{title}</span>
          {count !== undefined && <span className="text-sm font-normal text-fg-subtle tabular-nums">{count}</span>}
        </button>
        {onAdd && (
          <Button size="icon-sm" variant="ghost" aria-label={`Add task to ${label}`} onClick={onAdd}>
            <PlusIcon />
          </Button>
        )}
      </div>
      <div id={contentId} role="list" hidden={!isOpen}>
        {children}
      </div>
    </section>
  );
}

export {
  TaskRow,
  TaskList,
  TaskGroup,
  DueDate,
  ProjectTag,
  tagDotColors,
  dueInfo,
  daysFrom,
  startOfDay,
  isoDay,
  type TaskRowProps,
  type TaskGroupProps,
  type TagColor,
  type Person,
};
