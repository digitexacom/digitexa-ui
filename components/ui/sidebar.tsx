"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/*
 * Collapsible app sidebar.
 *
 * Desktop: expanded ↔ icon rail. The state lives on <html data-sidebar="collapsed"> (like data-theme),
 * is saved to localStorage, and toggles with ⌘B / Ctrl+B. To avoid a flash on reload, run this before paint:
 *
 *   try{if(localStorage.getItem("dx-sidebar")==="collapsed")document.documentElement.setAttribute("data-sidebar","collapsed")}catch(e){}
 *
 * Mobile (< md): the sidebar becomes an off-canvas drawer opened by <SidebarTrigger />.
 */

const STORAGE_KEY = "dx-sidebar";
const ATTR = "data-sidebar";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return ctx;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR] });
  return () => observer.disconnect();
}

const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

function SidebarProvider({ children, shortcut = "b" }: { children: React.ReactNode; /** ⌘/Ctrl + key; null disables it */ shortcut?: string | null }) {
  const collapsed = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute(ATTR) === "collapsed",
    () => false,
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const setCollapsed = React.useCallback((next: boolean) => {
    const d = document.documentElement;
    if (next) d.setAttribute(ATTR, "collapsed");
    else d.removeAttribute(ATTR);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "collapsed");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // pick up the saved state when the page didn't run the init snippet
  React.useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "collapsed") setCollapsed(true);
    } catch {}
  }, [setCollapsed]);

  const toggle = React.useCallback(() => {
    if (isMobile()) setMobileOpen((open) => !open);
    else setCollapsed(!document.documentElement.hasAttribute(ATTR));
  }, [setCollapsed]);

  React.useEffect(() => {
    if (!shortcut) return;
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === shortcut && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut, toggle]);

  const value = React.useMemo(() => ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, toggle }), [collapsed, setCollapsed, mobileOpen, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

/** Two-column app frame: <AppShell sidebar={<Sidebar>…</Sidebar>}>{page}</AppShell> */
function AppShell({ sidebar, className, children, ...props }: React.ComponentProps<"div"> & { sidebar: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div data-slot="app-shell" className={cn("flex h-dvh overflow-hidden bg-bg", className)} {...props}>
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      {/* mobile backdrop */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-(--dx-z-overlay) bg-overlay transition-opacity duration-(--dx-motion) md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        data-slot="sidebar"
        data-mobile={mobileOpen ? "open" : "closed"}
        className={cn(
          "group/sidebar flex w-(--dx-sidebar-width) shrink-0 flex-col overflow-hidden border-r border-border bg-bg-subtle",
          "transition-[width,translate] duration-(--dx-motion) ease-out",
          "md:in-data-[sidebar=collapsed]:w-(--dx-sidebar-width-collapsed)",
          // mobile: off-canvas drawer
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-(--dx-z-overlay) max-md:shadow-lg",
          "max-md:data-[mobile=closed]:-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

/** Hidden while the sidebar is an icon rail. */
const whenExpanded = "md:in-data-[sidebar=collapsed]:hidden";

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex h-(--dx-topbar-height) shrink-0 items-center gap-2 px-3 md:in-data-[sidebar=collapsed]:justify-center md:in-data-[sidebar=collapsed]:px-0", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-2 py-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex shrink-0 flex-col gap-0.5 border-t border-border p-2", className)} {...props} />;
}

function SidebarGroup({ title, action, className, children, ...props }: React.ComponentProps<"div"> & { title?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div data-slot="sidebar-group" role="group" className={cn("flex flex-col gap-px", className)} {...props}>
      {title && (
        <>
          <div className={cn("flex h-6 items-center justify-between px-2 text-2xs font-medium tracking-wide whitespace-nowrap text-fg-subtle uppercase", whenExpanded)}>
            {title}
            {action}
          </div>
          {/* in the icon rail the title becomes a divider */}
          <div aria-hidden className="mx-2 my-1 hidden h-px bg-border md:in-data-[sidebar=collapsed]:block" />
        </>
      )}
      {children}
    </div>
  );
}

type SidebarItemProps = React.ComponentProps<"a"> & {
  icon?: React.ReactNode;
  active?: boolean;
  /** Right-aligned extra: a count, a dot, an icon. */
  trailing?: React.ReactNode;
  /** Indent level for nested items (0–2). Nested items are hidden in the icon rail. */
  depth?: 0 | 1 | 2;
  /** Tooltip text in the icon rail. Defaults to the children when they're a string. */
  tooltip?: string;
  /** Render your router's Link: <SidebarItem asChild icon={<HomeIcon />}><Link href="/">Home</Link></SidebarItem> */
  asChild?: boolean;
};

function SidebarItem({ icon, active, trailing, depth = 0, tooltip, asChild, className, children, ...props }: SidebarItemProps) {
  const { collapsed, setMobileOpen } = useSidebar();
  const Comp = asChild ? Slot : "a";
  const label = tooltip ?? (typeof children === "string" ? children : undefined);

  const content = (
    <>
      {icon && (
        <span data-sidebar-icon className="grid size-4 shrink-0 place-items-center">
          {icon}
        </span>
      )}
      <span className={cn("min-w-0 flex-1 truncate", whenExpanded)}>{asChild ? (children as React.ReactElement<{ children?: React.ReactNode }>).props.children : children}</span>
      {trailing && <span className={cn("flex shrink-0 items-center gap-1 text-xs text-fg-subtle", whenExpanded)}>{trailing}</span>}
    </>
  );

  const item = (
    <Comp
      data-slot="sidebar-item"
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "group/item flex h-(--dx-control-md) shrink-0 items-center gap-2 rounded-md px-2 text-base whitespace-nowrap text-fg-muted",
        "hover:bg-muted hover:text-fg",
        "aria-[current=page]:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-fg aria-[current=page]:shadow-sm",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-subtle aria-[current=page]:[&_svg]:text-fg",
        "md:in-data-[sidebar=collapsed]:justify-center md:in-data-[sidebar=collapsed]:px-0",
        depth === 1 && "pl-7",
        depth === 2 && "pl-11",
        depth > 0 && whenExpanded,
        className,
      )}
      {...props}
    >
      {asChild ? React.cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, {}, content) : content}
    </Comp>
  );

  if (!collapsed || !label) return item;
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </TooltipRoot>
  );
}

/** Toggles the icon rail on desktop and the drawer on mobile. */
function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { collapsed, mobileOpen, toggle } = useSidebar();
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Toggle sidebar"
      aria-expanded={!collapsed || mobileOpen}
      title="Toggle sidebar (⌘B)"
      onClick={toggle}
      className={cn("-ml-1.5", className)}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
}

function Topbar({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="topbar"
      className={cn("flex h-(--dx-topbar-height) shrink-0 items-center gap-2 border-b border-border bg-bg px-4", className)}
      {...props}
    />
  );
}

export {
  AppShell,
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarTrigger,
  Topbar,
};
