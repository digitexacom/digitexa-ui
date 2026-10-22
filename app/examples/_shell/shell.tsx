import Link from "next/link";
import {
  ActivityIcon,
  ArchiveIcon,
  BoxIcon,
  CalendarIcon,
  ChevronDownIcon,
  CodeIcon,
  FlagIcon,
  FolderIcon,
  GanttChartIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ListChecksIcon,
  ListIcon,
  LockIcon,
  MegaphoneIcon,
  PaletteIcon,
  PaperclipIcon,
  PlusIcon,
  SettingsIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tooltip } from "@/components/ui/tooltip";
import { Notifications, SearchPalette, UserMenu, WorkspaceSwitcher } from "./chrome";
import { projects } from "./data";

type Page = "overview" | "settings";

function AppSidebar({ page }: { page: Page }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup title="Workspace">
          <SidebarItem asChild icon={<LayoutDashboardIcon />} active={page === "overview"}>
            <Link href="/examples/overview">Overview</Link>
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
        <SidebarItem asChild icon={<SettingsIcon />} active={page === "settings"}>
          <Link href="/examples/settings">Settings</Link>
        </SidebarItem>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function AppTopbar({ title }: { title: string }) {
  return (
    <Topbar>
      <SidebarTrigger />
      <Link href="/" className="text-sm text-fg-subtle hover:text-fg max-sm:hidden">
        Docs
      </Link>
      <span className="text-fg-subtle max-sm:hidden">/</span>
      <span className="font-medium">{title}</span>
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

/** Sidebar + topbar frame shared by the example pages. */
export function ExampleShell({ page, title, children }: { page: Page; title: string; children: React.ReactNode }) {
  return (
    <AppShell sidebar={<AppSidebar page={page} />}>
      <AppTopbar title={title} />
      {children}
    </AppShell>
  );
}
