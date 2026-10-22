"use client";

import * as React from "react";
import { BugIcon, FolderIcon, PaletteIcon, RocketIcon, ShieldIcon, SparklesIcon, ZapIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";

const members = [
  { name: "Ada Lovelace", role: "engineering" },
  { name: "Grace Hopper", role: "engineering" },
  { name: "Dieter Rams", role: "design" },
  { name: "Margaret Hamilton", role: "engineering lead" },
  { name: "Susan Kare", role: "design" },
];

const memberOptions: ComboboxOption[] = members.map((m) => ({
  value: m.name.toLowerCase().replace(/\s+/g, "-"),
  label: m.name,
  icon: <Avatar aria-hidden name={m.name} size="xs" />,
  keywords: [m.role],
}));

const labelOptions: ComboboxOption[] = [
  { value: "bug", label: "Bug", icon: <BugIcon /> },
  { value: "feature", label: "Feature", icon: <SparklesIcon /> },
  { value: "design", label: "Design", icon: <PaletteIcon />, keywords: ["ui", "ux"] },
  { value: "performance", label: "Performance", icon: <ZapIcon />, keywords: ["speed"] },
  { value: "security", label: "Security", icon: <ShieldIcon /> },
  { value: "release", label: "Release", icon: <RocketIcon />, keywords: ["ship", "deploy"] },
];

const projectOptions: ComboboxOption[] = ["Storefront rebuild", "Mobile app v3", "Billing migration", "Design system"].map((p) => ({
  value: p,
  label: p,
  icon: <FolderIcon />,
}));

export default function Demo() {
  const [owner, setOwner] = React.useState<string | undefined>("grace-hopper");
  const [labels, setLabels] = React.useState<string[]>(["bug", "performance"]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel>Owner</FieldLabel>
        <FieldControl>
          <Combobox options={memberOptions} value={owner} onValueChange={setOwner} placeholder="Assign owner" searchPlaceholder="Search people…" emptyText="No one matches" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Labels</FieldLabel>
        <FieldControl>
          <Combobox multiple options={labelOptions} value={labels} onValueChange={setLabels} placeholder="Add labels" searchPlaceholder="Filter labels…" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Move to project</FieldLabel>
        <FieldControl>
          <Combobox size="sm" options={projectOptions} placeholder="Choose a project" />
        </FieldControl>
      </Field>
    </div>
  );
}
