"use client";

import { FolderIcon, HomeIcon, SettingsIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Demo() {
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
