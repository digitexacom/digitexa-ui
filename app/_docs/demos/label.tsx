"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="label-demo">Project name</Label>
      <Input id="label-demo" placeholder="Website redesign" />
    </div>
  );
}
