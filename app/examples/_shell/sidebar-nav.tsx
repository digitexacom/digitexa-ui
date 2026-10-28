"use client";

import * as React from "react";
import Link from "next/link";
import {
  ActivityIcon,
  ArchiveIcon,
  BoxIcon,
  CalendarIcon,
  CodeIcon,
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
import { SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarGroup, SidebarItem, SidebarSearch, whenExpanded } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { UserMenu } from "./chrome";
import { projects } from "./data";

const teams = [
  { name: "Design", icon: PaletteIcon },
  { name: "Engineering", icon: CodeIcon },
  { name: "Marketing", icon: MegaphoneIcon },
  { name: "Product", icon: BoxIcon },
];

const matches = (query: string, text: string) => text.toLocaleLowerCase("en").includes(query.trim().toLocaleLowerCase("en"));

export function SidebarNav({ page }: { page: "overview" | "settings" }) {
  const [query, setQuery] = React.useState("");
  const filtering = query.trim() !== "";
  const shownProjects = projects.filter((p) => matches(query, p.name));
  const shownTeams = teams.filter((t) => matches(query, t.name));

  return (
    <>
      <SidebarSearch value={query} onChange={setQuery} placeholder="Search projects…" aria-label="Search projects and teams" />
      <SidebarContent>
        {!filtering && (
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
        )}

        {shownProjects.length > 0 && (
          <SidebarGroup
            title="Projects"
            collapsible
            storageKey="dx-example-group-projects"
            forceOpen={filtering}
            action={
              <Tooltip content="New project">
                <Button size="icon-sm" variant="ghost" className="size-6" aria-label="New project">
                  <PlusIcon />
                </Button>
              </Tooltip>
            }
          >
            {shownProjects.map((p, i) => (
              <React.Fragment key={p.name}>
                <SidebarItem
                  href="#"
                  icon={
                    <span className={`grid size-4.5 place-items-center rounded-sm ${p.tint} [&_svg]:size-3!`}>
                      <p.icon />
                    </span>
                  }
                  trailing={
                    "locked" in p && p.locked ? (
                      <LockIcon className="size-3!" aria-label="Private" />
                    ) : "starred" in p && p.starred ? (
                      <StarIcon className="size-3! fill-current text-status-progress!" />
                    ) : (
                      <span className="tabular-nums">{p.open || ""}</span>
                    )
                  }
                >
                  {p.name}
                </SidebarItem>
                {i === 0 && !filtering && (
                  <>
                    <SidebarItem href="#" icon={<LayoutGridIcon />} depth={1}>Board</SidebarItem>
                    <SidebarItem href="#" icon={<ListIcon />} depth={1}>List</SidebarItem>
                    <SidebarItem href="#" icon={<GanttChartIcon />} depth={1}>Timeline</SidebarItem>
                    <SidebarItem href="#" icon={<PaperclipIcon />} depth={1}>Files</SidebarItem>
                  </>
                )}
              </React.Fragment>
            ))}
            {!filtering && <SidebarItem href="#" icon={<ArchiveIcon />}>Archive</SidebarItem>}
          </SidebarGroup>
        )}

        {shownTeams.length > 0 && (
          <SidebarGroup title="Teams" collapsible storageKey="dx-example-group-teams" forceOpen={filtering}>
            {shownTeams.map((t) => (
              <SidebarItem key={t.name} href="#" icon={<t.icon />}>
                {t.name}
              </SidebarItem>
            ))}
          </SidebarGroup>
        )}

        {filtering && shownProjects.length === 0 && shownTeams.length === 0 && (
          <p role="status" className={`px-2 py-1 text-sm text-fg-subtle ${whenExpanded}`}>
            Nothing matches “{query.trim()}”.
          </p>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarCollapseButton />
        <SidebarItem asChild icon={<SettingsIcon />} active={page === "settings"}>
          <Link href="/examples/settings">Settings</Link>
        </SidebarItem>
        <UserMenu />
      </SidebarFooter>
    </>
  );
}
