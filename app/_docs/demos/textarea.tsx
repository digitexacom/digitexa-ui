"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="desc">Description</Label>
      <Textarea id="desc" placeholder="What needs to happen? The field grows as you type." />
    </div>
  );
}
