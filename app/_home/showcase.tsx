"use client";

import * as React from "react";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  ChartColumnIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  FileTextIcon,
  FlagIcon,
  FolderIcon,
  GanttChartIcon,
  InboxIcon,
  LayoutGridIcon,
  ListChecksIcon,
  MessagesSquareIcon,
  PaletteIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { ActivityFeed, ActivityItem, ActivityStatus, ActivityTarget } from "@/components/ui/activity-feed";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupIcon, InputGroupInput } from "@/components/ui/input-group";
import { Meter } from "@/components/ui/meter";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { Switch } from "@/components/ui/switch";
import { TaskRow } from "@/components/ui/task-row";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast, Toaster } from "@/components/ui/toast";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

// Every card here is built only from kit components and tokens.

function Tile({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn("mb-5 break-inside-avoid", className)} {...props} />;
}

function ControlsCard() {
  return (
    <Tile>
      <CardContent className="flex flex-col gap-4 pt-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">
            Button <ArrowRightIcon />
          </Button>
          <Button variant="soft">Soft</Button>
          <Button>Secondary</Button>
        </div>
        <InputGroup>
          <InputGroupInput aria-label="Search tasks" placeholder="Search tasks…" />
          <InputGroupIcon>
            <SearchIcon />
          </InputGroupIcon>
        </InputGroup>
        <Textarea aria-label="Message" placeholder="Message" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            <Badge variant="accent">Badge</Badge>
            <StatusBadge status="review" />
          </div>
          <div className="flex items-center gap-2.5">
            <RadioGroup defaultValue="a" aria-label="Pick one" className="flex gap-2">
              <RadioGroupItem value="a" aria-label="Option A" />
              <RadioGroupItem value="b" aria-label="Option B" />
            </RadioGroup>
            <Checkbox defaultChecked aria-label="Checked" />
            <Switch defaultChecked aria-label="Enabled" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Alert dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive “Spring campaign”?</AlertDialogTitle>
                <AlertDialogDescription>It moves out of the sidebar. You can restore it from Archive.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success("Project archived")}>Archive</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <ToggleGroup type="single" defaultValue="board" aria-label="View">
            <ToggleGroupItem value="board">
              <LayoutGridIcon /> Board
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <ListChecksIcon /> List
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Tile>
  );
}

const weeks = [
  { label: "W38", done: 9 },
  { label: "W39", done: 14 },
  { label: "W40", done: 11 },
  { label: "W41", done: 17 },
  { label: "W42", done: 13 },
  { label: "W43", done: 19 },
];

function VelocityCard() {
  const max = Math.max(...weeks.map((w) => w.done));
  return (
    <Tile>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>Tasks completed</CardTitle>
        <CardDescription>Last 6 weeks, all projects</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-40 items-end gap-2" role="img" aria-label={weeks.map((w) => `${w.label}: ${w.done}`).join(", ")}>
          {weeks.map((w, i) => (
            <div key={w.label} className="flex h-full flex-1 flex-col items-center gap-1.5">
              {/* the bar's % height needs a parent with a definite height: this flex-1 box */}
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-md bg-accent"
                  style={{ height: `${(w.done / max) * 100}%`, opacity: 0.35 + (i / (weeks.length - 1)) * 0.65 }}
                />
              </div>
              <span className="text-2xs text-fg-subtle">{w.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-bg-subtle p-3">
            <div className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">Next milestone</div>
            <div className="mt-1 font-semibold">Checkout beta</div>
            <div className="text-xs text-fg-muted">Nov 12</div>
          </div>
          <div className="rounded-md bg-bg-subtle p-3">
            <div className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">Velocity</div>
            <div className="mt-1 font-semibold">+23%</div>
            <div className="text-xs text-success-fg">vs. last sprint</div>
          </div>
        </div>
        <Button className="w-full">
          <ChartColumnIcon /> View full report
        </Button>
      </CardContent>
    </Tile>
  );
}

function MilestoneCard() {
  return (
    <Tile>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>Plan a milestone</CardTitle>
        <CardDescription>Group tasks around a date the team can aim for.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldControl>
            <Input placeholder="e.g. Checkout beta" />
          </FieldControl>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel>Project</FieldLabel>
            <Select defaultValue="storefront">
              <FieldControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FieldControl>
              <SelectContent>
                <SelectItem value="storefront">Storefront</SelectItem>
                <SelectItem value="driver">Driver app</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Target date</FieldLabel>
            <FieldControl>
              <DatePicker placeholder="Pick a date" />
            </FieldControl>
          </Field>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 border-0 pt-0">
        <Button variant="primary" className="w-full" onClick={() => toast.success("Milestone created", { description: "Added to Storefront rebuild." })}>
          Create milestone
        </Button>
        <Button variant="ghost" className="w-full">
          Cancel
        </Button>
      </CardFooter>
    </Tile>
  );
}

function NavCard({ title, items, active }: { title: string; items: { label: string; icon: React.ComponentType }[]; active?: string }) {
  return (
    <Tile className="mb-0">
      <CardContent className="flex flex-col gap-0.5 pt-3.5 pb-3">
        <div className="px-2 pb-1 text-sm text-fg-subtle">{title}</div>
        {items.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-current={active === label ? "page" : undefined}
            className="flex h-(--dx-control-md) items-center gap-2 rounded-md px-2 text-fg-muted hover:bg-muted hover:text-fg aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-fg [&_svg]:size-4"
          >
            <Icon /> {label}
          </a>
        ))}
      </CardContent>
    </Tile>
  );
}

function NavCards() {
  return (
    <div className="mb-5 grid break-inside-avoid grid-cols-2 gap-4">
      <NavCard
        title="Planning"
        active="Timeline"
        items={[
          { label: "My tasks", icon: ListChecksIcon },
          { label: "Projects", icon: FolderIcon },
          { label: "Timeline", icon: GanttChartIcon },
          { label: "Calendar", icon: CalendarIcon },
          { label: "Milestones", icon: FlagIcon },
        ]}
      />
      <NavCard
        title="Account"
        items={[
          { label: "Profile", icon: UserIcon },
          { label: "Members", icon: UsersIcon },
          { label: "Appearance", icon: PaletteIcon },
          { label: "Security", icon: ShieldIcon },
          { label: "Help", icon: CircleHelpIcon },
        ]}
      />
    </div>
  );
}

function ProjectCard() {
  return (
    <Tile>
      <CardHeader>
        <div>
          <CardTitle>Storefront rebuild</CardTitle>
          <CardDescription>Due Nov 18 · 11 open tasks</CardDescription>
        </div>
        <Badge variant="info" dot>
          On track
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">58%</div>
        <Progress value={58} label="Storefront rebuild progress" />
        <Meter
          label="Tasks by status"
          segments={(["backlog", "todo", "progress", "review", "done"] as const).map((s, i) => ({
            label: statusIconLabels[s],
            value: [3, 5, 4, 2, 12][i],
            className: `bg-status-${s}`,
          }))}
        />
        <ul className="flex flex-col gap-1.5 text-sm">
          {(["todo", "progress", "review", "done"] as const).map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <StatusIcon status={s} label="" />
              <span className="flex-1 text-fg-muted">{statusIconLabels[s]}</span>
              <span className="tabular-nums">{[5, 4, 2, 12][i]}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <AvatarGroup max={4}>
          {["Mira Okafor", "Jonas Weber", "Leyla Demir", "Theo Martin", "Ana Souza"].map((n) => (
            <Avatar key={n} name={n} />
          ))}
        </AvatarGroup>
        <Button size="sm" variant="ghost" className="ml-auto">
          Open <ArrowRightIcon />
        </Button>
      </CardFooter>
    </Tile>
  );
}

function CapacityCard() {
  const [hours, setHours] = React.useState([32]);
  return (
    <Tile>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>Weekly capacity</CardTitle>
        <CardDescription>Hours Mira can take on per week.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-fg-muted">Capacity</span>
          <span className="text-2xl font-semibold tabular-nums">{hours[0]}h</span>
        </div>
        <Slider value={hours} onValueChange={setHours} min={8} max={40} step={4} aria-label="Weekly hours" />
        <div className="flex justify-between text-xs text-fg-subtle">
          <span>8h (min)</span>
          <span>40h (max)</span>
        </div>
        <Field orientation="horizontal">
          <FieldControl>
            <Switch defaultChecked />
          </FieldControl>
          <FieldLabel>Warn me when I&apos;m over capacity</FieldLabel>
        </Field>
      </CardContent>
    </Tile>
  );
}

function TasksCard({ today }: { today: Date | null }) {
  const day = (n: number) => (today ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + n) : undefined);
  const [done, setDone] = React.useState<string[]>([]);
  const tasks = [
    { id: "STR-142", title: "Retry failed card payments", status: "progress", priority: "urgent", project: { name: "Storefront", color: "todo" }, due: day(0) },
    { id: "PRC-31", title: "Compare plans table on mobile", status: "todo", priority: "high", project: { name: "Pricing", color: "progress" }, due: day(-1) },
    { id: "DRV-88", title: "Offline photo queue", status: "review", priority: "medium", project: { name: "Driver app", color: "review" }, due: day(3) },
  ] as const;
  return (
    <Tile>
      <CardHeader>
        <CardTitle>My tasks</CardTitle>
        <Badge>3 open</Badge>
      </CardHeader>
      <div role="list" className="border-t border-border">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            identifier={t.id}
            title={t.title}
            status={done.includes(t.id) ? "done" : t.status}
            priority={t.priority}
            project={t.project}
            assignee={{ name: "Mira Okafor" }}
            due={t.due}
            today={today ?? undefined}
            onStatusChange={() => setDone((d) => (d.includes(t.id) ? d.filter((x) => x !== t.id) : [...d, t.id]))}
          />
        ))}
      </div>
    </Tile>
  );
}

function CalendarCard() {
  return (
    <Tile>
      <CardContent className="flex justify-center pt-3">
        <Calendar mode="range" />
      </CardContent>
    </Tile>
  );
}

function ActivityCard({ now }: { now: Date | null }) {
  return (
    <Tile>
      <CardHeader>
        <div>
          <CardTitle>Activity</CardTitle>
          <CardDescription>What changed today</CardDescription>
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="Refresh">
          <RefreshCwIcon />
        </Button>
      </CardHeader>
      <CardContent>
        {now ? (
          <ActivityFeed>
            <ActivityItem actor={{ name: "Jonas Weber" }} time={new Date(now.getTime() - 4 * 60_000)}>
              moved <ActivityTarget>Offline photo queue</ActivityTarget> to <ActivityStatus status="review" />
            </ActivityItem>
            <ActivityItem actor={{ name: "Mira Okafor" }} time={new Date(now.getTime() - 52 * 60_000)} content="Retries should back off after the third attempt.">
              commented on <ActivityTarget>Retry failed card payments</ActivityTarget>
            </ActivityItem>
            <ActivityItem actor={{ name: "Theo Martin" }} time={new Date(now.getTime() - 3 * 3600_000)}>
              completed <ActivityTarget>Pricing copy</ActivityTarget>
            </ActivityItem>
          </ActivityFeed>
        ) : (
          <div className="h-56" />
        )}
      </CardContent>
    </Tile>
  );
}

function NotificationsCard() {
  const rows = [
    { id: "assigned", label: "Assigned to me", on: true },
    { id: "mentions", label: "Mentions", on: true },
    { id: "status", label: "Status changes", on: false },
    { id: "digest", label: "Weekly digest", on: true },
  ];
  return (
    <Tile>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what reaches your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border">
        {rows.map((r) => (
          <Field key={r.id} orientation="horizontal" className="justify-between py-2.5 first:pt-0">
            <FieldLabel className="font-normal">{r.label}</FieldLabel>
            <FieldControl>
              <Switch defaultChecked={r.on} />
            </FieldControl>
          </Field>
        ))}
      </CardContent>
      <CardFooter className="border-0 pt-0">
        <Button size="sm" variant="ghost" className="-ml-2">
          <BellIcon /> Notification settings
        </Button>
      </CardFooter>
    </Tile>
  );
}

function SettingsLinksCard() {
  const links = [
    { title: "Members & roles", text: "Invite people and choose what they can do.", icon: UsersIcon },
    { title: "Templates", text: "Start projects from your team's checklists.", icon: FileTextIcon },
    { title: "Integrations", text: "Connect GitHub, Slack and your inbox.", icon: InboxIcon },
  ];
  return (
    <Tile>
      <CardContent className="flex flex-col gap-3 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {links.map(({ title, text, icon: Icon }) => (
          <a
            key={title}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 rounded-lg bg-bg-subtle p-3 hover:bg-muted [&_svg]:size-4"
          >
            <Icon className="shrink-0 text-fg-subtle" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{title}</span>
              <span className="block text-sm text-fg-muted">{text}</span>
            </span>
            <ChevronRightIcon className="text-fg-subtle" />
          </a>
        ))}
      </CardContent>
    </Tile>
  );
}

function ChatCard() {
  return (
    <Tile>
      <CardHeader className="flex-col items-start gap-0.5">
        <CardTitle>Ask about this project</CardTitle>
        <CardDescription>Summaries and answers from your tasks.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-accent-subtle text-accent-subtle-fg">
          <MessagesSquareIcon className="size-5" />
        </span>
        <p className="font-medium">What&apos;s blocking checkout beta?</p>
        <p className="max-w-56 text-sm text-fg-muted">Ask in plain words. Answers link back to the tasks they came from.</p>
      </CardContent>
      <CardFooter className="border-0 pt-0">
        <InputGroup>
          <InputGroupInput aria-label="Ask a question" placeholder="Ask a question…" />
          <Button size="icon-sm" variant="primary" aria-label="Send" className="mr-1">
            <ArrowRightIcon />
          </Button>
        </InputGroup>
      </CardFooter>
    </Tile>
  );
}

export function Showcase() {
  const now = useNow();
  return (
    <div className="relative">
      <div className="columns-1 gap-5 md:columns-2 xl:columns-4">
        <ControlsCard />
        <NavCards />
        <ProjectCard />
        <VelocityCard />
        <TasksCard today={now} />
        <MilestoneCard />
        <CapacityCard />
        <CalendarCard />
        <ActivityCard now={now} />
        <NotificationsCard />
        <SettingsLinksCard />
        <ChatCard />
      </div>
      {/* fade the bottom edge out, like the end of a long page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg to-transparent" />
      <Toaster position="bottom-right" />
    </div>
  );
}
