import React, {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputVariant = "flat" | "bordered" | "underlined" | "faded";
type InputColor = "default" | "primary" | "success" | "warning" | "danger";
type InputSize = "sm" | "md" | "lg";
type InputRadius = "none" | "sm" | "md" | "lg" | "full";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> {
  variant?: InputVariant;
  color?: InputColor;
  size?: InputSize;
  radius?: InputRadius;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, { wrapper: string; input: string; label: string }> = {
  sm: { wrapper: "min-h-8", input: "text-xs py-1 px-2", label: "text-xs" },
  md: { wrapper: "min-h-10", input: "text-sm py-2 px-3", label: "text-sm" },
  lg: { wrapper: "min-h-12", input: "text-base py-2.5 px-3.5", label: "text-base" },
};

const radiusStyles: Record<InputRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const focusColorMap: Record<InputColor, string> = {
  default: "group-focus-within:border-default-500",
  primary: "group-focus-within:border-primary-500",
  success: "group-focus-within:border-success-500",
  warning: "group-focus-within:border-warning-500",
  danger: "group-focus-within:border-danger-500",
};

const labelColorMap: Record<InputColor, string> = {
  default: "group-focus-within:text-default-700",
  primary: "group-focus-within:text-primary-500",
  success: "group-focus-within:text-success-500",
  warning: "group-focus-within:text-warning-500",
  danger: "group-focus-within:text-danger-500",
};

const variantStyles: Record<InputVariant, string> = {
  flat: "bg-default-100 border-transparent hover:bg-default-200",
  bordered: "bg-transparent border-2 border-default-300 hover:border-default-400",
  underlined: "bg-transparent border-b-2 border-default-300 rounded-none! hover:border-default-400",
  faded: "bg-default-50 border-2 border-default-200 hover:border-default-300",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "flat",
      color = "default",
      size = "md",
      radius = "md",
      label,
      placeholder,
      description,
      errorMessage,
      isInvalid = false,
      isDisabled = false,
      isReadOnly = false,
      startContent,
      endContent,
      fullWidth = true,
      className = "",
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      type = "text",
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = String(currentValue).length > 0;
    const isLabelFloating = isFocused || hasValue;

    const showError = isInvalid && errorMessage;
    const activeColor = isInvalid ? "danger" : color;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const wrapperClasses = [
      "group relative flex items-center w-full",
      "transition-all duration-200 ease-in-out",
      sizeStyles[size].wrapper,
      variant !== "underlined" ? radiusStyles[radius] : "",
      variantStyles[variant],
      focusColorMap[activeColor],
      isDisabled ? "opacity-50 pointer-events-none" : "",
      isInvalid ? "border-danger-500!" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "peer w-full bg-transparent outline-none",
      "transition-all duration-200",
      "placeholder-transparent",
      sizeStyles[size].input,
      startContent ? "pl-0" : "",
      endContent ? "pr-0" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const labelClasses = [
      "absolute left-0 origin-top-left pointer-events-none",
      "transition-all duration-200 ease-in-out",
      "text-default-500",
      labelColorMap[activeColor],
      isInvalid ? "text-danger-500!" : "",
      sizeStyles[size].label,
      startContent ? "ml-8" : "ml-3",
      isLabelFloating
        ? "scale-[0.75] -translate-y-2.5 opacity-100"
        : "translate-y-0 scale-100",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : "w-fit"} ${className}`}>
        <div className={wrapperClasses}>
          {startContent && (
            <span className="flex items-center pl-3 text-default-400 shrink-0">
              {startContent}
            </span>
          )}

          <div className="relative flex-1 flex items-center">
            {label && (
              <label htmlFor={id} className={labelClasses}>
                {label}
              </label>
            )}
            <input
              ref={ref}
              id={id}
              type={type}
              value={currentValue}
              placeholder={isLabelFloating ? placeholder : " "}
              disabled={isDisabled}
              readOnly={isReadOnly}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`${inputClasses} ${label && isLabelFloating ? "pt-4 pb-0.5" : ""}`}
              aria-invalid={isInvalid}
              aria-describedby={description ? `${id}-desc` : undefined}
              {...props}
            />
          </div>

          {endContent && (
            <span className="flex items-center pr-3 text-default-400 shrink-0">
              {endContent}
            </span>
          )}
        </div>

        {showError && (
          <p className="text-xs text-danger-500 px-1">{errorMessage}</p>
        )}
        {!showError && description && (
          <p id={`${id}-desc`} className="text-xs text-default-400 px-1">
            {description}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
