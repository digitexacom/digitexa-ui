import { BookOpenIcon, GlobeIcon, MegaphoneIcon, PaletteIcon, RocketIcon, SmartphoneIcon } from "lucide-react";

// Fictional data shared by the example pages.
export type Health = "on-track" | "planning" | "at-risk" | "completed";

export const health: Record<Health, { label: string; variant: "info" | "neutral" | "danger" | "success" }> = {
  "on-track": { label: "On track", variant: "info" },
  planning: { label: "Planning", variant: "neutral" },
  "at-risk": { label: "At risk", variant: "danger" },
  completed: { label: "Completed", variant: "success" },
};

// icon tints reuse the status palette, so every accent and theme stays coherent
export const tints = {
  todo: "bg-status-todo-subtle text-status-todo-fg",
  review: "bg-status-review-subtle text-status-review-fg",
  progress: "bg-status-progress-subtle text-status-progress-fg",
  done: "bg-status-done-subtle text-status-done-fg",
  danger: "bg-danger-subtle text-danger-fg-subtle",
} as const;

export const projects = [
  { name: "Storefront rebuild", icon: GlobeIcon, tint: tints.todo, lead: "Mira Okafor", health: "on-track", progress: 58, open: 11, overdue: 2, due: "Nov 18", starred: true },
  { name: "Driver app", icon: SmartphoneIcon, tint: tints.review, lead: "Jonas Weber", health: "on-track", progress: 64, open: 5, overdue: 0, due: "Dec 09", starred: true },
  { name: "Spring campaign", icon: MegaphoneIcon, tint: tints.danger, lead: "Leyla Demir", health: "planning", progress: 12, open: 8, overdue: 1, due: "Jan 20" },
  { name: "Pricing launch", icon: RocketIcon, tint: tints.progress, lead: "Theo Martin", health: "at-risk", progress: 21, open: 7, overdue: 3, due: "Nov 04" },
  { name: "Component library", icon: PaletteIcon, tint: tints.review, lead: "Mira Okafor", health: "on-track", progress: 37, open: 6, overdue: 0, due: "Dec 30" },
  { name: "Help center", icon: BookOpenIcon, tint: tints.done, lead: "Leyla Demir", health: "completed", progress: 100, open: 0, overdue: 0, due: "Oct 02", locked: true },
] as const satisfies readonly {
  name: string;
  icon: typeof GlobeIcon;
  tint: string;
  lead: string;
  health: Health;
  progress: number;
  open: number;
  overdue: number;
  due: string;
  starred?: boolean;
  locked?: boolean;
}[];
