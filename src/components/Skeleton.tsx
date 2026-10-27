import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** true bo'lsa skeleton o'rniga asl kontent ko'rinadi */
  isLoaded?: boolean;
  /** Shimmer animatsiyasini o'chiradi */
  disableAnimation?: boolean;
  /** Yuklangandan keyin ko'rinadigan kontent */
  children?: ReactNode;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ isLoaded = false, disableAnimation = false, children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      aria-busy={!isLoaded}
      className={cn(
        // default radius only when the caller didn't pass one (avoids rounded-xl vs rounded-full conflicts)
        "group relative overflow-hidden",
        !/\brounded(-|\b)/.test(className) && "rounded-xl",
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
  )
);

Skeleton.displayName = "Skeleton";
export default Skeleton;
