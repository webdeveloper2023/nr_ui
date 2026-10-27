import React, { type ReactNode } from "react";

type BadgeColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type BadgeVariant = "solid" | "flat" | "faded";
type BadgeSize = "sm" | "md" | "lg";
type BadgePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
type BadgeShape = "circle" | "rectangle";

export interface BadgeProps {
  content?: ReactNode;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  placement?: BadgePlacement;
  shape?: BadgeShape;
  isInvisible?: boolean;
  children?: ReactNode;
  className?: string;
}

const placementMap: Record<BadgePlacement, string> = {
  "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
  "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
  "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
  "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
};

const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
  default: {
    solid: "bg-default-500 text-white",
    flat: "bg-default-100 text-default-700",
    faded: "bg-default-50 text-default-600 border border-default-200",
  },
  primary: {
    solid: "bg-primary-500 text-white",
    flat: "bg-primary-50 text-primary-600",
    faded: "bg-primary-50 text-primary-500 border border-primary-200",
  },
  secondary: {
    solid: "bg-primary-300 text-white",
    flat: "bg-primary-50 text-primary-400",
    faded: "bg-primary-50 text-primary-300 border border-primary-200",
  },
  success: {
    solid: "bg-success-500 text-white",
    flat: "bg-success-500/10 text-success-500",
    faded: "bg-success-500/5 text-success-500 border border-success-500/30",
  },
  warning: {
    solid: "bg-warning-500 text-white",
    flat: "bg-warning-500/10 text-warning-500",
    faded: "bg-warning-500/5 text-warning-500 border border-warning-500/30",
  },
  danger: {
    solid: "bg-danger-500 text-white",
    flat: "bg-danger-500/10 text-danger-500",
    faded: "bg-danger-500/5 text-danger-500 border border-danger-500/30",
  },
};

const sizeMap: Record<BadgeSize, { badge: string; dot: string; text: string }> = {
  sm: { badge: "min-w-4 h-4 px-1", dot: "w-2 h-2", text: "text-[10px]" },
  md: { badge: "min-w-5 h-5 px-1.5", dot: "w-2.5 h-2.5", text: "text-xs" },
  lg: { badge: "min-w-6 h-6 px-2", dot: "w-3 h-3", text: "text-sm" },
};

export const Badge: React.FC<BadgeProps> = ({
  content,
  color = "danger",
  variant = "solid",
  size = "sm",
  placement = "top-right",
  shape = "circle",
  isInvisible = false,
  children,
  className = "",
}) => {
  const hasContent = content !== undefined && content !== null;

  const badgeClasses = [
    "absolute z-10 flex items-center justify-center font-semibold leading-none",
    "transition-all duration-200 ease-in-out",
    placementMap[placement],
    colorStyles[color][variant],
    sizeMap[size].text,
    hasContent
      ? `${sizeMap[size].badge} ${shape === "circle" ? "rounded-full" : "rounded-md"}`
      : `${sizeMap[size].dot} rounded-full`,
    isInvisible ? "scale-0 opacity-0" : "scale-100 opacity-100",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {children}
      <span className={badgeClasses}>{hasContent ? content : null}</span>
    </div>
  );
};

Badge.displayName = "Badge";
export default Badge;
