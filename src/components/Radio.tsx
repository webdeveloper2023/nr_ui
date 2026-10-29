import { createContext, forwardRef, useContext, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useFieldDefaults } from "./formContext";
import { rx, useResponsive, type Breakpoint, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type RadioColor = "default" | "accent" | "success" | "warning" | "danger";
type RadioSize = "xs" | "sm" | "md" | "lg";
type RadioVariant = "primary" | "secondary";

interface RadioGroupContextValue {
  value: string;
  setValue: (v: string) => void;
  name: string;
  variant: RadioVariant;
  color: RadioColor;
  size: RadioSize;
  isDisabled: boolean;
  isInvalid: boolean;
  bps: Breakpoint[];
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const sizeMap: Record<RadioSize, { outer: string; dot: string; label: string; gap: string }> = {
  xs: { outer: "w-3.5 h-3.5", dot: "w-1.5 h-1.5", label: "text-xs", gap: "gap-1.5" },
  sm: { outer: "w-4 h-4", dot: "w-1.5 h-1.5", label: "text-sm", gap: "gap-2" },
  md: { outer: "w-5 h-5", dot: "w-2 h-2", label: "text-sm", gap: "gap-2.5" },
  lg: { outer: "w-6 h-6", dot: "w-2.5 h-2.5", label: "text-base", gap: "gap-3" },
};

// Mobile: 44px tap row (padding), circle one step larger, 16px label. Tablet: taller tap row. Desktop: lg one step larger.
const sizeMapR: Record<RadioSize, { row: BreakpointClasses; outer: BreakpointClasses; dot: BreakpointClasses; label: BreakpointClasses }> = {
  xs: { row: { m: "mobile:py-2" }, outer: { m: "mobile:w-4 mobile:h-4" }, dot: {}, label: { m: "mobile:text-sm" } },
  sm: { row: { m: "mobile:py-2", t: "tablet:py-1.5" }, outer: { m: "mobile:w-5 mobile:h-5" }, dot: { m: "mobile:w-2 mobile:h-2" }, label: { m: "mobile:text-base" } },
  md: {
    row: { m: "mobile:py-2.5", t: "tablet:py-2" },
    outer: { m: "mobile:w-6 mobile:h-6 mobile:mt-0" },
    dot: { m: "mobile:w-2.5 mobile:h-2.5" },
    label: { m: "mobile:text-base" },
  },
  lg: {
    row: { m: "mobile:py-2.5", t: "tablet:py-2" },
    outer: { d: "desktop:w-7 desktop:h-7" },
    dot: { d: "desktop:w-3 desktop:h-3" },
    label: { d: "desktop:text-lg" },
  },
};

const checkedMap: Record<RadioColor, { fill: string; dot: string }> = {
  default: { fill: "bg-foreground", dot: "bg-background" },
  accent: { fill: "bg-accent", dot: "bg-accent-foreground" },
  success: { fill: "bg-success", dot: "bg-success-foreground" },
  warning: { fill: "bg-warning", dot: "bg-warning-foreground" },
  danger: { fill: "bg-danger", dot: "bg-danger-foreground" },
};

const uncheckedMap: Record<RadioVariant, string> = {
  primary: "bg-field shadow-field group-hover:bg-[color-mix(in_oklab,var(--color-field)_94%,var(--color-foreground))]",
  secondary: "bg-field-secondary group-hover:bg-[color-mix(in_oklab,var(--color-field-secondary)_92%,var(--color-foreground))]",
};

// ─── RadioGroup ─────────────────────────────
export interface RadioGroupProps {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Group label */
  label?: ReactNode;
  /** Helper text below the field */
  description?: ReactNode;
  /** Text shown in the invalid state */
  errorMessage?: ReactNode;
  /** Items orientation */
  orientation?: "vertical" | "horizontal";
  /** Selected value (controlled) */
  value?: string;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  /** Called with the new value when it changes */
  onValueChange?: (value: string) => void;
  /** Style: primary — white circle with a shadow, secondary — gray (inside cards) */
  variant?: RadioVariant;
  /** Color of the selected state */
  color?: RadioColor;
  /** Size */
  size?: RadioSize;
  /** Disabled state */
  isDisabled?: boolean;
  /** Invalid state */
  isInvalid?: boolean;
  /** Required field (shows *) */
  isRequired?: boolean;
  /** Input name for forms */
  name?: string;
  /** Adapts to the screen: on mobile 44px tap rows, one step larger circles, 16px labels and a horizontal group stacks vertically; taller tap rows on tablet; larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Radio items */
  children?: ReactNode;
  /** Extra CSS classes */
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      description,
      errorMessage,
      orientation = "vertical",
      value: valueProp,
      defaultValue = "",
      onValueChange,
      variant = "primary",
      color = "accent",
      size = "md",
      isDisabled: isDisabledProp,
      isInvalid = false,
      isRequired = false,
      name: nameProp,
      responsive,
      children,
      className = "",
    },
    ref
  ) => {
    const form = useFieldDefaults();
    const isDisabled = isDisabledProp ?? form.isDisabled ?? false;
    const bps = useResponsive(responsive);
    const autoName = useId();
    const labelId = useId();
    const [internal, setInternal] = useState(defaultValue);
    const value = valueProp ?? internal;

    const setValue = (v: string) => {
      if (valueProp === undefined) setInternal(v);
      onValueChange?.(v);
    };

    return (
      <RadioGroupContext.Provider value={{ value, setValue, name: nameProp ?? autoName, variant, color, size, isDisabled, isInvalid, bps }}>
        <div
          ref={ref}
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-required={isRequired || undefined}
          aria-invalid={isInvalid || undefined}
          className={cn("flex flex-col gap-2.5", className)}
        >
          {label && (
            <span id={labelId} className="text-sm text-muted">
              {label}
              {isRequired && <span className="text-danger ml-0.5">*</span>}
            </span>
          )}
          <div
            className={cn(
              "flex",
              orientation === "horizontal" ? "flex-row flex-wrap gap-x-5 gap-y-2.5" : "flex-col gap-3",
              // Rows are already 44px tall on mobile: stack them without extra gaps
              rx(bps, { m: "mobile:flex-col mobile:gap-0", t: orientation === "vertical" ? "tablet:gap-1" : undefined })
            )}
          >
            {children}
          </div>
          {isInvalid && errorMessage ? (
            <p className="text-xs text-danger">{errorMessage}</p>
          ) : (
            description && <p className="text-xs text-muted">{description}</p>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

// ─── Radio ──────────────────────────────────
export interface RadioProps {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Option value */
  value: string;
  /** Description below the option */
  description?: ReactNode;
  /** Disabled state */
  isDisabled?: boolean;
  /** Label text */
  children?: ReactNode;
  /** Extra CSS classes */
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ value, description, isDisabled: disabledProp, children, className = "" }, ref) => {
  const ctx = useContext(RadioGroupContext);
  const id = useId();
  if (!ctx) throw new Error("<Radio> must be used inside <RadioGroup>");

  const { size, color, variant, isInvalid, bps } = ctx;
  const r = sizeMapR[size];
  const isDisabled = disabledProp ?? ctx.isDisabled;
  const checked = ctx.value === value;

  return (
    <label
      htmlFor={id}
      className={cn("group inline-flex items-start select-none", sizeMap[size].gap, rx(bps, r.row), isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer", className)}
    >
      <input
        ref={ref}
        id={id}
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => ctx.setValue(value)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 flex items-center justify-center shrink-0 rounded-full",
          "transition-[background-color,box-shadow,transform] duration-150 ease-out group-active:scale-90 motion-reduce:group-active:scale-100",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          sizeMap[size].outer,
          rx(bps, r.outer),
          checked ? checkedMap[color].fill : uncheckedMap[variant],
          isInvalid && !checked && "outline-1 outline-offset-[-1px] outline-danger"
        )}
      >
        <span
          className={cn(
            "rounded-full transition-[transform,opacity] duration-150 ease-out",
            sizeMap[size].dot,
            rx(bps, r.dot),
            checkedMap[color].dot,
            checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </span>
      {(children || description) && (
        <span className="flex flex-col">
          {children && <span className={cn("text-foreground", sizeMap[size].label, rx(bps, r.label), isInvalid && "text-danger")}>{children}</span>}
          {description && <span className="text-xs text-muted mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
});

Radio.displayName = "Radio";

export default RadioGroup;
