import { forwardRef, useId, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

type SwitchColor = "default" | "accent" | "success" | "warning" | "danger";
type SwitchSize = "xs" | "sm" | "md" | "lg";

export interface SwitchProps {
  /** Color of the on state */
  color?: SwitchColor;
  /** Size */
  size?: SwitchSize;
  /** Selected state (controlled) */
  isSelected?: boolean;
  /** Initial state (uncontrolled) */
  defaultSelected?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Called when the state changes */
  onChange?: (selected: boolean) => void;
  /** Called with the new value when it changes */
  onValueChange?: (selected: boolean) => void;
  /** Label text */
  children?: ReactNode;
  /** Description below the label */
  description?: ReactNode;
  /** Icon inside the thumb; a function receives the current state */
  thumbIcon?: ReactNode | ((state: { isSelected: boolean }) => ReactNode);
  /** Icon shown on the left of the track when on */
  startContent?: ReactNode;
  /** Icon shown on the right of the track when off */
  endContent?: ReactNode;
  /** Extra CSS classes */
  className?: string;
  /** Input name for forms */
  name?: string;
}

// thumb travel = track width - thumb width - 2 * 2px padding; pressed thumb grows by 4px
const sizeMap: Record<SwitchSize, { track: string; thumb: string; press: string; on: string; onPressed: string; label: string; icon: string }> = {
  xs: { track: "w-6 h-4 px-0.5", thumb: "w-3 h-3", press: "group-active:w-3.5", on: "translate-x-2", onPressed: "group-active:translate-x-1.5", label: "text-xs", icon: "[&_svg]:w-2 [&_svg]:h-2" },
  sm: { track: "w-8 h-5 px-0.5", thumb: "w-4 h-4", press: "group-active:w-5", on: "translate-x-3", onPressed: "group-active:translate-x-2", label: "text-sm", icon: "[&_svg]:w-2.5 [&_svg]:h-2.5" },
  md: { track: "w-10 h-6 px-0.5", thumb: "w-5 h-5", press: "group-active:w-6", on: "translate-x-4", onPressed: "group-active:translate-x-3", label: "text-sm", icon: "[&_svg]:w-3 [&_svg]:h-3" },
  lg: { track: "w-12 h-7 px-0.5", thumb: "w-6 h-6", press: "group-active:w-7", on: "translate-x-5", onPressed: "group-active:translate-x-4", label: "text-base", icon: "[&_svg]:w-3.5 [&_svg]:h-3.5" },
};

const colorMap: Record<SwitchColor, { on: string; onText: string; icon: string }> = {
  default: { on: "bg-foreground", onText: "text-background", icon: "text-foreground" },
  accent: { on: "bg-accent", onText: "text-accent-foreground", icon: "text-accent" },
  success: { on: "bg-success", onText: "text-success-foreground", icon: "text-success" },
  warning: { on: "bg-warning", onText: "text-warning-foreground", icon: "text-warning" },
  danger: { on: "bg-danger", onText: "text-danger-foreground", icon: "text-danger" },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      color = "accent",
      size = "md",
      isSelected,
      defaultSelected = false,
      isDisabled = false,
      onChange,
      onValueChange,
      children,
      description,
      thumbIcon,
      startContent,
      endContent,
      className = "",
      name,
    },
    ref
  ) => {
    const id = useId();
    const [internalSelected, setInternalSelected] = useState(defaultSelected);
    const isControlled = isSelected !== undefined;
    const selected = isControlled ? isSelected : internalSelected;
    const s = sizeMap[size];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setInternalSelected(next);
      onChange?.(next);
      onValueChange?.(next);
    };

    const icon = typeof thumbIcon === "function" ? thumbIcon({ isSelected: selected }) : thumbIcon;

    return (
      <label
        htmlFor={id}
        className={cn("group inline-flex items-center gap-3 select-none", isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer", className)}
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
          aria-checked={selected}
          className="peer sr-only"
        />

        <span
          aria-hidden
          className={cn(
            "relative inline-flex items-center shrink-0 rounded-full overflow-hidden",
            "transition-colors duration-150 ease-out",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            s.track,
            selected ? colorMap[color].on : "bg-default group-hover:bg-default-hover"
          )}
        >
          {startContent && (
            <span
              className={cn(
                "absolute left-1.5 flex transition-[opacity,transform] duration-150",
                colorMap[color].onText,
                s.icon,
                selected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )}
            >
              {startContent}
            </span>
          )}
          {endContent && (
            <span
              className={cn(
                "absolute right-1.5 flex text-muted transition-[opacity,transform] duration-150",
                s.icon,
                selected ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
              )}
            >
              {endContent}
            </span>
          )}
          <span
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full bg-accent-foreground shadow-[0_1px_3px_0_rgb(0_0_0/0.18),0_0_1px_0_rgb(0_0_0/0.2)]",
              "transition-[transform,width] duration-200 ease-(--ease-out-soft) motion-reduce:transition-none",
              s.thumb,
              s.press,
              selected ? cn(s.on, s.onPressed) : "translate-x-0"
            )}
          >
            {icon && <span className={cn("flex", s.icon, selected ? colorMap[color].icon : "text-muted")}>{icon}</span>}
          </span>
        </span>

        {(children || description) && (
          <span className="flex flex-col">
            {children && <span className={cn("text-foreground", s.label)}>{children}</span>}
            {description && <span className="text-xs text-muted">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
export default Switch;
