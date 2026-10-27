import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type CardVariant = "shadow" | "bordered" | "flat";
type CardRadius = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  radius?: CardRadius;
  isHoverable?: boolean;
  isPressable?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const radiusStyles: Record<CardRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-xl",
  lg: "rounded-2xl",
};

const variantStyles: Record<CardVariant, string> = {
  shadow: "bg-white shadow-md shadow-default-200/50",
  bordered: "bg-white border border-default-200",
  flat: "bg-default-50",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "shadow",
      radius = "md",
      isHoverable = false,
      isPressable = false,
      fullWidth = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const classes = [
      "relative overflow-hidden",
      "transition-all duration-200 ease-in-out",
      radiusStyles[radius],
      variantStyles[variant],
      fullWidth ? "w-full" : "",
      isHoverable
        ? "hover:-translate-y-1 hover:shadow-lg hover:shadow-default-200/60"
        : "",
      isPressable
        ? "cursor-pointer active:scale-[0.97] select-none"
        : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role={isPressable ? "button" : undefined}
        tabIndex={isPressable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isPressable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 p-4 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-4 py-3 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 p-4 border-t border-default-100 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export default Card;
