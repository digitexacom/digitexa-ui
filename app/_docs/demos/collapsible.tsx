"use client";

import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const subIssues = ["Draft invite email copy", "Hook up resend endpoint", "Add rate limiting"];

export default function Demo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid max-w-sm gap-6">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Sub-issues · {subIssues.length}</CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-1 flex flex-col gap-0.5 pl-6 text-base text-fg">
            {subIssues.map((s) => (
              <li key={s} className="flex h-(--dx-control-md) items-center">
                {s}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="text-base font-medium text-fg">3 archived projects</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={open ? "Hide archived projects" : "Show archived projects"}>
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="border-t border-border px-3 py-2 text-base text-fg-muted">Website v1 · Q2 OKRs · Legacy billing</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
