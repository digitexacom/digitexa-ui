import type { Metadata } from "next";

import { pageMetadata } from "../../_docs/seo";

import { ExampleShell } from "../_shell/shell";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = pageMetadata({ path: "/examples/settings", title: "Settings example", description: "Example settings screen built only from Digitexa UI components: theme cards, accent, density, motion and account forms.", type: "website" });

export default function SettingsExample() {
  return (
    <ExampleShell page="settings" title="Settings">
      <SettingsView />
    </ExampleShell>
  );
}
