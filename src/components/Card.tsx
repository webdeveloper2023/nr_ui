import { createContext, forwardRef, useContext, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type CardVariant = "default" | "flat" | "bordered" | "elevated" | "accent" | "dashed" | "glass" | "secondary" | "tertiary" | "transparent";
type CardRadius = "none" | "md" | "lg" | "xl" | "2xl";
type CardSize = "sm" | "md" | "lg" | "xl";
type CardOrientation = "vertical" | "horizontal";
type CardMediaAspect = "video" | "square" | "wide" | "portrait" | "auto";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Style: default (soft gradient), flat (no gradient), bordered (thin border, no shadow), elevated (deep shadow), accent (tinted), dashed (placeholder / empty state), glass, secondary, tertiary or transparent */
  variant?: CardVariant;
  /** Size: padding and text of the header, body, footer and media follow it */
  size?: CardSize;
  /** vertical (default) stacks the parts; horizontal puts CardMedia beside the content, stacking again on mobile when responsive */
  orientation?: CardOrientation;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Corner radius (default: lg for sm, xl for md and lg, 2xl for xl) */
  radius?: CardRadius;
  /** Lifts slightly on hover */
  isHoverable?: boolean;
  /** Pressable card (acts like a button, keyboard accessible) */
  isPressable?: boolean;
  /** Marks the card as chosen with an accent ring (choice cards) */
  isSelected?: boolean;
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
  /** Left-side slot (avatar, icon) */
  startContent?: ReactNode;
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

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL */
  src?: string;
  /** Image description for screen readers */
  alt?: string;
  /** Shape: video (16:9), square, wide (21:9), portrait (3:4) or auto (image height; fills the side in a horizontal card) */
  aspect?: CardMediaAspect;
  /** Keeps the card padding around the media and rounds its corners */
  isInset?: boolean;
  /** Content laid over the media (badge, title on a gradient) */
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
  bordered: "bg-surface border border-border",
  elevated: "bg-surface shadow-overlay",
  accent: "bg-accent-soft",
  dashed: "border-2 border-dashed border-border bg-transparent",
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
  "2xl": "rounded-[2rem]",
};

// Mobile: one step smaller radius (less wasted corner on narrow screens). Desktop: roomier padding.
const radiusStylesR: Record<CardRadius, BreakpointClasses> = {
  none: {},
  md: { m: "mobile:rounded-lg" },
  lg: { m: "mobile:rounded-xl" },
  xl: { m: "mobile:rounded-2xl" },
  "2xl": { m: "mobile:rounded-3xl" },
};

const defaultRadius: Record<CardSize, CardRadius> = { sm: "lg", md: "xl", lg: "xl", xl: "2xl" };

// Each size scales padding and text together; md keeps the original spacing
const sizeStyles: Record<CardSize, { header: string; title: string; description: string; body: string; footer: string; inset: string; side: string }> = {
  sm: { header: "px-3 pt-3 pb-1.5 gap-2.5", title: "text-sm leading-5", description: "text-xs leading-4", body: "px-3 py-1.5 text-[13px] gap-1.5", footer: "px-3 pt-1.5 pb-3 gap-1.5", inset: "m-2 mb-0 rounded-lg", side: "w-24" },
  md: { header: "px-4 pt-4 pb-2 gap-3", title: "text-base leading-6", description: "text-sm leading-5", body: "px-4 py-2 text-sm gap-2", footer: "px-4 pt-2 pb-4 gap-2", inset: "m-3 mb-0 rounded-2xl", side: "w-32" },
  lg: { header: "px-6 pt-6 pb-3 gap-3", title: "text-lg leading-7", description: "text-sm leading-5", body: "px-6 py-3 text-[15px] gap-2.5", footer: "px-6 pt-3 pb-6 gap-2", inset: "m-4 mb-0 rounded-2xl", side: "w-44" },
  xl: { header: "px-8 pt-8 pb-4 gap-4", title: "text-xl leading-7 font-semibold", description: "text-base leading-6", body: "px-8 py-4 text-base gap-3", footer: "px-8 pt-4 pb-8 gap-3", inset: "m-5 mb-0 rounded-3xl", side: "w-56" },
};

const aspectStyles: Record<CardMediaAspect, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
  auto: "",
};
const headerR: BreakpointClasses = { d: "desktop:px-6 desktop:pt-6 desktop:pb-3" };
const bodyR: BreakpointClasses = { d: "desktop:px-6 desktop:py-3 desktop:text-base" };
const footerR: BreakpointClasses = { d: "desktop:px-6 desktop:pb-6" };

/** Active breakpoints, size and orientation of the card, read by its parts */
const CardContext = createContext<{ bps: Breakpoint[]; size: CardSize; horizontal: boolean }>({ bps: [], size: "md", horizontal: false });

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      size = "md",
      orientation = "vertical",
      material,
      radius,
      isHoverable = false,
      isPressable = false,
      isSelected = false,
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
    const horizontal = orientation === "horizontal";
    const r = radius ?? defaultRadius[size];
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
      <CardContext.Provider value={{ bps, size, horizontal }}>
        <div
          ref={ref}
          data-glass={material}
          className={cn(
            "group/card relative flex overflow-hidden text-foreground",
            horizontal ? cn("flex-row", rx(bps, { m: "mobile:flex-col" })) : "flex-col",
            "transition-[transform,box-shadow,background-color] duration-200 ease-(--ease-out-soft)",
            variantStyles[variant],
            radiusStyles[r],
            rx(bps, radiusStylesR[r]),
            fullWidth ? "w-full" : rx(bps, { m: "mobile:w-full" }),
            isHoverable && "hover:-translate-y-0.5 hover:shadow-overlay",
            isPressable &&
              "cursor-pointer select-none active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isSelected && "ring-2 ring-accent",
            isDisabled && "opacity-50 pointer-events-none",
            isFooterBlurred &&
              "[&>[data-slot=footer]]:absolute [&>[data-slot=footer]]:bottom-0 [&>[data-slot=footer]]:inset-x-0 [&>[data-slot=footer]]:z-10 [&>[data-slot=footer]]:glass-thin",
            className
          )}
          role={isPressable ? "button" : undefined}
          tabIndex={isPressable ? 0 : undefined}
          aria-disabled={isDisabled || undefined}
          aria-pressed={isPressable ? isSelected : undefined}
          data-selected={isSelected || undefined}
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
  ({ startContent, title, description, endContent, children, className = "", ...props }, ref) => {
    const { bps, size } = useContext(CardContext);
    const s = sizeStyles[size];
    return (
      <div ref={ref} data-slot="header" className={cn("flex w-full shrink-0 items-start", s.header, size === "md" && rx(bps, headerR), className)} {...props}>
        {startContent && <div className="shrink-0">{startContent}</div>}
        {(title || description) && (
          <div className="min-w-0 flex-1">
            {title && <h3 className={cn("font-medium text-foreground", s.title)}>{title}</h3>}
            {description && <p className={cn("text-muted", s.description)}>{description}</p>}
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
  const { bps, size } = useContext(CardContext);
  return (
    <div ref={ref} data-slot="body" className={cn("relative flex w-full flex-auto flex-col break-words", sizeStyles[size].body, size === "md" && rx(bps, bodyR), className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ isBlurred = false, showDivider = false, children, className = "", ...props }, ref) => {
    const { bps, size } = useContext(CardContext);
    const isMd = size === "md";
    return (
      <div
        ref={ref}
        data-slot="footer"
        className={cn(
          "flex w-full shrink-0 items-center",
          sizeStyles[size].footer,
          isMd && rx(bps, isBlurred ? { d: "desktop:px-6" } : footerR),
          isMd && !showDivider && !isBlurred && rx(bps, { d: "desktop:pt-3" }),
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

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  ({ src, alt = "", aspect, isInset = false, children, className = "", ...props }, ref) => {
    const { bps, size, horizontal } = useContext(CardContext);
    const s = sizeStyles[size];
    const shape = aspect ?? (horizontal ? "auto" : "video");
    return (
      <div
        ref={ref}
        data-slot="media"
        className={cn(
          "relative shrink-0 overflow-hidden bg-default",
          aspectStyles[shape],
          horizontal && cn(s.side, "self-stretch", rx(bps, { m: "mobile:w-full mobile:aspect-video" })),
          isInset && s.inset,
          horizontal && isInset && "mr-0 mb-3",
          className
        )}
        {...props}
      >
        {src && <img src={src} alt={alt} className={cn("w-full object-cover", shape === "auto" && !horizontal ? "h-auto" : "h-full")} />}
        {children && <div className="absolute inset-0 flex flex-col">{children}</div>}
      </div>
    );
  }
);

CardMedia.displayName = "CardMedia";

export default Card;
