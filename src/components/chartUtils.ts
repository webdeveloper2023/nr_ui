// Shared building blocks of the charts: scales, ticks, paths, number formatting,
// container measuring and value tweening. Everything is plain SVG math — no chart library.
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useBreakpoint, type Breakpoint } from "./breakpoints";
import type { NRLocale } from "./locale";

/** Series colors of the shared chart palette (fixed order; series take them by position) */
export type ChartColor = "blue" | "green" | "purple" | "orange" | "cyan" | "amber" | "indigo" | "pink";

export const CHART_COLORS: readonly ChartColor[] = ["blue", "green", "purple", "orange", "cyan", "amber", "indigo", "pink"];

/** CSS color of a series: its own color, else the palette slot of its position */
export function seriesColor(index: number, color?: ChartColor | string): string {
  if (color) {
    const slot = CHART_COLORS.indexOf(color as ChartColor);
    return slot >= 0 ? `var(--color-chart-${slot + 1})` : color;
  }
  return `var(--color-chart-${(index % CHART_COLORS.length) + 1})`;
}

/** One plotted measure: `key` reads the value from every data row */
export interface ChartSeries {
  /** Field of each data row holding this series' value */
  key: string;
  /** Name shown in the legend and tooltip */
  label: string;
  /** Palette color (defaults to the slot of its position) or any CSS color */
  color?: ChartColor | string;
}

export type ChartDatum = Record<string, unknown>;

export const toNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

// ── Formatting ────────────────────────────────────────────
const intlLocale: Record<NRLocale, string> = { en: "en-US", uz: "uz-UZ", ru: "ru-RU" };

/** 1 284 → "1.3K" (en) / "1,3 ming" (uz) / "1,3 тыс." (ru) */
export function formatCompact(value: number, locale: NRLocale = "en"): string {
  if (Math.abs(value) < 1000) return new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 2 }).format(value);
  return new Intl.NumberFormat(intlLocale[locale], { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** Full number with locale grouping: 1284 → "1,284" */
export function formatNumber(value: number, locale: NRLocale = "en"): string {
  return new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 2 }).format(value);
}

/** Axis / tooltip text of an x value (dates get a short locale date) */
export function formatX(value: unknown, locale: NRLocale = "en"): string {
  if (value instanceof Date) return new Intl.DateTimeFormat(intlLocale[locale], { month: "short", day: "numeric" }).format(value);
  return value == null ? "" : String(value);
}

// ── Scales & ticks ────────────────────────────────────────
/** Rounds a step to 1, 2, 2.5 or 5 × 10ⁿ so ticks land on clean numbers */
function niceStep(raw: number): number {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}

/** Clean domain and ticks covering [min, max] with about `count` intervals */
export function niceTicks(min: number, max: number, count = 4): { domain: [number, number]; ticks: number[] } {
  if (min === max) {
    if (max === 0) return { domain: [0, 1], ticks: [0, 1] };
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const step = niceStep((max - min) / Math.max(1, count));
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
  return { domain: [lo, hi], ticks };
}

export const scaleLinear =
  ([d0, d1]: [number, number], [r0, r1]: [number, number]) =>
  (v: number) =>
    d1 === d0 ? (r0 + r1) / 2 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

// ── Paths ─────────────────────────────────────────────────
export type Point = [number, number];

/** Straight segments through the points */
export const linePath = (pts: Point[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("");

/**
 * Smooth curve that never overshoots the data (monotone cubic interpolation),
 * so a smoothed line still peaks exactly at the real maximum.
 */
export function smoothPath(pts: Point[]): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  const dx = (i: number) => pts[i + 1][0] - pts[i][0];
  const slope = (i: number) => (dx(i) === 0 ? 0 : (pts[i + 1][1] - pts[i][1]) / dx(i));
  const m: number[] = new Array(n);
  m[0] = slope(0);
  m[n - 1] = slope(n - 2);
  for (let i = 1; i < n - 1; i++) {
    const a = slope(i - 1);
    const b = slope(i);
    m[i] = a * b <= 0 ? 0 : (3 * (dx(i - 1) + dx(i))) / ((2 * dx(i) + dx(i - 1)) / a + (dx(i) + 2 * dx(i - 1)) / b);
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx(i) / 3;
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    d += `C${(x0 + h).toFixed(2)},${(y0 + m[i] * h).toFixed(2)} ${(x1 - h).toFixed(2)},${(y1 - m[i + 1] * h).toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
  }
  return d;
}

/** Closed area between a top line and a baseline (bottom points are walked back) */
export function areaPath(top: Point[], bottom: Point[], smooth: boolean): string {
  if (!top.length) return "";
  const make = smooth ? smoothPath : linePath;
  const back = make([...bottom].reverse()).replace(/^M/, "L");
  return `${make(top)}${back}Z`;
}

/** Donut / pie slice from angle a0 to a1 (radians, 0 = 12 o'clock, clockwise) */
export function arcPath(cx: number, cy: number, r: number, inner: number, a0: number, a1: number): string {
  const sweep = a1 - a0;
  if (sweep <= 0) return "";
  if (sweep >= Math.PI * 2 - 1e-6) a1 = a0 + Math.PI * 2 - 1e-4; // full circle: avoid a zero-length arc
  const p = (rad: number, a: number) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)].map((v) => v.toFixed(2)).join(",");
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (inner <= 0) return `M${cx},${cy}L${p(r, a0)}A${r},${r} 0 ${large} 1 ${p(r, a1)}Z`;
  return `M${p(r, a0)}A${r},${r} 0 ${large} 1 ${p(r, a1)}L${p(inner, a1)}A${inner},${inner} 0 ${large} 0 ${p(inner, a0)}Z`;
}

/** Rectangle with only the data end rounded (the baseline end stays square) */
export function barPath(x: number, y: number, w: number, h: number, r: number, end: "top" | "bottom" | "right" | "left"): string {
  if (w <= 0 || h <= 0) return "";
  const rr = Math.min(r, (end === "top" || end === "bottom" ? w : h) / 2, end === "top" || end === "bottom" ? h : w);
  const x1 = x + w;
  const y1 = y + h;
  switch (end) {
    case "top":
      return `M${x},${y1}V${y + rr}Q${x},${y} ${x + rr},${y}H${x1 - rr}Q${x1},${y} ${x1},${y + rr}V${y1}Z`;
    case "bottom":
      return `M${x},${y}V${y1 - rr}Q${x},${y1} ${x + rr},${y1}H${x1 - rr}Q${x1},${y1} ${x1},${y1 - rr}V${y}Z`;
    case "right":
      return `M${x},${y}H${x1 - rr}Q${x1},${y} ${x1},${y + rr}V${y1 - rr}Q${x1},${y1} ${x1 - rr},${y1}H${x}Z`;
    default:
      return `M${x1},${y}H${x + rr}Q${x},${y} ${x},${y + rr}V${y1 - rr}Q${x},${y1} ${x + rr},${y1}H${x1}Z`;
  }
}

// ── Hooks ─────────────────────────────────────────────────
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Width of an element, kept up to date with ResizeObserver (0 before the first measure) */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Animates numbers toward their targets (axis domains, slice angles) so hiding a series
 * or moving the range glides instead of jumping. Instant with reduced motion.
 */
export function useTween(targets: number[], { duration = 360, enabled = true } = {}): number[] {
  const [values, setValues] = useState(targets);
  const shown = useRef(targets);
  const key = targets.map((t) => t.toFixed(6)).join("|");
  const animate = enabled && !prefersReducedMotion();

  useEffect(() => {
    const to = key.split("|").map(Number);
    const from = shown.current.length === to.length ? shown.current : to;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = animate ? Math.min(1, (now - start) / duration) : 1;
      const e = easeOut(t);
      const next = from.map((f, i) => f + (to[i] - f) * e);
      shown.current = next;
      setValues(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [key, duration, animate]);

  return animate && values.length === targets.length ? values : targets;
}

const HEIGHT_FACTOR: Record<Breakpoint, number> = { m: 0.78, t: 0.9, l: 1, d: 1.15 };

/** Chart height for the current breakpoint when it is responsive there (shorter on phones, taller on desktop) */
export function useChartLayout(height: number, bps: readonly Breakpoint[]) {
  const bp = useBreakpoint();
  const active = bps.includes(bp);
  return {
    height: active ? Math.round(height * HEIGHT_FACTOR[bp]) : height,
    /** Phone layout: fewer ticks, legend below, smaller labels */
    compact: active && bp === "m",
  };
}

/**
 * Which series are hidden (legend toggles). Controlled with `hidden` + `onChange`, or uncontrolled.
 * The last visible series cannot be hidden, so the chart never goes blank.
 */
export function useHiddenSeries(
  keys: string[],
  hidden: string[] | undefined,
  defaultHidden: string[] | undefined,
  onChange: ((hidden: string[]) => void) | undefined
): [Set<string>, (key: string) => void] {
  const [own, setOwn] = useState<string[]>(defaultHidden ?? []);
  const current = hidden ?? own;
  const set = new Set(current.filter((k) => keys.includes(k)));
  const toggle = (key: string) => {
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    if (keys.every((k) => next.includes(k))) return;
    if (hidden === undefined) setOwn(next);
    onChange?.(next);
  };
  return [set, toggle];
}
