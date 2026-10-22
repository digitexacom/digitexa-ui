"use client";

import * as React from "react";

import { Calendar, type DateRange } from "@/components/ui/calendar";
import { useNow } from "@/lib/use-now";

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export default function Demo() {
  const now = useNow();
  // dates are relative to today, which is only known on the client
  return now ? <Calendars today={now} /> : <div className="h-72" />;
}

function Calendars({ today }: { today: Date }) {
  const [due, setDue] = React.useState<Date | undefined>(() => addDays(today, 3));
  const [sprint, setSprint] = React.useState<DateRange | undefined>(() => ({ from: today, to: addDays(today, 11) }));

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">Due date · workdays only</span>
        <div className="rounded-lg border border-border bg-surface p-2">
          <Calendar selected={due} onSelect={setDue} min={today} disabled={isWeekend} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">Sprint range</span>
        <div className="rounded-lg border border-border bg-surface p-2">
          <Calendar mode="range" selected={sprint} onSelect={setSprint} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">de-DE · week starts Sunday</span>
        <div className="rounded-lg border border-border bg-surface p-2">
          <Calendar locale="de-DE" weekStartsOn={0} showOutsideDays={false} labels={{ previousMonth: "Vorheriger Monat", nextMonth: "Nächster Monat" }} />
        </div>
      </div>
    </div>
  );
}
