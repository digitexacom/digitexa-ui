"use client";

import * as React from "react";
import {
  ArchiveIcon,
  ArrowRightIcon,
  BoldIcon,
  CopyIcon,
  FolderIcon,
  HomeIcon,
  SettingsIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UnderlineIcon,
} from "lucide-react";

import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Stat, StatGroup } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Meter } from "@/components/ui/meter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip } from "@/components/ui/tooltip";

const statuses = ["backlog", "todo", "progress", "review", "done"] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{label}</span>
      {children}
    </div>
  );
}

function ButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Variant">
        <Button variant="primary">
          <PlusIcon /> New task
        </Button>
        <Button>Secondary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">
          <TrashIcon /> Delete
        </Button>
        <Button variant="link">
          Link <ArrowRightIcon />
        </Button>
      </Row>
      <Row label="Size">
        <Button size="xs">XS · 20</Button>
        <Button size="sm">Small · 24</Button>
        <Button size="md">Medium · 30</Button>
        <Button size="lg">Large · 36</Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="More">
          <MoreHorizontalIcon />
        </Button>
      </Row>
      <Row label="State">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button asChild>
          <a href="#preview">asChild → &lt;a&gt;</a>
        </Button>
        <Button asChild>
          <a aria-disabled="true">Disabled link</a>
        </Button>
      </Row>
    </div>
  );
}

function InputDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Project name" aria-label="Project name" />
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-subtle" />
        <Input placeholder="Search…" aria-label="Search" className="pl-8" />
      </div>
      <div className="flex flex-col gap-1">
        <Input aria-invalid defaultValue="name@" aria-label="Email" aria-describedby="email-error" />
        <span id="email-error" className="text-xs text-danger">
          Enter a valid email address.
        </span>
      </div>
      <div className="flex gap-2">
        <Input size="sm" placeholder="sm · 24" aria-label="Small" />
        <Input placeholder="md · 30" aria-label="Medium" />
        <Input size="lg" placeholder="lg · 36" aria-label="Large" />
      </div>
      <Input disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  );
}

function TextareaDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="desc">Description</Label>
      <Textarea id="desc" placeholder="What needs to happen? The field grows as you type." />
    </div>
  );
}

function LabelDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="label-demo">Project name</Label>
      <Input id="label-demo" placeholder="Website redesign" />
    </div>
  );
}

function CheckboxDemo() {
  const [all, setAll] = React.useState<boolean | "indeterminate">("indeterminate");
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-all" checked={all} onCheckedChange={setAll} />
        <Label htmlFor="cb-all">Select all (indeterminate)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-1" defaultChecked />
        <Label htmlFor="cb-1">Email me about mentions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-2" disabled />
        <Label htmlFor="cb-2">Disabled</Label>
      </div>
    </div>
  );
}

function SwitchDemo() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Switch id="sw-1" defaultChecked />
        <Label htmlFor="sw-1">Show completed tasks</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-2" disabled />
        <Label htmlFor="sw-2">Disabled</Label>
      </div>
    </div>
  );
}

function SelectDemo() {
  return (
    <div className="flex max-w-56 flex-col gap-1.5">
      <Label htmlFor="status-select">Status</Label>
      <Select defaultValue="progress">
        <SelectTrigger id="status-select">
          <SelectValue placeholder="Pick a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                <StatusIcon status={s} label="" />
                {statusIconLabels[s]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function ToggleGroupDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleGroup type="single" defaultValue="board" aria-label="View">
        <ToggleGroupItem value="board">
          <LayoutGridIcon /> Board
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <ListIcon /> List
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function TabsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="underline">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-3 text-sm text-fg-muted">
          Underline tabs for page-level sections.
        </TabsContent>
        <TabsContent value="activity" className="pt-3 text-sm text-fg-muted">
          Activity feed goes here.
        </TabsContent>
        <TabsContent value="files" className="pt-3 text-sm text-fg-muted">
          Files go here.
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Status">
        {statuses.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Semantic">
        <Badge>Neutral</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger" dot>
          At risk
        </Badge>
        <Badge variant="info">Info</Badge>
      </Row>
    </div>
  );
}

function StatusIconDemo() {
  return (
    <div className="flex flex-col gap-2">
      {statuses.map((s) => (
        <div key={s} className="flex items-center gap-2">
          <StatusIcon status={s} label="" />
          {statusIconLabels[s]}
        </div>
      ))}
    </div>
  );
}

function AvatarDemo() {
  const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus Torvalds", "Margaret Hamilton"];
  return (
    <div className="flex flex-col gap-3">
      <Row label="Size">
        <Avatar name="Ada Lovelace" size="xs" />
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Ada Lovelace" size="md" />
        <Avatar name="Ada Lovelace" size="lg" />
        <Avatar name="Ada Lovelace" size="xl" />
      </Row>
      <Row label="Group">
        <AvatarGroup max={4}>
          {people.map((p) => (
            <Avatar key={p} name={p} />
          ))}
        </AvatarGroup>
      </Row>
    </div>
  );
}

function KbdDemo() {
  return (
    <div className="flex items-center gap-4 text-sm text-fg-muted">
      <span className="flex items-center gap-1">
        Search <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span className="flex items-center gap-1">
        New task <Kbd>C</Kbd>
      </span>
    </div>
  );
}

function CardDemo() {
  return (
    <div className="flex flex-col gap-4">
      <StatGroup>
        <Stat label="Projects" value="6" hint="1 completed" />
        <Stat label="Tasks" value="50" hint="29 open" />
        <Stat label="Completion" value="42%" hint="across all projects" />
        <Stat label="Members" value="8" hint="1 pending invite" />
      </StatGroup>
      <Card className="max-w-sm">
        <CardHeader>
          <div>
            <CardTitle>Website redesign</CardTitle>
            <CardDescription>Due Nov 15 · 9 open tasks</CardDescription>
          </div>
          <StatusBadge status="progress" />
        </CardHeader>
        <CardContent>
          <Progress value={50} label="Website redesign progress" />
        </CardContent>
        <CardFooter>
          <AvatarGroup>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Alan Turing" />
          </AvatarGroup>
          <Button size="sm" variant="ghost" className="ml-auto">
            Open <ArrowRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function TableDemo() {
  const rows = [
    { name: "Website redesign", lead: "Ada Lovelace", status: "progress", pct: 50 },
    { name: "Mobile app", lead: "Alan Turing", status: "review", pct: 72 },
    { name: "Brand refresh", lead: "Grace Hopper", status: "done", pct: 100 },
  ] as const;
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-40">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Avatar name={r.lead} size="sm" />
                  {r.lead.split(" ")[0]}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Progress value={r.pct} tone={r.pct === 100 ? "success" : "accent"} label={`${r.name} progress`} />
                  <span className="w-8 text-right text-xs text-fg-muted tabular-nums">{r.pct}%</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function ProgressDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Progress value={50} label="Accent" />
      <Progress value={100} tone="success" label="Success" />
      <Progress value={14} tone="danger" label="Danger" />
      <Progress value={33} tone="neutral" label="Neutral" />
    </div>
  );
}

function MeterDemo() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Meter
        label="Tasks by status"
        segments={[
          { label: "Backlog", value: 4, className: "bg-status-backlog" },
          { label: "To do", value: 14, className: "bg-status-todo" },
          { label: "In progress", value: 7, className: "bg-status-progress" },
          { label: "In review", value: 4, className: "bg-status-review" },
          { label: "Done", value: 21, className: "bg-status-done" },
        ]}
      />
      <Meter
        label="Workload"
        max={10}
        className="h-1.5"
        segments={[
          { label: "To do", value: 3, className: "bg-status-todo" },
          { label: "In progress", value: 2, className: "bg-status-progress" },
        ]}
      />
    </div>
  );
}

function SeparatorDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <span className="font-medium">Website redesign</span>
      <Separator />
      <div className="flex h-4 items-center gap-3 text-sm text-fg-muted">
        Board <Separator orientation="vertical" /> List <Separator orientation="vertical" /> Timeline
      </div>
    </div>
  );
}

function SidebarDemo() {
  return (
    <SidebarProvider shortcut={null}>
    <div className="flex h-80 overflow-hidden rounded-md border border-border">
      <Sidebar className="max-md:static max-md:shadow-none max-md:data-[mobile=closed]:translate-x-0">
        <SidebarHeader className="font-semibold">
          <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-accent text-2xs font-bold text-accent-fg">N</span>
          <span className="truncate md:in-data-[sidebar=collapsed]:hidden">Northwind Studio</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Workspace">
            <SidebarItem href="#" icon={<HomeIcon />} active>
              Overview
            </SidebarItem>
            <SidebarItem href="#" icon={<FolderIcon />} trailing="6">
              Projects
            </SidebarItem>
            <SidebarItem href="#" icon={<LayoutGridIcon />} depth={1}>
              Board
            </SidebarItem>
            <SidebarItem href="#" icon={<ListIcon />} depth={1}>
              List
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem href="#" icon={<SettingsIcon />}>
            Settings
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <div className="flex h-(--dx-topbar-height) items-center gap-2 border-b border-border px-3">
          <SidebarTrigger />
          <span className="text-sm text-fg-muted">Click to collapse to an icon rail (⌘B in the example app)</span>
        </div>
        <div className="grid flex-1 place-items-center text-sm text-fg-subtle">Page content</div>
      </div>
    </div>
    </SidebarProvider>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex max-w-sm items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex gap-2">
      <Tooltip content="Archive project">
        <Button size="icon" aria-label="Archive">
          <ArchiveIcon />
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <>
            New task <Kbd className="border-transparent bg-bg/20 text-bg">C</Kbd>
          </>
        }
        side="bottom"
      >
        <Button variant="primary">
          <PlusIcon /> New
        </Button>
      </Tooltip>
    </div>
  );
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Share…</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <Label htmlFor="invite">Invite by email</Label>
        <div className="flex gap-2">
          <Input id="invite" placeholder="name@company.com" />
          <Button variant="primary">Invite</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DropdownMenuDemo() {
  const [showDone, setShowDone] = React.useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Actions <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Task</DropdownMenuLabel>
        <DropdownMenuItem>
          <PencilIcon /> Rename <DropdownMenuShortcut>R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon /> Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Website redesign</DropdownMenuItem>
            <DropdownMenuItem>Mobile app</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showDone} onCheckedChange={setShowDone}>
          Show completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DialogDemo() {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">
            <PlusIcon /> Create task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>The task is added to the “To do” column.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" autoFocus placeholder="e.g. Update the homepage hero image" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-muted">Status:</span>
              <StatusBadge status="todo" />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="primary">Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="danger">
            <TrashIcon /> Delete…
          </Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>This can’t be undone. 24 tasks and all comments will be deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const demos: Record<string, React.ComponentType> = {
  button: ButtonDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  label: LabelDemo,
  checkbox: CheckboxDemo,
  switch: SwitchDemo,
  select: SelectDemo,
  "toggle-group": ToggleGroupDemo,
  tabs: TabsDemo,
  badge: BadgeDemo,
  "status-icon": StatusIconDemo,
  avatar: AvatarDemo,
  kbd: KbdDemo,
  card: CardDemo,
  table: TableDemo,
  progress: ProgressDemo,
  meter: MeterDemo,
  separator: SeparatorDemo,
  sidebar: SidebarDemo,
  skeleton: SkeletonDemo,
  tooltip: TooltipDemo,
  popover: PopoverDemo,
  "dropdown-menu": DropdownMenuDemo,
  dialog: DialogDemo,
};

export function Demo({ slug }: { slug: string }) {
  const Component = demos[slug];
  return Component ? <Component /> : null;
}
