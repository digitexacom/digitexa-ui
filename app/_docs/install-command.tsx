"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteUrl } from "./site";

export function InstallCommand({ name }: { name: string }) {
  const command = `curl -fsSL ${siteUrl}/dx.mjs | node --input-type=module - add ${name} --registry ${siteUrl}/r`;
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-bg-subtle py-1 pr-1 pl-3">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-fg-muted">
        <span className="text-fg-subtle select-none">$ </span>
        {command}
      </code>
      <Button size="icon-sm" variant="ghost" onClick={copy} aria-label="Copy command">
        {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
      </Button>
    </div>
  );
}
