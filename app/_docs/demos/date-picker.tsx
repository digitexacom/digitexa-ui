"use client";

import * as React from "react";

import { type DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Field, FieldControl, FieldDescription, FieldLabel } from "@/components/ui/field";

export default function Demo() {
  const [due, setDue] = React.useState<Date | undefined>();
  const [sprint, setSprint] = React.useState<DateRange | undefined>();

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel>Due date</FieldLabel>
        <FieldControl>
          <DatePicker value={due} onValueChange={setDue} placeholder="No due date" disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6} />
        </FieldControl>
        <FieldDescription>Weekends are unavailable.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Sprint</FieldLabel>
        <FieldControl>
          <DateRangePicker value={sprint} onValueChange={setSprint} placeholder="Pick start and end" />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Release (long format, small)</FieldLabel>
        <FieldControl>
          <DatePicker size="sm" defaultValue={new Date(2026, 11, 14)} formatOptions={{ weekday: "short", month: "long", day: "numeric", year: "numeric" }} />
        </FieldControl>
      </Field>
      <Field>
        <FieldLabel>Archived on</FieldLabel>
        <FieldControl>
          <DatePicker defaultValue={new Date(2026, 8, 30)} disabled />
        </FieldControl>
      </Field>
    </div>
  );
}
