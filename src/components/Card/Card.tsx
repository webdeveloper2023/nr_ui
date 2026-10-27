import { type ReactNode, type HTMLAttributes } from "react";

type CardRadius = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
  shadow?: "none" | "sm" | "md" | "lg";
  isHoverable?: boolean;
  isPressable?: boolean;
  isBlurred?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const radiusMap: Record<CardRadius, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
};

const shadowMap = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export function Card({
  radius = "md",
  shadow = "sm",
  isHoverable = false,
  isPressable = false,
  isBlurred = false,
  header,
  footer,
  children,
  className = "",
  ...props
}: CardProps) {
  const base = "bg-white border border-default-200 overflow-hidden transition-all duration-200";
  const hoverable = isHoverable ? "hover:shadow-lg hover:-translate-y-0.5" : "";
  const pressable = isPressable ? "cursor-pointer active:scale-[0.98]" : "";
  const blurred = isBlurred ? "backdrop-blur-lg bg-white/70" : "";

  const classes = [base, radiusMap[radius], shadowMap[shadow], hoverable, pressable, blurred, className].join(" ");

  return (
    <div className={classes} {...props}>
      {header && <div className="px-4 pt-4 pb-2">{header}</div>}
      <div className="px-4 py-3">{children}</div>
      {footer && <div className="px-4 pt-2 pb-4 border-t border-default-100">{footer}</div>}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-1 py-1 ${className}`}>{children}</div>;
}

export default Card;
