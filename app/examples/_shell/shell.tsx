import Link from "next/link";
import {
  ChevronDownIcon,
  FlagIcon,
  FolderIcon,
  ListChecksIcon,
  PlusIcon,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";
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
  SidebarHeader,
  SidebarTrigger,
  Topbar,
} from "@/components/ui/sidebar";

import {
  Notifications,
  SearchPalette,
  WorkspaceSwitcher,
} from "./chrome";
import {
  SidebarNav,
} from "./sidebar-nav";

type Page = "overview" | "settings";

function AppSidebar({ page }: { page: Page }) {
  return (
    <Sidebar>
      <SidebarHeader className="h-auto py-2">
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarNav page={page} />
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
