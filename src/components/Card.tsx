import { createContext, forwardRef, useContext, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type CardVariant = "default" | "flat" | "glass" | "secondary" | "tertiary" | "transparent";
type CardRadius = "none" | "md" | "lg" | "xl";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Style: default (soft gradient), flat (no gradient), glass, secondary, tertiary or transparent */
  variant?: CardVariant;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Corner radius */
  radius?: CardRadius;
  /** Lifts slightly on hover */
  isHoverable?: boolean;
  /** Pressable card (acts like a button, keyboard accessible) */
  isPressable?: boolean;
  /** Puts the card in a disabled state */
  isDisabled?: boolean;
  /** Overlays the footer on the content as frosted glass */
  isFooterBlurred?: boolean;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Adapts to the screen: fills the width with a smaller radius on mobile, roomier padding on desktop (header, body and footer follow). true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Called on press when isPressable is set */
  onPress?: () => void;
  /** Card content (CardHeader, CardBody, CardFooter) */
  children?: ReactNode;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title text */
  title?: ReactNode;
  /** Description below the title */
  description?: ReactNode;
  /** Right-side slot (button, menu) */
  endContent?: ReactNode;
  /** Header content (free-form instead of title) */
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Main content */
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Makes the footer background frosted glass (backdrop blur) */
  isBlurred?: boolean;
  /** Adds a divider above the footer */
  showDivider?: boolean;
  /** Footer content */
  children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface-gradient shadow-surface",
  flat: "bg-surface shadow-surface",
  glass: "glass",
  secondary: "bg-surface-secondary",
  tertiary: "bg-surface-tertiary",
  transparent: "bg-transparent",
};

const radiusStyles: Record<CardRadius, string> = {
  none: "rounded-none",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

// Mobile: one step smaller radius (less wasted corner on narrow screens). Desktop: roomier padding.
const radiusStylesR: Record<CardRadius, BreakpointClasses> = {
  none: {},
  md: { m: "mobile:rounded-lg" },
  lg: { m: "mobile:rounded-xl" },
  xl: { m: "mobile:rounded-2xl" },
};
const headerR: BreakpointClasses = { d: "desktop:px-6 desktop:pt-6 desktop:pb-3" };
const bodyR: BreakpointClasses = { d: "desktop:px-6 desktop:py-3 desktop:text-base" };
const footerR: BreakpointClasses = { d: "desktop:px-6 desktop:pb-6" };

/** Active breakpoints of the card, read by its header, body and footer */
const CardContext = createContext<Breakpoint[]>([]);

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      material,
      radius = "xl",
      isHoverable = false,
      isPressable = false,
      isDisabled = false,
      isFooterBlurred = false,
      fullWidth = false,
      responsive,
      onPress,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const bps = useResponsive(responsive);
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      onClick?.(e);
      onPress?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
        onPress?.();
      }
    };

    return (
      <CardContext.Provider value={bps}>
        <div
          ref={ref}
          data-glass={material}
          className={cn(
            "group/card relative flex flex-col overflow-hidden text-foreground",
            "transition-[transform,box-shadow,background-color] duration-200 ease-(--ease-out-soft)",
            variantStyles[variant],
            radiusStyles[radius],
            rx(bps, radiusStylesR[radius]),
            fullWidth ? "w-full" : rx(bps, { m: "mobile:w-full" }),
            isHoverable && "hover:-translate-y-0.5 hover:shadow-overlay",
            isPressable &&
              "cursor-pointer select-none active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isDisabled && "opacity-50 pointer-events-none",
            isFooterBlurred &&
              "[&>[data-slot=footer]]:absolute [&>[data-slot=footer]]:bottom-0 [&>[data-slot=footer]]:inset-x-0 [&>[data-slot=footer]]:z-10 [&>[data-slot=footer]]:glass-thin",
            className
          )}
          role={isPressable ? "button" : undefined}
          tabIndex={isPressable ? 0 : undefined}
          aria-disabled={isDisabled || undefined}
          onClick={isPressable || onClick ? handleClick : undefined}
          onKeyDown={isPressable ? handleKeyDown : undefined}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, endContent, children, className = "", ...props }, ref) => {
    const bps = useContext(CardContext);
    return (
      <div ref={ref} data-slot="header" className={cn("flex w-full shrink-0 items-start gap-3 px-4 pt-4 pb-2", rx(bps, headerR), className)} {...props}>
        {(title || description) && (
          <div className="min-w-0 flex-1">
            {title && <h3 className="text-base font-medium leading-6 text-foreground">{title}</h3>}
            {description && <p className="text-sm leading-5 text-muted">{description}</p>}
          </div>
        )}
        {children}
        {endContent && <div className="ml-auto shrink-0">{endContent}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ children, className = "", ...props }, ref) => {
  const bps = useContext(CardContext);
  return (
    <div ref={ref} data-slot="body" className={cn("relative flex w-full flex-auto flex-col gap-2 px-4 py-2 text-sm break-words", rx(bps, bodyR), className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ isBlurred = false, showDivider = false, children, className = "", ...props }, ref) => {
    const bps = useContext(CardContext);
    return (
      <div
        ref={ref}
        data-slot="footer"
        className={cn(
          "flex w-full shrink-0 items-center gap-2 px-4 pt-2 pb-4",
          rx(bps, isBlurred ? { d: "desktop:px-6" } : footerR),
          !showDivider && !isBlurred && rx(bps, { d: "desktop:pt-3" }),
          showDivider && "mt-2 pt-4 border-t border-separator",
          isBlurred && "glass-thin pt-3 pb-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export default Card;
