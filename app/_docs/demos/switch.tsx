"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Switch id="sw-1" defaultChecked />
        <Label htmlFor="sw-1">Show completed tasks</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-2" disabled />
        <Label htmlFor="sw-2">Disabled</Label>
      </div>
    </div>
  );
}
