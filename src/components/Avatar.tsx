import { Children, cloneElement, forwardRef, isValidElement, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

type AvatarColor = "default" | "accent" | "success" | "warning" | "danger";
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarRadius = "none" | "sm" | "md" | "lg" | "full";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "color" | "size"> {
  /** Rasm manzili */
  src?: string;
  /** Ism - rasm bo'lmasa initsiallar shundan olinadi */
  name?: string;
  /** O'lcham */
  size?: AvatarSize;
  /** Fallback (initsial) rangi va halqa rangi */
  color?: AvatarColor;
  /** Burchaklar yumaloqligi */
  radius?: AvatarRadius;
  /** Atrofida rangli halqa (ring) chizadi */
  isBordered?: boolean;
  /** Xira, o'chirilgan ko'rinish */
  isDisabled?: boolean;
  /** Rasm yuklanmasa fallback ko'rsatish */
  showFallback?: boolean;
  /** Rasm o'rniga ko'rsatiladigan maxsus kontent */
  fallback?: ReactNode;
  /** Ismdan initsiallarni hosil qiluvchi funksiya */
  getInitials?: (name: string) => string;
  /** Qo'shimcha klasslar */
  className?: string;
  /** Rasm va ism bo'lmasa ko'rsatiladigan ikonka */
  icon?: ReactNode;
}

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
  xl: { container: "w-14 h-14", text: "text-lg" },
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
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const hasImage = Boolean(src) && !imgError;
    const showFallbackContent = !hasImage || !loaded;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={name || alt || "avatar"}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden shrink-0 align-middle box-border",
          "outline-none transition-transform duration-200 ease-(--ease-out-soft)",
          sizeMap[size].container,
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
          <span className={cn("flex items-center justify-center w-full h-full font-medium select-none", sizeMap[size].text)}>
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
  /** Ko'rsatiladigan maksimal avatarlar soni */
  max?: number;
  /** Umumiy son (+N hisoblash uchun) */
  total?: number;
  /** Avatar elementlari */
  children: ReactNode;
  /** Barcha avatarlar o'lchami */
  size?: AvatarSize;
  /** Barcha avatarlar rangi */
  color?: AvatarColor;
  /** Barcha avatarlar burchagi */
  radius?: AvatarRadius;
  /** Avatarlarga halqa qo'shadi */
  isBordered?: boolean;
  /** Ustma-ust emas, setka ko'rinishida joylashtiradi */
  isGrid?: boolean;
  /** +N elementini maxsus chizish funksiyasi */
  renderCount?: (count: number) => ReactNode;
  /** Qo'shimcha klasslar */
  className?: string;
}

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
}: AvatarGroupProps) => {
  const childArray = Children.toArray(children);
  const visibleCount = max !== undefined ? Math.min(max, childArray.length) : childArray.length;
  const overflowCount = (total ?? childArray.length) - visibleCount;

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
            className: cn(!isBordered && !isGrid && "ring-2 ring-background", child.props.className),
          });
        }
        return child;
      })}

      {overflowCount > 0 &&
        (renderCount ? (
          renderCount(overflowCount)
        ) : (
          <div
            className={cn(
              "relative inline-flex items-center justify-center shrink-0 font-medium",
              "bg-default text-muted",
              isBordered ? "ring-2 ring-offset-2 ring-offset-background ring-border" : "ring-2 ring-background",
              radiusMap[radius ?? "full"],
              sizeMap[size].container,
              sizeMap[size].text
            )}
          >
            +{overflowCount}
          </div>
        ))}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";
export default Avatar;
