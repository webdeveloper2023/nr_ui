import { useId, type ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "../lib/cn";

type StatColor = "default" | "accent" | "success" | "warning" | "danger";
type StatVariant = "default" | "secondary";

const strokeColors: Record<StatColor, string> = {
  default: "var(--color-muted)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
};

export interface SparklineProps {
  /** Grafik nuqtalari qiymatlari */
  data: number[];
  /** Chiziq rangi */
  color?: StatColor;
  /** Istalgan CSS rang (`color` o'rniga) */
  stroke?: string;
  /** Kenglik (px). Berilmasa konteyner kengligini egallaydi */
  width?: number;
  /** Balandlik (px) */
  height?: number;
  /** Ostidagi gradient maydonni ko'rsatadi */
  showArea?: boolean;
  /** Qo'shimcha klasslar */
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
  /** Ko'rsatkich nomi */
  title: string;
  /** Asosiy qiymat */
  value: ReactNode;
  /** O'zgarish foizi (musbat - o'sish, manfiy - tushish) */
  change?: number;
  /** Trend ostidagi izoh matni (masalan, "o'tgan oyga nisbatan") */
  changeLabel?: string;
  /** Tushish ijobiy bo'lsa (masalan, bounce rate) ranglarni almashtiradi */
  isInverted?: boolean;
  /** Sarlavha yonidagi ikonka */
  icon?: ReactNode;
  /** Ikonka, progress va grafik rangi */
  color?: StatColor;
  /** Ko'rinish: oq surface yoki kulrang (surface ichida) */
  variant?: StatVariant;
  /** O'ng yuqoridagi amallar (menyu tugmasi va h.k.) */
  actions?: ReactNode;
  /** Progress chizig'i qiymati (0–100) */
  progress?: number;
  /** Pastdagi sparkline grafik ma'lumotlari */
  chartData?: number[];
  /** Pastki qism kontenti (havola va h.k.) */
  footer?: ReactNode;
  /** Qo'shimcha klasslar */
  className?: string;
}

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
  actions,
  progress,
  chartData,
  footer,
  className = "",
}: StatCardProps) {
  const trend = change === undefined ? null : change > 0 ? "up" : change < 0 ? "down" : "flat";
  const isGood = trend === "flat" ? null : (trend === "up") !== isInverted;
  const trendStyle =
    isGood === null ? "bg-default text-muted" : isGood ? "bg-success-soft text-success-soft-foreground" : "bg-danger-soft text-danger-soft-foreground";

  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl overflow-hidden text-foreground",
        variant === "secondary" ? "bg-surface-secondary" : "bg-surface shadow-surface",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-2.5 min-h-8">
          {icon && <span className={cn("flex items-center justify-center w-8 h-8 shrink-0 rounded-lg [&_svg]:size-4", iconStyles[color])}>{icon}</span>}
          <p className="flex-1 min-w-0 truncate text-sm text-muted">{title}</p>
          {actions && <div className="shrink-0 -mr-1.5 text-muted">{actions}</div>}
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <p className="min-w-0 text-3xl font-semibold tracking-tight tabular-nums leading-none">{value}</p>
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
          <div className="mt-4 h-1.5 w-full rounded-full bg-default overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className={cn("h-full rounded-full transition-[width] duration-500 ease-(--ease-out-soft)", fillStyles[color])} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        )}
      </div>

      {chartData && (
        <div className="-mt-1 px-4 pb-4">
          <Sparkline data={chartData} color={isGood === false ? "danger" : color} height={48} />
        </div>
      )}

      {footer && <div className="mt-auto border-t border-separator px-4 py-3 text-sm">{footer}</div>}
    </div>
  );
}

export default StatCard;
