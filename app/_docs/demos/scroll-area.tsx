"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

const activity = Array.from({ length: 24 }, (_, i) => `ENG-${310 - i} moved to ${["In progress", "In review", "Done"][i % 3]}`);
const members = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Linus Torvalds", "Margaret Hamilton", "Ken Thompson", "Barbara Liskov", "Dennis Ritchie"];

export default function Demo() {
  return (
    <div className="flex flex-col gap-6">
      <ScrollArea className="h-56 w-72 rounded-lg border border-border bg-surface">
        <div className="p-3">
          <h4 className="mb-2 text-2xs font-medium tracking-wide text-fg-subtle uppercase">Activity</h4>
          <ul className="flex flex-col">
            {activity.map((a) => (
              <li key={a} className="truncate border-b border-border py-1.5 text-base text-fg last:border-0">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>

      <ScrollArea orientation="horizontal" className="w-full max-w-md rounded-lg border border-border bg-surface">
        <div className="flex w-max gap-2 p-3">
          {members.map((m) => (
            <div key={m} className="flex h-(--dx-control-lg) shrink-0 items-center rounded-md bg-muted px-3 text-base text-fg">
              {m}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
