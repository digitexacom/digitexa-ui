"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Issue = {
  id: string;
  title: string;
  assignee: string | null;
  priority: number;
  estimate: number | null;
  due: Date;
};

const titles = [
  "Offline sync for drafts",
  "Fix flaky login test",
  "Dark mode for charts",
  "Invite teammates by link",
  "Audit log export",
  "Keyboard shortcuts sheet",
  "Slack notifications",
  "Bulk edit labels",
  "Reduce bundle size",
  "Webhook retries",
  "Rename workspace",
  "Billing page redesign",
  "SAML single sign-on",
  "Archive old cycles",
];
const people = ["Ada", "Grace", "Alan", "Linus", null];
const priorities = ["None", "Urgent", "High", "Medium", "Low"];

const issues: Issue[] = titles.map((title, i) => ({
  id: `ENG-${120 + i}`,
  title,
  assignee: people[i % people.length],
  priority: (i % 4) + 1,
  estimate: i % 5 === 4 ? null : ((i * 3) % 8) + 1,
  due: new Date(2026, 10, 1 + ((i * 5) % 28)),
}));

const columns: DataTableColumn<Issue>[] = [
  { key: "id", header: "ID", sortable: true, width: 96, hideable: false, className: "font-mono text-sm text-fg-muted" },
  { key: "title", header: "Title", sortable: true, className: "text-fg" },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    width: 120,
    cell: (row) => <Badge>{priorities[row.priority]}</Badge>,
  },
  { key: "assignee", header: "Assignee", sortable: true, width: 120, cell: (row) => row.assignee ?? <span className="text-fg-subtle">Unassigned</span> },
  { key: "estimate", header: "Points", sortable: true, align: "right", width: 88 },
  {
    key: "due",
    header: "Due",
    sortable: true,
    align: "right",
    width: 112,
    cell: (row) => row.due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  },
];

export default function Demo() {
  const [selected, setSelected] = React.useState<string[]>(["ENG-121"]);
  const [opened, setOpened] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <DataTable
          aria-label="Issues"
          data={issues}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          filterable
          filterPlaceholder="Filter issues…"
          columnToggle
          toolbar={
            <Button variant="primary">
              <PlusIcon /> New issue
            </Button>
          }
          defaultSort={{ key: "due", direction: "asc" }}
          pageSize={5}
          onRowClick={(row) => setOpened(row.id)}
        />
        <p className="text-sm text-fg-muted">Last opened: {opened ?? "none"} (click a row or press Enter on it)</p>
      </div>

      {/* sticky header inside a fixed-height frame */}
      <DataTable aria-label="All issues" data={issues} columns={columns.slice(0, 4)} getRowId={(row) => row.id} stickyHeader maxHeight={240} />

      <DataTable aria-label="Archived issues" data={[] as Issue[]} columns={columns} emptyState="No archived issues yet." />
    </div>
  );
}
