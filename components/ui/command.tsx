"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Command palette: a filterable list with full keyboard control (↑ ↓ Home End, Enter, Esc).
 *
 *   <CommandDialog open={open} onOpenChange={setOpen}>
 *     <CommandInput placeholder="Search…" />
 *     <CommandList>
 *       <CommandEmpty>No results</CommandEmpty>
 *       <CommandGroup heading="Projects">
 *         <CommandItem onSelect={…}>Storefront rebuild</CommandItem>
 *       </CommandGroup>
 *     </CommandList>
 *   </CommandDialog>
 *
 * Items match on their text plus optional `keywords`. Use useCommandShortcut() to open it with ⌘K.
 */

type CommandContextValue = {
  query: string;
  setQuery: (q: string) => void;
  active: string | null;
  setActive: (id: string | null) => void;
  listId: string;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error("Command parts must be used inside <Command> or <CommandDialog>");
  return ctx;
}

const normalize = (s: string) => s.toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

function matches(query: string, text: string) {
  const q = normalize(query.trim());
  if (!q) return true;
  const t = normalize(text);
  return q.split(/\s+/).every((word) => t.includes(word));
}

function Command({ className, children, onKeyDown, ...props }: React.ComponentProps<"div">) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<string | null>(null);
  const listId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const items = () => [...(rootRef.current?.querySelectorAll<HTMLElement>("[data-slot=command-item]:not([aria-disabled=true])") ?? [])];

  // after the list re-renders, make the first visible item active
  const activateFirst = React.useCallback(() => {
    requestAnimationFrame(() => setActive(items()[0]?.id ?? null));
  }, []);

  const updateQuery = React.useCallback(
    (q: string) => {
      setQuery(q);
      activateFirst();
    },
    [activateFirst],
  );

  const attach = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (node) activateFirst();
    },
    [activateFirst],
  );

  function move(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e);
    const list = items();
    if (!list.length) return;
    const index = list.findIndex((el) => el.id === active);
    let next = index;
    if (e.key === "ArrowDown") next = (index + 1) % list.length;
    else if (e.key === "ArrowUp") next = (index - 1 + list.length) % list.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = list.length - 1;
    else if (e.key === "Enter") {
      e.preventDefault();
      list[index]?.click();
      return;
    } else return;
    e.preventDefault();
    setActive(list[next].id);
    list[next].scrollIntoView({ block: "nearest" });
  }

  return (
    <CommandContext.Provider value={{ query, setQuery: updateQuery, active, setActive, listId }}>
      <div ref={attach} data-slot="command" className={cn("flex flex-col overflow-hidden text-fg", className)} onKeyDown={move} {...props}>
        {children}
      </div>
    </CommandContext.Provider>
  );
}

function CommandInput({ className, ...props }: Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const { query, setQuery, active, listId } = useCommand();
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3">
      <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
      <input
        data-slot="command-input"
        role="combobox"
        aria-expanded
        aria-controls={listId}
        aria-activedescendant={active ?? undefined}
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn("h-full flex-1 bg-transparent text-md outline-none placeholder:text-fg-subtle", className)}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  const { listId } = useCommand();
  return <div id={listId} role="listbox" data-slot="command-list" className={cn("max-h-80 overflow-y-auto overscroll-contain p-1", className)} {...props} />;
}

/** Shown only when no item matches (pure CSS, so it never lags a render behind). */
function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-empty"
      className={cn(
        "hidden py-8 text-center text-sm text-fg-muted",
        "[[data-slot=command-list]:not(:has([data-slot=command-item]))_&]:block",
        className,
      )}
      {...props}
    />
  );
}

function CommandGroup({ heading, className, children, ...props }: React.ComponentProps<"div"> & { heading?: React.ReactNode }) {
  const id = React.useId();
  return (
    // groups with no matching items collapse via :has()
    <div role="group" aria-labelledby={heading ? id : undefined} data-slot="command-group" className={cn("not-has-[[data-slot=command-item]]:hidden", className)} {...props}>
      {heading && (
        <div id={id} className="px-2 pt-2 pb-1 text-2xs font-medium tracking-wide text-fg-subtle uppercase">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

type CommandItemProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  onSelect?: () => void;
  /** Extra words to match, e.g. ["settings", "preferences"]. */
  keywords?: string[];
  disabled?: boolean;
};

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function CommandItem({ onSelect, keywords = [], disabled, className, children, ...props }: CommandItemProps) {
  const { query, active, setActive } = useCommand();
  const id = React.useId();
  if (!matches(query, [textOf(children), ...keywords].join(" "))) return null;
  return (
    <div
      id={id}
      role="option"
      data-slot="command-item"
      aria-selected={active === id}
      aria-disabled={disabled || undefined}
      onPointerMove={() => !disabled && active !== id && setActive(id)}
      onClick={() => !disabled && onSelect?.()}
      className={cn(
        "flex h-(--dx-control-lg) cursor-pointer items-center gap-2.5 rounded-sm px-2 text-base select-none",
        "aria-selected:bg-muted aria-disabled:pointer-events-none aria-disabled:text-fg-disabled",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*=text-])]:text-fg-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-xs text-fg-subtle", className)} {...props} />;
}

function CommandSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

type CommandDialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  title?: string;
  className?: string;
};

function CommandDialog({ title = "Command palette", className, children, ...props }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-(--dx-z-overlay) bg-overlay data-[state=open]:animate-[dx-fade-in_var(--dx-motion)_var(--dx-motion-ease)]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed top-[14vh] left-1/2 z-(--dx-z-overlay) w-[calc(100%-2rem)] max-w-xl -translate-x-1/2",
            "overflow-hidden rounded-xl border border-border bg-surface-raised shadow-lg outline-none",
            "data-[state=open]:animate-[dx-pop-in_var(--dx-motion)_var(--dx-motion-ease)]",
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <Command>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Opens the palette with ⌘K / Ctrl+K. Returns [open, setOpen]. */
function useCommandShortcut(key = "k") {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key]);
  return [open, setOpen] as const;
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  useCommandShortcut,
};
