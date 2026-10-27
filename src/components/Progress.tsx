import React from "react";

type ProgressColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type ProgressSize = "sm" | "md" | "lg";
type ProgressRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ProgressProps {
  value?: number;
  maxValue?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  radius?: ProgressRadius;
  showValueLabel?: boolean;
  label?: string;
  isIndeterminate?: boolean;
  isStriped?: boolean;
  className?: string;
}

const sizeMap: Record<ProgressSize, { track: string; label: string }> = {
  sm: { track: "h-1.5", label: "text-xs" },
  md: { track: "h-3", label: "text-sm" },
  lg: { track: "h-5", label: "text-base" },
};

const radiusMap: Record<ProgressRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const barColorMap: Record<ProgressColor, string> = {
  default: "bg-default-500",
  primary: "bg-primary-500",
  secondary: "bg-primary-300",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const stripedStyle = `
  background-image: linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: nr-progress-stripes 1s linear infinite;
`;

const indeterminateKeyframes = `
@keyframes nr-progress-indeterminate {
  0% { left: -40%; width: 40%; }
  50% { left: 20%; width: 60%; }
  100% { left: 100%; width: 40%; }
}
@keyframes nr-progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
`;

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  maxValue = 100,
  color = "primary",
  size = "md",
  radius = "full",
  showValueLabel = false,
  label,
  isIndeterminate = false,
  isStriped = false,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  const trackClasses = [
    "relative w-full overflow-hidden bg-default-100",
    sizeMap[size].track,
    radiusMap[radius],
  ].join(" ");

  const barClasses = [
    "h-full transition-[width] duration-500 ease-out",
    barColorMap[color],
    radiusMap[radius],
  ].join(" ");

  return (
    <>
      <style>{indeterminateKeyframes}</style>

      <div
        className={`flex flex-col gap-1.5 w-full ${className}`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {(label || showValueLabel) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className={`${sizeMap[size].label} text-default-700 font-medium`}>
                {label}
              </span>
            )}
            {showValueLabel && !isIndeterminate && (
              <span className={`${sizeMap[size].label} text-default-500`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div className={trackClasses}>
          {isIndeterminate ? (
            <div
              className={`absolute h-full ${barColorMap[color]} ${radiusMap[radius]}`}
              style={{
                animation: "nr-progress-indeterminate 1.5s ease-in-out infinite",
              }}
            />
          ) : (
            <div
              className={barClasses}
              style={{
                width: `${percentage}%`,
                ...(isStriped
                  ? {
                      backgroundImage:
                        "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
                      backgroundSize: "1rem 1rem",
                      animation: "nr-progress-stripes 1s linear infinite",
                    }
                  : {}),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

Progress.displayName = "Progress";
export default Progress;
