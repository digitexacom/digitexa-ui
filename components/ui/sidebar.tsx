"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon, ChevronsUpDownIcon, PanelLeftIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

/** Hidden while the sidebar is an icon rail. Use on your own elements inside the sidebar. */
const whenExpanded = "md:in-data-[sidebar=collapsed]:hidden";
/** Shown only while the sidebar is an icon rail (e.g. a stand-in for a tree that doesn't fit). */
const whenRail = "hidden md:in-data-[sidebar=collapsed]:flex";

const desktopQuery = "(min-width: 768px)";
function subscribeDesktop(onChange: () => void) {
  const mq = matchMedia(desktopQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
/** True when the sidebar is an icon rail right now (collapsed on a desktop-width screen; mobile shows a drawer). */
function useIsRail() {
  const { collapsed } = useSidebar();
  const desktop = React.useSyncExternalStore(subscribeDesktop, () => matchMedia(desktopQuery).matches, () => true);
  return collapsed && desktop;
}

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
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-2 py-2",
        // the scrollbar only shows while the pointer is over the sidebar
        "[scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--dx-border-strong)_transparent]",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex shrink-0 flex-col gap-0.5 border-t border-border p-2", className)} {...props} />;
}

type SidebarGroupProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode;
  action?: React.ReactNode;
  /** Title becomes a chevron toggle that shows and hides the group's items. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Remember the open state in localStorage under this key. */
  storageKey?: string;
  /** Keep it open regardless of state, e.g. while a sidebar search is filtering. */
  forceOpen?: boolean;
};

// open state kept in localStorage; read through useSyncExternalStore so every tab and instance agrees
const storageEvent = "dx-sidebar-group";
function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(storageEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(storageEvent, onChange);
  };
}
function readStorage(key: string | undefined) {
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function useStoredOpen(storageKey: string | undefined, defaultOpen: boolean) {
  const [local, setLocal] = React.useState(defaultOpen);
  const saved = React.useSyncExternalStore(subscribeStorage, () => readStorage(storageKey), () => null);
  const open = storageKey && saved !== null ? saved === "1" : local;
  const update = React.useCallback(
    (next: boolean) => {
      setLocal(next);
      if (!storageKey) return;
      try {
        localStorage.setItem(storageKey, next ? "1" : "0");
        window.dispatchEvent(new Event(storageEvent));
      } catch {}
    },
    [storageKey],
  );
  return [open, update] as const;
}

function SidebarGroup({
  title,
  action,
  collapsible = false,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  storageKey,
  forceOpen = false,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  const [stored, setStored] = useStoredOpen(storageKey, defaultOpen);
  const rail = useIsRail();
  const open = forceOpen || (openProp ?? stored);
  const setOpen = (next: boolean) => {
    if (forceOpen) return;
    if (openProp === undefined) setStored(next);
    onOpenChange?.(next);
  };

  const divider = <div aria-hidden className="mx-2 my-1 hidden h-px bg-border md:in-data-[sidebar=collapsed]:block" />;

  if (!collapsible || rail) {
    // in the icon rail every group is flat: the title becomes a divider and all icons stay reachable
    return (
      <div data-slot="sidebar-group" role="group" className={cn("flex flex-col gap-px", className)} {...props}>
        {title && (
          <>
            <div className={cn("flex h-6 items-center justify-between px-2 text-2xs font-medium tracking-wide whitespace-nowrap text-fg-subtle uppercase", whenExpanded)}>
              {title}
              {action}
            </div>
            {divider}
          </>
        )}
        {children}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <div data-slot="sidebar-group" data-collapsible="" role="group" className={cn("flex flex-col gap-px", className)} {...props}>
        <div className="group/title flex h-(--dx-control-md) shrink-0 items-center rounded-md pr-1 hover:bg-muted">
          <CollapsibleTrigger asChild>
            <button type="button" className="group/trigger flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-md px-2 text-left text-base font-medium text-fg-muted hover:text-fg">
              <ChevronRightIcon aria-hidden className="size-3.5 shrink-0 text-fg-subtle transition-transform duration-(--dx-motion) group-data-[state=open]/trigger:rotate-90" />
              <span className="min-w-0 flex-1 truncate">{title}</span>
            </button>
          </CollapsibleTrigger>
          {action}
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-px">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/* ---------------------------------------------------------------- search */

type SidebarSearchProps = Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  /** What the search icon does in the icon rail. Default: expand the sidebar and focus the box. */
  onRailClick?: () => void;
};

/** Filter box for the sidebar's items. Esc clears, ↓ moves into the list. In the icon rail it's a search button. */
function SidebarSearch({ value, onChange, onRailClick, placeholder = "Search…", className, ...props }: SidebarSearchProps) {
  const { setCollapsed } = useSidebar();
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div data-slot="sidebar-search" className={cn("shrink-0 px-2 pb-1", className)}>
      <SidebarItem
        asChild
        show="rail"
        icon={<SearchIcon />}
        tooltip={typeof placeholder === "string" ? placeholder.replace(/…$/, "") : "Search"}
      >
        <button
          type="button"
          onClick={() => {
            if (onRailClick) return onRailClick();
            setCollapsed(false);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          Search
        </button>
      </SidebarItem>
      <div
        className={cn(
          "flex h-(--dx-control-sm) items-center gap-1.5 rounded-md border border-input bg-bg px-2 text-sm",
          "focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20",
          whenExpanded,
        )}
      >
        <SearchIcon aria-hidden className="size-3.5 shrink-0 text-fg-subtle" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              e.preventDefault();
              onChange("");
            }
            if (e.key === "ArrowDown") {
              const first = e.currentTarget.closest("[data-slot=sidebar]")?.querySelector<HTMLElement>("[data-slot=sidebar-content] a, [data-slot=sidebar-content] button");
              if (first) {
                e.preventDefault();
                first.focus();
              }
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle [&::-webkit-search-cancel-button]:hidden"
          {...props}
        />
        {value && (
          <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="grid size-4 shrink-0 place-items-center rounded-sm text-fg-subtle hover:text-fg">
            <XIcon aria-hidden className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- profile */

type SidebarProfileProps = Omit<React.ComponentProps<"button">, "title"> & {
  /** Logo, workspace mark or avatar. The only part left in the icon rail. */
  media: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right side; defaults to an up/down chevron. Pass null for none. */
  trailing?: React.ReactNode;
};

/** Two-line identity button for the header (workspace) or footer (user). Wrap in a DropdownMenuTrigger asChild. */
function SidebarProfile({ media, title, subtitle, trailing, className, ...props }: SidebarProfileProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-profile"
      className={cn(
        "flex w-full min-w-0 items-center gap-2.5 rounded-md p-1.5 text-left hover:bg-muted data-[state=open]:bg-muted",
        "md:in-data-[sidebar=collapsed]:justify-center md:in-data-[sidebar=collapsed]:p-1",
        className,
      )}
      {...props}
    >
      <span className="grid shrink-0 place-items-center">{media}</span>
      <span className={cn("flex min-w-0 flex-1 flex-col leading-tight", whenExpanded)}>
        <span className="truncate font-semibold">{title}</span>
        {subtitle && <span className="truncate text-xs text-fg-subtle">{subtitle}</span>}
      </span>
      {trailing !== null && <span className={cn("shrink-0 text-fg-subtle [&_svg]:size-3.5", whenExpanded)}>{trailing ?? <ChevronsUpDownIcon />}</span>}
    </button>
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
  /** "rail": only in the icon rail (a stand-in for something that doesn't fit). "expanded": never in the rail. */
  show?: "always" | "rail" | "expanded";
};

function SidebarItem({ icon, active, trailing, depth = 0, tooltip, asChild, show = "always", className, children, ...props }: SidebarItemProps) {
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
        (depth > 0 || show === "expanded") && whenExpanded,
        show === "rail" && whenRail,
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
  SidebarSearch,
  SidebarProfile,
  useIsRail,
  whenExpanded,
  whenRail,
  SidebarTrigger,
  Topbar,
};
