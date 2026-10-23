import { ogContentType, ogSize, renderOg } from "./_docs/og";

export const alt = "Digitexa UI: open-source, copy-paste React components";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    title: "The component kit you copy, then own",
    description: "53 open-source React components with kanban, timeline and calendar built in.",
  });
}
