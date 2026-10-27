import { forwardRef, type ReactNode } from "react";
import { cn } from "../lib/cn";

type ChipVariant = "primary" | "secondary" | "tertiary" | "soft";
type ChipColor = "default" | "accent" | "success" | "warning" | "danger";
type ChipSize = "sm" | "md" | "lg";

export interface ChipProps {
  /** Ko'rinish: primary (to'liq rang), secondary (kulrang fon), tertiary (fonsiz) yoki soft (yumshoq rangli fon) */
  variant?: ChipVariant;
  /** Rang */
  color?: ChipColor;
  /** O'lcham */
  size?: ChipSize;
  /** Matn oldida rangli nuqta ko'rsatadi (status uchun) */
  dot?: boolean;
  /** Matn oldidagi kontent (ikonka) */
  startContent?: ReactNode;
  /** Matn ortidagi kontent */
  endContent?: ReactNode;
  /** Berilsa, yopish (X) tugmasi chiqadi */
  onClose?: () => void;
  /** Chap tomondagi avatar */
  avatar?: ReactNode;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Chip matni */
  children?: ReactNode;
  /** Qo'shimcha klasslar */
  className?: string;
}

const sizeMap: Record<ChipSize, { chip: string; close: string; dot: string; avatar: string; icon: string }> = {
  sm: { chip: "h-5 px-1.5 gap-1 text-xs", close: "w-3.5 h-3.5", dot: "w-1.5 h-1.5", avatar: "[&_*]:w-3.5 [&_*]:h-3.5 -ml-0.5", icon: "[&_svg]:w-3 [&_svg]:h-3" },
  md: { chip: "h-6 px-2 gap-1 text-xs", close: "w-4 h-4", dot: "w-1.5 h-1.5", avatar: "[&_*]:w-4 [&_*]:h-4 -ml-1", icon: "[&_svg]:w-3.5 [&_svg]:h-3.5" },
  lg: { chip: "h-7 px-2.5 gap-1.5 text-sm", close: "w-[18px] h-[18px]", dot: "w-2 h-2", avatar: "[&_*]:w-5 [&_*]:h-5 -ml-1.5", icon: "[&_svg]:w-4 [&_svg]:h-4" },
};

const dotColor: Record<ChipColor, string> = {
  default: "bg-muted",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const textColor: Record<ChipColor, string> = {
  default: "text-foreground",
  accent: "text-accent",
  success: "text-success-soft-foreground",
  warning: "text-warning-soft-foreground",
  danger: "text-danger-soft-foreground",
};

const colorStyles: Record<ChipColor, Record<ChipVariant, string>> = {
  default: {
    primary: "bg-default text-default-foreground",
    secondary: "bg-default/60 text-foreground",
    tertiary: "bg-transparent text-foreground",
    soft: "bg-default/70 text-default-foreground",
  },
  accent: {
    primary: "bg-accent text-accent-foreground",
    secondary: cn("bg-default/60", textColor.accent),
    tertiary: cn("bg-transparent", textColor.accent),
    soft: "bg-accent-soft text-accent-soft-foreground",
  },
  success: {
    primary: "bg-success text-success-foreground",
    secondary: cn("bg-default/60", textColor.success),
    tertiary: cn("bg-transparent", textColor.success),
    soft: "bg-success-soft text-success-soft-foreground",
  },
  warning: {
    primary: "bg-warning text-warning-foreground",
    secondary: cn("bg-default/60", textColor.warning),
    tertiary: cn("bg-transparent", textColor.warning),
    soft: "bg-warning-soft text-warning-soft-foreground",
  },
  danger: {
    primary: "bg-danger text-danger-foreground",
    secondary: cn("bg-default/60", textColor.danger),
    tertiary: cn("bg-transparent", textColor.danger),
    soft: "bg-danger-soft text-danger-soft-foreground",
  },
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = "soft",
      color = "default",
      size = "md",
      dot = false,
      startContent,
      endContent,
      onClose,
      avatar,
      isDisabled = false,
      children,
      className = "",
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex max-w-fit min-w-min items-center rounded-full whitespace-nowrap font-medium leading-none",
        "transition-colors duration-150",
        sizeMap[size].chip,
        sizeMap[size].icon,
        colorStyles[color][variant],
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {avatar && <span className={cn("flex shrink-0 overflow-hidden rounded-full", sizeMap[size].avatar)}>{avatar}</span>}
      {dot && <span className={cn("shrink-0 rounded-full", sizeMap[size].dot, variant === "primary" ? "bg-current" : dotColor[color])} />}
      {startContent && <span className="flex shrink-0">{startContent}</span>}
      <span className="truncate">{children}</span>
      {endContent && <span className="flex shrink-0">{endContent}</span>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          disabled={isDisabled}
          className={cn(
            "-mr-0.5 shrink-0 flex items-center justify-center rounded-full cursor-pointer",
            "opacity-60 hover:opacity-100 hover:bg-current/15 transition-[opacity,background-color] duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-focus",
            sizeMap[size].close
          )}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="!w-[70%] !h-[70%]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  )
);

Chip.displayName = "Chip";
export default Chip;
