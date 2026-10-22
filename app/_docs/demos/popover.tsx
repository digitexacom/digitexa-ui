"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Share…</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <Label htmlFor="invite">Invite by email</Label>
        <div className="flex gap-2">
          <Input id="invite" placeholder="name@company.com" />
          <Button variant="primary">Invite</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
