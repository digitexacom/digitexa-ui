"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { statuses } from "./_shared";

export default function Demo() {
  return (
    <div className="flex max-w-56 flex-col gap-1.5">
      <Label htmlFor="status-select">Status</Label>
      <Select defaultValue="progress">
        <SelectTrigger id="status-select">
          <SelectValue placeholder="Pick a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                <StatusIcon status={s} label="" />
                {statusIconLabels[s]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
