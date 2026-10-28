import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import {
  fieldBoxClasses,
  fieldDescriptionClasses,
  fieldErrorClasses,
  fieldHeight,
  fieldLabelClasses,
  fieldPadding,
  fieldRadius,
  fieldText,
  type FieldRadius,
  type FieldSize,
  type FieldVariant,
  type LabelPlacement,
} from "./fieldStyles";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Style: primary — white field with a shadow (on the gray canvas), secondary — gray field (inside white cards) */
  variant?: FieldVariant;
  /** Size */
  size?: FieldSize;
  /** Corner radius */
  radius?: FieldRadius;
  /** Field label, shown above the field */
  label?: ReactNode;
  /** Label placement: above or to the left */
  labelPlacement?: LabelPlacement;
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
  /** Shows a clear (X) button */
  isClearable?: boolean;
  /** Called when the clear button is pressed */
  onClear?: () => void;
  /** Called with the new value when it changes */
  onValueChange?: (value: string) => void;
  /** Leading content (e.g. an icon) */
  startContent?: ReactNode;
  /** Trailing content (e.g. an icon) */
  endContent?: ReactNode;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Layer drawn behind the input text — e.g. a mask guide (used by PhoneInput) */
  inputOverlay?: ReactNode;
  /** Extra classes for inner slots */
  classNames?: Partial<Record<"base" | "label" | "inputWrapper" | "input" | "description" | "errorMessage", string>>;
}

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.53 12.47a.75.75 0 1 1-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L10.94 12 8.47 9.53a.75.75 0 0 1 1.06-1.06L12 10.94l2.47-2.47a.75.75 0 0 1 1.06 1.06L13.06 12l2.47 2.47Z" />
  </svg>
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "md",
      label,
      labelPlacement = "outside",
      description,
      errorMessage,
      isInvalid = false,
      isDisabled = false,
      isReadOnly = false,
      isRequired = false,
      isClearable = false,
      onClear,
      onValueChange,
      startContent,
      endContent,
      fullWidth = true,
      className = "",
      classNames = {},
      inputOverlay,
      value,
      defaultValue,
      onChange,
      type = "text",
      id: idProp,
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const autoId = useId();
    const id = idProp ?? autoId;
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const hasValue = currentValue.length > 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
      onValueChange?.(e.target.value);
    };
    // Clear through a native input event so it flows through handleChange like typing does:
    // onChange and onValueChange both fire, and value + onChange inputs update too.
    const handleClear = () => {
      const el = inputRef.current;
      if (el) {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.focus();
      } else {
        if (!isControlled) setInternalValue("");
        onValueChange?.("");
      }
      onClear?.();
    };

    const showError = isInvalid && Boolean(errorMessage);
    const descId = `${id}-desc`;
    const errId = `${id}-err`;
    const isLeft = labelPlacement === "outside-left";

    const inputEl = (
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={currentValue}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        onChange={handleChange}
        aria-invalid={isInvalid || undefined}
        aria-describedby={showError ? errId : description ? descId : undefined}
        className={cn(
          "relative w-full min-w-0 h-full bg-transparent outline-none text-foreground placeholder:text-field-placeholder",
          "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          fieldText[size],
          classNames.input
        )}
        {...props}
      />
    );

    return (
      <div
        data-disabled={isDisabled || undefined}
        className={cn(
          "flex",
          isLeft && label ? "flex-row items-start gap-3" : "flex-col gap-1.5",
          fullWidth ? "w-full" : "w-fit",
          isDisabled && "opacity-50 pointer-events-none",
          className,
          classNames.base
        )}
      >
        {label && (
          <label htmlFor={id} className={cn(fieldLabelClasses, isLeft && cn("shrink-0", fieldHeight[size], "flex items-center"), classNames.label)}>
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div
            onClick={() => inputRef.current?.focus()}
            className={cn(
              "relative flex items-center w-full cursor-text",
              fieldPadding[size],
              fieldHeight[size],
              fieldRadius[radius],
              fieldBoxClasses(variant, isInvalid),
              classNames.inputWrapper
            )}
          >
            {startContent && <span className="flex items-center shrink-0 text-muted">{startContent}</span>}
            {inputOverlay !== undefined ? (
              <div className="relative flex flex-1 min-w-0 h-full items-center">
                <span aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center whitespace-pre overflow-hidden", fieldText[size])}>
                  {inputOverlay}
                </span>
                {inputEl}
              </div>
            ) : (
              inputEl
            )}
            {isClearable && hasValue && !isReadOnly && (
              <button
                type="button"
                tabIndex={-1}
                aria-label={t.common.clear}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="flex items-center shrink-0 text-muted/70 hover:text-foreground transition-colors cursor-pointer animate-fade-in"
              >
                <ClearIcon />
              </button>
            )}
            {endContent && <span className="flex items-center shrink-0 text-muted">{endContent}</span>}
          </div>
          {showError ? (
            <p id={errId} className={cn(fieldErrorClasses, classNames.errorMessage)}>
              {errorMessage}
            </p>
          ) : (
            description && (
              <p id={descId} className={cn(fieldDescriptionClasses, classNames.description)}>
                {description}
              </p>
            )
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
