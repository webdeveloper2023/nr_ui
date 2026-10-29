import { useId, type ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type StatColor = "default" | "accent" | "success" | "warning" | "danger";
type StatVariant = "default" | "secondary" | "glass" | "gradient";

const strokeColors: Record<StatColor, string> = {
  default: "var(--color-muted)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
};

export interface SparklineProps {
  /** Chart data points */
  data: number[];
  /** Line color */
  color?: StatColor;
  /** Any CSS color (instead of `color`) */
  stroke?: string;
  /** Width (px). Fills the container when omitted */
  width?: number;
  /** Height (px) */
  height?: number;
  /** Shows the gradient area below the line */
  showArea?: boolean;
  /** Extra classes */
  className?: string;
}

export function Sparkline({
  data,
  color = "accent",
  stroke: strokeProp,
  width,
  height = 40,
  showArea = true,
  className = "",
}: SparklineProps) {
  const id = useId();
  if (data.length < 2) return null;
  const w = width ?? 200;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => [(i / (data.length - 1)) * w, height - 2 - ((v - min) / range) * (height - 4)]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  const stroke = strokeProp ?? strokeColors[color];

  return (
    <svg
      width={width ?? "100%"}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={cn("block overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {showArea && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export interface StatCardProps {
  /** Metric name */
  title: string;
  /** Main value */
  value: ReactNode;
  /** Change in percent (positive = up, negative = down) */
  change?: number;
  /** Caption under the trend (e.g. "vs last month") */
  changeLabel?: string;
  /** Swaps the colors when a decrease is good (e.g. bounce rate) */
  isInverted?: boolean;
  /** Icon next to the title */
  icon?: ReactNode;
  /** Color of the icon, progress and chart */
  color?: StatColor;
  /** Style: default (soft gradient), secondary (gray), glass or gradient (accent → indigo) */
  variant?: StatVariant;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Top-right actions (menu button, etc.) */
  actions?: ReactNode;
  /** Progress bar value (0–100) */
  progress?: number;
  /** Data for the sparkline at the bottom */
  chartData?: number[];
  /** Footer content (link, etc.) */
  footer?: ReactNode;
  /** Extra classes */
  className?: string;
  /** Adapts to the screen: smaller radius and value text on mobile, roomier padding and a larger value on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

// Mobile: compact value and radius (cards sit edge to edge). Desktop: roomier padding, larger value.
const rootR: BreakpointClasses = { m: "mobile:rounded-2xl" };
const bodyR: BreakpointClasses = { d: "desktop:p-6" };
const valueR: BreakpointClasses = { m: "mobile:text-2xl", d: "desktop:text-4xl" };
const chartR: BreakpointClasses = { d: "desktop:px-6 desktop:pb-6" };
const footerR: BreakpointClasses = { d: "desktop:px-6 desktop:py-4" };

const iconStyles: Record<StatColor, string> = {
  default: "bg-default text-muted",
  accent: "bg-accent-soft text-accent-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
};

const fillStyles: Record<StatColor, string> = {
  default: "bg-foreground",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  isInverted = false,
  icon,
  color = "accent",
  variant = "default",
  material,
  actions,
  progress,
  chartData,
  footer,
  className = "",
  responsive,
}: StatCardProps) {
  const bps = useResponsive(responsive);
  const trend = change === undefined ? null : change > 0 ? "up" : change < 0 ? "down" : "flat";
  const isGood = trend === "flat" ? null : (trend === "up") !== isInverted;
  const isGradient = variant === "gradient";
  const trendStyle = isGradient
    ? "bg-white/20 text-white"
    : isGood === null
      ? "bg-default text-muted"
      : isGood
        ? "bg-success-soft text-success-soft-foreground"
        : "bg-danger-soft text-danger-soft-foreground";

  return (
    <div
      data-glass={material}
      className={cn(
        "flex flex-col rounded-3xl overflow-hidden text-foreground",
        rx(bps, rootR),
        variant === "secondary" && "bg-surface-secondary",
        variant === "default" && "bg-surface-gradient shadow-surface",
        variant === "glass" && "glass",
        isGradient && "bg-linear-to-br from-accent to-indigo text-white shadow-surface [&_.text-muted]:text-white/75",
        className
      )}
    >
      <div className={cn("p-4", rx(bps, bodyR))}>
        <div className="flex items-center gap-2.5 min-h-8">
          {icon && <span className={cn("flex items-center justify-center w-8 h-8 shrink-0 rounded-lg [&_svg]:size-4", isGradient ? "bg-white/20 text-white" : iconStyles[color])}>{icon}</span>}
          <p className="flex-1 min-w-0 truncate text-sm text-muted">{title}</p>
          {actions && <div className="shrink-0 -mr-1.5 text-muted">{actions}</div>}
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <p className={cn("min-w-0 text-3xl font-semibold tracking-tight tabular-nums leading-none", rx(bps, valueR))}>{value}</p>
          {trend && (
            <span className={cn("inline-flex items-center gap-0.5 h-6 rounded-full px-2 text-xs font-medium tabular-nums shrink-0", trendStyle)}>
              {trend === "up" && <ArrowUp size={12} strokeWidth={2.5} />}
              {trend === "down" && <ArrowDown size={12} strokeWidth={2.5} />}
              {change! > 0 ? "+" : ""}
              {change}%
            </span>
          )}
        </div>
        {changeLabel && <p className="mt-2 text-xs text-muted">{changeLabel}</p>}

        {progress !== undefined && (
          <div className={cn("mt-4 h-1.5 w-full rounded-full overflow-hidden", isGradient ? "bg-white/25" : "bg-default")} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className={cn("h-full rounded-full transition-[width] duration-500 ease-(--ease-out-soft)", isGradient ? "bg-white" : fillStyles[color])} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        )}
      </div>

      {chartData && (
        <div className={cn("-mt-1 px-4 pb-4", rx(bps, chartR))}>
          <Sparkline data={chartData} color={isGood === false ? "danger" : color} stroke={isGradient ? "#ffffff" : undefined} height={48} />
        </div>
      )}

      {footer && <div className={cn("mt-auto border-t px-4 py-3 text-sm", rx(bps, footerR), isGradient ? "border-white/20" : "border-separator")}>{footer}</div>}
    </div>
  );
}

export default StatCard;
