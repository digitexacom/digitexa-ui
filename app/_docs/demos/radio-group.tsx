"use client";

import { ArrowRightIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioCard, RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Demo() {
  return (
    <div className="flex flex-col gap-5">
      <RadioGroup defaultValue="week" aria-label="Digest frequency">
        {[
          ["day", "Every day"],
          ["week", "Every week"],
          ["never", "Never"],
        ].map(([value, label]) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem id={`freq-${value}`} value={value} />
            <Label htmlFor={`freq-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
      <RadioGroup defaultValue="board" aria-label="Default view" className="max-w-md grid-cols-3">
        {[
          ["board", "Board", LayoutGridIcon],
          ["list", "List", ListIcon],
          ["timeline", "Timeline", ArrowRightIcon],
        ].map(([value, label, Icon]) => {
          const I = Icon as typeof ListIcon;
          return (
            <RadioCard key={value as string} value={value as string} className="p-3">
              <I className="size-4 text-fg-subtle" />
              <span className="font-medium">{label as string}</span>
            </RadioCard>
          );
        })}
      </RadioGroup>
    </div>
  );
}
