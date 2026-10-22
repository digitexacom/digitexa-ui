"use client";

import { FolderPlusIcon, InboxIcon, SearchXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Demo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EmptyState
        variant="dashed"
        icon={<FolderPlusIcon />}
        title="No projects yet"
        description="Projects group tasks, docs and milestones. Create one to get your team started."
        actions={
          <>
            <Button variant="primary">New project</Button>
            <Button>Import from CSV</Button>
          </>
        }
      />
      <EmptyState
        icon={<SearchXIcon />}
        title="No tasks match your filters"
        description="Try removing the “Assigned to me” filter or searching all projects."
        actions={<Button variant="ghost">Clear filters</Button>}
      />
      <EmptyState className="md:col-span-2" variant="dashed" icon={<InboxIcon />} title="Inbox zero" description="You're all caught up." />
    </div>
  );
}
