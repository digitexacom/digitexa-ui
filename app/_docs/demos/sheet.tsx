"use client";

import * as React from "react";

import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Peek,
  PeekContent,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const sides = ["right", "left", "top", "bottom"] as const;

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="primary" className="self-start">
            Open task
          </Button>
        </SheetTrigger>
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle>DX-142 · Redesign pricing page</SheetTitle>
            <SheetDescription>In progress · assigned to Maya</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-title">Title</Label>
              <Input id="sheet-title" defaultValue="Redesign pricing page" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-desc">Description</Label>
              <Textarea id="sheet-desc" defaultValue="Align the plan cards with the new brand grid and add an annual toggle." />
            </div>
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild>
              <Button>Cancel</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="primary">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="flex flex-wrap gap-2">
        {sides.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button size="sm" className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side} size="sm">
              <SheetHeader>
                <SheetTitle className="capitalize">{side} sheet</SheetTitle>
                <SheetDescription>Filters for the Q3 roadmap board.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p className="text-sm text-fg-muted">Status, assignee and label filters would live here.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        ))}
      </div>
      <PeekDemo />
    </div>
  );
}

const tasks = [
  { id: "WEB-3", title: "Design system: color, type, components", status: "progress" },
  { id: "WEB-7", title: "Homepage frontend build", status: "progress" },
  { id: "WEB-8", title: "Product page template", status: "todo" },
  { id: "WEB-9", title: "Contact form and consent copy", status: "review" },
] as const;

/** Peek: the list stays usable and in place; clicking another row swaps the panel's content. */
function PeekDemo() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const task = tasks.find((t) => t.id === openId);
  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">Peek: click a row</span>
      <ul className="overflow-hidden rounded-lg border border-border">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => setOpenId(t.id)}
              aria-current={openId === t.id || undefined}
              className="flex h-(--dx-row-height) w-full items-center gap-2.5 border-b border-border px-3 text-left last:border-0 hover:bg-bg-subtle aria-[current=true]:bg-selected"
            >
              <StatusIcon status={t.status} label="" />
              <span className="flex-1 truncate">{t.title}</span>
              <span className="font-mono text-xs text-fg-subtle">{t.id}</span>
            </button>
          </li>
        ))}
      </ul>
      <Peek open={!!task} onOpenChange={(open) => !open && setOpenId(null)}>
        <PeekContent aria-describedby={undefined}>
          {task && (
            <>
              <SheetHeader>
                <span className="font-mono text-xs text-fg-subtle">{task.id}</span>
                <SheetTitle className="text-lg">{task.title}</SheetTitle>
              </SheetHeader>
              <SheetBody>
                <div className="flex items-center gap-2 text-sm">
                  <StatusIcon status={task.status} label="" /> {statusIconLabels[task.status]}
                </div>
                <p className="text-sm text-fg-muted">The list behind stays where it is. Pick another row to switch, press Esc to close.</p>
              </SheetBody>
            </>
          )}
        </PeekContent>
      </Peek>
    </div>
  );
}
