import { createContext, forwardRef, useContext, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

type RadioColor = "default" | "accent" | "success" | "warning" | "danger";
type RadioSize = "sm" | "md" | "lg";
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
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const sizeMap: Record<RadioSize, { outer: string; dot: string; label: string; gap: string }> = {
  sm: { outer: "w-4 h-4", dot: "w-1.5 h-1.5", label: "text-sm", gap: "gap-2" },
  md: { outer: "w-5 h-5", dot: "w-2 h-2", label: "text-sm", gap: "gap-2.5" },
  lg: { outer: "w-6 h-6", dot: "w-2.5 h-2.5", label: "text-base", gap: "gap-3" },
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
  /** Guruh sarlavhasi */
  label?: ReactNode;
  /** Maydon ostidagi yordamchi matn */
  description?: ReactNode;
  /** Xato holatida ko'rsatiladigan matn */
  errorMessage?: ReactNode;
  /** Elementlar yo'nalishi */
  orientation?: "vertical" | "horizontal";
  /** Tanlangan qiymat (controlled) */
  value?: string;
  /** Boshlang'ich qiymat (uncontrolled) */
  defaultValue?: string;
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (value: string) => void;
  /** Ko'rinish: primary — oq doiracha soyali, secondary — kulrang (karta ichida) */
  variant?: RadioVariant;
  /** Tanlangan holat rangi */
  color?: RadioColor;
  /** O'lcham */
  size?: RadioSize;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Xato (invalid) holat */
  isInvalid?: boolean;
  /** Majburiy maydon (* belgisi) */
  isRequired?: boolean;
  /** Forma uchun input nomi */
  name?: string;
  /** Radio elementlari */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
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
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      name: nameProp,
      children,
      className = "",
    },
    ref
  ) => {
    const autoName = useId();
    const labelId = useId();
    const [internal, setInternal] = useState(defaultValue);
    const value = valueProp ?? internal;

    const setValue = (v: string) => {
      if (valueProp === undefined) setInternal(v);
      onValueChange?.(v);
    };

    return (
      <RadioGroupContext.Provider value={{ value, setValue, name: nameProp ?? autoName, variant, color, size, isDisabled, isInvalid }}>
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
          <div className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-x-5 gap-y-2.5" : "flex-col gap-3")}>{children}</div>
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
  /** Variant qiymati */
  value: string;
  /** Variant ostidagi izoh */
  description?: ReactNode;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Label matni */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ value, description, isDisabled: disabledProp, children, className = "" }, ref) => {
  const ctx = useContext(RadioGroupContext);
  const id = useId();
  if (!ctx) throw new Error("<Radio> must be used inside <RadioGroup>");

  const { size, color, variant, isInvalid } = ctx;
  const isDisabled = disabledProp ?? ctx.isDisabled;
  const checked = ctx.value === value;

  return (
    <label
      htmlFor={id}
      className={cn("group inline-flex items-start select-none", sizeMap[size].gap, isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer", className)}
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
          checked ? checkedMap[color].fill : uncheckedMap[variant],
          isInvalid && !checked && "outline-1 outline-offset-[-1px] outline-danger"
        )}
      >
        <span
          className={cn(
            "rounded-full transition-[transform,opacity] duration-150 ease-out",
            sizeMap[size].dot,
            checkedMap[color].dot,
            checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </span>
      {(children || description) && (
        <span className="flex flex-col">
          {children && <span className={cn("text-foreground", sizeMap[size].label, isInvalid && "text-danger")}>{children}</span>}
          {description && <span className="text-xs text-muted mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
});

Radio.displayName = "Radio";

export default RadioGroup;
