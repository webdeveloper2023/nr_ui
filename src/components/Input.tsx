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
  /** Ko'rinish: primary — oq maydon soyali (kulrang fonda), secondary — kulrang maydon (oq karta ichida) */
  variant?: FieldVariant;
  /** O'lcham */
  size?: FieldSize;
  /** Burchaklar yumaloqligi */
  radius?: FieldRadius;
  /** Maydon sarlavhasi (label) — maydon tepasida */
  label?: ReactNode;
  /** Label joylashuvi: tepada yoki chap tomonda */
  labelPlacement?: LabelPlacement;
  /** Maydon ostidagi yordamchi matn */
  description?: ReactNode;
  /** Xato holatida ko'rsatiladigan matn */
  errorMessage?: ReactNode;
  /** Xato (invalid) holat */
  isInvalid?: boolean;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Faqat o'qish uchun */
  isReadOnly?: boolean;
  /** Majburiy maydon (* belgisi) */
  isRequired?: boolean;
  /** Qiymatni tozalash (X) tugmasini ko'rsatadi */
  isClearable?: boolean;
  /** Tozalash tugmasi bosilganda chaqiriladi */
  onClear?: () => void;
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (value: string) => void;
  /** Boshidagi kontent (masalan, ikonka) */
  startContent?: ReactNode;
  /** Oxiridagi kontent (masalan, ikonka) */
  endContent?: ReactNode;
  /** Konteyner kengligini to'liq egallaydi */
  fullWidth?: boolean;
  /** Ichki qismlar uchun qo'shimcha klasslar */
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
      value,
      defaultValue,
      onChange,
      type = "text",
      id: idProp,
      ...props
    },
    ref
  ) => {
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
    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      onValueChange?.("");
      onClear?.();
      inputRef.current?.focus();
    };

    const showError = isInvalid && Boolean(errorMessage);
    const descId = `${id}-desc`;
    const errId = `${id}-err`;
    const isLeft = labelPlacement === "outside-left";

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
                "w-full min-w-0 h-full bg-transparent outline-none text-foreground placeholder:text-field-placeholder",
                "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                fieldText[size],
                classNames.input
              )}
              {...props}
            />
            {isClearable && hasValue && !isReadOnly && (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Clear"
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
