"use client";

import * as React from "react";
import { ArchiveIcon, CopyIcon, LinkIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Demo() {
  const [priority, setPriority] = React.useState("high");
  const [subscribed, setSubscribed] = React.useState(true);
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-36 w-full max-w-sm place-items-center rounded-lg border border-dashed border-border-strong bg-bg-subtle text-sm text-fg-muted">
        Right-click the task card
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>DX-142</ContextMenuLabel>
        <ContextMenuItem>
          <PencilIcon /> Edit <ContextMenuShortcut>E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon /> Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <LinkIcon /> Copy link <ContextMenuShortcut>⌘L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <UserIcon /> Assign to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Maya Chen</ContextMenuItem>
            <ContextMenuItem>Leo Park</ContextMenuItem>
            <ContextMenuItem disabled>Sam Ortiz (away)</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuLabel>Priority</ContextMenuLabel>
        <ContextMenuRadioGroup value={priority} onValueChange={setPriority}>
          <ContextMenuRadioItem value="urgent">Urgent</ContextMenuRadioItem>
          <ContextMenuRadioItem value="high">High</ContextMenuRadioItem>
          <ContextMenuRadioItem value="low">Low</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={subscribed} onCheckedChange={setSubscribed}>
          Subscribed to updates
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <ArchiveIcon /> Archive
        </ContextMenuItem>
        <ContextMenuItem variant="danger">
          <TrashIcon /> Delete <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
