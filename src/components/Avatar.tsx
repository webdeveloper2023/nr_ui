import React, { forwardRef, useState, type ReactNode, type ImgHTMLAttributes } from "react";

type AvatarColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type AvatarSize = "sm" | "md" | "lg";
type AvatarRadius = "none" | "sm" | "md" | "lg" | "full";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "color" | "size"> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  radius?: AvatarRadius;
  isBordered?: boolean;
  showFallback?: boolean;
  className?: string;
  icon?: ReactNode;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  sm: { container: "w-8 h-8", text: "text-xs", px: 32 },
  md: { container: "w-10 h-10", text: "text-sm", px: 40 },
  lg: { container: "w-12 h-12", text: "text-base", px: 48 },
};

const radiusMap: Record<AvatarRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const colorMap: Record<AvatarColor, { bg: string; text: string; border: string }> = {
  default: { bg: "bg-default-200", text: "text-default-600", border: "ring-default-400" },
  primary: { bg: "bg-primary-100", text: "text-primary-600", border: "ring-primary-500" },
  secondary: { bg: "bg-primary-50", text: "text-primary-400", border: "ring-primary-300" },
  success: { bg: "bg-success-500/15", text: "text-success-500", border: "ring-success-500" },
  warning: { bg: "bg-warning-500/15", text: "text-warning-500", border: "ring-warning-500" },
  danger: { bg: "bg-danger-500/15", text: "text-danger-500", border: "ring-danger-500" },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const DefaultIcon = () => (
  <svg
    className="w-[60%] h-[60%]"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
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
      showFallback = true,
      className = "",
      icon,
      alt,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;

    const containerClasses = [
      "relative inline-flex items-center justify-center overflow-hidden shrink-0",
      "transition-transform duration-200",
      sizeMap[size].container,
      radiusMap[radius],
      !showImage ? `${colorMap[color].bg} ${colorMap[color].text}` : "",
      isBordered ? `ring-2 ring-offset-2 ${colorMap[color].border}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={containerClasses} role="img" aria-label={name || alt || "avatar"}>
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            {...props}
          />
        ) : showFallback ? (
          name ? (
            <span className={`${sizeMap[size].text} font-semibold select-none`}>
              {getInitials(name)}
            </span>
          ) : icon ? (
            icon
          ) : (
            <DefaultIcon />
          )
        ) : null}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// --- AvatarGroup ---

export interface AvatarGroupProps {
  max?: number;
  children: ReactNode;
  size?: AvatarSize;
  isBordered?: boolean;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max,
  children,
  size = "md",
  isBordered = true,
  className = "",
}) => {
  const childArray = React.Children.toArray(children);
  const visibleCount = max !== undefined ? Math.min(max, childArray.length) : childArray.length;
  const overflowCount = childArray.length - visibleCount;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {childArray.slice(0, visibleCount).map((child, i) => {
        if (React.isValidElement<AvatarProps>(child)) {
          return React.cloneElement(child, {
            key: i,
            size: child.props.size || size,
            isBordered: child.props.isBordered ?? isBordered,
            className: `ring-2 ring-white ${child.props.className || ""}`,
          });
        }
        return child;
      })}

      {overflowCount > 0 && (
        <div
          className={[
            "inline-flex items-center justify-center shrink-0",
            "bg-default-200 text-default-600 font-semibold",
            "rounded-full ring-2 ring-white",
            sizeMap[size].container,
            sizeMap[size].text,
          ].join(" ")}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";
export default Avatar;
