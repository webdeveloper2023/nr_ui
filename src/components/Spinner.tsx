import React from "react";

type SpinnerColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, { container: string; label: string }> = {
  sm: { container: "w-5 h-5", label: "text-xs" },
  md: { container: "w-8 h-8", label: "text-sm" },
  lg: { container: "w-12 h-12", label: "text-base" },
};

const colorMap: Record<SpinnerColor, { outer: string; inner: string }> = {
  default: { outer: "border-default-300", inner: "border-default-600" },
  primary: { outer: "border-primary-200", inner: "border-primary-500" },
  secondary: { outer: "border-primary-100", inner: "border-primary-300" },
  success: { outer: "border-success-500/20", inner: "border-success-500" },
  warning: { outer: "border-warning-500/20", inner: "border-warning-500" },
  danger: { outer: "border-danger-500/20", inner: "border-danger-500" },
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  label,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label={label || "Loading"}
    >
      <div className={`relative ${sizeMap[size].container}`}>
        {/* Outer circle - spins clockwise */}
        <div
          className={[
            "absolute inset-0 rounded-full",
            "border-2 border-transparent",
            colorMap[color].outer,
            "border-t-transparent!",
            "animate-spin",
          ].join(" ")}
          style={{ animationDuration: "0.8s" }}
        />

        {/* Inner circle - spins counter-clockwise */}
        <div
          className={[
            "absolute inset-1 rounded-full",
            "border-2 border-transparent",
            colorMap[color].inner,
            "border-b-transparent!",
            "animate-spin",
          ].join(" ")}
          style={{ animationDirection: "reverse", animationDuration: "0.6s" }}
        />
      </div>

      {label && (
        <span className={`${sizeMap[size].label} text-default-500`}>{label}</span>
      )}
    </div>
  );
};

Spinner.displayName = "Spinner";
export default Spinner;
