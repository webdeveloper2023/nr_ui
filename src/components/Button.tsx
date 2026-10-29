import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "glass" | "danger" | "danger-soft";
type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant: primary, secondary, tertiary, outline, ghost, glass, danger, danger-soft */
  variant?: ButtonVariant;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Size */
  size?: ButtonSize;
  /** Corner radius (default: fully rounded) */
  radius?: ButtonRadius;
  /** Leading content (e.g. an icon) */
  startContent?: ReactNode;
  /** Trailing content (e.g. an icon) */
  endContent?: ReactNode;
  /** Custom spinner shown while loading */
  spinner?: ReactNode;
  /** Loading state: shows a spinner and blocks presses */
  isLoading?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Square (round) icon-only button */
  isIconOnly?: boolean;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Disables the press animation */
  disableAnimation?: boolean;
  /** Adapts to the screen: touch-sized (44px for md) on mobile and tablet, larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Inner content */
  children?: ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-xs gap-1",
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: "h-6 w-6 min-w-6",
  sm: "h-8 w-8 min-w-8",
  md: "h-10 w-10 min-w-10",
  lg: "h-12 w-12 min-w-12",
};

// Mobile / tablet: touch targets (44px for md). Laptop: static sizes. Desktop: lg grows a step.
const sizeStylesR: Record<ButtonSize, BreakpointClasses> = {
  xs: { m: "mobile:h-8 mobile:px-3" },
  sm: { m: "mobile:h-10 mobile:px-4", t: "tablet:h-9 tablet:px-3.5" },
  md: { m: "mobile:h-11 mobile:px-5 mobile:text-base", t: "tablet:h-11 tablet:px-5" },
  lg: { d: "desktop:h-14 desktop:px-7 desktop:text-lg" },
};

const iconOnlySizeStylesR: Record<ButtonSize, BreakpointClasses> = {
  xs: { m: "mobile:h-8 mobile:w-8 mobile:min-w-8" },
  sm: { m: "mobile:h-10 mobile:w-10 mobile:min-w-10", t: "tablet:h-9 tablet:w-9 tablet:min-w-9" },
  md: { m: "mobile:h-11 mobile:w-11 mobile:min-w-11", t: "tablet:h-11 tablet:w-11 tablet:min-w-11" },
  lg: { d: "desktop:h-14 desktop:w-14 desktop:min-w-14" },
};

const radiusStyles: Record<ButtonRadius, string> = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary: "bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover",
  tertiary: "bg-default text-default-foreground hover:bg-default-hover",
  outline: "border border-border bg-transparent text-foreground hover:bg-default/60",
  ghost: "bg-transparent text-foreground hover:bg-default",
  glass: "glass-thin text-foreground hover:brightness-[1.06] dark:hover:brightness-125 active:brightness-110 dark:active:brightness-150",
  danger: "bg-danger text-danger-foreground hover:bg-danger-hover",
  "danger-soft": "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover",
};

const spinnerSize: Record<ButtonSize, string> = { xs: "w-3 h-3", sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-[18px] h-[18px]" };

const LoadingSpinner = ({ size }: { size: ButtonSize }) => (
  <svg className={cn(spinnerSize[size], "animate-spin")} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ─── Group context ──────────────────────────
interface ButtonGroupContextValue {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  responsive?: ResponsiveProp;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const group = useContext(ButtonGroupContext);
  const {
    variant = group?.variant ?? "primary",
    material,
    size = group?.size ?? "md",
    radius = "full",
    startContent,
    endContent,
    spinner,
    isLoading = false,
    isDisabled = group?.isDisabled ?? false,
    isIconOnly = false,
    fullWidth = false,
    disableAnimation = false,
    responsive,
    children,
    className = "",
    type = "button",
    ...rest
  } = props;
  const bps = useResponsive(responsive ?? group?.responsive);

  const disabled = isDisabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      data-glass={material}
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 font-medium select-none whitespace-nowrap",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !disableAnimation &&
          "transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
        rx(bps, (isIconOnly ? iconOnlySizeStylesR : sizeStylesR)[size]),
        radiusStyles[radius],
        variantStyles[variant],
        fullWidth && "w-full",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className
      )}
      {...rest}
    >
      {isLoading && (spinner ?? <LoadingSpinner size={size} />)}
      {!isLoading && startContent}
      {isLoading && isIconOnly ? null : children}
      {!isLoading && endContent}
    </button>
  );
});

Button.displayName = "Button";

// ─── ButtonGroup ────────────────────────────
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Variant of every button in the group */
  variant?: ButtonVariant;
  /** Size of every button in the group */
  size?: ButtonSize;
  /** Corner radius of the group */
  radius?: ButtonRadius;
  /** Disables every button in the group */
  isDisabled?: boolean;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Passed to every button; on mobile the group also fills the width and the buttons share it equally. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Button elements */
  children?: ReactNode;
}

const groupRadius: Record<ButtonRadius, { first: string; last: string }> = {
  none: { first: "rounded-none", last: "rounded-none" },
  sm: { first: "rounded-l-lg", last: "rounded-r-lg" },
  md: { first: "rounded-l-xl", last: "rounded-r-xl" },
  lg: { first: "rounded-l-2xl", last: "rounded-r-2xl" },
  full: { first: "rounded-l-full", last: "rounded-r-full" },
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ variant = "tertiary", size, radius = "full", isDisabled, fullWidth = false, responsive, children, className = "", ...props }, ref) => {
    const bps = useResponsive(responsive);
    const items = Children.toArray(children).filter(isValidElement) as ReactElement<ButtonProps>[];
    const last = items.length - 1;
    const isOutline = variant === "outline";

    return (
      <ButtonGroupContext.Provider value={{ variant, size, isDisabled, responsive }}>
        <div
          ref={ref}
          role="group"
          className={cn("inline-flex items-center", fullWidth && "w-full", rx(bps, { m: "mobile:flex mobile:w-full" }), className)}
          {...props}
        >
          {items.map((child, i) =>
            cloneElement(child, {
              key: child.key ?? i,
              radius: "none",
              fullWidth: fullWidth || child.props.fullWidth,
              className: cn(
                "active:scale-100 focus-visible:z-10",
                rx(bps, { m: "mobile:flex-1" }),
                i === 0 && groupRadius[radius].first,
                i === last && groupRadius[radius].last,
                isOutline && i > 0 && "-ml-px",
                !isOutline && i > 0 && "border-l border-[color-mix(in_oklab,currentColor_14%,transparent)]",
                child.props.className
              ),
            })
          )}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export default Button;
