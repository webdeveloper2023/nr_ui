import { Children, cloneElement, forwardRef, isValidElement, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type AvatarColor = "default" | "accent" | "success" | "warning" | "danger";
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarRadius = "none" | "sm" | "md" | "lg" | "full";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "color" | "size"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Image URL */
  src?: string;
  /** Name — initials are derived from it when there is no image */
  name?: string;
  /** Size */
  size?: AvatarSize;
  /** Fallback (initials) color and ring color */
  color?: AvatarColor;
  /** Corner radius */
  radius?: AvatarRadius;
  /** Draws a colored ring around the avatar */
  isBordered?: boolean;
  /** Dimmed, disabled look */
  isDisabled?: boolean;
  /** Shows the fallback when the image fails to load */
  showFallback?: boolean;
  /** Custom content shown instead of the image */
  fallback?: ReactNode;
  /** Function that builds initials from the name */
  getInitials?: (name: string) => string;
  /** Extra classes */
  className?: string;
  /** Icon shown when there is no image or name */
  icon?: ReactNode;
  /** Adapts to the screen: lg and xl get one step smaller on mobile and one step larger on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
  xl: { container: "w-14 h-14", text: "text-lg" },
};

// Large avatars shrink a step on mobile and grow a step on desktop; small ones stay aligned with text rows.
const sizeMapR: Record<AvatarSize, { container: BreakpointClasses; text: BreakpointClasses }> = {
  xs: { container: {}, text: {} },
  sm: { container: {}, text: {} },
  md: { container: {}, text: {} },
  lg: { container: { m: "mobile:w-10 mobile:h-10", d: "desktop:w-14 desktop:h-14" }, text: { m: "mobile:text-sm", d: "desktop:text-lg" } },
  xl: { container: { m: "mobile:w-12 mobile:h-12", d: "desktop:w-16 desktop:h-16" }, text: { m: "mobile:text-base", d: "desktop:text-xl" } },
};

const radiusMap: Record<AvatarRadius, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

const colorMap: Record<AvatarColor, { bg: string; ring: string }> = {
  default: { bg: "bg-default text-muted", ring: "ring-border" },
  accent: { bg: "bg-accent-soft text-accent-soft-foreground", ring: "ring-accent" },
  success: { bg: "bg-success-soft text-success-soft-foreground", ring: "ring-success" },
  warning: { bg: "bg-warning-soft text-warning-soft-foreground", ring: "ring-warning" },
  danger: { bg: "bg-danger-soft text-danger-soft-foreground", ring: "ring-danger" },
};

function defaultInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const DefaultIcon = () => (
  <svg className="w-[60%] h-[60%] translate-y-[8%]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      name,
      size = "md",
      color = "default",
      radius = "full",
      isBordered = false,
      isDisabled = false,
      showFallback = true,
      fallback,
      getInitials = defaultInitials,
      className = "",
      icon,
      alt,
      responsive,
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const bps = useResponsive(responsive);
    const [imgError, setImgError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const hasImage = Boolean(src) && !imgError;
    const showFallbackContent = !hasImage || !loaded;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={name || alt || t.common.avatar}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden shrink-0 align-middle box-border",
          "outline-none transition-transform duration-200 ease-(--ease-out-soft)",
          sizeMap[size].container,
          rx(bps, sizeMapR[size].container),
          radiusMap[radius],
          colorMap[color].bg,
          isBordered && cn("ring-2 ring-offset-2 ring-offset-background", colorMap[color].ring),
          isDisabled && "opacity-50",
          className
        )}
      >
        {hasImage && (
          <img
            src={src}
            alt={alt || name || "avatar"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-(--ease-out-soft)",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            {...props}
          />
        )}
        {showFallbackContent && showFallback && (
          <span className={cn("flex items-center justify-center w-full h-full font-medium select-none", sizeMap[size].text, rx(bps, sizeMapR[size].text))}>
            {fallback ?? (name ? getInitials(name) : icon ?? <DefaultIcon />)}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// --- AvatarGroup ---

export interface AvatarGroupProps {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Maximum number of avatars shown */
  max?: number;
  /** Total count (used to compute +N) */
  total?: number;
  /** Avatar elements */
  children: ReactNode;
  /** Size of every avatar */
  size?: AvatarSize;
  /** Color of every avatar */
  color?: AvatarColor;
  /** Radius of every avatar */
  radius?: AvatarRadius;
  /** Adds a ring to every avatar */
  isBordered?: boolean;
  /** Lays avatars out in a grid instead of stacking */
  isGrid?: boolean;
  /** Custom renderer for the +N item */
  renderCount?: (count: number) => ReactNode;
  /** Extra classes */
  className?: string;
  /** Passed to every avatar; on mobile at most 3 avatars stay visible and the +N count grows to match. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

/** Avatars shown on mobile when the group is responsive */
const MOBILE_MAX = 3;

export const AvatarGroup = ({
  max,
  total,
  children,
  size = "md",
  color,
  radius,
  isBordered = false,
  isGrid = false,
  renderCount,
  className = "",
  responsive,
}: AvatarGroupProps) => {
  const bps = useResponsive(responsive);
  const childArray = Children.toArray(children);
  const visibleCount = max !== undefined ? Math.min(max, childArray.length) : childArray.length;
  const overflowCount = (total ?? childArray.length) - visibleCount;
  // On mobile fewer avatars fit: hide the extra ones with CSS and show a second, larger +N
  const mobileCount = bps.includes("m") && !isGrid ? Math.min(visibleCount, MOBILE_MAX) : visibleCount;
  const mobileOverflow = (total ?? childArray.length) - mobileCount;
  const trimsOnMobile = mobileCount < visibleCount;

  // "all" | "not-mobile" | "mobile" — one display utility per breakpoint, never two at once
  const countBadge = (count: number, on: "all" | "not-mobile" | "mobile" = "all") =>
    renderCount ? (
      <span key={on} className={on === "mobile" ? "hidden mobile:contents" : cn("contents", on === "not-mobile" && "mobile:hidden")}>
        {renderCount(count)}
      </span>
    ) : (
      <div
        key={on}
        className={cn(
          "relative items-center justify-center shrink-0 font-medium",
          on === "mobile" ? "hidden mobile:inline-flex" : cn("inline-flex", on === "not-mobile" && "mobile:hidden"),
          "bg-default text-muted",
          isBordered ? "ring-2 ring-offset-2 ring-offset-background ring-border" : "ring-2 ring-background",
          radiusMap[radius ?? "full"],
          sizeMap[size].container,
          sizeMap[size].text,
          rx(bps, sizeMapR[size].container),
          rx(bps, sizeMapR[size].text)
        )}
      >
        +{count}
      </div>
    );

  return (
    <div
      className={cn(
        "flex items-center",
        isGrid ? "flex-wrap gap-3" : "-space-x-2 [&>*]:transition-transform [&>*:hover]:-translate-y-0.5 [&>*:hover]:z-10",
        className
      )}
    >
      {childArray.slice(0, visibleCount).map((child, i) => {
        if (isValidElement<AvatarProps>(child)) {
          return cloneElement(child, {
            key: i,
            size: child.props.size ?? size,
            color: child.props.color ?? color,
            radius: child.props.radius ?? radius,
            isBordered: child.props.isBordered ?? isBordered,
            responsive: child.props.responsive ?? responsive,
            className: cn(!isBordered && !isGrid && "ring-2 ring-background", i >= mobileCount && "mobile:hidden", child.props.className),
          });
        }
        return child;
      })}

      {trimsOnMobile ? (
        <>
          {overflowCount > 0 && countBadge(overflowCount, "not-mobile")}
          {countBadge(mobileOverflow, "mobile")}
        </>
      ) : (
        overflowCount > 0 && countBadge(overflowCount)
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";
export default Avatar;
