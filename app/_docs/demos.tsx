"use client";

import * as React from "react";
import { ArrowRightIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{label}</span>
      {children}
    </div>
  );
}

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Variant">
        <Button variant="primary">
          <PlusIcon /> New task
        </Button>
        <Button>Secondary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">
          <TrashIcon /> Delete
        </Button>
        <Button variant="link">
          Link <ArrowRightIcon />
        </Button>
      </Row>
      <Row label="Size">
        <Button size="sm">Small · 24</Button>
        <Button size="md">Medium · 30</Button>
        <Button size="lg">Large · 36</Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Add">
          <PlusIcon />
        </Button>
      </Row>
      <Row label="State">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button asChild variant="secondary">
          <a href="#dialog">asChild → &lt;a&gt;</a>
        </Button>
      </Row>
    </div>
  );
}

export function InputDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Project name" />
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-subtle" />
        <Input placeholder="Search…" className="pl-8" />
      </div>
      <div className="flex flex-col gap-1">
        <Input aria-invalid defaultValue="name@" />
        <span className="text-xs text-danger">Enter a valid email address.</span>
      </div>
      <div className="flex gap-2">
        <Input size="sm" placeholder="sm · 24" />
        <Input placeholder="md · 30" />
        <Input size="lg" placeholder="lg · 36" />
      </div>
      <Input disabled placeholder="Disabled" />
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Status">
        <StatusBadge status="backlog" />
        <StatusBadge status="todo" />
        <StatusBadge status="progress" />
        <StatusBadge status="review" />
        <StatusBadge status="done" />
      </Row>
      <Row label="Semantic">
        <Badge>Neutral</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </Row>
    </div>
  );
}

export function DialogDemo() {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">
            <PlusIcon /> Create task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>The task is added to the “To do” column.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Title</span>
              <Input autoFocus placeholder="e.g. Update the homepage hero image" />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-muted">Status:</span>
              <StatusBadge status="todo" />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="primary">Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="danger">
            <TrashIcon /> Delete…
          </Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>This can’t be undone. 24 tasks and all comments will be deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
