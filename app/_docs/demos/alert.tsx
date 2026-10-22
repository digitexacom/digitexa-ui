"use client";

import * as React from "react";
import { CalendarClockIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Demo() {
  const [showTip, setShowTip] = React.useState(true);
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert variant="info">
        <AlertTitle>Sprint 14 starts Monday</AlertTitle>
        <AlertDescription>Unestimated issues in the backlog won&apos;t be pulled into the sprint.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Milestone reached</AlertTitle>
        <AlertDescription>All 24 issues in &ldquo;Website redesign&rdquo; are done.</AlertDescription>
      </Alert>
      <Alert
        variant="warning"
        action={
          <Button size="sm" variant="secondary">
            Review
          </Button>
        }
      >
        <AlertTitle>3 tasks are overdue</AlertTitle>
        <AlertDescription>Mobile onboarding slipped past its due date.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>GitHub sync failed</AlertTitle>
        <AlertDescription>
          Reconnect the integration in <a href="#preview">workspace settings</a>.
        </AlertDescription>
      </Alert>
      {showTip && (
        <Alert icon={<CalendarClockIcon aria-hidden />} onDismiss={() => setShowTip(false)}>
          <AlertDescription>Tip: press C anywhere to create a task.</AlertDescription>
        </Alert>
      )}
      <Alert variant="neutral" icon={false}>
        <AlertDescription>No icon, neutral: this project is read-only for guests.</AlertDescription>
      </Alert>
    </div>
  );
}
