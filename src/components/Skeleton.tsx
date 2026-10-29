import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type ResponsiveProp } from "./breakpoints";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, the real content is shown instead of the skeleton */
  isLoaded?: boolean;
  /** Disables the shimmer animation */
  disableAnimation?: boolean;
  /** Content shown once loaded */
  children?: ReactNode;
  /** Adapts to the screen: the default radius gets one step smaller on mobile, matching a responsive Card. Sizes come from your className. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ isLoaded = false, disableAnimation = false, children, className = "", responsive, ...props }, ref) => {
    const bps = useResponsive(responsive);
    return (
      <div
        ref={ref}
        aria-busy={!isLoaded}
        className={cn(
          // default radius only when the caller didn't pass one (avoids rounded-xl vs rounded-full conflicts)
          "group relative overflow-hidden",
          !/\brounded(-|\b)/.test(className) && cn("rounded-xl", rx(bps, { m: "mobile:rounded-lg" })),
          isLoaded
            ? "bg-transparent"
            : cn(
                "bg-default pointer-events-none [&>*]:opacity-0",
                !disableAnimation &&
                  "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-surface/60 before:to-transparent"
              ),
          "[&>*]:transition-opacity [&>*]:duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
export default Skeleton;
