"use client";

import { GitPullRequestIcon } from "lucide-react";

import * as React from "react";

import { ActivityFeed, ActivityItem, ActivityStatus, ActivityTarget } from "@/components/ui/activity-feed";
import { useNow } from "@/lib/use-now";

export default function Demo() {
  const now = useNow();
  return now ? <Feed now={now} /> : <div className="h-[22rem] w-full" />;
}

function Feed({ now }: { now: Date }) {
  // fixed on first render, so the relative times visibly age
  const [start] = React.useState(now.getTime());
  const ago = (minutes: number) => new Date(start - minutes * 60_000);
  return (
    <ActivityFeed className="max-w-xl">
      <ActivityItem actor={{ name: "Jonas Weber" }} time={ago(4)}>
        moved <ActivityTarget>Offline queue for delivery photos</ActivityTarget> from <ActivityStatus status="done" /> to{" "}
        <ActivityStatus status="todo" />
      </ActivityItem>
      <ActivityItem
        actor={{ name: "Mira Okafor" }}
        time={ago(52)}
        content="Retries should back off after the third attempt, otherwise the bank flags us. I've added the limit to the spec."
      >
        commented on <ActivityTarget>Checkout: retry failed card payments</ActivityTarget>
      </ActivityItem>
      <ActivityItem actor={{ name: "GitHub" }} icon={<GitPullRequestIcon />} time={ago(60 * 5)}>
        linked pull request <ActivityTarget>#482 Cart API client</ActivityTarget>
      </ActivityItem>
      <ActivityItem actor={{ name: "Leyla Demir" }} time={ago(60 * 26)}>
        set priority of <ActivityTarget>Pricing page design</ActivityTarget> to <ActivityTarget>High</ActivityTarget>
      </ActivityItem>
      <ActivityItem actor={{ name: "Theo Martin" }} time={ago(60 * 24 * 4)}>
        created the project <ActivityTarget>Pricing launch</ActivityTarget>
      </ActivityItem>
    </ActivityFeed>
  );
}
