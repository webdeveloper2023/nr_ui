// Responsive system shared by every component.
//
// Breakpoints (aligned with Tailwind's md / lg / 2xl):
//   m — mobile   < 768px
//   t — tablet   768px – 1023px
//   l — laptop   1024px – 1535px   (the reference design: most components look as without `responsive`)
//   d — desktop  ≥ 1536px
//
// Every component takes `responsive`:
//   responsive                 → adapts on all four breakpoints
//   responsive={["m", "t"]}    → adapts on mobile and tablet only; laptop / desktop keep the static look
//   responsive="m"             → mobile only
//
// The matching Tailwind variants `mobile:`, `tablet:`, `laptop:`, `desktop:` (exact ranges) live in theme.css.
// Components pick the per-breakpoint class strings in JS, so the CSS stays static and SSR-safe.

import { createContext, useContext, useSyncExternalStore } from "react";
import { cn } from "../lib/cn";
import { LAYOUT_CLASSES } from "./layoutClasses";

export type Breakpoint = "m" | "t" | "l" | "d";

/** true = every breakpoint; a breakpoint or a list = only those; false = none */
export type ResponsiveProp = boolean | Breakpoint | readonly Breakpoint[];

/** A value that can differ per breakpoint: `3` or `{ m: 1, t: 2, l: 3 }` */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/** Class strings to add on each breakpoint (written with the matching variant, e.g. `mobile:h-11`) */
export type BreakpointClasses = Partial<Record<Breakpoint, string>>;

export const BREAKPOINTS: readonly Breakpoint[] = ["m", "t", "l", "d"];

export const BREAKPOINT_INFO: Record<Breakpoint, { name: string; min: number; max: number | null }> = {
  m: { name: "mobile", min: 0, max: 767 },
  t: { name: "tablet", min: 768, max: 1023 },
  l: { name: "laptop", min: 1024, max: 1535 },
  d: { name: "desktop", min: 1536, max: null },
};

/** Media query of one breakpoint: "(min-width: 768px) and (max-width: 1023px)" */
export function breakpointQuery(bp: Breakpoint): string {
  const { min, max } = BREAKPOINT_INFO[bp];
  return [min > 0 && `(min-width: ${min}px)`, max !== null && `(max-width: ${max}px)`].filter(Boolean).join(" and ");
}

const isBreakpoint = (v: unknown): v is Breakpoint => typeof v === "string" && (BREAKPOINTS as readonly string[]).includes(v);

/** Normalizes a `responsive` prop to an ordered list of breakpoints. */
export function resolveBreakpoints(value: ResponsiveProp | null | undefined): Breakpoint[] {
  if (value === true) return [...BREAKPOINTS];
  if (!value) return [];
  const list: readonly unknown[] = typeof value === "string" ? [value] : value;
  return BREAKPOINTS.filter((bp) => list.includes(bp));
}

/** Joins the class strings of the active breakpoints: rx(["m"], { m: "mobile:h-11", d: "desktop:h-10" }) → "mobile:h-11" */
export function rx(bps: readonly Breakpoint[], classes: BreakpointClasses): string {
  return bps.map((bp) => classes[bp]).filter(Boolean).join(" ");
}

export const isResponsiveObject = <T>(value: ResponsiveValue<T>): value is Partial<Record<Breakpoint, T>> =>
  typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).some(isBreakpoint);

/**
 * Fills a responsive value for all four breakpoints, mobile-first:
 * a breakpoint without a value takes the nearest smaller one (or the nearest larger one at the bottom).
 * spread({ m: 1, l: 3 }) → { m: 1, t: 1, l: 3, d: 3 }
 */
export function spread<T>(value: ResponsiveValue<T>): Record<Breakpoint, T> {
  if (!isResponsiveObject(value)) return { m: value, t: value, l: value, d: value } as Record<Breakpoint, T>;
  const out = {} as Record<Breakpoint, T>;
  const first = BREAKPOINTS.map((bp) => value[bp]).find((v) => v !== undefined) as T;
  let last = first;
  for (const bp of BREAKPOINTS) {
    if (value[bp] !== undefined) last = value[bp] as T;
    out[bp] = last;
  }
  return out;
}

// ── Spacing scale ─────────────────────────────────────────
// One scale for gaps and paddings across the kit. The static value equals the laptop one;
// with `responsive` it tightens on small screens and opens up on large ones.
export type Space = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Pixel values of the scale per breakpoint (documentation and tests) */
export const SPACE_SCALE: Record<Space, Record<Breakpoint, number>> = {
  none: { m: 0, t: 0, l: 0, d: 0 },
  xs: { m: 4, t: 4, l: 4, d: 6 },
  sm: { m: 8, t: 8, l: 8, d: 12 },
  md: { m: 12, t: 16, l: 16, d: 20 },
  lg: { m: 16, t: 20, l: 24, d: 28 },
  xl: { m: 24, t: 28, l: 32, d: 40 },
  "2xl": { m: 32, t: 40, l: 48, d: 64 },
};

/**
 * Per-breakpoint values → one base class (the laptop value) plus a class on every breakpoint that differs.
 * The four variants cover the whole width range, so the base only matters where nothing overrides it.
 */
export function classesFor<K extends string>(values: Record<Breakpoint, K>, table: Record<"base" | Breakpoint, Record<K, string>>): string {
  const base = values.l;
  return cn(table.base[base], ...BREAKPOINTS.filter((bp) => values[bp] !== base).map((bp) => table[bp][values[bp]]));
}

type SpaceUtility = "gap" | "p" | "px" | "py";
type Unit = keyof (typeof LAYOUT_CLASSES)["gap"]["base"];
const unit = (px: number) => String(px / 4) as Unit;

/**
 * Spacing classes. A plain token follows the shared scale on the active breakpoints
 * (tighter on mobile, roomier on desktop); an object pins an exact token per breakpoint.
 */
export function spaceClasses(utility: SpaceUtility, value: ResponsiveValue<Space> | undefined, bps: readonly Breakpoint[]): string {
  if (value === undefined) return "";
  const units = {} as Record<Breakpoint, Unit>;
  if (isResponsiveObject(value)) {
    const tokens = spread(value);
    for (const bp of BREAKPOINTS) units[bp] = unit(SPACE_SCALE[tokens[bp]].l);
  } else {
    for (const bp of BREAKPOINTS) units[bp] = unit(SPACE_SCALE[value][bps.includes(bp) ? bp : "l"]);
  }
  return classesFor(units, LAYOUT_CLASSES[utility]);
}

// ── Context & hooks ───────────────────────────────────────
export const ResponsiveContext = createContext<ResponsiveProp | undefined>(undefined);

/** Active breakpoints of a component: its own `responsive` prop, else the nearest ResponsiveProvider. */
export function useResponsive(responsive?: ResponsiveProp): Breakpoint[] {
  const inherited = useContext(ResponsiveContext);
  return resolveBreakpoints(responsive ?? inherited);
}

const canMatch = () => typeof window !== "undefined" && typeof window.matchMedia === "function";

function subscribe(onChange: () => void) {
  if (!canMatch()) return () => {};
  const lists = BREAKPOINTS.map((bp) => window.matchMedia(breakpointQuery(bp)));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

const getSnapshot = (): Breakpoint =>
  (canMatch() && BREAKPOINTS.find((bp) => window.matchMedia(breakpointQuery(bp)).matches)) || "l";

/**
 * The breakpoint the screen is on right now: "m" | "t" | "l" | "d" (updates on resize).
 * Renders "l" on the server; prefer CSS (Show / Hide, `responsive`) for layout so the first paint is right.
 */
export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, () => "l");
}

/** true when the screen is on one of the given breakpoints: useBreakpointMatch(["m", "t"]) */
export function useBreakpointMatch(on: ResponsiveProp): boolean {
  return resolveBreakpoints(on).includes(useBreakpoint());
}
