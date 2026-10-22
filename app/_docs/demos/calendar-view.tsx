"use client";

import * as React from "react";

import { CalendarView, type CalendarEvent } from "@/components/ui/calendar-view";
import { useNow } from "@/lib/use-now";

// demo dates are relative to the viewer's today, so they never go stale
const dayFrom = (today: Date) => (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

const build = (day: (n: number) => Date): CalendarEvent[] => [
  { id: "e1", title: "Checkout discovery wrap-up", date: day(-8), status: "done" },
  { id: "e2", title: "Cart API cutover", date: day(-3), status: "done" },
  { id: "e3", title: "Design review", date: day(0), time: "10:00", status: "review" },
  { id: "e4", title: "Card retries standup", date: day(0), time: "11:30", status: "progress" },
  { id: "e5", title: "Pricing copy due", date: day(0), status: "progress" },
  { id: "e6", title: "Vendor call", date: day(0), time: "16:00", status: "todo" },
  { id: "e7", title: "Driver app QA", date: day(2), end: day(4), status: "progress" },
  { id: "e8", title: "Checkout beta", date: day(10), status: "todo" },
  { id: "e9", title: "Retro", date: day(6), time: "15:00", status: "todo" },
  { id: "e10", title: "Spring campaign kickoff", date: day(14), status: "backlog" },
  { id: "e11", title: "Pricing launch", date: day(24), status: "todo" },
];

export default function Demo() {
  const now = useNow();
  const events = React.useMemo(() => (now ? build(dayFrom(now)) : []), [now]);
  const [picked, setPicked] = React.useState<string>("Click an event or a day.");
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return (
    <div className="flex w-full flex-col gap-2">
      <CalendarView
        events={events}
        onEventClick={(e) => setPicked(`Opened “${e.title}”`)}
        onDayClick={(d, list) => setPicked(`${fmt.format(d)}: ${list.length} ${list.length === 1 ? "event" : "events"}`)}
      />
      <p className="text-sm text-fg-muted" aria-live="polite">
        {picked}
      </p>
    </div>
  );
}
