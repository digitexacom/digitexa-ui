"use client";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Row, statuses } from "./_shared";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Status">
        {statuses.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </Row>
      <Row label="Semantic">
        <Badge>Neutral</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger" dot>
          At risk
        </Badge>
        <Badge variant="info">Info</Badge>
      </Row>
    </div>
  );
}
