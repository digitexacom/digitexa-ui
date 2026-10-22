"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Demo() {
  const [estimate, setEstimate] = React.useState([5]);
  const [budget, setBudget] = React.useState([20, 60]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Label id="estimate-label">Story points</Label>
          <span className="text-sm text-fg-muted tabular-nums">{estimate[0]} pts</span>
        </div>
        <Slider aria-labelledby="estimate-label" value={estimate} onValueChange={setEstimate} min={1} max={13} />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Label>Weekly hours per member</Label>
          <span className="text-sm text-fg-muted tabular-nums">
            {budget[0]}–{budget[1]} h
          </span>
        </div>
        <Slider value={budget} onValueChange={setBudget} max={80} step={5} minStepsBetweenThumbs={1} thumbLabels={["Minimum hours", "Maximum hours"]} />
      </div>
      <div className="flex flex-col gap-2.5">
        <Label>Sprint capacity (locked)</Label>
        <Slider aria-label="Sprint capacity" defaultValue={[70]} disabled />
      </div>
    </div>
  );
}
