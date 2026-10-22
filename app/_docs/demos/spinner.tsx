"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { Row } from "./_shared";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Size">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </Row>
      <Row label="Color">
        <Spinner className="text-fg-subtle" />
        <Spinner className="text-accent" />
        <Spinner className="text-success" />
      </Row>
      <Row label="In use">
        <Button variant="primary" disabled>
          <Spinner aria-hidden /> Saving…
        </Button>
        <span className="flex items-center gap-2 text-sm text-fg-muted">
          <Spinner size="sm" label="Syncing issues" /> Syncing 12 issues from GitHub
        </span>
      </Row>
    </div>
  );
}
