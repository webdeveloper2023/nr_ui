import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

type AlertColor = "default" | "accent" | "success" | "warning" | "danger";
type AlertVariant = "default" | "soft" | "flat";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  /** Holat rangi (ikonka va fon tusi) */
  color?: AlertColor;
  /** Ko'rinish: default — oq surface, soft — rangli yengil tus, flat — to'liq rangli fon */
  variant?: AlertVariant;
  /** Sarlavha */
  title?: ReactNode;
  /** Tavsif matni */
  description?: ReactNode;
  /** Maxsus ikonka (standart holat ikonkasi o'rniga) */
  icon?: ReactNode;
  /** Ikonkani yashirish */
  hideIcon?: boolean;
  /** O'ng tomondagi amal (masalan, tugma) */
  action?: ReactNode;
  /** Yopish tugmasi bosilganda chaqiriladi (berilsa X tugmasi ko'rinadi) */
  onClose?: () => void;
  /** Qo'shimcha kontent (tavsif ostida) */
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

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      color = "accent",
      variant = "default",
      title,
      description,
      icon,
      hideIcon = false,
      action,
      onClose,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isFlat = variant === "flat";

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative isolate flex w-full items-start gap-3 overflow-hidden rounded-2xl p-4 text-sm",
          isFlat ? flatTone[color] : "bg-surface shadow-surface",
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

        {action && <div className="flex shrink-0 items-center gap-2 self-center">{action}</div>}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full cursor-pointer",
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
