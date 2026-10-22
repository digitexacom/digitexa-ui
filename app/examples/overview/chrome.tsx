"use client";

// Interactive pieces of the example app: workspace switcher, user menu, notifications, search palette.
import * as React from "react";
import {
  BellIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleUserIcon,
  FolderIcon,
  KeyboardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  UserPlusIcon,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  useCommandShortcut,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { StatusIcon } from "@/components/ui/status-icon";
import { Tooltip } from "@/components/ui/tooltip";
import { accents, setHtmlAttr, useHtmlAttr } from "../../_docs/theme-switcher";

// hidden while the sidebar is collapsed to an icon rail
const rail = "md:in-data-[sidebar=collapsed]:hidden";

const workspaces = [
  { id: "northwind", name: "Northwind Studio", plan: "Business", mark: "N", tone: "bg-accent text-accent-fg" },
  { id: "personal", name: "Personal", plan: "Free", mark: "P", tone: "bg-status-done text-surface" },
  { id: "lighthouse", name: "Lighthouse Labs", plan: "Team", mark: "L", tone: "bg-fg text-bg" },
];

function WorkspaceMark({ ws, className }: { ws: (typeof workspaces)[number]; className?: string }) {
  return (
    <span className={`grid size-5 shrink-0 place-items-center rounded-sm text-2xs font-bold ${ws.tone} ${className ?? ""}`}>{ws.mark}</span>
  );
}

export function WorkspaceSwitcher() {
  const [current, setCurrent] = React.useState(workspaces[0].id);
  const ws = workspaces.find((w) => w.id === current)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Workspace: ${ws.name}`}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 outline-none hover:bg-muted data-[state=open]:bg-muted md:in-data-[sidebar=collapsed]:flex-none md:in-data-[sidebar=collapsed]:px-1"
        >
          <WorkspaceMark ws={ws} />
          <span className={`truncate font-semibold ${rail}`}>{ws.name}</span>
          <ChevronsUpDownIcon className={`ml-auto size-3.5 shrink-0 text-fg-subtle ${rail}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onSelect={() => setCurrent(w.id)}>
            <WorkspaceMark ws={w} />
            <span className="flex-1 truncate">{w.name}</span>
            <span className="text-xs text-fg-subtle">{w.plan}</span>
            <CheckIcon className={w.id === current ? "text-fg!" : "invisible"} />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PlusIcon /> Create workspace
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon /> Workspace settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserPlusIcon /> Invite members
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeItems() {
  const theme = useHtmlAttr("data-theme", "system");
  const accent = useHtmlAttr("data-accent", "ember");
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {theme === "dark" ? <MoonIcon /> : theme === "light" ? <SunIcon /> : <MonitorIcon />} Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setHtmlAttr("data-theme", v === "system" ? null : v, "dx-theme")}>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <PaletteIcon /> Accent
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={accent} onValueChange={(v) => setHtmlAttr("data-accent", v, "dx-accent")}>
            {accents.map((a) => (
              <DropdownMenuRadioItem key={a} value={a}>
                <span data-accent={a} className="size-2.5 rounded-full bg-accent" />
                <span className="capitalize">{a}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="flex h-9 items-center gap-2 rounded-md px-2 text-left outline-none hover:bg-muted data-[state=open]:bg-muted md:in-data-[sidebar=collapsed]:justify-center md:in-data-[sidebar=collapsed]:px-0"
        >
          <span className="relative shrink-0">
            <Avatar name="Mira Okafor" size="sm" />
            <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-success ring-2 ring-bg-subtle" />
          </span>
          <span className={`min-w-0 flex-1 truncate font-medium ${rail}`}>Mira Okafor</span>
          <ChevronsUpDownIcon className={`size-3.5 shrink-0 text-fg-subtle ${rail}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-60">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar name="Mira Okafor" size="lg" />
          <div className="min-w-0">
            <div className="truncate font-medium">Mira Okafor</div>
            <div className="truncate text-xs text-fg-subtle">mira@northwind.example</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleUserIcon /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon /> Preferences <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <KeyboardIcon /> Keyboard shortcuts <DropdownMenuShortcut>?</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Notification = { id: number; who: string; what: string; when: string; status: "todo" | "review" | "done"; unread: boolean };

const initialNotifications: Notification[] = [
  { id: 1, who: "Jonas Weber", what: "moved “Checkout beta” to In review", when: "4m", status: "review", unread: true },
  { id: 2, who: "Leyla Demir", what: "mentioned you in Spring campaign", when: "1h", status: "todo", unread: true },
  { id: 3, who: "Theo Martin", what: "marked “Pricing copy” as done", when: "Yesterday", status: "done", unread: false },
];

export function Notifications() {
  const [items, setItems] = React.useState(initialNotifications);
  const unread = items.filter((n) => n.unread).length;
  return (
    <Popover>
      <Tooltip content="Notifications">
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} className="relative">
            <BellIcon />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />}
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="font-semibold">Notifications</span>
          <Button size="xs" variant="ghost" disabled={!unread} onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}>
            Mark all read
          </Button>
        </div>
        <ul className="flex flex-col p-1">
          {items.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => setItems((all) => all.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
                className="flex w-full items-start gap-2.5 rounded-sm px-2 py-2 text-left hover:bg-muted"
              >
                <Avatar name={n.who} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">
                    <b className="font-medium">{n.who.split(" ")[0]}</b> {n.what}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-fg-subtle">
                    <StatusIcon status={n.status} label="" className="size-3" /> {n.when}
                  </span>
                </span>
                {n.unread && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

const projectNames = ["Storefront rebuild", "Driver app", "Spring campaign", "Pricing launch", "Component library", "Help center"];

export function SearchPalette() {
  const [open, setOpen] = useCommandShortcut();
  const { toggle } = useSidebar();
  const run = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-(--dx-control-md) w-64 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-fg-subtle shadow-sm hover:border-border-strong max-lg:hidden"
      >
        <SearchIcon className="size-3.5" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <Kbd>⌘K</Kbd>
      </button>
      <Tooltip content="Search (⌘K)">
        <Button size="icon" variant="ghost" aria-label="Search" onClick={() => setOpen(true)} className="lg:hidden">
          <SearchIcon />
        </Button>
      </Tooltip>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects, people, actions…" />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandGroup heading="Projects">
            {projectNames.map((p) => (
              <CommandItem key={p} onSelect={run()}>
                <FolderIcon /> {p}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={run()} keywords={["add", "task"]}>
              <PlusIcon /> New task <CommandShortcut>C</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run(toggle)} keywords={["collapse", "expand", "rail"]}>
              <LayoutDashboardIcon /> Toggle sidebar <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={run(() => {
                const dark = document.documentElement.getAttribute("data-theme") === "dark";
                setHtmlAttr("data-theme", dark ? "light" : "dark", "dx-theme");
              })}
              keywords={["dark", "light", "theme", "mode"]}
            >
              <MoonIcon /> Toggle dark mode
            </CommandItem>
            <CommandItem onSelect={run()} keywords={["invite", "member"]}>
              <UserPlusIcon /> Invite members
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
