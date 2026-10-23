"use client";

import * as React from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRightLeftIcon, CheckIcon, PlusIcon } from "lucide-react";

import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityIcon, priorityLabels, type Priority } from "@/components/ui/priority";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusIcon, type StatusIconStatus } from "@/components/ui/status-icon";
import { DueDate, type Person, type TagColor } from "@/components/ui/task-row";
import { cn } from "@/lib/utils";

type KanbanItem = { id: UniqueIdentifier };

type KanbanColumnData<T extends KanbanItem> = {
  /** Must not collide with any item id. */
  id: UniqueIdentifier;
  title: string;
  status?: StatusIconStatus;
  /** WIP limit: the count turns red above it. */
  limit?: number;
  items: T[];
};

type KanbanMove<T extends KanbanItem> = {
  item: T;
  from: { columnId: UniqueIdentifier; index: number };
  to: { columnId: UniqueIdentifier; index: number };
};

type KanbanBoardProps<T extends KanbanItem> = Omit<React.ComponentProps<"div">, "onChange" | "children"> & {
  columns: KanbanColumnData<T>[];
  renderCard: (item: T, state: { overlay: boolean; dragging: boolean }) => React.ReactNode;
  /** Receives the full next state after a drop. */
  onChange?: (columns: KanbanColumnData<T>[]) => void;
  /** Same drop, described as a single move. Not called when the card ends where it started. */
  onMove?: (move: KanbanMove<T>, columns: KanbanColumnData<T>[]) => void;
  onAdd?: (columnId: UniqueIdentifier) => void;
  /** Text used in screen-reader announcements, e.g. the card title. */
  getItemLabel?: (item: T) => string;
  /** Width of every column on desktop; any CSS length. Below 768px columns take 88% of the board and snap. */
  columnWidth?: string;
  /** Text for the touch "move" action and its sheet, for translation. */
  labels?: { move?: string; moveTitle?: string; moveDescription?: string };
};

function findColumn<T extends KanbanItem>(columns: KanbanColumnData<T>[], id: UniqueIdentifier) {
  return columns.find((c) => c.id === id) ?? columns.find((c) => c.items.some((i) => i.id === id));
}

function locate<T extends KanbanItem>(columns: KanbanColumnData<T>[], id: UniqueIdentifier) {
  for (const c of columns) {
    const index = c.items.findIndex((i) => i.id === id);
    if (index !== -1) return { columnId: c.id, index, item: c.items[index] };
  }
  return null;
}

/** Board of sortable columns. Drag with the pointer, or focus a card and use Space + arrow keys. */
function KanbanBoard<T extends KanbanItem>({
  columns,
  renderCard,
  onChange,
  onMove,
  onAdd,
  getItemLabel,
  columnWidth = "18rem",
  labels,
  className,
  style,
  ...props
}: KanbanBoardProps<T>) {
  // While dragging, the board shows a local draft; the parent only hears about the final drop.
  const [draft, setDraft] = React.useState<KanbanColumnData<T>[] | null>(null);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const origin = React.useRef<ReturnType<typeof locate<T>>>(null);
  const shown = draft ?? columns;
  const dndId = React.useId();
  // dnd-kit needs a number, so the drop animation reads --dx-motion (0 under reduced motion) at drag start
  const [dropMs, setDropMs] = React.useState(170);

  // Mouse drags after 4px; touch needs a ~250ms press so a swipe still scrolls the page and the board.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const boardRef = React.useRef<HTMLDivElement>(null);
  const [visibleColumn, setVisibleColumn] = React.useState<UniqueIdentifier | null>(null);
  const [moving, setMoving] = React.useState<UniqueIdentifier | null>(null);

  // a column's left edge in the board's scroll coordinates
  const columnOffset = (board: HTMLElement, el: HTMLElement) => el.getBoundingClientRect().left - board.getBoundingClientRect().left + board.scrollLeft;

  // mobile chips: the column whose left edge is nearest the scroll position is the current one
  function updateVisibleColumn() {
    const board = boardRef.current;
    if (!board) return;
    let best: { id: string | null; d: number } = { id: null, d: Infinity };
    for (const el of board.querySelectorAll<HTMLElement>("[data-slot=kanban-column]")) {
      const d = Math.abs(columnOffset(board, el) - board.scrollLeft);
      if (d < best.d) best = { id: el.dataset.columnId ?? null, d };
    }
    if (best.id) setVisibleColumn(best.id);
  }

  function scrollToColumn(id: UniqueIdentifier) {
    const board = boardRef.current;
    const el = board?.querySelector<HTMLElement>(`[data-column-id="${globalThis.CSS.escape(String(id))}"]`);
    if (!board || !el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce";
    board.scrollTo({ left: columnOffset(board, el), behavior: reduce ? "auto" : "smooth" });
    setVisibleColumn(String(id));
  }

  // touch alternative to dragging: pick a column from a sheet
  function moveTo(itemId: UniqueIdentifier, columnId: UniqueIdentifier) {
    const start = locate(columns, itemId);
    if (!start || start.columnId === columnId) return;
    const next = columns.map((c) => {
      if (c.id === start.columnId) return { ...c, items: c.items.filter((i) => i.id !== itemId) };
      if (c.id === columnId) return { ...c, items: [...c.items, start.item] };
      return c;
    });
    const end = locate(next, itemId)!;
    onChange?.(next);
    onMove?.({ item: start.item, from: { columnId: start.columnId, index: start.index }, to: { columnId, index: end.index } }, next);
  }

  const labelOf = (id: UniqueIdentifier) => {
    const hit = locate(shown, id);
    return hit && getItemLabel ? getItemLabel(hit.item) : `card ${id}`;
  };
  const columnTitle = (id: UniqueIdentifier | undefined) => (id === undefined ? "" : (findColumn(shown, id)?.title ?? ""));
  const positionIn = (id: UniqueIdentifier) => {
    const col = findColumn(shown, id);
    const hit = locate(shown, id);
    if (!col) return "";
    return hit ? `${col.title}, position ${hit.index + 1} of ${col.items.length}` : col.title;
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${labelOf(active.id)} in ${positionIn(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${labelOf(active.id)} is over ${positionIn(over.id)}.` : `${labelOf(active.id)} is no longer over a column.`),
    onDragEnd: ({ active, over }) =>
      over ? `Dropped ${labelOf(active.id)} in ${columnTitle(over.id)}.` : `Dropped ${labelOf(active.id)}. It stayed in place.`,
    onDragCancel: ({ active }) => `Moving ${labelOf(active.id)} was cancelled.`,
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    setDraft(columns);
    const motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dx-motion"));
    if (!Number.isNaN(motion)) setDropMs(motion);
    origin.current = locate(columns, active.id);
  }

  // Cross-column moves happen live so the card shows where it will land.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    setDraft((prev) => {
      const cols = prev ?? columns;
      const from = findColumn(cols, active.id);
      const to = findColumn(cols, over.id);
      if (!from || !to || from.id === to.id) return prev;
      const item = from.items.find((i) => i.id === active.id);
      if (!item) return prev;
      const overIndex = to.items.findIndex((i) => i.id === over.id);
      const insertAt = overIndex === -1 ? to.items.length : overIndex;
      return cols.map((c) => {
        if (c.id === from.id) return { ...c, items: c.items.filter((i) => i.id !== active.id) };
        if (c.id === to.id) return { ...c, items: [...c.items.slice(0, insertAt), item, ...c.items.slice(insertAt)] };
        return c;
      });
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    let next = draft ?? columns;
    if (over) {
      const col = findColumn(next, active.id);
      if (col) {
        const fromIndex = col.items.findIndex((i) => i.id === active.id);
        const overIndex = col.items.findIndex((i) => i.id === over.id);
        if (overIndex !== -1 && overIndex !== fromIndex) {
          next = next.map((c) => (c.id === col.id ? { ...c, items: arrayMove(c.items, fromIndex, overIndex) } : c));
        }
      }
    } else {
      next = columns;
    }
    const start = origin.current;
    const end = locate(next, active.id);
    setDraft(null);
    setActiveId(null);
    origin.current = null;
    if (!start || !end || (start.columnId === end.columnId && start.index === end.index)) return;
    onChange?.(next);
    onMove?.({ item: end.item, from: { columnId: start.columnId, index: start.index }, to: { columnId: end.columnId, index: end.index } }, next);
  }

  function handleDragCancel() {
    setDraft(null);
    setActiveId(null);
    origin.current = null;
  }

  const activeItem = activeId === null ? null : (locate(shown, activeId)?.item ?? null);

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCorners}
      // scroll the board (and page) when a dragged card nears an edge
      autoScroll={{ threshold: { x: 0.18, y: 0.15 }, acceleration: 14 }}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: "To pick up a card, press Space or Enter. Use the arrow keys to move it within or between columns. Press Space or Enter again to drop it, or Escape to cancel.",
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* mobile: one chip per column, tap to jump */}
      <div data-slot="kanban-chips" className="mb-2 flex gap-1.5 overflow-x-auto pb-1 md:hidden" role="tablist" aria-label="Columns">
        {shown.map((col) => (
          <button
            key={col.id}
            role="tab"
            aria-selected={(visibleColumn ?? String(shown[0]?.id)) === String(col.id)}
            onClick={() => scrollToColumn(col.id)}
            className={cn(
              "flex h-(--dx-control-md) shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm whitespace-nowrap text-fg-muted",
              "aria-selected:border-transparent aria-selected:bg-fg aria-selected:text-bg",
            )}
          >
            {col.status && <StatusIcon status={col.status} label="" className="size-3" />}
            {col.title}
            <span className="tabular-nums opacity-70">{col.items.length}</span>
          </button>
        ))}
      </div>
      <div
        ref={boardRef}
        onScroll={updateVisibleColumn}
        data-slot="kanban-board"
        data-dragging={activeId !== null || undefined}
        className={cn(
          "flex items-start gap-3 overflow-x-auto pb-2",
          // mobile: near-full-width columns that snap; snapping pauses while a card is dragged so edge auto-scroll works
          "max-md:snap-x max-md:snap-mandatory max-md:scroll-px-0 max-md:data-dragging:snap-none",
          className,
        )}
        style={{ ["--dx-kanban-column" as string]: columnWidth, ...style }}
        {...props}
      >
        {shown.map((col) => (
          <DroppableColumn key={col.id} column={col} onAdd={onAdd ? () => onAdd(col.id) : undefined}>
            {col.items.map((item) => (
              <SortableCard key={item.id} id={item.id} label={getItemLabel?.(item)} moveLabel={labels?.move ?? "Move"} onMoveRequest={() => setMoving(item.id)}>
                {(dragging) => renderCard(item, { overlay: false, dragging })}
              </SortableCard>
            ))}
          </DroppableColumn>
        ))}
      </div>
      <Sheet open={moving !== null} onOpenChange={(open) => !open && setMoving(null)}>
        <SheetContent side="bottom" className="pb-[env(safe-area-inset-bottom)]">
          <SheetHeader>
            <SheetTitle>{labels?.moveTitle ?? "Move to"}</SheetTitle>
            <SheetDescription>{moving !== null ? labelOf(moving) : ""}{labels?.moveDescription ? ` · ${labels.moveDescription}` : ""}</SheetDescription>
          </SheetHeader>
          <SheetBody className="flex flex-col gap-1">
            {shown.map((col) => {
              const current = moving !== null && findColumn(shown, moving)?.id === col.id;
              return (
                <button
                  key={col.id}
                  aria-current={current || undefined}
                  onClick={() => {
                    if (moving !== null) moveTo(moving, col.id);
                    setMoving(null);
                  }}
                  className="flex h-11 items-center gap-2.5 rounded-md px-2 text-left text-md hover:bg-muted aria-[current=true]:bg-selected"
                >
                  {col.status && <StatusIcon status={col.status} label="" />}
                  <span className="flex-1">{col.title}</span>
                  <span className="text-sm text-fg-subtle tabular-nums">{col.items.length}</span>
                  {current && <CheckIcon className="size-4 text-fg" />}
                </button>
              );
            })}
          </SheetBody>
        </SheetContent>
      </Sheet>
      <DragOverlay dropAnimation={{ duration: dropMs, easing: "cubic-bezier(0.22, 0.9, 0.3, 1)" /* = --dx-motion-ease; WAAPI cannot read vars */ }}>
        {activeItem ? (
          <div data-slot="kanban-overlay" className="cursor-grabbing rounded-md shadow-lg [&>*]:shadow-none">
            {renderCard(activeItem, { overlay: true, dragging: true })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn<T extends KanbanItem>({
  column,
  onAdd,
  children,
}: {
  column: KanbanColumnData<T>;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <KanbanColumn
      data-column-id={String(column.id)}
      title={column.title}
      status={column.status}
      count={column.items.length}
      limit={column.limit}
      onAdd={onAdd}
      bodyRef={setNodeRef}
      data-over={isOver || undefined}
    >
      <SortableContext items={column.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {column.items.length === 0 && (
        <div className="grid h-16 place-items-center rounded-md border border-dashed border-border-strong text-xs text-fg-subtle">Drop cards here</div>
      )}
    </KanbanColumn>
  );
}

function SortableCard({
  id,
  label,
  moveLabel,
  onMoveRequest,
  children,
}: {
  id: UniqueIdentifier;
  label?: string;
  moveLabel: string;
  onMoveRequest: () => void;
  children: (dragging: boolean) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  // keep presses on the move button from starting a drag (mouse, touch or keyboard)
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div
      ref={setNodeRef}
      data-slot="kanban-item"
      data-dragging={isDragging || undefined}
      {...attributes}
      {...listeners}
      aria-roledescription="sortable card"
      aria-label={label}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        // no touch-none: the page scrolls under a finger; dragging starts after a long press
        "group/item relative rounded-md outline-none select-none focus-visible:ring-2 focus-visible:ring-ring [-webkit-touch-callout:none]",
        // the card left behind becomes a placeholder
        "data-dragging:opacity-40 data-dragging:[&>*]:border-dashed",
        // keep card text clear of the move button
        "pointer-coarse:[&>*:first-child]:pr-10",
      )}
    >
      {children(isDragging)}
      {/* touch screens get an explicit move action next to long-press dragging */}
      <button
        type="button"
        aria-label={label ? `${moveLabel}: ${label}` : moveLabel}
        onClick={onMoveRequest}
        onPointerDown={stop}
        onMouseDown={stop}
        onTouchStart={stop}
        onKeyDown={stop}
        className="absolute top-1.5 right-1.5 hidden size-7 place-items-center rounded-md border border-border bg-surface text-fg-muted shadow-sm pointer-coarse:grid"
      >
        <ArrowRightLeftIcon className="size-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------- column shell */

type KanbanColumnProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: string;
  status?: StatusIconStatus;
  count?: number;
  limit?: number;
  onAdd?: () => void;
  /** Ref for the card area (the drop target). */
  bodyRef?: React.Ref<HTMLDivElement>;
};

/** Column frame: header with status, title, count / WIP limit and add button; cards go in children. */
function KanbanColumn({ title, status, count, limit, onAdd, bodyRef, className, children, ...props }: KanbanColumnProps) {
  const over = limit !== undefined && count !== undefined && count > limit;
  return (
    <section
      data-slot="kanban-column"
      aria-label={title}
      className={cn(
        "flex max-h-full w-(--dx-kanban-column,18rem) shrink-0 flex-col rounded-lg bg-bg-subtle",
        // mobile: 88% of the board, so the next column peeks in
        "max-md:w-[88%] max-md:snap-start",
        "transition-[box-shadow] duration-(--dx-motion-fast) data-over:ring-1 data-over:ring-border-strong",
        className,
      )}
      {...props}
    >
      <header className="flex h-(--dx-control-lg) shrink-0 items-center gap-2 pr-1.5 pl-3">
        {status && <StatusIcon status={status} label="" />}
        <h3 className="truncate text-base font-medium">{title}</h3>
        {count !== undefined && (
          <span
            className={cn("text-sm text-fg-subtle tabular-nums", over && "rounded-sm bg-danger-subtle px-1 font-medium text-danger-fg-subtle")}
            title={over ? `Over the WIP limit of ${limit}` : undefined}
          >
            {count}
            {limit !== undefined && `/${limit}`}
          </span>
        )}
        {onAdd && (
          <Button size="icon-sm" variant="ghost" className="ml-auto" aria-label={`Add card to ${title}`} onClick={onAdd}>
            <PlusIcon />
          </Button>
        )}
      </header>
      <div ref={bodyRef} className="flex min-h-16 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- card */

type KanbanCardProps = Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  identifier?: string;
  labels?: { name: string; color?: TagColor }[];
  priority?: Priority;
  assignees?: Person[];
  due?: Date;
  today?: Date;
  /** 0–100; renders a thin bar. */
  progress?: number;
  done?: boolean;
};

/** Presentational card for renderCard. */
function KanbanCard({ title, identifier, labels, priority, assignees, due, today, progress, done, className, children, ...props }: KanbanCardProps) {
  const hasFooter = due || priority || (assignees && assignees.length > 0);
  return (
    <div
      data-slot="kanban-card"
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-surface p-2.5 text-base shadow-sm",
        "transition-[border-color] duration-(--dx-motion-fast) hover:border-border-strong",
        className,
      )}
      {...props}
    >
      {identifier && <span className="text-xs text-fg-subtle tabular-nums">{identifier}</span>}
      <div className={cn("line-clamp-2 font-medium", done && "text-fg-subtle line-through")}>{title}</div>
      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {labels.map((l) => (
            <Badge key={l.name} variant={l.color ?? "neutral"}>
              {l.name}
            </Badge>
          ))}
        </div>
      )}
      {children}
      {progress !== undefined && (
        <div className="flex items-center gap-2">
          <Progress value={progress} label="Progress" tone={progress >= 100 ? "success" : "accent"} className="h-1" />
          <span className="text-2xs text-fg-subtle tabular-nums">{Math.round(progress)}%</span>
        </div>
      )}
      {hasFooter && (
        <div className="flex items-center gap-2">
          {priority && <PriorityIcon priority={priority} label={`Priority: ${priorityLabels[priority]}`} />}
          {due && <DueDate date={due} today={today} done={done} />}
          {assignees && assignees.length > 0 && (
            <AvatarGroup max={3} className="ml-auto">
              {assignees.map((a) => (
                <Avatar key={a.name} name={a.name} src={a.src} size="sm" />
              ))}
            </AvatarGroup>
          )}
        </div>
      )}
    </div>
  );
}

export { KanbanBoard, KanbanColumn, KanbanCard, type KanbanBoardProps, type KanbanColumnData, type KanbanItem, type KanbanMove, type KanbanCardProps };
