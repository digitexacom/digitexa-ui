"use client";

import { FolderIcon, SettingsIcon, PlusIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";

export default function Demo() {
  return (
    <Command className="max-w-md rounded-lg border border-border bg-surface-raised shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Projects">
          <CommandItem>
            <FolderIcon /> Storefront rebuild
          </CommandItem>
          <CommandItem>
            <FolderIcon /> Driver app
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem keywords={["add"]}>
            <PlusIcon /> New task <CommandShortcut>C</CommandShortcut>
          </CommandItem>
          <CommandItem keywords={["settings"]}>
            <SettingsIcon /> Preferences <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
