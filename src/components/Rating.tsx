import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type RatingSize = "xs" | "sm" | "md" | "lg";
type RatingColor = "warning" | "accent" | "danger" | "success" | "default";

export interface RatingProps {
  /** Rating value (controlled) */
  value?: number;
  /** Initial rating */
  defaultValue?: number;
  /** Called when the rating changes */
  onChange?: (value: number) => void;
  /** Number of stars */
  max?: number;
  /** Size */
  size?: RatingSize;
  /** Color of filled stars */
  color?: RatingColor;
  /** Display only, cannot be changed */
  isReadOnly?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Shows the numeric value next to it */
  showValue?: boolean;
  /** Adapts to the screen: on mobile stars one step larger, spaced apart with a 44px-tall tap area and a 16px value; larger lg stars on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

const sizes: Record<RatingSize, number> = { xs: 12, sm: 16, md: 20, lg: 26 };
// Mobile: stars one step larger (CSS size overrides the icon's width / height), wider spacing and a
// 44px-tall invisible tap area on editable stars. Tablet: a taller tap area. Desktop: lg one step larger.
const starR: Record<RatingSize, BreakpointClasses> = {
  xs: { m: "mobile:size-4" },
  sm: { m: "mobile:size-5" },
  md: { m: "mobile:size-6" },
  lg: { d: "desktop:size-8" },
};
const hitR: BreakpointClasses = {
  m: "mobile:after:absolute mobile:after:-inset-x-1 mobile:after:-inset-y-2.5",
  t: "tablet:after:absolute tablet:after:-inset-x-0.5 tablet:after:-inset-y-2",
};
const rowR: BreakpointClasses = { m: "mobile:gap-2", t: "tablet:gap-1" };

const fills: Record<RatingColor, string> = {
  warning: "text-warning fill-warning",
  accent: "text-accent fill-accent",
  danger: "text-danger fill-danger",
  success: "text-success fill-success",
  default: "text-foreground fill-foreground",
};

export function Rating({
  value: valueProp,
  defaultValue = 0,
  onChange,
  max = 5,
  size = "md",
  color = "warning",
  isReadOnly = false,
  isDisabled = false,
  showValue = false,
  responsive,
  className = "",
}: RatingProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const starClass = rx(bps, starR[size]);
  const [valueState, setValueState] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const value = valueProp ?? valueState;
  const shown = hover ?? value;
  const isStatic = isReadOnly || isDisabled;

  const set = (v: number) => {
    if (isStatic) return;
    const next = v === value ? 0 : v;
    setValueState(next);
    onChange?.(next);
  };

  return (
    <div className={cn("inline-flex items-center gap-2", isDisabled && "opacity-50", className)}>
      <div className={cn("flex items-center gap-0.5", rx(bps, rowR))} role="radiogroup" aria-readonly={isReadOnly} onMouseLeave={() => setHover(null)}>
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const fillPct = Math.max(0, Math.min(1, shown - i)) * 100;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={t.rating.star(n)}
              disabled={isStatic}
              onClick={() => set(n)}
              onMouseEnter={() => !isStatic && setHover(n)}
              className={cn(
                "relative rounded-md transition-transform duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isStatic ? "cursor-default" : cn("cursor-pointer hover:scale-110 active:scale-95", rx(bps, hitR))
              )}
            >
              <Star size={sizes[size]} strokeWidth={1.5} className={cn("text-default fill-default", starClass)} />
              <span className="absolute inset-0 overflow-hidden transition-[width] duration-150" style={{ width: `${fillPct}%` }}>
                <Star size={sizes[size]} strokeWidth={1.5} className={cn(fills[color], starClass)} />
              </span>
            </button>
          );
        })}
      </div>
      {showValue && <span className={cn("text-sm font-medium text-foreground tabular-nums", rx(bps, { m: "mobile:text-base" }))}>{value.toFixed(1)}</span>}
    </div>
  );
}

export default Rating;
