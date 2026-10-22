"use client";

import * as React from "react";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/* ---------- store: a tiny external store read with useSyncExternalStore ---------- */

type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";
type ToastId = string | number;

type ToastAction = { label: React.ReactNode; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void };

type ToastOptions = {
  /** Reuse an id to update a toast in place instead of adding a new one. */
  id?: ToastId;
  description?: React.ReactNode;
  action?: ToastAction;
  /** Milliseconds; `Infinity` keeps it until dismissed. Default 4000 (loading toasts never expire). */
  duration?: number;
  /** Hide the close button. */
  dismissible?: boolean;
  onDismiss?: (id: ToastId) => void;
};

type ToastData = ToastOptions & {
  id: ToastId;
  type: ToastType;
  title: React.ReactNode;
  /** bumped on every update so the timer restarts */
  version: number;
  closing: boolean;
};

const DEFAULT_DURATION = 4000;
const EXIT_MS = 200;
const MAX_STORED = 20;

let toasts: ToastData[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const empty: ToastData[] = [];

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function upsert(type: ToastType, title: React.ReactNode, options: ToastOptions = {}): ToastId {
  const id = options.id ?? `dx-toast-${++counter}`;
  const existing = toasts.find((t) => t.id === id);
  if (existing) {
    toasts = toasts.map((t) =>
      t.id === id ? { ...t, ...options, id, type, title, version: t.version + 1, closing: false } : t,
    );
  } else {
    toasts = [...toasts, { ...options, id, type, title, version: 0, closing: false }].slice(-MAX_STORED);
  }
  emit();
  return id;
}

function dismiss(id?: ToastId) {
  const targets = toasts.filter((t) => !t.closing && (id === undefined || t.id === id));
  if (targets.length === 0) return;
  const ids = new Set(targets.map((t) => t.id));
  toasts = toasts.map((t) => (ids.has(t.id) ? { ...t, closing: true } : t));
  emit();
  for (const t of targets) t.onDismiss?.(t.id);
  // let the exit animation play, then drop them
  setTimeout(() => {
    toasts = toasts.filter((t) => !(ids.has(t.id) && t.closing));
    emit();
  }, EXIT_MS);
}

type PromiseMessages<T> = {
  loading: React.ReactNode;
  success: React.ReactNode | ((value: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
};

function promise<T>(input: Promise<T> | (() => Promise<T>), messages: PromiseMessages<T>, options: Omit<ToastOptions, "id"> = {}) {
  const id = upsert("loading", messages.loading, { ...options, duration: Infinity });
  const p = typeof input === "function" ? input() : input;
  p.then(
    (value) => {
      const title = typeof messages.success === "function" ? messages.success(value) : messages.success;
      upsert("success", title, { ...options, id });
    },
    (error: unknown) => {
      const title = typeof messages.error === "function" ? messages.error(error) : messages.error;
      upsert("error", title, { ...options, id });
    },
  );
  return p;
}

/**
 * toast("Saved") · toast.success("Task created", { description, action }) · toast.error(...)
 * toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })
 * toast.dismiss(id) — or toast.dismiss() for all. Mount <Toaster /> once.
 */
const toast = Object.assign((title: React.ReactNode, options?: ToastOptions) => upsert("default", title, options), {
  success: (title: React.ReactNode, options?: ToastOptions) => upsert("success", title, options),
  error: (title: React.ReactNode, options?: ToastOptions) => upsert("error", title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) => upsert("warning", title, options),
  info: (title: React.ReactNode, options?: ToastOptions) => upsert("info", title, options),
  loading: (title: React.ReactNode, options?: ToastOptions) => upsert("loading", title, options),
  promise,
  dismiss,
});

function useToasts() {
  return React.useSyncExternalStore(
    subscribe,
    () => toasts,
    () => empty,
  );
}

/* ---------- UI ---------- */

type ToasterPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

const positions: Record<ToasterPosition, string> = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
};

const icons: Partial<Record<ToastType, React.ReactNode>> = {
  success: <CircleCheckIcon className="text-success" aria-hidden />,
  error: <CircleAlertIcon className="text-danger" aria-hidden />,
  warning: <TriangleAlertIcon className="text-warning" aria-hidden />,
  info: <InfoIcon className="text-info" aria-hidden />,
  loading: <Spinner size="md" className="text-fg-muted" aria-hidden />,
};

type ToasterProps = React.ComponentProps<"section"> & {
  position?: ToasterPosition;
  /** How many toasts show at once; newer ones push older ones into a queue. */
  visibleToasts?: number;
  /** Default duration for toasts that don't set one. */
  duration?: number;
};

function Toaster({ className, position = "bottom-right", visibleToasts = 3, duration = DEFAULT_DURATION, ...props }: ToasterProps) {
  const all = useToasts();
  const [paused, setPaused] = React.useState(false);
  const isTop = position.startsWith("top");
  const visible = all.slice(-visibleToasts);
  // newest sits closest to the screen edge
  const ordered = isTop ? [...visible].reverse() : visible;

  return (
    <section
      data-slot="toaster"
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
      className={cn("pointer-events-none fixed z-(--dx-z-toast) flex flex-col p-3 sm:p-4", positions[position], className)}
      {...props}
    >
      <ol
        className="flex w-[356px] max-w-[calc(100vw-1.5rem)] flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
        }}
      >
        {ordered.map((t) => (
          <ToastItem key={t.id} toast={t} paused={paused} defaultDuration={duration} fromTop={isTop} />
        ))}
      </ol>
    </section>
  );
}

function ToastItem({
  toast: t,
  paused,
  defaultDuration,
  fromTop,
}: {
  toast: ToastData;
  paused: boolean;
  defaultDuration: number;
  fromTop: boolean;
}) {
  const duration = t.type === "loading" ? Infinity : (t.duration ?? defaultDuration);
  const remaining = React.useRef(duration);

  // an update (e.g. promise settled) restarts the countdown
  React.useEffect(() => {
    remaining.current = duration;
  }, [t.version, duration]);

  React.useEffect(() => {
    if (paused || t.closing || !Number.isFinite(duration)) return;
    const start = Date.now();
    const timer = setTimeout(() => dismiss(t.id), Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - start;
    };
  }, [paused, t.closing, t.id, t.version, duration]);

  const icon = icons[t.type];

  return (
    // padding instead of gap: no dead zone between toasts, so hover-pause doesn't flicker
    <li className="pointer-events-auto w-full py-1">
      <div
        data-slot="toast"
        data-type={t.type}
        data-state={t.closing ? "closed" : "open"}
        style={{ "--dx-float-y": fromTop ? "-8px" : "8px" } as React.CSSProperties}
        className={cn(
          "flex w-full items-start gap-2.5 rounded-lg border border-border bg-surface-raised p-3 text-fg shadow-lg",
          "[&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
          "data-[state=open]:animate-[dx-float-in_var(--dx-motion-slow)_var(--dx-motion-ease)]",
          "data-[state=closed]:animate-[dx-fade-out_var(--dx-motion-fast)_ease-in_forwards]",
        )}
      >
        {icon}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="text-base font-medium">{t.title}</div>
          {t.description && <div className="text-sm text-fg-muted">{t.description}</div>}
        </div>
        {t.action && (
          <Button
            size="sm"
            className="-my-0.5 shrink-0"
            onClick={(e) => {
              t.action?.onClick(e);
              if (!e.defaultPrevented) dismiss(t.id);
            }}
          >
            {t.action.label}
          </Button>
        )}
        {t.dismissible !== false && (
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="-my-0.5 -mr-1 grid size-6 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-muted hover:text-fg"
          >
            <XIcon className="size-3.5" aria-hidden />
            <span className="sr-only">Dismiss notification</span>
          </button>
        )}
      </div>
    </li>
  );
}

export { Toaster, toast, useToasts, type ToasterProps, type ToastOptions, type ToastType, type ToastId };
