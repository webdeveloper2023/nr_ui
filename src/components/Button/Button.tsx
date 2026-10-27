import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "solid" | "bordered" | "light" | "flat" | "ghost";
type ButtonColor = "default" | "primary" | "success" | "warning" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  radius?: ButtonRadius;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  fullWidth?: boolean;
}

const colorMap: Record<ButtonColor, { solid: string; bordered: string; light: string; flat: string; ghost: string }> = {
  default: {
    solid: "bg-default-200 text-default-800 hover:bg-default-300",
    bordered: "border-2 border-default-300 text-default-700 hover:bg-default-100",
    light: "text-default-700 hover:bg-default-100",
    flat: "bg-default-100 text-default-700 hover:bg-default-200",
    ghost: "border-2 border-default-300 text-default-700 hover:bg-default-200 hover:text-default-800",
  },
  primary: {
    solid: "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-200",
    bordered: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
    light: "text-primary-500 hover:bg-primary-50",
    flat: "bg-primary-100 text-primary-600 hover:bg-primary-200",
    ghost: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
  },
  success: {
    solid: "bg-success-500 text-white hover:opacity-90",
    bordered: "border-2 border-success-500 text-success-500 hover:bg-green-50",
    light: "text-success-500 hover:bg-green-50",
    flat: "bg-green-100 text-green-700 hover:bg-green-200",
    ghost: "border-2 border-success-500 text-success-500 hover:bg-success-500 hover:text-white",
  },
  warning: {
    solid: "bg-warning-500 text-white hover:opacity-90",
    bordered: "border-2 border-warning-500 text-warning-500 hover:bg-amber-50",
    light: "text-warning-500 hover:bg-amber-50",
    flat: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    ghost: "border-2 border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white",
  },
  danger: {
    solid: "bg-danger-500 text-white hover:opacity-90",
    bordered: "border-2 border-danger-500 text-danger-500 hover:bg-red-50",
    light: "text-danger-500 hover:bg-red-50",
    flat: "bg-red-100 text-red-600 hover:bg-red-200",
    ghost: "border-2 border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white",
  },
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const iconSizeMap: Record<ButtonSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

const radiusMap: Record<ButtonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export function Button({
  variant = "solid",
  color = "default",
  size = "md",
  radius = "md",
  startContent,
  endContent,
  isLoading = false,
  isDisabled = false,
  isIconOnly = false,
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 active:scale-[0.97]";
  const disabled = "opacity-50 pointer-events-none";

  const classes = [
    base,
    colorMap[color][variant],
    isIconOnly ? iconSizeMap[size] : sizeMap[size],
    radiusMap[radius],
    fullWidth ? "w-full" : "",
    isDisabled || isLoading ? disabled : "",
    className,
  ].join(" ");

  return (
    <button className={classes} disabled={isDisabled || isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!isLoading && startContent}
      {!isIconOnly && children}
      {!isLoading && endContent}
    </button>
  );
}

export default Button;
