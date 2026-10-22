"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Demo() {
  const [all, setAll] = React.useState<boolean | "indeterminate">("indeterminate");
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-all" checked={all} onCheckedChange={setAll} />
        <Label htmlFor="cb-all">Select all (indeterminate)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-1" defaultChecked />
        <Label htmlFor="cb-1">Email me about mentions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-2" disabled />
        <Label htmlFor="cb-2">Disabled</Label>
      </div>
    </div>
  );
}
