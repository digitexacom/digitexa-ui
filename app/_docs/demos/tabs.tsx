"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Demo() {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="underline">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-3 text-sm text-fg-muted">
          Underline tabs for page-level sections.
        </TabsContent>
        <TabsContent value="activity" className="pt-3 text-sm text-fg-muted">
          Activity feed goes here.
        </TabsContent>
        <TabsContent value="files" className="pt-3 text-sm text-fg-muted">
          Files go here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
