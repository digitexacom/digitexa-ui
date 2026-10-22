"use client";

import { Progress } from "@/components/ui/progress";

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Progress value={50} label="Accent" />
      <Progress value={100} tone="success" label="Success" />
      <Progress value={14} tone="danger" label="Danger" />
      <Progress value={33} tone="neutral" label="Neutral" />
    </div>
  );
}
