import type { Metadata } from "next";
import Link from "next/link";
import {
  ActivityIcon,
  ArchiveIcon,
  BookOpenIcon,
  BoxIcon,
  CalendarIcon,
  ChevronDownIcon,
  CodeIcon,
  FlagIcon,
  FolderIcon,
  GanttChartIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ListChecksIcon,
  ListIcon,
  LockIcon,
  MegaphoneIcon,
  PaletteIcon,
  PaperclipIcon,
  PlusIcon,
  RocketIcon,
  SettingsIcon,
  SmartphoneIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Stat, StatGroup } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Meter } from "@/components/ui/meter";
import { Progress } from "@/components/ui/progress";
import {
  AppShell,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
  Topbar,
} from "@/components/ui/sidebar";
import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { Notifications, SearchPalette, UserMenu, WorkspaceSwitcher } from "./chrome";

export const metadata: Metadata = { title: "Workspace overview", description: "Example app built only from Digitexa UI components." };

type Health = "on-track" | "planning" | "at-risk" | "completed";

const health: Record<Health, { label: string; variant: "info" | "neutral" | "danger" | "success" }> = {
  "on-track": { label: "On track", variant: "info" },
  planning: { label: "Planning", variant: "neutral" },
  "at-risk": { label: "At risk", variant: "danger" },
  completed: { label: "Completed", variant: "success" },
};

// icon tints reuse the status palette, so every accent and theme stays coherent
const tints = {
  todo: "bg-status-todo-subtle text-status-todo-fg",
  review: "bg-status-review-subtle text-status-review-fg",
  progress: "bg-status-progress-subtle text-status-progress-fg",
  done: "bg-status-done-subtle text-status-done-fg",
  danger: "bg-danger-subtle text-danger-fg-subtle",
} as const;

const projects = [
  { name: "Storefront rebuild", icon: GlobeIcon, tint: tints.todo, lead: "Mira Okafor", health: "on-track", progress: 58, open: 11, overdue: 2, due: "Nov 18", starred: true },
  { name: "Driver app", icon: SmartphoneIcon, tint: tints.review, lead: "Jonas Weber", health: "on-track", progress: 64, open: 5, overdue: 0, due: "Dec 09", starred: true },
  { name: "Spring campaign", icon: MegaphoneIcon, tint: tints.danger, lead: "Leyla Demir", health: "planning", progress: 12, open: 8, overdue: 1, due: "Jan 20" },
  { name: "Pricing launch", icon: RocketIcon, tint: tints.progress, lead: "Theo Martin", health: "at-risk", progress: 21, open: 7, overdue: 3, due: "Nov 04" },
  { name: "Component library", icon: PaletteIcon, tint: tints.review, lead: "Mira Okafor", health: "on-track", progress: 37, open: 6, overdue: 0, due: "Dec 30" },
  { name: "Help center", icon: BookOpenIcon, tint: tints.done, lead: "Leyla Demir", health: "completed", progress: 100, open: 0, overdue: 0, due: "Oct 02", locked: true },
] as const satisfies readonly {
  name: string;
  icon: typeof GlobeIcon;
  tint: string;
  lead: string;
  health: Health;
  progress: number;
  open: number;
  overdue: number;
  due: string;
  starred?: boolean;
  locked?: boolean;
}[];

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

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup title="Workspace">
          <SidebarItem href="#" icon={<LayoutDashboardIcon />} active>
            Overview
          </SidebarItem>
          <SidebarItem href="#" icon={<FolderIcon />}>Projects</SidebarItem>
          <SidebarItem href="#" icon={<ListChecksIcon />} trailing="12">
            My tasks
          </SidebarItem>
          <SidebarItem href="#" icon={<CalendarIcon />}>Calendar</SidebarItem>
          <SidebarItem href="#" icon={<GanttChartIcon />}>Timeline</SidebarItem>
          <SidebarItem href="#" icon={<UsersIcon />}>Members</SidebarItem>
          <SidebarItem href="#" icon={<ActivityIcon />}>Activity</SidebarItem>
        </SidebarGroup>

        <SidebarGroup
          title="Projects"
          action={
            <Tooltip content="New project">
              <Button size="icon-sm" variant="ghost" className="-mr-1 size-5" aria-label="New project">
                <PlusIcon />
              </Button>
            </Tooltip>
          }
        >
          {projects.slice(0, 1).map((p) => (
            <SidebarItem
              key={p.name}
              href="#"
              icon={<span className={`grid size-4.5 place-items-center rounded-sm ${p.tint} [&_svg]:size-3!`}><p.icon /></span>}
              trailing={<StarIcon className="size-3! fill-current text-status-progress!" />}
            >
              {p.name}
            </SidebarItem>
          ))}
          <SidebarItem href="#" icon={<LayoutGridIcon />} depth={1}>Board</SidebarItem>
          <SidebarItem href="#" icon={<ListIcon />} depth={1}>List</SidebarItem>
          <SidebarItem href="#" icon={<GanttChartIcon />} depth={1}>Timeline</SidebarItem>
          <SidebarItem href="#" icon={<PaperclipIcon />} depth={1}>Files</SidebarItem>
          {projects.slice(1).map((p) => (
            <SidebarItem
              key={p.name}
              href="#"
              icon={<span className={`grid size-4.5 place-items-center rounded-sm ${p.tint} [&_svg]:size-3!`}><p.icon /></span>}
              trailing={
                "locked" in p && p.locked ? <LockIcon className="size-3!" aria-label="Private" /> : "starred" in p && p.starred ? <StarIcon className="size-3! fill-current text-status-progress!" /> : null
              }
            >
              {p.name}
            </SidebarItem>
          ))}
          <SidebarItem href="#" icon={<ArchiveIcon />}>Archive</SidebarItem>
        </SidebarGroup>

        <SidebarGroup title="Teams">
          <SidebarItem href="#" icon={<PaletteIcon />}>Design</SidebarItem>
          <SidebarItem href="#" icon={<CodeIcon />}>Engineering</SidebarItem>
          <SidebarItem href="#" icon={<MegaphoneIcon />}>Marketing</SidebarItem>
          <SidebarItem href="#" icon={<BoxIcon />}>Product</SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem href="#" icon={<SettingsIcon />}>Settings</SidebarItem>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function AppTopbar() {
  return (
    <Topbar>
      <SidebarTrigger />
      <Link href="/" className="text-sm text-fg-subtle hover:text-fg max-sm:hidden">
        Docs
      </Link>
      <span className="text-fg-subtle max-sm:hidden">/</span>
      <span className="font-medium">Overview</span>
      <div className="ml-auto flex items-center gap-2">
        <SearchPalette />
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusIcon /> New <ChevronDownIcon className="text-fg-subtle" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ListChecksIcon /> Task <DropdownMenuShortcut>C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderIcon /> Project <DropdownMenuShortcut>P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FlagIcon /> Milestone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Topbar>
  );
}

export default function OverviewExample() {
  const completed = projects.filter((p) => p.health === "completed").length;
  const done = byStatus.find((s) => s.status === "done")!.count;
  const open = totalTasks - done;

  return (
    <AppShell sidebar={<AppSidebar />}>
      <AppTopbar />
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
                      <TableRow key={p.name} className="h-12">
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
    </AppShell>
  );
}
