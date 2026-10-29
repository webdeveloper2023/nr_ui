import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type ResponsiveProp } from "./breakpoints";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  /** Orientation: horizontal or vertical */
  orientation?: DividerOrientation;
  /** Centered label (horizontal only) */
  children?: ReactNode;
  /** Extra classes */
  className?: string;
  /** Adapts to the screen: a vertical divider turns horizontal on mobile, where side-by-side content stacks (pair it with a responsive Stack). true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

export const Divider = ({ orientation = "horizontal", children, className = "", responsive }: DividerProps) => {
  const bps = useResponsive(responsive);
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
      className={cn(
        "shrink-0 border-none bg-separator",
        orientation === "horizontal" ? "h-px w-full" : cn("w-px h-full self-stretch", rx(bps, { m: "mobile:h-px mobile:w-full mobile:self-auto" })),
        className
      )}
    />
  );
};

Divider.displayName = "Divider";
export default Divider;
