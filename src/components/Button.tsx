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

type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ko'rinish varianti: primary, secondary, tertiary, outline, ghost, danger, danger-soft */
  variant?: ButtonVariant;
  /** O'lcham */
  size?: ButtonSize;
  /** Burchaklar yumaloqligi (default — to'liq dumaloq) */
  radius?: ButtonRadius;
  /** Boshidagi kontent (masalan, ikonka) */
  startContent?: ReactNode;
  /** Oxiridagi kontent (masalan, ikonka) */
  endContent?: ReactNode;
  /** Loading paytida ko'rsatiladigan maxsus spinner */
  spinner?: ReactNode;
  /** Yuklanish holati: spinner chiqadi va bosib bo'lmaydi */
  isLoading?: boolean;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Faqat ikonka uchun kvadrat (dumaloq) tugma */
  isIconOnly?: boolean;
  /** Konteyner kengligini to'liq egallaydi */
  fullWidth?: boolean;
  /** Bosilish animatsiyasini o'chiradi */
  disableAnimation?: boolean;
  /** Ichki kontent */
  children?: ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 w-8 min-w-8",
  md: "h-10 w-10 min-w-10",
  lg: "h-12 w-12 min-w-12",
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
  danger: "bg-danger text-danger-foreground hover:bg-danger-hover",
  "danger-soft": "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover",
};

const spinnerSize: Record<ButtonSize, string> = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-[18px] h-[18px]" };

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
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const group = useContext(ButtonGroupContext);
  const {
    variant = group?.variant ?? "primary",
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
    children,
    className = "",
    type = "button",
    ...rest
  } = props;

  const disabled = isDisabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 font-medium select-none whitespace-nowrap",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !disableAnimation &&
          "transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
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
  /** Guruhdagi barcha tugmalar varianti */
  variant?: ButtonVariant;
  /** Guruhdagi barcha tugmalar o'lchami */
  size?: ButtonSize;
  /** Guruh chetlarining yumaloqligi */
  radius?: ButtonRadius;
  /** Guruhdagi barcha tugmalarni o'chiradi */
  isDisabled?: boolean;
  /** Konteyner kengligini to'liq egallaydi */
  fullWidth?: boolean;
  /** Button elementlari */
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
  ({ variant = "tertiary", size, radius = "full", isDisabled, fullWidth = false, children, className = "", ...props }, ref) => {
    const items = Children.toArray(children).filter(isValidElement) as ReactElement<ButtonProps>[];
    const last = items.length - 1;
    const isOutline = variant === "outline";

    return (
      <ButtonGroupContext.Provider value={{ variant, size, isDisabled }}>
        <div ref={ref} role="group" className={cn("inline-flex items-center", fullWidth && "w-full", className)} {...props}>
          {items.map((child, i) =>
            cloneElement(child, {
              key: child.key ?? i,
              radius: "none",
              fullWidth: fullWidth || child.props.fullWidth,
              className: cn(
                "active:scale-100 focus-visible:z-10",
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
