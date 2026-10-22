"use client";

import { ArrowRightIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row } from "./_shared";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Variant">
        <Button variant="primary">
          <PlusIcon /> New task
        </Button>
        <Button>Secondary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">
          <TrashIcon /> Delete
        </Button>
        <Button variant="link">
          Link <ArrowRightIcon />
        </Button>
      </Row>
      <Row label="Size">
        <Button size="xs">XS · 20</Button>
        <Button size="sm">Small · 24</Button>
        <Button size="md">Medium · 30</Button>
        <Button size="lg">Large · 36</Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="More">
          <MoreHorizontalIcon />
        </Button>
      </Row>
      <Row label="State">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Saving
        </Button>
        <Button asChild>
          <a href="#preview">asChild → &lt;a&gt;</a>
        </Button>
        <Button asChild>
          <a aria-disabled="true">Disabled link</a>
        </Button>
      </Row>
    </div>
  );
}
