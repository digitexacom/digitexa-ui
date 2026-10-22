"use client";

import * as React from "react";

import { Avatar } from "@/components/ui/avatar";
import { StatusIcon, statusIconLabels, type StatusIconStatus } from "@/components/ui/status-icon";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "just now", "5 minutes ago", "yesterday", "in 2 days". */
function formatRelativeTime(date: Date, now: Date, locale = "en-US") {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  if (Math.abs(seconds) < 45) return "just now";
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size || unit === "minute") return rtf.format(Math.round(seconds / size), unit);
  }
  return "";
}

/** Vertical feed. Items are joined by a connector line through their avatars. */
function ActivityFeed({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="activity-feed" className={cn("flex flex-col", className)} {...props} />;
}

type ActivityItemProps = Omit<React.ComponentProps<"li">, "content"> & {
  actor: { name: string; src?: string };
  /** The sentence after the actor's name: "moved <b>X</b> from Done to To do". */
  children: React.ReactNode;
  time: Date;
  /** Replaces the avatar with a small icon bubble, for system events. */
  icon?: React.ReactNode;
  /** Quoted block under the sentence, e.g. a comment body. */
  content?: React.ReactNode;
  locale?: string;
};

function ActivityItem({ actor, children, time, icon, content, locale, className, ...props }: ActivityItemProps) {
  const now = useNow();
  return (
    <li data-slot="activity-item" className={cn("group/activity relative flex gap-3 pb-4 last:pb-0", className)} {...props}>
      {/* connector: from below this avatar to the next one */}
      <span aria-hidden className="absolute top-7 bottom-1 left-3 w-px -translate-x-1/2 bg-border group-last/activity:hidden" />
      <span className="relative z-1 mt-0.5 shrink-0">
        {icon ? (
          <span className="grid size-6 place-items-center rounded-full border border-border bg-surface text-fg-muted [&_svg]:size-3.5">{icon}</span>
        ) : (
          <Avatar name={actor.name} src={actor.src} size="md" className="ring-2 ring-surface" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <p className="text-base leading-5 text-fg-muted">
          <span className="font-medium text-fg">{actor.name}</span> {children}
          {now && (
            <span aria-hidden className="text-fg-subtle">
              {" "}
              ·{" "}
            </span>
          )}
          <time
            dateTime={time.toISOString()}
            title={new Intl.DateTimeFormat(locale ?? "en-US", { dateStyle: "medium", timeStyle: "short" }).format(time)}
            className="text-sm whitespace-nowrap text-fg-subtle"
          >
            {now ? formatRelativeTime(time, now, locale) : null}
          </time>
        </p>
        {content && <div className="rounded-md border border-border bg-surface px-3 py-2 text-base text-fg">{content}</div>}
      </div>
    </li>
  );
}

/** Emphasized object in the sentence, e.g. a task title. */
function ActivityTarget({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="activity-target" className={cn("font-medium text-fg", className)} {...props} />;
}

/** Inline status with its icon: "from <ActivityStatus status="done" />". */
function ActivityStatus({ status, className, ...props }: React.ComponentProps<"span"> & { status: StatusIconStatus }) {
  return (
    <span data-slot="activity-status" className={cn("inline-flex items-center gap-1 align-top font-medium text-fg", className)} {...props}>
      <StatusIcon status={status} label="" />
      {statusIconLabels[status]}
    </span>
  );
}

export { ActivityFeed, ActivityItem, ActivityTarget, ActivityStatus, formatRelativeTime, type ActivityItemProps };
