import React, { forwardRef, type ReactNode } from "react";

type ChipVariant = "solid" | "bordered" | "light" | "flat" | "dot";
type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type ChipSize = "sm" | "md" | "lg";
type ChipRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ChipProps {
  variant?: ChipVariant;
  color?: ChipColor;
  size?: ChipSize;
  radius?: ChipRadius;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onClose?: () => void;
  avatar?: ReactNode;
  isDisabled?: boolean;
  children?: ReactNode;
  className?: string;
}

const sizeMap: Record<ChipSize, { chip: string; text: string; close: string; dot: string }> = {
  sm: { chip: "h-6 px-2 gap-1", text: "text-xs", close: "w-3 h-3", dot: "w-1.5 h-1.5" },
  md: { chip: "h-7 px-2.5 gap-1.5", text: "text-sm", close: "w-3.5 h-3.5", dot: "w-2 h-2" },
  lg: { chip: "h-8 px-3 gap-2", text: "text-base", close: "w-4 h-4", dot: "w-2.5 h-2.5" },
};

const radiusMap: Record<ChipRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const dotColorMap: Record<ChipColor, string> = {
  default: "bg-default-500",
  primary: "bg-primary-500",
  secondary: "bg-primary-300",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const colorStyles: Record<ChipColor, Record<Exclude<ChipVariant, "dot">, string>> = {
  default: {
    solid: "bg-default-200 text-default-800",
    bordered: "border-2 border-default-300 text-default-700 bg-transparent",
    light: "text-default-700 bg-transparent",
    flat: "bg-default-100 text-default-700",
  },
  primary: {
    solid: "bg-primary-500 text-white",
    bordered: "border-2 border-primary-500 text-primary-500 bg-transparent",
    light: "text-primary-500 bg-transparent",
    flat: "bg-primary-50 text-primary-500",
  },
  secondary: {
    solid: "bg-primary-300 text-white",
    bordered: "border-2 border-primary-300 text-primary-300 bg-transparent",
    light: "text-primary-300 bg-transparent",
    flat: "bg-primary-50 text-primary-400",
  },
  success: {
    solid: "bg-success-500 text-white",
    bordered: "border-2 border-success-500 text-success-500 bg-transparent",
    light: "text-success-500 bg-transparent",
    flat: "bg-success-500/10 text-success-500",
  },
  warning: {
    solid: "bg-warning-500 text-white",
    bordered: "border-2 border-warning-500 text-warning-500 bg-transparent",
    light: "text-warning-500 bg-transparent",
    flat: "bg-warning-500/10 text-warning-500",
  },
  danger: {
    solid: "bg-danger-500 text-white",
    bordered: "border-2 border-danger-500 text-danger-500 bg-transparent",
    light: "text-danger-500 bg-transparent",
    flat: "bg-danger-500/10 text-danger-500",
  },
};

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = "solid",
      color = "default",
      size = "md",
      radius = "full",
      startContent,
      endContent,
      onClose,
      avatar,
      isDisabled = false,
      children,
      className = "",
    },
    ref
  ) => {
    const isDot = variant === "dot";

    const chipClasses = [
      "inline-flex items-center justify-center font-medium",
      "transition-all duration-200 ease-in-out",
      sizeMap[size].chip,
      sizeMap[size].text,
      radiusMap[radius],
      isDot
        ? "bg-default-100 text-default-700 border border-default-200"
        : colorStyles[color][variant as Exclude<ChipVariant, "dot">],
      isDisabled ? "opacity-50 pointer-events-none" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={chipClasses}>
        {avatar && <span className="shrink-0 -ml-0.5">{avatar}</span>}

        {isDot && (
          <span className={`${sizeMap[size].dot} rounded-full shrink-0 ${dotColorMap[color]}`} />
        )}

        {!isDot && startContent && <span className="shrink-0">{startContent}</span>}

        <span className="px-0.5 truncate">{children}</span>

        {!isDot && endContent && <span className="shrink-0">{endContent}</span>}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isDisabled}
            className={[
              "shrink-0 flex items-center justify-center rounded-full",
              "opacity-70 hover:opacity-100 transition-opacity duration-150",
              "outline-none focus-visible:ring-1 focus-visible:ring-current",
              sizeMap[size].close,
            ].join(" ")}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";
export default Chip;
