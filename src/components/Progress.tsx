import React, { type ReactNode } from "react";
import { cn } from "../lib/cn";

type ProgressColor = "default" | "accent" | "success" | "warning" | "danger";
type ProgressSize = "xs" | "sm" | "md" | "lg";
type ProgressRadius = "none" | "sm" | "md" | "full";

export interface ProgressProps {
  /** Joriy qiymat */
  value?: number;
  /** Minimal qiymat */
  minValue?: number;
  /** Maksimal qiymat */
  maxValue?: number;
  /** Rang */
  color?: ProgressColor;
  /** O'lcham (chiziq qalinligi) */
  size?: ProgressSize;
  /** Burchak yumaloqligi */
  radius?: ProgressRadius;
  /** Qiymat yorlig'ini ko'rsatish */
  showValueLabel?: boolean;
  /** Qiymat o'rniga ko'rsatiladigan maxsus matn */
  valueLabel?: ReactNode;
  /** Yorliq matni */
  label?: ReactNode;
  /** Qiymatni formatlash (Intl.NumberFormat) sozlamalari */
  formatOptions?: Intl.NumberFormatOptions;
  /** Noma'lum davomiylikdagi (cheksiz) animatsiya */
  isIndeterminate?: boolean;
  /** Chiziqli (striped) animatsiyali to'ldirish */
  isStriped?: boolean;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

const trackSize: Record<ProgressSize, string> = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
};

const radiusMap: Record<ProgressRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
};

const fillColor: Record<ProgressColor, string> = {
  default: "bg-foreground",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const strokeColor: Record<ProgressColor, string> = {
  default: "text-foreground",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const keyframes = `
@keyframes nr-progress-indeterminate {
  0% { transform: translateX(-100%) scaleX(0.4); }
  50% { transform: translateX(30%) scaleX(0.6); }
  100% { transform: translateX(100%) scaleX(0.4); }
}
@keyframes nr-progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
`;

const stripes: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg,rgb(255 255 255 / .22) 25%,transparent 25%,transparent 50%,rgb(255 255 255 / .22) 50%,rgb(255 255 255 / .22) 75%,transparent 75%,transparent)",
  backgroundSize: "1rem 1rem",
  animation: "nr-progress-stripes 1s linear infinite",
};

const toPercent = (value: number, min: number, max: number) =>
  Math.min(100, Math.max(0, ((value - min) / (max - min || 1)) * 100));

const formatValue = (pct: number, value: number, opts?: Intl.NumberFormatOptions) =>
  opts ? new Intl.NumberFormat(undefined, opts).format(opts.style === "percent" ? pct / 100 : value) : `${Math.round(pct)}%`;

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  minValue = 0,
  maxValue = 100,
  color = "accent",
  size = "md",
  radius = "full",
  showValueLabel = false,
  valueLabel,
  label,
  formatOptions,
  isIndeterminate = false,
  isStriped = false,
  isDisabled = false,
  className = "",
}) => {
  const percentage = toPercent(value, minValue, maxValue);
  const showTop = label || showValueLabel || valueLabel;

  return (
    <div
      className={cn("flex flex-col gap-2 w-full", isDisabled && "opacity-50", className)}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
    >
      {(isIndeterminate || isStriped) && <style>{keyframes}</style>}
      {showTop && (
        <div className="flex items-center justify-between gap-2 text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {(showValueLabel || valueLabel) && !isIndeterminate && (
            <span className="tabular-nums text-muted">{valueLabel ?? formatValue(percentage, value, formatOptions)}</span>
          )}
        </div>
      )}

      <div className={cn("relative w-full overflow-hidden bg-default", trackSize[size], radiusMap[radius])}>
        {isIndeterminate ? (
          <div
            className={cn("absolute inset-y-0 left-0 w-full origin-left", fillColor[color], radiusMap[radius])}
            style={{ animation: "nr-progress-indeterminate 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite" }}
          />
        ) : (
          <div
            className={cn("h-full transition-[width] duration-500 ease-(--ease-out-soft)", fillColor[color], radiusMap[radius])}
            style={{ width: `${percentage}%`, ...(isStriped ? stripes : {}) }}
          />
        )}
      </div>
    </div>
  );
};

Progress.displayName = "Progress";

/* ── Circular ─────────────────────────────────── */

type CircularSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface CircularProgressProps {
  /** Joriy qiymat */
  value?: number;
  /** Minimal qiymat */
  minValue?: number;
  /** Maksimal qiymat */
  maxValue?: number;
  /** Rang */
  color?: ProgressColor;
  /** O'lcham */
  size?: CircularSize;
  /** Doira chizig'i qalinligi */
  strokeWidth?: number;
  /** Qiymat yorlig'ini markazda ko'rsatish */
  showValueLabel?: boolean;
  /** Qiymat o'rniga ko'rsatiladigan maxsus matn */
  valueLabel?: ReactNode;
  /** Pastdagi yorliq matni */
  label?: ReactNode;
  /** Qiymatni formatlash (Intl.NumberFormat) sozlamalari */
  formatOptions?: Intl.NumberFormatOptions;
  /** Noma'lum davomiylikdagi (cheksiz) animatsiya */
  isIndeterminate?: boolean;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

const circularSizeMap: Record<CircularSize, { px: number; text: string }> = {
  xs: { px: 24, text: "text-[7px]" },
  sm: { px: 32, text: "text-[9px]" },
  md: { px: 48, text: "text-xs" },
  lg: { px: 64, text: "text-sm" },
  xl: { px: 96, text: "text-xl" },
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  minValue = 0,
  maxValue = 100,
  color = "accent",
  size = "md",
  strokeWidth,
  showValueLabel = false,
  valueLabel,
  label,
  formatOptions,
  isIndeterminate = false,
  isDisabled = false,
  className = "",
}) => {
  const { px, text } = circularSizeMap[size];
  const stroke = strokeWidth ?? Math.max(3, Math.round(px / 14));
  const r = (px - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const percentage = toPercent(value, minValue, maxValue);
  const offset = isIndeterminate ? circumference * 0.75 : circumference * (1 - percentage / 100);

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-1.5", isDisabled && "opacity-50", className)}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
    >
      <div className="relative" style={{ width: px, height: px }}>
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          className={cn("-rotate-90", strokeColor[color], isIndeterminate && "animate-spin")}
          style={isIndeterminate ? { animationDuration: "1s" } : undefined}
        >
          <circle cx={px / 2} cy={px / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-default" />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-(--ease-out-soft)"
          />
        </svg>
        {(showValueLabel || valueLabel) && !isIndeterminate && (
          <span className={cn("absolute inset-0 flex items-center justify-center font-semibold tabular-nums text-foreground", text)}>
            {valueLabel ?? formatValue(percentage, value, formatOptions)}
          </span>
        )}
      </div>
      {label && <span className="text-xs text-muted">{label}</span>}
    </div>
  );
};

CircularProgress.displayName = "CircularProgress";

export default Progress;
