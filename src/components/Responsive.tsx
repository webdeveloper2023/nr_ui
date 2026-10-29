import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { LAYOUT_CLASSES } from "./layoutClasses";
import { BREAKPOINTS, ResponsiveContext, resolveBreakpoints, rx, type Breakpoint, type ResponsiveProp } from "./breakpoints";

export interface ResponsiveProviderProps {
  /** Default `responsive` for every component inside: true = all breakpoints, or a list like ["m", "t"]. A component's own prop wins */
  responsive?: ResponsiveProp;
  /** The part of the app the default applies to */
  children: ReactNode;
}

/** Turns on responsive behaviour for every component inside, without passing the prop one by one. */
export function ResponsiveProvider({ responsive = true, children }: ResponsiveProviderProps) {
  return <ResponsiveContext.Provider value={responsive}>{children}</ResponsiveContext.Provider>;
}

// ── Show / Hide ───────────────────────────────────────────
export interface ShowProps extends HTMLAttributes<HTMLDivElement> {
  /** Breakpoints the content is visible on (hidden with CSS everywhere else) */
  on: ResponsiveProp;
  /** Content */
  children?: ReactNode;
}

const hideOn = (bps: readonly Breakpoint[]) =>
  rx(bps, { m: LAYOUT_CLASSES.display.m.none, t: LAYOUT_CLASSES.display.t.none, l: LAYOUT_CLASSES.display.l.none, d: LAYOUT_CLASSES.display.d.none });

/** Renders the content only on the given breakpoints. The wrapper is `display: contents`, so it does not affect layout. */
export function Show({ on, className, children, ...props }: ShowProps) {
  const visible = resolveBreakpoints(on);
  return (
    <div className={cn("contents", hideOn(BREAKPOINTS.filter((bp) => !visible.includes(bp))), className)} {...props}>
      {children}
    </div>
  );
}

export interface HideProps extends HTMLAttributes<HTMLDivElement> {
  /** Breakpoints the content is hidden on */
  on: ResponsiveProp;
  /** Content */
  children?: ReactNode;
}

/** Hides the content on the given breakpoints. The wrapper is `display: contents`, so it does not affect layout. */
export function Hide({ on, className, children, ...props }: HideProps) {
  return (
    <div className={cn("contents", hideOn(resolveBreakpoints(on)), className)} {...props}>
      {children}
    </div>
  );
}
