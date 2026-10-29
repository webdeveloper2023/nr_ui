import { createContext, forwardRef, useContext, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { LAYOUT_CLASSES } from "./layoutClasses";
import {
  BREAKPOINTS,
  classesFor,
  isResponsiveObject,
  spaceClasses,
  spread,
  useResponsive,
  type Breakpoint,
  type ResponsiveProp,
  type ResponsiveValue,
  type Space,
} from "./breakpoints";

type LayoutElement = "div" | "section" | "main" | "header" | "footer" | "article" | "aside" | "nav" | "ul" | "ol" | "li";

// ─── Container ──────────────────────────────
type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Maximum width: sm 640, md 768, lg 1024, xl 1280, 2xl 1536 px or full */
  size?: ContainerSize;
  /** Side gutters (shared spacing scale); an object sets them per breakpoint: { m: "md", l: "xl" } */
  padding?: ResponsiveValue<Space>;
  /** Top and bottom padding (shared spacing scale) */
  paddingY?: ResponsiveValue<Space>;
  /** Gutters follow the screen: 16px mobile, 20px tablet, 24px laptop, 28px desktop (for padding "lg"). true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** HTML element to render */
  as?: LayoutElement;
  /** Content */
  children?: ReactNode;
}

const containerSize: Record<ContainerSize, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "max-w-none",
};

/** Centered page column with gutters that follow the screen size. */
export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ size = "xl", padding = "lg", paddingY, responsive, as: Tag = "div", className = "", children, ...props }, ref) => {
    const bps = useResponsive(responsive);
    return (
      <Tag
        ref={ref as never}
        className={cn("mx-auto w-full", containerSize[size], spaceClasses("px", padding, bps), spaceClasses("py", paddingY, bps), className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = "Container";

// ─── Stack ──────────────────────────────────
type StackDirection = "row" | "column";
type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Direction; an object sets it per breakpoint: { m: "column", t: "row" } */
  direction?: ResponsiveValue<StackDirection>;
  /** Space between items (shared spacing scale) */
  gap?: ResponsiveValue<Space>;
  /** Cross-axis alignment */
  align?: StackAlign;
  /** Main-axis distribution */
  justify?: StackJustify;
  /** Lets items wrap onto new lines */
  wrap?: boolean;
  /** Padding inside the stack (shared spacing scale) */
  padding?: ResponsiveValue<Space>;
  /** A row turns into a column on mobile and the gap follows the screen. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** HTML element to render */
  as?: LayoutElement;
  /** Items */
  children?: ReactNode;
}

const alignStyles: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyStyles: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/** One-dimensional layout with a gap from the shared spacing scale. */
export const Stack = forwardRef<HTMLElement, StackProps>(
  (
    { direction = "column", gap = "md", align, justify, wrap = false, padding, responsive, as: Tag = "div", className = "", children, ...props },
    ref
  ) => {
    const bps = useResponsive(responsive);
    const directions = spread(direction);
    // A plain row stacks up on mobile, where there is no room side by side
    if (!isResponsiveObject(direction) && direction === "row" && bps.includes("m")) directions.m = "column";
    return (
      <Tag
        ref={ref as never}
        className={cn(
          "flex",
          classesFor(directions, LAYOUT_CLASSES.direction),
          spaceClasses("gap", gap, bps),
          spaceClasses("p", padding, bps),
          align && alignStyles[align],
          justify && justifyStyles[justify],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Stack.displayName = "Stack";

// ─── Grid ───────────────────────────────────
type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColsKey = keyof (typeof LAYOUT_CLASSES)["cols"]["base"];

const GridContext = createContext<Record<Breakpoint, number> | null>(null);

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Number of columns (1–12); an object sets it per breakpoint: { m: 1, t: 2, l: 4 } */
  cols?: ResponsiveValue<GridCols>;
  /** Fits as many columns as there is room for, each at least this wide (e.g. 240 or "16rem"); overrides cols */
  minChildWidth?: number | string;
  /** Space between cells (shared spacing scale) */
  gap?: ResponsiveValue<Space>;
  /** Columns collapse on small screens (1 on mobile, up to 2 on tablet) and the gap follows the screen. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** HTML element to render */
  as?: LayoutElement;
  /** Cells */
  children?: ReactNode;
}

const colKeys = (columns: Record<Breakpoint, number>) =>
  Object.fromEntries(BREAKPOINTS.map((bp) => [bp, String(columns[bp]) as ColsKey])) as Record<Breakpoint, ColsKey>;

/** Two-dimensional layout: columns that collapse on small screens. */
export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ cols = 1, minChildWidth, gap = "md", responsive, as: Tag = "div", className = "", style, children, ...props }, ref) => {
    const bps = useResponsive(responsive);
    const columns = spread(cols) as Record<Breakpoint, number>;
    if (!isResponsiveObject(cols)) {
      if (bps.includes("m")) columns.m = 1;
      if (bps.includes("t")) columns.t = Math.min(cols, 2);
    }
    const auto = minChildWidth !== undefined;
    const min = typeof minChildWidth === "number" ? `${minChildWidth}px` : minChildWidth;
    const autoStyle: CSSProperties | undefined = auto ? { gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}, 100%), 1fr))` } : undefined;

    return (
      <GridContext.Provider value={auto ? null : columns}>
        <Tag
          ref={ref as never}
          className={cn(
            "grid",
            !auto && classesFor(colKeys(columns), LAYOUT_CLASSES.cols),
            spaceClasses("gap", gap, bps),
            className
          )}
          style={autoStyle ? { ...autoStyle, ...style } : style}
          {...props}
        >
          {children}
        </Tag>
      </GridContext.Provider>
    );
  }
);

Grid.displayName = "Grid";

type SpanKey = keyof (typeof LAYOUT_CLASSES)["span"]["base"];

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Columns the cell spans (1–12 or "full"); an object sets it per breakpoint. Never wider than the grid's columns on that breakpoint */
  span?: ResponsiveValue<GridCols | "full">;
  /** HTML element to render */
  as?: LayoutElement;
  /** Content */
  children?: ReactNode;
}

/** A Grid cell spanning several columns; the span shrinks with the grid on small screens. */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(({ span = 1, as: Tag = "div", className = "", children, ...props }, ref) => {
  const columns = useContext(GridContext);
  const spans = spread(span);
  const keys = {} as Record<Breakpoint, SpanKey>;
  for (const bp of BREAKPOINTS) {
    const s = spans[bp];
    keys[bp] = String(s === "full" ? "full" : columns ? Math.min(s, columns[bp]) : s) as SpanKey;
  }
  return (
    <Tag ref={ref as never} className={cn(classesFor(keys, LAYOUT_CLASSES.span), className)} {...props}>
      {children}
    </Tag>
  );
});

GridItem.displayName = "GridItem";
