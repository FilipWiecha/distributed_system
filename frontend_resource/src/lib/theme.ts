import { useSyncExternalStore } from "react";

export type ThemeMode = "system" | "light" | "dark";

const KEY = "theme";
const listeners = new Set<() => void>();
const media =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

export function getMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "light";
  } catch {
    return "light";
  }
}

function resolve(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? (media?.matches ? "dark" : "light") : mode;
}

function apply() {
  document.documentElement.dataset.theme = resolve(getMode());
}

export function setMode(mode: ThemeMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* pamięć niedostępna – motyw obowiązuje do końca sesji */
  }
  apply();
  listeners.forEach((l) => l());
}

media?.addEventListener("change", () => {
  if (getMode() === "system") {
    apply();
    listeners.forEach((l) => l());
  }
});

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme() {
  const mode = useSyncExternalStore(
    subscribe,
    getMode,
    () => "light" as ThemeMode,
  );
  const resolved = useSyncExternalStore(
    subscribe,
    () => resolve(getMode()),
    () => "light" as const,
  );
  return { mode, resolved, setMode };
}
