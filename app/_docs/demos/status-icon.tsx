"use client";

import { StatusIcon, statusIconLabels } from "@/components/ui/status-icon";
import { statuses } from "./_shared";

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      {statuses.map((s) => (
        <div key={s} className="flex items-center gap-2">
          <StatusIcon status={s} label="" />
          {statusIconLabels[s]}
        </div>
      ))}
    </div>
  );
}
