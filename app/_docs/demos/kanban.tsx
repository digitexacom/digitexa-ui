"use client";

import * as React from "react";

import { KanbanBoard, KanbanCard, type KanbanColumnData } from "@/components/ui/kanban";
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
  return now ? <Board today={now} /> : <div className="h-[29rem] w-full" />;
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
