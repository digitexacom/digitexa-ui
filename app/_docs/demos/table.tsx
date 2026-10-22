"use client";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Demo() {
  const rows = [
    { name: "Website redesign", lead: "Ada Lovelace", status: "progress", pct: 50 },
    { name: "Mobile app", lead: "Alan Turing", status: "review", pct: 72 },
    { name: "Brand refresh", lead: "Grace Hopper", status: "done", pct: 100 },
  ] as const;
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-40">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Avatar name={r.lead} size="sm" />
                  {r.lead.split(" ")[0]}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Progress value={r.pct} tone={r.pct === 100 ? "success" : "accent"} label={`${r.name} progress`} />
                  <span className="w-8 text-right text-xs text-fg-muted tabular-nums">{r.pct}%</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
