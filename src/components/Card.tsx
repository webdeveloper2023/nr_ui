import { forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

type CardVariant = "default" | "flat" | "glass" | "secondary" | "tertiary" | "transparent";
type CardRadius = "none" | "md" | "lg" | "xl";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Ko'rinish: default (yengil gradient), flat (gradientsiz), glass (shisha), secondary, tertiary yoki transparent */
  variant?: CardVariant;
  /** Shisha materiali: frosted (klassik) yoki liquid (clear glass Liquid). Berilmasa global sozlama (html data-glass) ishlatiladi */
  material?: "frosted" | "liquid";
  /** Burchaklar yumaloqligi */
  radius?: CardRadius;
  /** Hover'da biroz ko'tarilish effekti */
  isHoverable?: boolean;
  /** Bosiladigan karta (tugma kabi, klaviatura bilan ham) */
  isPressable?: boolean;
  /** Kartani o'chirilgan holatga o'tkazadi */
  isDisabled?: boolean;
  /** Footer'ni kontent ustiga xira shisha qilib qo'yadi */
  isFooterBlurred?: boolean;
  /** Konteynerning to'liq kengligini egallaydi */
  fullWidth?: boolean;
  /** isPressable bo'lganda bosilganda chaqiriladi */
  onPress?: () => void;
  /** Karta ichidagi kontent (CardHeader, CardBody, CardFooter) */
  children?: ReactNode;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sarlavha matni */
  title?: ReactNode;
  /** Sarlavha ostidagi izoh matni */
  description?: ReactNode;
  /** O'ng tomondagi slot (tugma, menyu) */
  endContent?: ReactNode;
  /** Sarlavha qismi kontenti (title o'rniga erkin kontent) */
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Asosiy kontent */
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer fonini xira shisha (backdrop-blur) qiladi */
  isBlurred?: boolean;
  /** Footer ustiga ajratuvchi chiziq qo'shadi */
  showDivider?: boolean;
  /** Pastki qism kontenti */
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
      onPress,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
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
      <div
        ref={ref}
        data-glass={material}
        className={cn(
          "group/card relative flex flex-col overflow-hidden text-foreground",
          "transition-[transform,box-shadow,background-color] duration-200 ease-(--ease-out-soft)",
          variantStyles[variant],
          radiusStyles[radius],
          fullWidth && "w-full",
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
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, endContent, children, className = "", ...props }, ref) => (
    <div ref={ref} data-slot="header" className={cn("flex w-full shrink-0 items-start gap-3 px-4 pt-4 pb-2", className)} {...props}>
      {(title || description) && (
        <div className="min-w-0 flex-1">
          {title && <h3 className="text-base font-medium leading-6 text-foreground">{title}</h3>}
          {description && <p className="text-sm leading-5 text-muted">{description}</p>}
        </div>
      )}
      {children}
      {endContent && <div className="ml-auto shrink-0">{endContent}</div>}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ children, className = "", ...props }, ref) => (
  <div ref={ref} data-slot="body" className={cn("relative flex w-full flex-auto flex-col gap-2 px-4 py-2 text-sm break-words", className)} {...props}>
    {children}
  </div>
));

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ isBlurred = false, showDivider = false, children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="footer"
      className={cn(
        "flex w-full shrink-0 items-center gap-2 px-4 pt-2 pb-4",
        showDivider && "mt-2 pt-4 border-t border-separator",
        isBlurred && "glass-thin pt-3 pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

export default Card;
