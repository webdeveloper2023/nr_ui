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
  type FieldSize,
  type FieldVariant,
} from "./fieldStyles";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Ko'rinish: primary — oq maydon soyali, secondary — kulrang maydon (karta ichida) */
  variant?: FieldVariant;
  /** O'lcham */
  size?: FieldSize;
  /** Burchaklar yumaloqligi */
  radius?: "sm" | "md" | "lg";
  /** Maydon sarlavhasi (label) — maydon tepasida */
  label?: ReactNode;
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
  /** Minimal qatorlar soni */
  minRows?: number;
  /** Avtomatik o'sishdagi maksimal qatorlar soni */
  maxRows?: number;
  /** Avtomatik balandlikni o'chiradi */
  disableAutosize?: boolean;
  /** Belgilar sonini ko'rsatadi (maxLength bilan) */
  showCount?: boolean;
  /** Qiymat o'zgarganda yangi qiymat bilan chaqiriladi */
  onValueChange?: (value: string) => void;
  /** Konteyner kengligini to'liq egallaydi */
  fullWidth?: boolean;
}

const lineHeight: Record<FieldSize, number> = { sm: 20, md: 20, lg: 24 };
const padding: Record<FieldSize, string> = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-3.5 py-2.5" };
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
    const lh = lineHeight[size];

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
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", isDisabled && "opacity-50 pointer-events-none", className)}>
        {label && (
          <label htmlFor={id} className={fieldLabelClasses}>
            {label}
            {isRequired && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div
          onClick={() => areaRef.current?.focus()}
          className={cn("relative flex w-full cursor-text", padding[size], radiusStyles[radius], fieldBoxClasses(variant, isInvalid))}
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
