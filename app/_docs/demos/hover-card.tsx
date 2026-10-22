"use client";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function Demo() {
  return (
    <div className="text-base text-fg-muted">
      Blocked by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#preview" className="font-medium text-accent-subtle-fg underline-offset-4 hover:underline">
            DX-129
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-fg-subtle">DX-129</span>
            <StatusBadge status="review" />
          </div>
          <div className="text-base font-medium">Migrate billing to the new API</div>
          <p className="text-sm text-fg-muted">Webhooks need a retry queue before the old endpoint is switched off.</p>
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Avatar name="Maya Chen" size="sm" /> Maya Chen · due Oct 28
          </div>
        </HoverCardContent>
      </HoverCard>
      , which is waiting on review.
    </div>
  );
}
