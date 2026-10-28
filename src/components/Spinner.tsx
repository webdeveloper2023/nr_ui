import React from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";

type SpinnerColor = "default" | "accent" | "success" | "warning" | "danger" | "current";
type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "default" | "dots" | "wave" | "spinner";
type SpinnerLabelColor = "foreground" | "muted";

export interface SpinnerProps {
  /** Size */
  size?: SpinnerSize;
  /** Color */
  color?: SpinnerColor;
  /** Animation style */
  variant?: SpinnerVariant;
  /** Label text */
  label?: string;
  /** Label color */
  labelColor?: SpinnerLabelColor;
  /** Extra CSS classes */
  className?: string;
}

const sizeMap: Record<SpinnerSize, { box: string; stroke: number; dot: string; bar: string; label: string }> = {
  xs: { box: "w-3 h-3", stroke: 3, dot: "w-0.5 h-0.5", bar: "w-px h-2", label: "text-[11px]" },
  sm: { box: "w-4 h-4", stroke: 2.5, dot: "w-1 h-1", bar: "w-0.5 h-2.5", label: "text-xs" },
  md: { box: "w-6 h-6", stroke: 2.5, dot: "w-1.5 h-1.5", bar: "w-[3px] h-4", label: "text-sm" },
  lg: { box: "w-8 h-8", stroke: 2.5, dot: "w-2 h-2", bar: "w-1 h-5", label: "text-sm" },
};

const textColor: Record<SpinnerColor, string> = {
  default: "text-muted",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  current: "text-current",
};

const labelColorMap: Record<SpinnerLabelColor, string> = {
  foreground: "text-foreground",
  muted: "text-muted",
};

const keyframes = `
@keyframes nr-spinner-bounce { 0%,80%,100% { transform: scale(0.6); opacity: .35 } 40% { transform: scale(1); opacity: 1 } }
@keyframes nr-spinner-wave { 0%,100% { transform: scaleY(0.45); opacity: .45 } 50% { transform: scaleY(1); opacity: 1 } }
@keyframes nr-spinner-fade { from { opacity: 1 } to { opacity: .15 } }
`;

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "accent",
  variant = "default",
  label,
  labelColor = "muted",
  className = "",
}) => {
  const t = useLocale();
  const s = sizeMap[size];

  const renderIndicator = () => {
    switch (variant) {
      case "dots":
        return (
          <span className={cn("flex items-center justify-center gap-1", s.box)}>
            {[0, 160, 320].map((d) => (
              <span
                key={d}
                className={cn("rounded-full bg-current", s.dot)}
                style={{ animation: `nr-spinner-bounce 1.2s ${d}ms infinite ease-in-out both` }}
              />
            ))}
          </span>
        );
      case "wave":
        return (
          <span className={cn("flex items-center justify-center gap-[3px]", s.box)}>
            {[0, 100, 200, 300].map((d) => (
              <span
                key={d}
                className={cn("rounded-full bg-current", s.bar)}
                style={{ animation: `nr-spinner-wave 1s ${d}ms infinite ease-in-out` }}
              />
            ))}
          </span>
        );
      case "spinner":
        return (
          <span className={cn("relative", s.box)}>
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-0 h-1/2 w-full origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
              >
                <span
                  className="mx-auto block h-[32%] w-[13%] rounded-full bg-current"
                  style={{ animation: `nr-spinner-fade 0.8s ${(i * 0.1).toFixed(1)}s linear infinite` }}
                />
              </span>
            ))}
          </span>
        );
      default:
        return (
          <svg className={cn(s.box, "animate-spin")} style={{ animationDuration: "0.75s" }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={s.stroke} className="opacity-15" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth={s.stroke} strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={cn("inline-flex flex-col items-center justify-center gap-2", className)}
      role="status"
      aria-label={label || t.common.loading}
    >
      {variant !== "default" && <style>{keyframes}</style>}
      <span className={textColor[color]}>{renderIndicator()}</span>
      {label && <span className={cn(s.label, labelColorMap[labelColor])}>{label}</span>}
    </div>
  );
};

Spinner.displayName = "Spinner";
export default Spinner;
