"use client";

import * as React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const accents = [
  { id: "ember", label: "Ember", swatch: "oklch(0.64 0.165 47)" },
  { id: "cobalt", label: "Cobalt", swatch: "oklch(0.58 0.17 258)" },
  { id: "moss", label: "Moss", swatch: "oklch(0.6 0.12 145)" },
  { id: "plum", label: "Plum", swatch: "oklch(0.58 0.16 315)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.62 0.18 12)" },
  { id: "graphite", label: "Graphite", swatch: "oklch(0.45 0.012 65)" },
] as const;

type Theme = "system" | "light" | "dark";

const themes: { id: Theme; label: string; icon: typeof SunIcon }[] = [
  { id: "system", label: "Sistem", icon: MonitorIcon },
  { id: "light", label: "Açık", icon: SunIcon },
  { id: "dark", label: "Koyu", icon: MoonIcon },
];

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

// <html> niteliklerini dinle: başka sekme/kod değiştirse de seçici güncel kalır.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-accent"] });
  return () => observer.disconnect();
}

function useHtmlAttr<T extends string>(name: string, fallback: T): T {
  return React.useSyncExternalStore(
    subscribe,
    () => (document.documentElement.getAttribute(name) as T | null) ?? fallback,
    () => fallback,
  );
}

export function ThemeSwitcher() {
  const theme = useHtmlAttr<Theme>("data-theme", "system");
  const accent = useHtmlAttr("data-accent", "ember");

  function applyTheme(next: Theme) {
    const d = document.documentElement;
    if (next === "system") d.removeAttribute("data-theme");
    else d.setAttribute("data-theme", next);
    store("dx-theme", next === "system" ? null : next);
  }

  function applyAccent(next: string) {
    document.documentElement.setAttribute("data-accent", next);
    store("dx-accent", next);
  }

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Vurgu rengi" className="flex items-center gap-1">
        {accents.map((a) => (
          <button
            key={a.id}
            role="radio"
            aria-checked={accent === a.id}
            title={a.label}
            onClick={() => applyAccent(a.id)}
            className={cn(
              "grid size-5 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
              accent === a.id && "ring-2 ring-fg/80 ring-offset-2 ring-offset-bg",
            )}
          >
            <span className="size-3.5 rounded-full" style={{ background: a.swatch }} />
            <span className="sr-only">{a.label}</span>
          </button>
        ))}
      </div>

      <div role="radiogroup" aria-label="Tema" className="flex h-7 items-center rounded-md border border-border bg-bg-subtle p-0.5">
        {themes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="radio"
            aria-checked={theme === id}
            title={label}
            onClick={() => applyTheme(id)}
            className={cn(
              "grid h-full w-7 place-items-center rounded-sm text-fg-subtle outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
              theme === id && "bg-surface text-fg shadow-sm",
            )}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
