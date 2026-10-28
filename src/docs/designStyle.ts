import { useEffect, useState } from "react";

/** Docs-wide design style: solid surfaces, frosted glass or Liquid (clear glass). */
export type DesignStyle = "solid" | "frosted" | "liquid";


const isStyle = (v: string | null): v is DesignStyle => v === "solid" || v === "frosted" || v === "liquid";
const EVENT = "nr-design-style";

// Current value shared by every hook instance; the URL param is only honoured on first load.
let current: DesignStyle | null = null;

function readInitial(): DesignStyle {
  if (current) return current;
  current = readFromEnvironment();
  return current;
}

function readFromEnvironment(): DesignStyle {
  const params = new URLSearchParams(window.location.search);
  const param = params.get("style") ?? params.get("glass");
  if (isStyle(param)) return param;
  try {
    const saved = localStorage.getItem("nr-style") ?? localStorage.getItem("nr-glass");
    if (isStyle(saved)) return saved;
  } catch { /* ignore */ }
  return "frosted";
}

/**
 * Shared between the docs header and the dashboards. Applies <html data-glass="…">,
 * persists the choice and keeps every mounted switch in sync.
 */
export function useDesignStyle() {
  const [style, setStyleState] = useState<DesignStyle>(readInitial);

  useEffect(() => {
    document.documentElement.dataset.glass = style;
    try { localStorage.setItem("nr-style", style); } catch { /* ignore */ }
  }, [style]);

  useEffect(() => {
    const onChange = (e: Event) => setStyleState((e as CustomEvent<DesignStyle>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const setStyle = (next: DesignStyle) => {
    current = next;
    setStyleState(next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  };

  return [style, setStyle] as const;
}
