"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, CopyIcon, FileTextIcon, MessageSquareIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/** Split button: copy the page as Markdown, or open it in an AI chat. */
export function CopyPage({ markdown, markdownUrl }: { markdown: string; markdownUrl: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  const prompt = encodeURIComponent(`Read ${markdownUrl} so I can ask questions about it.`);
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <Button size="sm" onClick={copy} className="rounded-r-none shadow-none">
        {copied ? <CheckIcon className="text-success" /> : <CopyIcon />} Copy page
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" aria-label="More copy options" className="-ml-px rounded-l-none shadow-none">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild>
            <a href={markdownUrl}>
              <FileTextIcon /> View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noreferrer">
              <SparklesIcon /> Open in Claude
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noreferrer">
              <MessageSquareIcon /> Open in ChatGPT
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
