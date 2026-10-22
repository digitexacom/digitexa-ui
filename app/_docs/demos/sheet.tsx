"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
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
    </div>
  );
}
