"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  AtSignIcon,
  BuildingIcon,
  CalendarClockIcon,
  CheckIcon,
  CreditCardIcon,
  FolderIcon,
  GemIcon,
  KeyRoundIcon,
  KeyboardIcon,
  LanguagesIcon,
  MailIcon,
  MonitorIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  PaletteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  SmartphoneIcon,
  SunIcon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { accents, setHtmlAttr, useHtmlAttr } from "../../_docs/theme-switcher";

// ------------------------------------------------------------------ nav

const nav = [
  {
    title: "General",
    items: [
      { id: "workspace", label: "Workspace", icon: BuildingIcon },
      { id: "appearance", label: "Appearance", icon: PaletteIcon },
      { id: "language", label: "Language", icon: LanguagesIcon },
      { id: "datetime", label: "Date & time", icon: CalendarClockIcon },
    ],
  },
  {
    title: "Workspace",
    items: [
      { id: "members", label: "Members", icon: UsersIcon },
      { id: "teams", label: "Teams", icon: UsersRoundIcon },
      { id: "projects", label: "Projects", icon: FolderIcon },
      { id: "permissions", label: "Permissions", icon: ShieldIcon },
    ],
  },
  {
    title: "Notifications",
    items: [
      { id: "email", label: "Email", icon: MailIcon },
      { id: "push", label: "Push", icon: SmartphoneIcon },
      { id: "mentions", label: "Mentions", icon: AtSignIcon },
      { id: "assignments", label: "Task assignments", icon: UserCheckIcon },
    ],
  },
  {
    title: "Personal",
    items: [
      { id: "profile", label: "Profile", icon: UserIcon },
      { id: "preferences", label: "Preferences", icon: SlidersHorizontalIcon },
      { id: "shortcuts", label: "Keyboard shortcuts", icon: KeyboardIcon },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "password", label: "Password", icon: KeyRoundIcon },
      { id: "sessions", label: "Sessions", icon: MonitorSmartphoneIcon },
      { id: "2fa", label: "Two-factor authentication", icon: ShieldCheckIcon },
    ],
  },
  {
    title: "Billing",
    items: [
      { id: "plan", label: "Plan", icon: GemIcon },
      { id: "payment", label: "Payment", icon: CreditCardIcon },
    ],
  },
] as const;

type SectionId = (typeof nav)[number]["items"][number]["id"];
type NavItem = { id: SectionId; label: string; icon: React.ComponentType };
const allItems: NavItem[] = nav.flatMap((g): NavItem[] => [...g.items]);

// ------------------------------------------------------------------ layout pieces

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-0.5 text-fg-muted">{description}</p>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="border-b border-border pb-2 text-md font-semibold">{title}</h2>
      {children}
    </section>
  );
}

/** Label + description on the left, control on the right; stacks on narrow screens. */
function Row({ title, description, htmlFor, children }: { title: string; description?: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="font-medium">
          {title}
        </label>
        {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ------------------------------------------------------------------ appearance

// Fixed palettes for the theme thumbnails: they must look light/dark whatever the current theme is.
const preview = {
  light: { bg: "oklch(0.984 0.004 80)", side: "oklch(0.948 0.008 76)", line: "oklch(0.88 0.01 75)", ink: "oklch(0.25 0.012 65)" },
  dark: { bg: "oklch(0.2 0.007 62)", side: "oklch(0.16 0.006 60)", line: "oklch(0.33 0.01 66)", ink: "oklch(0.92 0.006 80)" },
};

function Thumb({ mode }: { mode: "light" | "dark" }) {
  const p = preview[mode];
  return (
    <div className="flex h-full flex-1" style={{ background: p.bg }}>
      <div className="flex w-1/4 flex-col gap-1 p-1.5" style={{ background: p.side }}>
        <span className="h-1 w-3/4 rounded-full bg-accent" />
        <span className="h-1 w-full rounded-full" style={{ background: p.line }} />
        <span className="h-1 w-2/3 rounded-full" style={{ background: p.line }} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <span className="h-1.5 w-1/3 rounded-full" style={{ background: p.ink }} />
        <span className="h-1 w-5/6 rounded-full" style={{ background: p.line }} />
        <span className="h-1 w-2/3 rounded-full" style={{ background: p.line }} />
        <span className="mt-1 h-2 w-1/4 rounded-sm bg-accent" />
      </div>
    </div>
  );
}

function ThemePreview({ mode }: { mode: "light" | "dark" | "system" }) {
  return (
    <div className="flex h-24 overflow-hidden rounded-md border border-border">
      {mode === "system" ? (
        <>
          <Thumb mode="light" />
          <Thumb mode="dark" />
        </>
      ) : (
        <Thumb mode={mode} />
      )}
    </div>
  );
}

function Appearance() {
  const theme = useHtmlAttr("data-theme", "system");
  const accent = useHtmlAttr("data-accent", "ember");
  const density = useHtmlAttr("data-density", "default");
  const sidebarDensity = useHtmlAttr("data-sidebar-density", "default");
  const motion = useHtmlAttr("data-motion", "system");

  const themes = [
    { id: "light", label: "Light", icon: SunIcon },
    { id: "dark", label: "Dark", icon: MoonIcon },
    { id: "system", label: "System", icon: MonitorIcon },
  ] as const;

  return (
    <>
      <PageHeader title="Appearance" description="Customize how Northwind looks on this device." />

      <Group title="Theme">
        <RadioGroup
          aria-label="Theme"
          value={theme}
          onValueChange={(v) => setHtmlAttr("data-theme", v === "system" ? null : v, "dx-theme")}
          className="mt-4 grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {themes.map(({ id, label, icon: Icon }) => (
            <RadioCard key={id} value={id} aria-label={label}>
              <ThemePreview mode={id} />
              <span className="flex items-center gap-1.5 px-1 pb-0.5 font-medium [&_svg]:size-3.5 [&_svg]:text-fg-subtle">
                <Icon /> {label}
              </span>
            </RadioCard>
          ))}
        </RadioGroup>
      </Group>

      <Group title="Accent color">
        <Row title="Accent" description="Used for primary buttons, focus rings and selection.">
          <RadioGroupPrimitive.Root
            aria-label="Accent color"
            value={accent}
            onValueChange={(v) => setHtmlAttr("data-accent", v, "dx-accent")}
            className="flex gap-2"
          >
            {accents.map((a) => (
              <RadioGroupPrimitive.Item
                key={a}
                value={a}
                aria-label={a}
                title={a[0].toUpperCase() + a.slice(1)}
                data-accent={a}
                className={cn(
                  "grid size-7 place-items-center rounded-full bg-accent text-accent-fg",
                  "ring-offset-2 ring-offset-surface data-[state=checked]:ring-2 data-[state=checked]:ring-accent",
                )}
              >
                <RadioGroupPrimitive.Indicator>
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroupPrimitive.Root>
        </Row>
      </Group>

      <Group title="Density">
        <Row title="Interface density" description="Type, control and row sizes across the whole app.">
          <ToggleGroup
            type="single"
            aria-label="Interface density"
            value={density}
            onValueChange={(v) => v && setHtmlAttr("data-density", v === "default" ? null : v, "dx-density")}
          >
            <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            <ToggleGroupItem value="default">Default</ToggleGroupItem>
            <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
          </ToggleGroup>
        </Row>
        <Row title="Sidebar density" description="Compact fits more projects on screen.">
          <ToggleGroup
            type="single"
            aria-label="Sidebar density"
            value={sidebarDensity}
            onValueChange={(v) => v && setHtmlAttr("data-sidebar-density", v === "compact" ? v : null, "dx-sidebar-density")}
          >
            <ToggleGroupItem value="default">Default</ToggleGroupItem>
            <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
          </ToggleGroup>
        </Row>
        <Row title="Motion" description="Animations for drawers, menus, dialogs and transitions." htmlFor="motion">
          <Select value={motion} onValueChange={(v) => setHtmlAttr("data-motion", v === "system" ? null : v, "dx-motion")}>
            <SelectTrigger id="motion" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Match system</SelectItem>
              <SelectItem value="reduce">Reduce motion</SelectItem>
              <SelectItem value="full">Full motion</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Group>
    </>
  );
}

// ------------------------------------------------------------------ other sections

function SaveBar({ dirty, onSave }: { dirty: boolean; onSave: () => void }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      {saved && !dirty && (
        <span className="flex items-center gap-1 text-sm text-success-fg">
          <CheckIcon className="size-3.5" /> Saved
        </span>
      )}
      <Button
        variant="primary"
        disabled={!dirty}
        onClick={() => {
          onSave();
          setSaved(true);
        }}
      >
        Save changes
      </Button>
    </div>
  );
}

function Workspace() {
  const initial = { name: "Northwind Studio", slug: "northwind" };
  const [form, setForm] = React.useState(initial);
  const [saved, setSaved] = React.useState(initial);
  const dirty = form.name !== saved.name || form.slug !== saved.slug;
  return (
    <>
      <PageHeader title="Workspace" description="Name, address and logo shared by everyone in the workspace." />
      <Group title="General">
        <Row title="Logo" description="Square image, at least 128 × 128.">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-accent text-md font-bold text-accent-fg">{form.name[0] ?? "?"}</span>
            <Button size="sm">Upload</Button>
          </div>
        </Row>
        <Row title="Name" htmlFor="ws-name">
          <Input id="ws-name" className="w-64" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Row>
        <Row title="URL" description="Changing it breaks existing links." htmlFor="ws-slug">
          <div className="flex w-64 items-center overflow-hidden rounded-md border border-input bg-surface shadow-sm focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20">
            <span className="border-r border-border bg-bg-subtle px-2 py-1.5 text-sm text-fg-subtle">northwind.app/</span>
            <input
              id="ws-slug"
              className="h-(--dx-control-md) min-w-0 flex-1 bg-transparent px-2 outline-none"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            />
          </div>
        </Row>
        <SaveBar dirty={dirty} onSave={() => setSaved(form)} />
      </Group>

      <Group title="Danger zone">
        <Row title="Delete workspace" description="Removes all projects, tasks and files. This can’t be undone.">
          <DeleteWorkspace name={saved.name} />
        </Row>
      </Group>
    </>
  );
}

function DeleteWorkspace({ name }: { name: string }) {
  const [confirm, setConfirm] = React.useState("");
  return (
    <Dialog onOpenChange={() => setConfirm("")}>
      <DialogTrigger asChild>
        <Button variant="danger">Delete workspace…</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete {name}?</DialogTitle>
          <DialogDescription>Everything in this workspace is deleted for every member.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Label htmlFor="confirm-name">
            Type <b className="font-semibold">{name}</b> to confirm
          </Label>
          <Input id="confirm-name" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger" disabled={confirm !== name}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Profile() {
  const initial = { name: "Mira Okafor", email: "mira@northwind.example", role: "design", bio: "" };
  const [form, setForm] = React.useState(initial);
  const [saved, setSaved] = React.useState(initial);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  return (
    <>
      <PageHeader title="Profile" description="How you appear to others in Northwind." />
      <Group title="Personal info">
        <Row title="Photo">
          <div className="flex items-center gap-3">
            <Avatar name={form.name || "?"} size="xl" />
            <Button size="sm">Change</Button>
            <Button size="sm" variant="ghost">
              Remove
            </Button>
          </div>
        </Row>
        <Row title="Full name" htmlFor="p-name">
          <Input id="p-name" className="w-64" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Row>
        <Row title="Email" description="Used for sign-in and notifications." htmlFor="p-email">
          <Input
            id="p-email"
            type="email"
            className="w-64"
            value={form.email}
            aria-invalid={!/^\S+@\S+\.\S+$/.test(form.email) || undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Row>
        <Row title="Team" htmlFor="p-role">
          <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
            <SelectTrigger id="p-role" className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <div className="flex flex-col gap-1.5 border-b border-border py-4">
          <Label htmlFor="p-bio">Bio</Label>
          <Textarea id="p-bio" placeholder="A line or two about what you work on." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <SaveBar dirty={dirty && /^\S+@\S+\.\S+$/.test(form.email)} onSave={() => setSaved(form)} />
      </Group>
    </>
  );
}

function NotificationSettings({ channel }: { channel: "email" | "push" | "mentions" | "assignments" }) {
  const copy = {
    email: { title: "Email", description: "What we send to mira@northwind.example." },
    push: { title: "Push", description: "Notifications on your phone and desktop." },
    mentions: { title: "Mentions", description: "When someone @mentions you or your team." },
    assignments: { title: "Task assignments", description: "When work is assigned to you or changes hands." },
  }[channel];
  const rows = [
    { id: "assigned", title: "Assigned to me", description: "A task is assigned to you.", on: true },
    { id: "status", title: "Status changes", description: "A task you follow changes status.", on: true },
    { id: "comments", title: "Comments", description: "Someone replies on a task you follow.", on: channel !== "push" },
    { id: "due", title: "Due soon", description: "A day before something you own is due.", on: false },
    { id: "digest", title: "Weekly digest", description: "A summary of the week every Monday.", on: channel === "email" },
  ];
  return (
    <>
      <PageHeader title={copy.title} description={copy.description} />
      <Group title="Notify me about">
        {rows.map((r) => (
          <Row key={`${channel}-${r.id}`} title={r.title} description={r.description} htmlFor={`${channel}-${r.id}`}>
            <Switch id={`${channel}-${r.id}`} defaultChecked={r.on} />
          </Row>
        ))}
      </Group>
    </>
  );
}

function Placeholder({ id }: { id: SectionId }) {
  const item = allItems.find((i) => i.id === id)!;
  const Icon = item.icon;
  return (
    <>
      <PageHeader title={item.label} description="Settings for this section." />
      <div className="grid place-items-center rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
        <span className="mb-3 grid size-10 place-items-center rounded-lg bg-muted text-fg-subtle [&_svg]:size-5">
          <Icon />
        </span>
        <p className="font-medium">Not part of the example yet</p>
        <p className="mt-0.5 max-w-xs text-sm text-fg-muted">Appearance, Workspace, Profile and the Notifications pages are wired up.</p>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ view

export function SettingsView() {
  const [section, setSection] = React.useState<SectionId>("appearance");

  // deep-linkable: /examples/settings#profile
  React.useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (allItems.some((i) => i.id === id)) setSection(id as SectionId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <div className="flex min-h-0 flex-1">
      <nav aria-label="Settings" className="w-60 shrink-0 overflow-y-auto border-r border-border px-3 py-5 max-md:hidden">
        {nav.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="px-2 pb-1 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{group.title}</div>
            {group.items.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={section === id ? "page" : undefined}
                className={cn(
                  "flex h-(--dx-control-md) items-center gap-2 rounded-md px-2 text-fg-muted hover:bg-muted hover:text-fg",
                  "[&_svg]:size-4 [&_svg]:text-fg-subtle",
                  "aria-[current=page]:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-fg aria-[current=page]:shadow-sm aria-[current=page]:[&_svg]:text-fg",
                )}
              >
                <Icon /> <span className="truncate">{label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>

      <main className="min-w-0 flex-1 overflow-y-auto">
        {/* mobile: section picker instead of the nav column */}
        <div className="border-b border-border p-3 md:hidden">
          <Select value={section} onValueChange={(v) => (window.location.hash = v)}>
            <SelectTrigger aria-label="Settings section">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allItems.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-10">
          {section === "appearance" ? (
            <Appearance />
          ) : section === "workspace" ? (
            <Workspace />
          ) : section === "profile" ? (
            <Profile />
          ) : section === "email" || section === "push" || section === "mentions" || section === "assignments" ? (
            <NotificationSettings channel={section} />
          ) : (
            <Placeholder id={section} />
          )}
        </div>
      </main>
    </div>
  );
}

