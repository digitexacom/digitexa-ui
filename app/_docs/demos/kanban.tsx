"use client";

import * as React from "react";

import { KanbanBoard, KanbanCard, moveKanbanItem, type KanbanColumnData, type KanbanMove } from "@/components/ui/kanban";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { toast, Toaster } from "@/components/ui/toast";
import type { Priority } from "@/components/ui/priority";
import type { TagColor } from "@/components/ui/task-row";
import { useNow } from "@/lib/use-now";

// demo dates are relative to the viewer's today, so they never go stale
const dayFrom = (today: Date) => (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

type Card = {
  id: string;
  title: string;
  priority: Priority;
  labels?: { name: string; color: TagColor }[];
  assignees: string[];
  due?: Date;
  progress?: number;
};

const build = (day: (n: number) => Date): KanbanColumnData<Card>[] => [
  {
    id: "col-todo",
    title: "To do",
    status: "todo",
    items: [
      { id: "STR-150", title: "Product page image zoom", priority: "low", labels: [{ name: "Frontend", color: "info" }], assignees: ["Leyla Demir"], due: day(9) },
      { id: "DRV-91", title: "Push notification copy review", priority: "none", labels: [{ name: "Copy", color: "neutral" }], assignees: [] },
      { id: "PRC-35", title: "Annual billing toggle", priority: "medium", assignees: ["Theo Martin"], due: day(5) },
    ],
  },
  {
    id: "col-progress",
    title: "In progress",
    status: "progress",
    limit: 3,
    items: [
      {
        id: "STR-142",
        title: "Checkout: retry failed card payments",
        priority: "urgent",
        labels: [
          { name: "Payments", color: "danger" },
          { name: "Backend", color: "accent" },
        ],
        assignees: ["Mira Okafor", "Jonas Weber"],
        due: day(0),
        progress: 60,
      },
      { id: "PRC-31", title: "Compare plans table on mobile", priority: "high", labels: [{ name: "Frontend", color: "info" }], assignees: ["Theo Martin"], due: day(-2), progress: 35 },
      { id: "DRV-90", title: "Route ETA smoothing", priority: "medium", assignees: ["Kenji Sato"], due: day(4), progress: 20 },
      { id: "STR-147", title: "Gift card balance check", priority: "low", assignees: ["Ana Souza"], due: day(12) },
    ],
  },
  {
    id: "col-review",
    title: "In review",
    status: "review",
    items: [
      { id: "DRV-88", title: "Offline queue for delivery photos", priority: "medium", labels: [{ name: "Mobile", color: "review" }], assignees: ["Jonas Weber", "Ruth Cohen"], due: day(3), progress: 90 },
    ],
  },
  { id: "col-done", title: "Done", status: "done", items: [] },
];

export default function Demo() {
  const now = useNow();
  if (!now) return <div className="h-[29rem] w-full" />;
  return (
    <div className="flex w-full flex-col gap-10">
      <Board today={now} />
      <ServerBoard today={now} />
    </div>
  );
}

function Board({ today }: { today: Date }) {
  const [columns, setColumns] = React.useState(() => build(dayFrom(today)));
  return (
    <KanbanBoard
      className="w-full"
      columns={columns}
      onChange={setColumns}
      onAdd={() => {}}
      getItemLabel={(c) => c.title}
      renderCard={(c) => (
        <KanbanCard
          identifier={c.id}
          title={c.title}
          labels={c.labels}
          priority={c.priority}
          assignees={c.assignees.map((name) => ({ name }))}
          due={c.due}
          today={today}
          progress={c.progress}
          done={columns.find((col) => col.id === "col-done")?.items.some((i) => i.id === c.id)}
        />
      )}
    />
  );
}

/* ---------------------------------------------------------------------------------------------
 * Saving to a server: update the board right away (optimistic), send the request, and if it fails
 * put just that card back where it was and tell the user. Rolling back only the failed card (not
 * restoring a snapshot) keeps any other moves made in the meantime.
 * ------------------------------------------------------------------------------------------- */

// stand-in for your API: resolves after ~700ms, or rejects when `fail` is on
const saveMove = (fail: boolean) => new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new Error("503")) : resolve()), 700));

function ServerBoard({ today }: { today: Date }) {
  const [columns, setColumns] = React.useState(() => build(dayFrom(today)).map((c) => ({ ...c, items: c.items.slice(0, 2) })));
  const [saving, setSaving] = React.useState<Set<string>>(() => new Set());
  const [failRequests, setFailRequests] = React.useState(true);

  async function persist(move: KanbanMove<Card>, next: KanbanColumnData<Card>[]) {
    const id = move.item.id;
    setColumns(next); // 1. optimistic: the card is already where it was dropped
    setSaving((s) => new Set(s).add(id));
    try {
      await saveMove(failRequests); // 2. e.g. fetch(`/api/tasks/${id}`, { method: "PATCH", body: … })
    } catch {
      // 3. roll back only this card, then explain what happened
      setColumns((cur) => moveKanbanItem(cur, id, move.from));
      const from = columns.find((c) => c.id === move.from.columnId)?.title;
      toast.error(`Couldn't move “${move.item.title}”`, {
        description: `The server didn't respond, so it's back in ${from}.`,
        action: { label: "Retry", onClick: () => persist(move, moveKanbanItem(columnsRef.current, id, move.to)) },
      });
    } finally {
      setSaving((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }

  // the retry button runs later, so it needs the board as it is then
  const columnsRef = React.useRef(columns);
  React.useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-medium">Saving to a server</div>
          <div className="text-sm text-fg-muted">Optimistic move, then roll back the card if the request fails.</div>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="fail-requests" checked={failRequests} onCheckedChange={setFailRequests} />
          <Label htmlFor="fail-requests">Simulate server errors</Label>
        </div>
      </div>
      <KanbanBoard
        className="w-full"
        columns={columns}
        onMove={persist}
        getItemLabel={(c) => c.title}
        renderCard={(c) => (
          <KanbanCard identifier={c.id} title={c.title} priority={c.priority} assignees={c.assignees.map((name) => ({ name }))} className={saving.has(c.id) ? "opacity-70" : undefined}>
            {saving.has(c.id) && (
              <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
                <Spinner size="xs" aria-hidden /> Saving…
              </span>
            )}
          </KanbanCard>
        )}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}
