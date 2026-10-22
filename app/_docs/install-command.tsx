"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  return (
    <Button size="icon-sm" variant="ghost" onClick={copy} aria-label={copied ? "Copied" : label} className={className}>
      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
    </Button>
  );
}

export function CommandLine({ command, className }: { command: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md border border-border bg-bg-subtle py-1 pr-1 pl-3", className)}>
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-fg-muted">
        <span className="text-fg-subtle select-none">$ </span>
        {command}
      </code>
      <CopyButton value={command} label="Copy command" />
    </div>
  );
}
