"use client";

import { AtSignIcon, GlobeIcon, LinkIcon, SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <InputGroup>
        <InputGroupIcon>
          <SearchIcon />
        </InputGroupIcon>
        <InputGroupInput aria-label="Search issues" placeholder="Search issues…" />
        <Kbd>/</Kbd>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon variant="segment">https://</InputGroupAddon>
        <InputGroupInput aria-label="Workspace URL" defaultValue="acme" />
        <InputGroupAddon>.digitexa.app</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupIcon>
          <AtSignIcon />
        </InputGroupIcon>
        <InputGroupInput aria-label="Invite by email" placeholder="teammate" />
        <InputGroupAddon variant="segment">@acme.com</InputGroupAddon>
      </InputGroup>
      <InputGroup size="sm">
        <InputGroupIcon>
          <LinkIcon />
        </InputGroupIcon>
        <InputGroupInput aria-label="Pull request URL" placeholder="Paste a pull request link" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Domain" defaultValue="status.acme" aria-invalid />
        <InputGroupIcon>
          <GlobeIcon />
        </InputGroupIcon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon variant="segment">USD</InputGroupAddon>
        <InputGroupInput aria-label="Budget" defaultValue="12,000" disabled />
      </InputGroup>
    </div>
  );
}
