import {
  forwardRef,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import {
  fieldBoxClasses,
  fieldDescriptionClasses,
  fieldErrorClasses,
  fieldLabelClasses,
  fieldText,
  fieldTextR,
  type FieldSize,
  type FieldVariant,
} from "./fieldStyles";
import { rx, useBreakpoint, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Style: primary — white field with a shadow, secondary — gray field (inside cards) */
  variant?: FieldVariant;
  /** Size */
  size?: FieldSize;
  /** Corner radius */
  radius?: "sm" | "md" | "lg";
  /** Field label, shown above the field */
  label?: ReactNode;
  /** Helper text below the field */
  description?: ReactNode;
  /** Text shown in the invalid state */
  errorMessage?: ReactNode;
  /** Invalid state */
  isInvalid?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Read-only */
  isReadOnly?: boolean;
  /** Required field (shows *) */
  isRequired?: boolean;
  /** Minimum rows */
  minRows?: number;
  /** Maximum rows while auto-growing */
  maxRows?: number;
  /** Disables auto-resizing */
  disableAutosize?: boolean;
  /** Shows the character count (with maxLength) */
  showCount?: boolean;
  /** Called with the new value when it changes */
  onValueChange?: (value: string) => void;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Adapts to the screen: 16px text and roomier padding on mobile (no zoom on focus), larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const lineHeight: Record<FieldSize, number> = { xs: 16, sm: 20, md: 20, lg: 24 };
const padding: Record<FieldSize, string> = { xs: "px-2 py-1", sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-3.5 py-2.5" };
const paddingR: Record<FieldSize, BreakpointClasses> = {
  xs: {},
  sm: { m: "mobile:px-3 mobile:py-2" },
  md: { m: "mobile:px-3.5 mobile:py-2.5" },
  lg: { d: "desktop:px-4 desktop:py-3" },
};
const radiusStyles = { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-2xl" } as const;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "md",
      label,
      description,
      errorMessage,
      isInvalid = false,
      isDisabled = false,
      isReadOnly = false,
      isRequired = false,
      minRows = 3,
      maxRows = 8,
      disableAutosize = false,
      showCount = false,
      onValueChange,
      fullWidth = true,
      responsive,
      className = "",
      value,
      defaultValue,
      onChange,
      maxLength,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const areaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);

    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const bps = useResponsive(responsive);
    const bp = useBreakpoint();
    // 16px text on mobile needs a taller line; autosize measures with the line height in use
    const lh = bps.includes(bp) && ((bp === "m" && (size === "sm" || size === "md")) || (bp === "d" && size === "lg")) ? lineHeight[size] + 4 : lineHeight[size];

    useLayoutEffect(() => {
      const el = areaRef.current;
      if (!el || disableAutosize) return;
      el.style.height = "auto";
      const next = Math.min(Math.max(el.scrollHeight, minRows * lh), maxRows * lh);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > maxRows * lh ? "auto" : "hidden";
    }, [currentValue, minRows, maxRows, lh, disableAutosize]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const showError = isInvalid && Boolean(errorMessage);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : cn("w-fit", rx(bps, { m: "mobile:w-full" })), isDisabled && "opacity-50 pointer-events-none", className)}>
        {label && (
          <label htmlFor={id} className={fieldLabelClasses}>
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div
          onClick={() => areaRef.current?.focus()}
          className={cn("relative flex w-full cursor-text", padding[size], rx(bps, paddingR[size]), radiusStyles[radius], fieldBoxClasses(variant, isInvalid))}
        >
          <textarea
            ref={areaRef}
            id={id}
            value={currentValue}
            onChange={handleChange}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            maxLength={maxLength}
            rows={minRows}
            aria-invalid={isInvalid || undefined}
            style={{ lineHeight: `${lh}px` }}
            className={cn(
              "w-full bg-transparent outline-none resize-none text-foreground placeholder:text-field-placeholder",
              fieldText[size],
              rx(bps, fieldTextR[size]),
              disableAutosize && "resize-y"
            )}
            {...props}
          />
        </div>
        {(showError || description || showCount) && (
          <div className="flex items-start justify-between gap-3">
            {showError ? <p className={fieldErrorClasses}>{errorMessage}</p> : <p className={fieldDescriptionClasses}>{description}</p>}
            {showCount && (
              <span className={cn("shrink-0 text-xs tabular-nums", maxLength && currentValue.length >= maxLength ? "text-danger" : "text-muted")}>
                {currentValue.length}
                {maxLength ? ` / ${maxLength}` : ""}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
