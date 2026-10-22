"use client";

import { PriorityIcon, PriorityLabel, priorities } from "@/components/ui/priority";
import { Row } from "./_shared";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Icon">
        {priorities.map((p) => (
          <PriorityIcon key={p} priority={p} />
        ))}
      </Row>
      <div className="flex flex-col gap-2">
        {priorities.map((p) => (
          <PriorityLabel key={p} priority={p} />
        ))}
      </div>
    </div>
  );
}
