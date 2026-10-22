"use client";

import * as React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip } from "@/components/ui/tooltip";

export const accents = ["ember", "cobalt", "moss", "plum", "rose", "graphite"] as const;

const themes = [
  { id: "system", label: "System", icon: MonitorIcon },
  { id: "light", label: "Light", icon: SunIcon },
  { id: "dark", label: "Dark", icon: MoonIcon },
] as const;

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

// Watch <html> attributes so the switcher stays in sync if other code changes them.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-accent", "data-density"] });
  return () => observer.disconnect();
}

function useHtmlAttr(name: string, fallback: string) {
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute(name) ?? fallback,
    () => fallback,
  );
}

function setHtmlAttr(name: string, value: string | null, storageKey: string) {
  const d = document.documentElement;
  if (value === null) d.removeAttribute(name);
  else d.setAttribute(name, value);
  store(storageKey, value);
}

export function ThemeSwitcher() {
  const theme = useHtmlAttr("data-theme", "system");
  const accent = useHtmlAttr("data-accent", "ember");
  const density = useHtmlAttr("data-density", "comfortable");

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        aria-label="Accent color"
        value={accent}
        onValueChange={(v) => v && setHtmlAttr("data-accent", v, "dx-accent")}
        className="max-sm:hidden"
      >
        {accents.map((id) => (
          <Tooltip key={id} content={id[0].toUpperCase() + id.slice(1)}>
            <ToggleGroupItem value={id} aria-label={id} className="min-w-0 px-1">
              {/* the swatch reads the real token by scoping data-accent to itself */}
              <span data-accent={id} className="size-3 rounded-full bg-accent" />
            </ToggleGroupItem>
          </Tooltip>
        ))}
      </ToggleGroup>

      <ToggleGroup
        type="single"
        aria-label="Density"
        value={density}
        onValueChange={(v) => v && setHtmlAttr("data-density", v === "compact" ? v : null, "dx-density")}
        className="max-md:hidden"
      >
        <ToggleGroupItem value="comfortable">Default</ToggleGroupItem>
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        type="single"
        aria-label="Theme"
        value={theme}
        onValueChange={(v) => v && setHtmlAttr("data-theme", v === "system" ? null : v, "dx-theme")}
      >
        {themes.map(({ id, label, icon: Icon }) => (
          <Tooltip key={id} content={label}>
            <ToggleGroupItem value={id} aria-label={label} className="px-1.5">
              <Icon />
            </ToggleGroupItem>
          </Tooltip>
        ))}
      </ToggleGroup>
    </div>
  );
}
