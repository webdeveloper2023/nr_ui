import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  /** Orientation: horizontal or vertical */
  orientation?: DividerOrientation;
  /** Centered label (horizontal only) */
  children?: ReactNode;
  /** Extra classes */
  className?: string;
}

export const Divider = ({ orientation = "horizontal", children, className = "" }: DividerProps) => {
  if (orientation === "horizontal" && children) {
    return (
      <div className={cn("flex w-full items-center gap-3 text-xs font-medium text-muted", className)} role="separator">
        <span className="h-px flex-1 bg-separator" />
        <span className="shrink-0">{children}</span>
        <span className="h-px flex-1 bg-separator" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("shrink-0 border-none bg-separator", orientation === "horizontal" ? "h-px w-full" : "w-px h-full self-stretch", className)}
    />
  );
};

Divider.displayName = "Divider";
export default Divider;
