"use client";

import * as React from "react";

import { statusIconLabels, type StatusIconStatus } from "@/components/ui/status-icon";
import { TaskGroup, TaskList, TaskRow, type TagColor } from "@/components/ui/task-row";
import type { Priority } from "@/components/ui/priority";
import { useNow } from "@/lib/use-now";

// demo dates are relative to the viewer's today, so they never go stale
const dayFrom = (today: Date) => (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

type Task = {
  id: string;
  title: string;
  status: StatusIconStatus;
  priority: Priority;
  project: { name: string; color: TagColor };
  assignee?: string;
  due?: Date;
};

const storefront = { name: "Storefront rebuild", color: "todo" } as const;
const driver = { name: "Driver app", color: "review" } as const;
const pricing = { name: "Pricing launch", color: "progress" } as const;

const build = (day: (n: number) => Date): Task[] => [
  { id: "STR-142", title: "Checkout: retry failed card payments", status: "progress", priority: "urgent", project: storefront, assignee: "Mira Okafor", due: day(0) },
  { id: "PRC-31", title: "Compare plans table on mobile", status: "progress", priority: "high", project: pricing, assignee: "Theo Martin", due: day(-2) },
  { id: "DRV-88", title: "Offline queue for delivery photos", status: "review", priority: "medium", project: driver, assignee: "Jonas Weber", due: day(3) },
  { id: "STR-150", title: "Product page image zoom", status: "todo", priority: "low", project: storefront, assignee: "Leyla Demir", due: day(9) },
  { id: "DRV-91", title: "Push notification copy review", status: "todo", priority: "none", project: driver },
  { id: "STR-133", title: "Migrate cart to the new API", status: "done", priority: "high", project: storefront, assignee: "Ana Souza", due: day(-4) },
];

const order: StatusIconStatus[] = ["progress", "review", "todo", "done"];

export default function Demo() {
  const now = useNow();
  return now ? <Tasks today={now} /> : <div className="h-[19rem] w-full rounded-lg border border-border bg-surface" />;
}

function Tasks({ today }: { today: Date }) {
  const [tasks, setTasks] = React.useState(() => build(dayFrom(today)));
  const [selected, setSelected] = React.useState<string | null>("DRV-88");
  const setStatus = (id: string, status: StatusIconStatus) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));

  return (
    <TaskList className="w-full">
      {order.map((status) => {
        const group = tasks.filter((t) => t.status === status);
        return (
          <TaskGroup key={status} title={statusIconLabels[status]} status={status} count={group.length} defaultOpen={status !== "done"} onAdd={() => {}}>
            {group.map((t) => (
              <TaskRow
                key={t.id}
                identifier={t.id}
                title={t.title}
                status={t.status}
                priority={t.priority}
                project={t.project}
                assignee={t.assignee ? { name: t.assignee } : undefined}
                due={t.due}
                today={today}
                selected={selected === t.id}
                onClick={() => setSelected(t.id)}
                onStatusChange={(next) => setStatus(t.id, next)}
              />
            ))}
          </TaskGroup>
        );
      })}
    </TaskList>
  );
}
