import type { Metadata } from "next";

import { ExampleShell } from "../_shell/shell";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Settings", description: "Example settings screen built only from Digitexa UI components." };

export default function SettingsExample() {
  return (
    <ExampleShell page="settings" title="Settings">
      <SettingsView />
    </ExampleShell>
  );
}
