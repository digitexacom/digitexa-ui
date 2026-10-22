"use client";

import * as React from "react";

import { Avatar } from "@/components/ui/avatar";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNow } from "@/lib/use-now";

// demo dates are relative to the viewer's today, so they never go stale
const dayFrom = (today: Date) => (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

const person = (name: string) => <Avatar name={name} size="sm" />;

const build = (day: (n: number) => Date): TimelineItem[] => [
  { id: "discovery", label: "Checkout discovery", start: day(-18), end: day(-9), status: "done", progress: 100, meta: person("Mira Okafor") },
  { id: "api", label: "Cart API migration", start: day(-10), end: day(2), status: "progress", progress: 70, meta: person("Ana Souza") },
  { id: "design", label: "Pricing page design", start: day(-6), end: day(1), status: "review", progress: 90, meta: person("Leyla Demir") },
  { id: "payments", label: "Card payment retries", start: day(-3), end: day(8), status: "progress", progress: 40, meta: person("Jonas Weber") },
  { id: "beta", label: "Checkout beta", start: day(10), status: "todo", milestone: true },
  { id: "driver", label: "Driver app offline mode", start: day(4), end: day(20), status: "todo", meta: person("Kenji Sato") },
  { id: "campaign", label: "Spring campaign brief", start: day(14), end: day(30), status: "backlog", meta: person("Theo Martin") },
  { id: "launch", label: "Pricing launch", start: day(24), status: "todo", milestone: true },
];

export default function Demo() {
  const now = useNow();
  const [scale, setScale] = React.useState<"day" | "week">("day");
  const items = React.useMemo(() => (now ? build(dayFrom(now)) : []), [now]);
  if (!now) return <div className="h-[26rem] w-full" />;
  const day = dayFrom(now);
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <ToggleGroup type="single" value={scale} onValueChange={(v) => v && setScale(v as "day" | "week")} aria-label="Scale" className="self-start">
        <ToggleGroupItem value="day">Days</ToggleGroupItem>
        <ToggleGroupItem value="week">Weeks</ToggleGroupItem>
      </ToggleGroup>
      <Timeline items={items} start={day(-21)} end={day(scale === "day" ? 21 : 60)} scale={scale} labelHeader="Work item" />
    </div>
  );
}
