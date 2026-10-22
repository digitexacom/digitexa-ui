"use client";

import { Meter } from "@/components/ui/meter";

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Meter
        label="Tasks by status"
        segments={[
          { label: "Backlog", value: 4, className: "bg-status-backlog" },
          { label: "To do", value: 14, className: "bg-status-todo" },
          { label: "In progress", value: 7, className: "bg-status-progress" },
          { label: "In review", value: 4, className: "bg-status-review" },
          { label: "Done", value: 21, className: "bg-status-done" },
        ]}
      />
      <Meter
        label="Workload"
        max={10}
        className="h-1.5"
        segments={[
          { label: "To do", value: 3, className: "bg-status-todo" },
          { label: "In progress", value: 2, className: "bg-status-progress" },
        ]}
      />
    </div>
  );
}
