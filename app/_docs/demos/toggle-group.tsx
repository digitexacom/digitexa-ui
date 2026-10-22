"use client";

import { BoldIcon, ItalicIcon, LayoutGridIcon, ListIcon, UnderlineIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleGroup type="single" defaultValue="board" aria-label="View">
        <ToggleGroupItem value="board">
          <LayoutGridIcon /> Board
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <ListIcon /> List
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
