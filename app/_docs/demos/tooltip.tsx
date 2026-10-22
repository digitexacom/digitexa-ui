"use client";

import { ArchiveIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";

export default function Demo() {
  return (
    <div className="flex gap-2">
      <Tooltip content="Archive project">
        <Button size="icon" aria-label="Archive">
          <ArchiveIcon />
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <>
            New task <Kbd className="border-transparent bg-bg/20 text-bg">C</Kbd>
          </>
        }
        side="bottom"
      >
        <Button variant="primary">
          <PlusIcon /> New
        </Button>
      </Tooltip>
    </div>
  );
}
