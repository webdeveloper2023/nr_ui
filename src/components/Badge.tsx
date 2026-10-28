import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type BadgeColor = "default" | "accent" | "success" | "warning" | "danger";
type BadgeVariant = "primary" | "soft";
type BadgeSize = "xs" | "sm" | "md" | "lg";
type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
type BadgeShape = "circle" | "rectangle";

export interface BadgeProps {
  /** Badge ichidagi matn yoki son */
  content?: ReactNode;
  /** Rang */
  color?: BadgeColor;
  /** Ko'rinish: primary (to'liq rang) yoki soft (yumshoq fon) */
  variant?: BadgeVariant;
  /** O'lcham */
  size?: BadgeSize;
  /** Elementning qaysi burchagida joylashishi */
  placement?: BadgePlacement;
  /** Ostidagi element shakli (joylashuvni moslash uchun) */
  shape?: BadgeShape;
  /** Matnsiz kichik nuqta ko'rinishi */
  isDot?: boolean;
  /** Badge'ni animatsiya bilan yashiradi */
  isInvisible?: boolean;
  /** Atrofida fon rangidagi chegara (halqa) */
  showOutline?: boolean;
  /** Bitta belgi uchun aylana shakl */
  isOneChar?: boolean;
  /** Badge qo'yiladigan element */
  children?: ReactNode;
  /** Qo'shimcha klasslar */
  className?: string;
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
}: BadgeProps) => {
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
          showOutline && "ring-2 ring-background",
          dot ? sizeMap[size].dot : oneChar ? sizeMap[size].oneChar : sizeMap[size].badge,
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
