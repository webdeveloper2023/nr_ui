import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

type CheckboxColor = "default" | "accent" | "success" | "warning" | "danger";
type CheckboxSize = "sm" | "md" | "lg";
type CheckboxRadius = "none" | "sm" | "md" | "full";

export interface CheckboxProps {
  /** Ko'rinish: primary — oq katakcha soyali, secondary — kulrang (karta ichida) */
  variant?: "primary" | "secondary";
  /** Tanlangan holat rangi */
  color?: CheckboxColor;
  /** O'lcham */
  size?: CheckboxSize;
  /** Burchaklar yumaloqligi */
  radius?: CheckboxRadius;
  /** Tanlangan holat (controlled) */
  isSelected?: boolean;
  /** Boshlang'ich holat (uncontrolled) */
  defaultSelected?: boolean;
  /** Qisman tanlangan holat (—) */
  isIndeterminate?: boolean;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Xato (invalid) holat */
  isInvalid?: boolean;
  /** Tanlanganda matn ustidan chiziladi */
  lineThrough?: boolean;
  /** Holat o'zgarganda chaqiriladi */
  onChange?: (checked: boolean) => void;
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (checked: boolean) => void;
  /** Label ostidagi izoh */
  description?: ReactNode;
  /** Label matni */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
  className?: string;
  /** Forma uchun input nomi */
  name?: string;
  /** Guruhdagi qiymat */
  value?: string;
}

const sizeMap: Record<CheckboxSize, { box: string; icon: string; label: string; gap: string }> = {
  sm: { box: "w-4 h-4", icon: "w-2.5 h-2.5", label: "text-sm", gap: "gap-2" },
  md: { box: "w-5 h-5", icon: "w-3 h-3", label: "text-sm", gap: "gap-2.5" },
  lg: { box: "w-6 h-6", icon: "w-3.5 h-3.5", label: "text-base", gap: "gap-3" },
};

const radiusMap: Record<CheckboxRadius, string> = {
  none: "rounded-none",
  sm: "rounded-[5px]",
  md: "rounded-md",
  full: "rounded-full",
};

const checkedMap: Record<CheckboxColor, string> = {
  default: "bg-foreground text-background",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
};

const uncheckedMap = {
  primary: "bg-field shadow-field group-hover:bg-[color-mix(in_oklab,var(--color-field)_94%,var(--color-foreground))]",
  secondary: "bg-field-secondary group-hover:bg-[color-mix(in_oklab,var(--color-field-secondary)_92%,var(--color-foreground))]",
} as const;

// ─── Group context ──────────────────────────
interface CheckboxGroupContextValue {
  value: string[];
  toggle: (v: string, checked: boolean) => void;
  variant?: "primary" | "secondary";
  color?: CheckboxColor;
  size?: CheckboxSize;
  radius?: CheckboxRadius;
  isDisabled?: boolean;
  isInvalid?: boolean;
  name?: string;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const group = useContext(CheckboxGroupContext);
  const {
    variant = group?.variant ?? "primary",
    color = group?.color ?? "accent",
    size = group?.size ?? "md",
    radius = group?.radius ?? "sm",
    isSelected,
    defaultSelected = false,
    isIndeterminate = false,
    isDisabled = group?.isDisabled ?? false,
    isInvalid = group?.isInvalid ?? false,
    lineThrough = false,
    onChange,
    onValueChange,
    description,
    children,
    className = "",
    name = group?.name,
    value,
  } = props;

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const [internalChecked, setInternalChecked] = useState(defaultSelected);
  const inGroup = group !== null && value !== undefined;
  const isControlled = isSelected !== undefined;
  const checked = inGroup ? group.value.includes(value) : isControlled ? isSelected : internalChecked;
  const isOn = checked || isIndeterminate;

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (inGroup) group.toggle(value, next);
    else if (!isControlled) setInternalChecked(next);
    onChange?.(next);
    onValueChange?.(next);
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative inline-flex items-start select-none",
        sizeMap[size].gap,
        isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
        className
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={isDisabled}
        aria-invalid={isInvalid || undefined}
        className="peer sr-only"
      />

      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 flex items-center justify-center shrink-0",
          "transition-[background-color,box-shadow,transform] duration-150 ease-out",
          "group-active:scale-90 motion-reduce:group-active:scale-100",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          sizeMap[size].box,
          radiusMap[radius],
          isOn ? checkedMap[color] : uncheckedMap[variant],
          isInvalid && !isOn && "outline-1 outline-offset-[-1px] outline-danger"
        )}
      >
        <svg
          className={cn(sizeMap[size].icon, "transition-[opacity,transform] duration-150 ease-out", isOn ? "opacity-100 scale-100" : "opacity-0 scale-50")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isIndeterminate ? (
            <line x1="5" y1="12" x2="19" y2="12" />
          ) : (
            <polyline
              points="20 6 9 17 4 12"
              strokeDasharray="24"
              strokeDashoffset={checked ? 0 : 24}
              style={{ transition: "stroke-dashoffset 250ms cubic-bezier(0.32,0.72,0,1) 50ms" }}
            />
          )}
        </svg>
      </span>

      {(children || description) && (
        <span className="flex flex-col">
          {children && (
            <span
              className={cn(
                "relative text-foreground transition-colors duration-150",
                sizeMap[size].label,
                isInvalid && "text-danger",
                lineThrough && checked && "text-muted line-through"
              )}
            >
              {children}
            </span>
          )}
          {description && <span className="text-xs text-muted mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

// ─── CheckboxGroup ──────────────────────────
export interface CheckboxGroupProps {
  /** Guruh sarlavhasi */
  label?: ReactNode;
  /** Maydon ostidagi yordamchi matn */
  description?: ReactNode;
  /** Xato holatida ko'rsatiladigan matn */
  errorMessage?: ReactNode;
  /** Elementlar yo'nalishi */
  orientation?: "vertical" | "horizontal";
  /** Qiymat */
  value?: string[];
  /** Boshlang'ich qiymat (uncontrolled) */
  defaultValue?: string[];
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (value: string[]) => void;
  /** Guruhdagi katakchalar ko'rinishi */
  variant?: "primary" | "secondary";
  /** Tanlangan holat rangi */
  color?: CheckboxColor;
  /** O'lcham */
  size?: CheckboxSize;
  /** Burchaklar yumaloqligi */
  radius?: CheckboxRadius;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Xato (invalid) holat */
  isInvalid?: boolean;
  /** Majburiy maydon (* belgisi) */
  isRequired?: boolean;
  /** Forma uchun input nomi */
  name?: string;
  /** Ichki kontent */
  children?: ReactNode;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      label,
      description,
      errorMessage,
      orientation = "vertical",
      value: valueProp,
      defaultValue = [],
      onValueChange,
      variant,
      color,
      size,
      radius,
      isDisabled,
      isInvalid = false,
      isRequired = false,
      name,
      children,
      className = "",
    },
    ref
  ) => {
    const labelId = useId();
    const [internal, setInternal] = useState<string[]>(defaultValue);
    const value = valueProp ?? internal;

    const toggle = (v: string, checked: boolean) => {
      const next = checked ? [...value.filter((x) => x !== v), v] : value.filter((x) => x !== v);
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    };

    return (
      <CheckboxGroupContext.Provider value={{ value, toggle, variant, color, size, radius, isDisabled, isInvalid, name }}>
        <div ref={ref} role="group" aria-labelledby={label ? labelId : undefined} className={cn("flex flex-col gap-2", className)}>
          {label && (
            <span id={labelId} className="text-sm text-muted">
              {label}
              {isRequired && <span className="text-danger ml-0.5">*</span>}
            </span>
          )}
          <div className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2.5")}>{children}</div>
          {isInvalid && errorMessage ? (
            <p className="text-xs text-danger">{errorMessage}</p>
          ) : (
            description && <p className="text-xs text-muted">{description}</p>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export default Checkbox;
