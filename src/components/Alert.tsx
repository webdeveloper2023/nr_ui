import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type AlertColor = "default" | "accent" | "success" | "warning" | "danger";
type AlertVariant = "default" | "soft" | "flat" | "glass";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  /** Status color (icon and background tint) */
  color?: AlertColor;
  /** Style: default — surface (soft gradient), soft — light color tint, flat — solid color, glass */
  variant?: AlertVariant;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Title */
  title?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Custom icon (replaces the default status icon) */
  icon?: ReactNode;
  /** Hides the icon */
  hideIcon?: boolean;
  /** Action on the right (e.g. a button) */
  action?: ReactNode;
  /** Called when the close button is pressed (the X shows only when set) */
  onClose?: () => void;
  /** Adapts to the screen: on mobile the action moves under the text and the close button grows to a touch target; roomier padding with 16px text on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra content (below the description) */
  children?: ReactNode;
}

const iconTone: Record<AlertColor, string> = {
  default: "text-foreground",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const washTone: Record<AlertColor, string> = {
  default: "from-default",
  accent: "from-accent-soft",
  success: "from-success-soft",
  warning: "from-warning-soft",
  danger: "from-danger-soft",
};

const flatTone: Record<AlertColor, string> = {
  default: "bg-default",
  accent: "bg-accent-soft",
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  danger: "bg-danger-soft",
};

const titleTone: Record<AlertColor, string> = {
  default: "text-foreground",
  accent: "text-accent-soft-foreground",
  success: "text-success-soft-foreground",
  warning: "text-warning-soft-foreground",
  danger: "text-danger-soft-foreground",
};

const iconPath: Record<AlertColor, ReactNode> = {
  default: <path d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  accent: <path d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  success: <path d="m8.5 12.5 2.5 2.5 5-5.5M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  warning: <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  danger: <path d="M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
};

// Mobile: the action wraps onto its own row (aligned with the text) and close is a touch target. Desktop: roomier.
const rootR: BreakpointClasses = { m: "mobile:flex-wrap", d: "desktop:gap-4 desktop:p-5 desktop:text-base" };
const actionR: BreakpointClasses = { m: "mobile:order-last mobile:basis-full mobile:self-start" };
const actionIndentR: BreakpointClasses = { m: "mobile:pl-[30px]" };
const closeR: BreakpointClasses = { m: "mobile:-m-2 mobile:h-9 mobile:w-9", t: "tablet:-m-1.5 tablet:h-8 tablet:w-8" };

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      color = "accent",
      variant = "default",
      material,
      title,
      description,
      icon,
      hideIcon = false,
      action,
      onClose,
      responsive,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const bps = useResponsive(responsive);
    const isFlat = variant === "flat";

    return (
      <div
        ref={ref}
        role="alert"
        data-glass={material}
        className={cn(
          "relative isolate flex w-full items-start gap-3 overflow-hidden rounded-2xl p-4 text-sm",
          isFlat ? flatTone[color] : variant === "glass" ? "glass" : "bg-surface-gradient shadow-surface",
          rx(bps, rootR),
          className
        )}
        {...props}
      >
        {variant === "soft" && (
          <span
            aria-hidden
            className={cn("pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l to-transparent to-70%", washTone[color])}
          />
        )}

        {!hideIcon && (
          <span className={cn("flex h-5 shrink-0 items-center", iconTone[color])}>
            {icon ?? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {iconPath[color]}
              </svg>
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          {title && <div className={cn("font-medium leading-5", isFlat ? titleTone[color] : "text-foreground")}>{title}</div>}
          {description && <div className={cn("leading-5 text-muted", title && "mt-0.5")}>{description}</div>}
          {children && <div className={cn((title || description) && "mt-3")}>{children}</div>}
        </div>

        {action && (
          <div className={cn("flex shrink-0 items-center gap-2 self-center", rx(bps, actionR), !hideIcon && rx(bps, actionIndentR))}>{action}</div>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className={cn(
              "-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full cursor-pointer",
              rx(bps, closeR),
              "text-muted hover:bg-default hover:text-foreground transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-focus"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
export default Alert;
