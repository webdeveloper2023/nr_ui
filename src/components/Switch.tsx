import React, { forwardRef, useState, useId, type ReactNode } from "react";

type SwitchColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  color?: SwitchColor;
  size?: SwitchSize;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (selected: boolean) => void;
  children?: ReactNode;
  thumbIcon?: ReactNode;
  className?: string;
  name?: string;
}

const sizeMap: Record<SwitchSize, {
  track: string;
  thumb: string;
  thumbTranslate: string;
  label: string;
  iconSize: string;
}> = {
  sm: {
    track: "w-8 h-5",
    thumb: "w-3.5 h-3.5",
    thumbTranslate: "translate-x-3.5",
    label: "text-xs",
    iconSize: "w-2.5 h-2.5",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-4.5 h-4.5",
    thumbTranslate: "translate-x-5",
    label: "text-sm",
    iconSize: "w-3 h-3",
  },
  lg: {
    track: "w-14 h-7",
    thumb: "w-5.5 h-5.5",
    thumbTranslate: "translate-x-7",
    label: "text-base",
    iconSize: "w-3.5 h-3.5",
  },
};

const colorMap: Record<SwitchColor, { on: string; ring: string }> = {
  default: { on: "bg-default-500", ring: "ring-default-400" },
  primary: { on: "bg-primary-500", ring: "ring-primary-400" },
  secondary: { on: "bg-primary-300", ring: "ring-primary-300" },
  success: { on: "bg-success-500", ring: "ring-success-400" },
  warning: { on: "bg-warning-500", ring: "ring-warning-400" },
  danger: { on: "bg-danger-500", ring: "ring-danger-400" },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      color = "primary",
      size = "md",
      isSelected,
      defaultSelected = false,
      isDisabled = false,
      onChange,
      children,
      thumbIcon,
      className = "",
      name,
    },
    ref
  ) => {
    const id = useId();
    const [internalSelected, setInternalSelected] = useState(defaultSelected);
    const isControlled = isSelected !== undefined;
    const selected = isControlled ? isSelected : internalSelected;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternalSelected(next);
      onChange?.(next);
    };

    const trackClasses = [
      "relative inline-flex items-center shrink-0",
      "rounded-full transition-colors duration-300 ease-in-out",
      sizeMap[size].track,
      selected ? colorMap[color].on : "bg-default-200",
      isDisabled ? "opacity-50" : "cursor-pointer",
    ]
      .filter(Boolean)
      .join(" ");

    const thumbClasses = [
      "absolute left-0.5 flex items-center justify-center",
      "rounded-full bg-white shadow-sm",
      "transition-transform duration-300 ease-in-out",
      sizeMap[size].thumb,
      selected ? sizeMap[size].thumbTranslate : "translate-x-0",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        className={`inline-flex items-center gap-2.5 select-none ${
          isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
        } ${className}`}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={id}
          name={name}
          checked={selected}
          onChange={handleChange}
          disabled={isDisabled}
          className="sr-only peer"
          aria-checked={selected}
        />

        <span
          className={`${trackClasses} peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${colorMap[color].ring}`}
        >
          <span className={thumbClasses}>
            {thumbIcon && (
              <span
                className={`${sizeMap[size].iconSize} flex items-center justify-center text-default-500`}
              >
                {thumbIcon}
              </span>
            )}
          </span>
        </span>

        {children && (
          <span className={`${sizeMap[size].label} text-default-700`}>
            {children}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
export default Switch;
