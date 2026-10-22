"use client";

import { Button } from "@/components/ui/button";
import { Toaster, toast } from "@/components/ui/toast";

import { Row } from "./_shared";

function saveSprint() {
  return new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Sprint 14" }), 1500));
}

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Type">
        <Button onClick={() => toast("Task moved to In review")}>Default</Button>
        <Button onClick={() => toast.success("Task created", { description: "DX-148 · Write release notes" })}>Success</Button>
        <Button onClick={() => toast.error("Couldn't upload file", { description: "roadmap.pdf is larger than 25 MB." })}>Error</Button>
        <Button onClick={() => toast.info("Maya joined the project")}>Info</Button>
        <Button onClick={() => toast.warning("Sprint ends tomorrow", { description: "6 tasks are still open." })}>Warning</Button>
      </Row>
      <Row label="More">
        <Button
          onClick={() =>
            toast("Task archived", {
              description: "DX-131 · Update onboarding copy",
              action: { label: "Undo", onClick: () => toast.success("Task restored") },
            })
          }
        >
          With action
        </Button>
        <Button
          onClick={() =>
            toast.promise(saveSprint(), {
              loading: "Saving sprint…",
              success: (sprint) => `${sprint.name} saved`,
              error: "Couldn't save the sprint",
            })
          }
        >
          Promise
        </Button>
        <Button onClick={() => toast("Deploy pinned", { duration: Infinity, description: "Stays until dismissed." })}>Persistent</Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </Row>
      {/* the docs layout has no Toaster, so this demo mounts its own */}
      <Toaster position="bottom-right" />
    </div>
  );
}
