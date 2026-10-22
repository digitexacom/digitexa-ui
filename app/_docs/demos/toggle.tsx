"use client";

import { BellIcon, BoldIcon, EyeOffIcon, ItalicIcon, StarIcon } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Bold" size="icon">
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Italic" size="icon" defaultPressed>
          <ItalicIcon />
        </Toggle>
        <Toggle variant="outline" defaultPressed>
          <StarIcon /> Favorite
        </Toggle>
        <Toggle variant="outline">
          <BellIcon /> Watch issue
        </Toggle>
        <Toggle disabled>
          <EyeOffIcon /> Hide completed
        </Toggle>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" size="xs">XS</Toggle>
        <Toggle variant="outline" size="sm">Small</Toggle>
        <Toggle variant="outline" size="md">Medium</Toggle>
        <Toggle variant="outline" size="lg">Large</Toggle>
      </div>
    </div>
  );
}
