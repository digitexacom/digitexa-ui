import type { Metadata } from "next";
import { GanttChartIcon, PlusIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Stat, StatGroup } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { Progress } from "@/components/ui/progress";
import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { health, projects } from "../_shell/data";
import { ExampleShell } from "../_shell/shell";

export const metadata: Metadata = { title: "Workspace overview", description: "Example app built only from Digitexa UI components." };

const byStatus = [
  { status: "backlog", count: 6 },
  { status: "todo", count: 12 },
  { status: "progress", count: 9 },
  { status: "review", count: 5 },
  { status: "done", count: 24 },
] as const;
const totalTasks = byStatus.reduce((s, x) => s + x.count, 0);

const statusBar = {
  backlog: "bg-status-backlog",
  todo: "bg-status-todo",
  progress: "bg-status-progress",
  review: "bg-status-review",
  done: "bg-status-done",
} as const;

const workload = [
  { name: "Mira Okafor", todo: 3, progress: 3, review: 1 },
  { name: "Jonas Weber", todo: 2, progress: 2, review: 2 },
  { name: "Leyla Demir", todo: 3, progress: 1, review: 1 },
  { name: "Theo Martin", todo: 2, progress: 2, review: 0 },
  { name: "Ana Souza", todo: 1, progress: 1, review: 1 },
  { name: "Kenji Sato", todo: 1, progress: 0, review: 0 },
  { name: "Ruth Cohen", todo: 0, progress: 0, review: 0 },
];
const maxLoad = Math.max(...workload.map((w) => w.todo + w.progress + w.review));

const milestones = [
  { name: "Pricing page live", project: "Pricing launch", date: "Nov 04", status: "progress" },
  { name: "Checkout beta", project: "Storefront rebuild", date: "Nov 12", status: "review" },
  { name: "Driver app TestFlight", project: "Driver app", date: "Nov 21", status: "todo" },
] as const;

export default function OverviewExample() {
  const completed = projects.filter((p) => p.health === "completed").length;
  const done = byStatus.find((s) => s.status === "done")!.count;
  const open = totalTasks - done;

  return (
    <ExampleShell page="overview" title="Overview">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Workspace overview</h1>
              <p className="text-fg-muted">Health of every project at Northwind Studio.</p>
            </div>
            <div className="flex gap-2">
              <Button>
                <GanttChartIcon /> Timeline
              </Button>
              <Button variant="primary">
                <PlusIcon /> New project
              </Button>
            </div>
          </div>

          <StatGroup>
            <Stat label="Projects" value={projects.length} hint={`${completed} completed`} />
            <Stat label="Tasks" value={totalTasks} hint={`${open} open`} />
            <Stat label="Completion rate" value={`${Math.round((done / totalTasks) * 100)}%`} hint="across all projects" />
            <Stat label="Members" value={workload.length} hint="2 pending invites" />
          </StatGroup>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <Button size="sm" variant="ghost">
                  View all
                </Button>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Project</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-44">Progress</TableHead>
                    <TableHead className="text-right">Open</TableHead>
                    <TableHead className="text-right">Overdue</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((p) => {
                    const h = health[p.health];
                    return (
                      <TableRow key={p.name} className="h-[calc(var(--dx-row-height)+8px)]">
                        <TableCell>
                          <span className="flex items-center gap-2.5 font-medium">
                            <span className={`grid size-7 place-items-center rounded-md ${p.tint} [&_svg]:size-3.5`}>
                              <p.icon />
                            </span>
                            {p.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2 text-fg-muted">
                            <Avatar name={p.lead} size="sm" />
                            {p.lead.split(" ")[0]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={h.variant} dot>
                            {h.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <Progress
                              value={p.progress}
                              label={`${p.name} progress`}
                              tone={p.health === "completed" ? "success" : p.health === "at-risk" ? "danger" : p.health === "planning" ? "neutral" : "accent"}
                            />
                            <span className="w-9 text-right text-xs text-fg-muted tabular-nums">{p.progress}%</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{p.open}</TableCell>
                        <TableCell className={`text-right tabular-nums ${p.overdue ? "font-medium text-danger" : "text-fg-subtle"}`}>{p.overdue}</TableCell>
                        <TableCell className="text-right text-fg-muted tabular-nums">{p.due}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            <div className="flex flex-col gap-5">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks by status</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Meter
                    label="Tasks by status"
                    segments={byStatus.map((s) => ({ label: statusIconLabels[s.status], value: s.count, className: statusBar[s.status] }))}
                  />
                  <ul className="flex flex-col">
                    {byStatus.map((s) => (
                      <li key={s.status} className="flex h-8 items-center gap-2">
                        <StatusIcon status={s.status} label="" />
                        <span className="flex-1">{statusIconLabels[s.status]}</span>
                        <span className="w-8 text-right tabular-nums">{s.count}</span>
                        <span className="w-10 text-right text-fg-subtle tabular-nums">{Math.round((s.count / totalTasks) * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workload</CardTitle>
                  <CardDescription>Open tasks per person</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col">
                    {workload.map((w) => {
                      const total = w.todo + w.progress + w.review;
                      return (
                        <li key={w.name} className="flex h-8 items-center gap-2.5">
                          <Avatar name={w.name} size="sm" />
                          <span className="w-16 truncate">{w.name.split(" ")[0]}</span>
                          <Meter
                            className="h-1.5 flex-1"
                            max={maxLoad}
                            label={`${w.name} workload`}
                            segments={[
                              { label: "To do", value: w.todo, className: "bg-status-todo" },
                              { label: "In progress", value: w.progress, className: "bg-status-progress" },
                              { label: "In review", value: w.review, className: "bg-status-review" },
                            ]}
                          />
                          <span className="w-5 text-right tabular-nums">{total}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-3">
                    {milestones.map((m) => (
                      <li key={m.name} className="flex items-start gap-2.5">
                        <StatusIcon status={m.status} className="mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{m.name}</div>
                          <div className="text-xs text-fg-subtle">{m.project}</div>
                        </div>
                        <span className="text-xs text-fg-muted tabular-nums">{m.date}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ExampleShell>
  );
}
