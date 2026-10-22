"use client";

import { ArrowRightIcon } from "lucide-react";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Stat, StatGroup } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <StatGroup>
        <Stat label="Projects" value="6" hint="1 completed" />
        <Stat label="Tasks" value="50" hint="29 open" />
        <Stat label="Completion" value="42%" hint="across all projects" />
        <Stat label="Members" value="8" hint="1 pending invite" />
      </StatGroup>
      <Card className="max-w-sm">
        <CardHeader>
          <div>
            <CardTitle>Website redesign</CardTitle>
            <CardDescription>Due Nov 15 · 9 open tasks</CardDescription>
          </div>
          <StatusBadge status="progress" />
        </CardHeader>
        <CardContent>
          <Progress value={50} label="Website redesign progress" />
        </CardContent>
        <CardFooter>
          <AvatarGroup>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Alan Turing" />
          </AvatarGroup>
          <Button size="sm" variant="ghost" className="ml-auto">
            Open <ArrowRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
