import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "solid" | "bordered" | "light" | "flat" | "ghost" | "shadow";
type ButtonColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
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
  children?: ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const radiusStyles: Record<ButtonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const colorMap: Record<ButtonColor, {
  solid: string;
  bordered: string;
  light: string;
  flat: string;
  ghost: string;
  shadow: string;
}> = {
  default: {
    solid: "bg-default-200 text-default-800 hover:bg-default-300",
    bordered: "border-2 border-default-300 text-default-700 hover:bg-default-100",
    light: "text-default-700 hover:bg-default-100",
    flat: "bg-default-100 text-default-700 hover:bg-default-200",
    ghost: "border-2 border-default-300 text-default-700 hover:bg-default-200 hover:text-default-800 hover:border-default-200",
    shadow: "bg-default-200 text-default-800 hover:bg-default-300 shadow-lg shadow-default-200/50",
  },
  primary: {
    solid: "bg-primary-500 text-white hover:bg-primary-600",
    bordered: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
    light: "text-primary-500 hover:bg-primary-50",
    flat: "bg-primary-50 text-primary-500 hover:bg-primary-100",
    ghost: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
    shadow: "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/40",
  },
  secondary: {
    solid: "bg-primary-300 text-white hover:bg-primary-400",
    bordered: "border-2 border-primary-300 text-primary-300 hover:bg-primary-50",
    light: "text-primary-300 hover:bg-primary-50",
    flat: "bg-primary-50 text-primary-400 hover:bg-primary-100",
    ghost: "border-2 border-primary-300 text-primary-300 hover:bg-primary-300 hover:text-white",
    shadow: "bg-primary-300 text-white hover:bg-primary-400 shadow-lg shadow-primary-300/40",
  },
  success: {
    solid: "bg-success-500 text-white hover:bg-success-500/90",
    bordered: "border-2 border-success-500 text-success-500 hover:bg-success-500/10",
    light: "text-success-500 hover:bg-success-500/10",
    flat: "bg-success-500/10 text-success-500 hover:bg-success-500/20",
    ghost: "border-2 border-success-500 text-success-500 hover:bg-success-500 hover:text-white",
    shadow: "bg-success-500 text-white hover:bg-success-500/90 shadow-lg shadow-success-500/40",
  },
  warning: {
    solid: "bg-warning-500 text-white hover:bg-warning-500/90",
    bordered: "border-2 border-warning-500 text-warning-500 hover:bg-warning-500/10",
    light: "text-warning-500 hover:bg-warning-500/10",
    flat: "bg-warning-500/10 text-warning-500 hover:bg-warning-500/20",
    ghost: "border-2 border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white",
    shadow: "bg-warning-500 text-white hover:bg-warning-500/90 shadow-lg shadow-warning-500/40",
  },
  danger: {
    solid: "bg-danger-500 text-white hover:bg-danger-500/90",
    bordered: "border-2 border-danger-500 text-danger-500 hover:bg-danger-500/10",
    light: "text-danger-500 hover:bg-danger-500/10",
    flat: "bg-danger-500/10 text-danger-500 hover:bg-danger-500/20",
    ghost: "border-2 border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white",
    shadow: "bg-danger-500 text-white hover:bg-danger-500/90 shadow-lg shadow-danger-500/40",
  },
};

const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  return (
    <svg
      className={`${spinnerSize} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    const disabled = isDisabled || isLoading;

    const classes = [
      "relative inline-flex items-center justify-center font-medium",
      "outline-none select-none whitespace-nowrap",
      "transition-all duration-200 ease-in-out",
      "active:scale-[0.97]",
      "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
      isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
      radiusStyles[radius],
      colorMap[color][variant],
      fullWidth ? "w-full" : "",
      disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {isLoading && <LoadingSpinner size={size} />}
        {!isLoading && startContent}
        {children}
        {!isLoading && endContent}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
