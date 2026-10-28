"use client";

import * as React from "react";
import { FileTextIcon, HomeIcon, ImageIcon, ListIcon, SettingsIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProfile,
  SidebarProvider,
  SidebarSearch,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const groups = [
  { title: "University", items: [{ name: "Announcements", count: 4 }, { name: "Events", count: 4 }, { name: "Achievements", count: 8 }, { name: "Pages", count: 3 }] },
  { title: "Faculty of Education", items: [{ name: "Announcements", count: 7 }, { name: "Pages", count: 7 }] },
  { title: "Faculty of Law", items: [{ name: "Announcements", count: 2 }] },
];

export default function Demo() {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const shown = groups.map((g) => ({ ...g, items: g.items.filter((i) => `${g.title} ${i.name}`.toLowerCase().includes(q)) })).filter((g) => g.items.length > 0);

  return (
    <SidebarProvider shortcut={null}>
      <div className="flex h-[30rem] overflow-hidden rounded-md border border-border">
        <Sidebar className="max-md:static max-md:shadow-none max-md:data-[mobile=closed]:translate-x-0">
          <SidebarHeader className="h-auto py-2">
            <SidebarProfile
              media={<span className="grid size-7 place-items-center rounded-md bg-accent text-xs font-bold text-accent-fg">S</span>}
              title="Student Portal"
              subtitle="Northwind University"
            />
          </SidebarHeader>
          <SidebarSearch value={query} onChange={setQuery} placeholder="Search models…" />
          <SidebarContent>
            {!q && (
              <SidebarGroup>
                <SidebarItem href="#" icon={<HomeIcon />} active>
                  Overview
                </SidebarItem>
                <SidebarItem href="#" icon={<ImageIcon />}>
                  Media
                </SidebarItem>
              </SidebarGroup>
            )}
            {shown.map((g, i) => (
              <SidebarGroup key={g.title} title={g.title} collapsible defaultOpen={i === 0} forceOpen={!!q}>
                {g.items.map((item) => (
                  <SidebarItem key={item.name} href="#" icon={item.name === "Pages" ? <FileTextIcon /> : <ListIcon />} trailing={<span className="tabular-nums">{item.count}</span>}>
                    {item.name}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem href="#" icon={<SettingsIcon />}>
              Settings
            </SidebarItem>
            <SidebarProfile media={<Avatar name="Demo User" size="lg" status="online" />} title="Demo User" subtitle="demo@example.test" />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <div className="flex h-(--dx-topbar-height) items-center gap-2 border-b border-border px-3">
            <SidebarTrigger />
            <span className="text-sm text-fg-muted">Collapse to an icon rail; groups flatten so every item stays reachable.</span>
          </div>
          <div className="grid flex-1 place-items-center text-sm text-fg-subtle">Page content</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
