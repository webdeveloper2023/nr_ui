import React, { forwardRef, useState, useId, type ReactNode } from "react";

type CheckboxColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type CheckboxSize = "sm" | "md" | "lg";
type CheckboxRadius = "none" | "sm" | "md" | "full";

export interface CheckboxProps {
  color?: CheckboxColor;
  size?: CheckboxSize;
  radius?: CheckboxRadius;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
  name?: string;
  value?: string;
}

const sizeMap: Record<CheckboxSize, { box: string; icon: string; label: string }> = {
  sm: { box: "w-4 h-4", icon: "w-2.5 h-2.5", label: "text-xs" },
  md: { box: "w-5 h-5", icon: "w-3 h-3", label: "text-sm" },
  lg: { box: "w-6 h-6", icon: "w-3.5 h-3.5", label: "text-base" },
};

const radiusMap: Record<CheckboxRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
};

const colorMap: Record<CheckboxColor, { checked: string; ring: string }> = {
  default: { checked: "bg-default-500 border-default-500", ring: "ring-default-400" },
  primary: { checked: "bg-primary-500 border-primary-500", ring: "ring-primary-400" },
  secondary: { checked: "bg-primary-300 border-primary-300", ring: "ring-primary-300" },
  success: { checked: "bg-success-500 border-success-500", ring: "ring-success-400" },
  warning: { checked: "bg-warning-500 border-warning-500", ring: "ring-warning-400" },
  danger: { checked: "bg-danger-500 border-danger-500", ring: "ring-danger-400" },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      color = "primary",
      size = "md",
      radius = "sm",
      isSelected,
      defaultSelected = false,
      isIndeterminate = false,
      isDisabled = false,
      onChange,
      children,
      className = "",
      name,
      value,
    },
    ref
  ) => {
    const id = useId();
    const [internalChecked, setInternalChecked] = useState(defaultSelected);
    const isControlled = isSelected !== undefined;
    const checked = isControlled ? isSelected : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternalChecked(next);
      onChange?.(next);
    };

    const boxClasses = [
      "relative flex items-center justify-center shrink-0",
      "border-2 transition-all duration-200 ease-in-out",
      sizeMap[size].box,
      radiusMap[radius],
      checked || isIndeterminate
        ? `${colorMap[color].checked} text-white`
        : "border-default-300 bg-transparent",
      checked || isIndeterminate ? "scale-100" : "",
      isDisabled ? "opacity-50" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        className={`inline-flex items-center gap-2 select-none ${
          isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
        } group ${className}`}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
          className="sr-only peer"
          aria-checked={isIndeterminate ? "mixed" : checked}
        />

        <span
          className={`${boxClasses} peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${colorMap[color].ring}`}
        >
          {isIndeterminate ? (
            <svg
              className={`${sizeMap[size].icon} transition-transform duration-200`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
            <svg
              className={`${sizeMap[size].icon} transition-all duration-200 ${
                checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>

        {children && (
          <span className={`${sizeMap[size].label} text-default-700 transition-colors`}>
            {children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
