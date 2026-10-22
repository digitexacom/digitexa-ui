"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Project name" aria-label="Project name" />
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-subtle" />
        <Input placeholder="Search…" aria-label="Search" className="pl-8" />
      </div>
      <div className="flex flex-col gap-1">
        <Input aria-invalid defaultValue="name@" aria-label="Email" aria-describedby="email-error" />
        <span id="email-error" className="text-xs text-danger">
          Enter a valid email address.
        </span>
      </div>
      <div className="flex gap-2">
        <Input size="sm" placeholder="sm · 24" aria-label="Small" />
        <Input placeholder="md · 30" aria-label="Medium" />
        <Input size="lg" placeholder="lg · 36" aria-label="Large" />
      </div>
      <Input disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  );
}
