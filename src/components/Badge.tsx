import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type BadgeColor = "default" | "accent" | "success" | "warning" | "danger";
type BadgeVariant = "primary" | "soft";
type BadgeSize = "xs" | "sm" | "md" | "lg";
type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
type BadgeShape = "circle" | "rectangle";

export interface BadgeProps {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Text or number inside the badge */
  content?: ReactNode;
  /** Color */
  color?: BadgeColor;
  /** Style: primary (solid color) or soft (tinted background) */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Which corner of the element it sits on */
  placement?: BadgePlacement;
  /** Shape of the wrapped element (adjusts the position) */
  shape?: BadgeShape;
  /** Small dot without text */
  isDot?: boolean;
  /** Hides the badge with an animation */
  isInvisible?: boolean;
  /** Ring in the background color around the badge */
  showOutline?: boolean;
  /** Perfect circle for single-character content */
  isOneChar?: boolean;
  /** Element the badge is attached to */
  children?: ReactNode;
  /** Extra classes */
  className?: string;
  /** Adapts to the screen: on mobile the two smallest sizes grow a little so the number stays legible. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const placementMap: Record<BadgeShape, Record<BadgePlacement, string>> = {
  circle: {
    "top-right": "top-[14%] right-[14%] translate-x-1/2 -translate-y-1/2",
    "top-left": "top-[14%] left-[14%] -translate-x-1/2 -translate-y-1/2",
    "bottom-right": "bottom-[14%] right-[14%] translate-x-1/2 translate-y-1/2",
    "bottom-left": "bottom-[14%] left-[14%] -translate-x-1/2 translate-y-1/2",
  },
  rectangle: {
    "top-right": "top-[4%] right-[4%] translate-x-1/2 -translate-y-1/2",
    "top-left": "top-[4%] left-[4%] -translate-x-1/2 -translate-y-1/2",
    "bottom-right": "bottom-[4%] right-[4%] translate-x-1/2 translate-y-1/2",
    "bottom-left": "bottom-[4%] left-[4%] -translate-x-1/2 translate-y-1/2",
  },
};

const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
  default: { primary: "bg-foreground text-background", soft: "bg-default text-default-foreground" },
  accent: { primary: "bg-accent text-accent-foreground", soft: "bg-accent-soft text-accent-soft-foreground" },
  success: { primary: "bg-success text-success-foreground", soft: "bg-success-soft text-success-soft-foreground" },
  warning: { primary: "bg-warning text-warning-foreground", soft: "bg-warning-soft text-warning-soft-foreground" },
  danger: { primary: "bg-danger text-danger-foreground", soft: "bg-danger-soft text-danger-soft-foreground" },
};

const sizeMap: Record<BadgeSize, { badge: string; oneChar: string; dot: string; text: string }> = {
  xs: { badge: "min-w-3.5 h-3.5 px-0.5", oneChar: "w-3.5 h-3.5", dot: "w-2 h-2", text: "text-[9px]" },
  sm: { badge: "min-w-4 h-4 px-1", oneChar: "w-4 h-4", dot: "w-2.5 h-2.5", text: "text-[10px]" },
  md: { badge: "min-w-5 h-5 px-1.5", oneChar: "w-5 h-5", dot: "w-3 h-3", text: "text-xs" },
  lg: { badge: "min-w-6 h-6 px-2", oneChar: "w-6 h-6", dot: "w-3.5 h-3.5", text: "text-sm" },
};

// Mobile: xs takes the sm box and sm gets 1px larger text, so counts stay readable on dense screens.
type SizeParts = { badge: BreakpointClasses; oneChar: BreakpointClasses; dot: BreakpointClasses; text: BreakpointClasses };
const sizeMapR: Record<BadgeSize, SizeParts> = {
  xs: {
    badge: { m: "mobile:min-w-4 mobile:h-4 mobile:px-1" },
    oneChar: { m: "mobile:w-4 mobile:h-4" },
    dot: { m: "mobile:w-2.5 mobile:h-2.5" },
    text: { m: "mobile:text-[10px]" },
  },
  sm: { badge: {}, oneChar: {}, dot: {}, text: { m: "mobile:text-[11px]" } },
  md: { badge: {}, oneChar: {}, dot: {}, text: {} },
  lg: { badge: {}, oneChar: {}, dot: {}, text: {} },
};

export const Badge = ({
  content,
  color = "danger",
  variant = "primary",
  size = "md",
  placement = "top-right",
  shape = "circle",
  isDot,
  isInvisible = false,
  showOutline = true,
  isOneChar,
  children,
  className = "",
  responsive,
}: BadgeProps) => {
  const bps = useResponsive(responsive);
  const hasContent = content !== undefined && content !== null && content !== "";
  const dot = isDot ?? !hasContent;
  const oneChar = isOneChar ?? (typeof content === "string" || typeof content === "number" ? String(content).length === 1 : false);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {children}
      <span
        className={cn(
          "absolute z-10 flex items-center justify-center rounded-full select-none whitespace-nowrap font-medium leading-none tabular-nums",
          "origin-center transition-[transform,opacity] duration-200 ease-(--ease-out-soft)",
          placementMap[shape][placement],
          colorStyles[color][variant],
          sizeMap[size].text,
          rx(bps, sizeMapR[size].text),
          showOutline && "ring-2 ring-background",
          dot ? sizeMap[size].dot : oneChar ? sizeMap[size].oneChar : sizeMap[size].badge,
          rx(bps, sizeMapR[size][dot ? "dot" : oneChar ? "oneChar" : "badge"]),
          isInvisible ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        {dot ? null : content}
      </span>
    </div>
  );
};

Badge.displayName = "Badge";
export default Badge;
