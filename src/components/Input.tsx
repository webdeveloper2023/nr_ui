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
import { rx, useResponsive, type ResponsiveProp } from "./breakpoints";
import {
  fieldBoxClasses,
  fieldDescriptionClasses,
  fieldErrorClasses,
  fieldHeight,
  fieldHeightInside,
  fieldHeightR,
  fieldInsidePadding,
  fieldLeftLabelR,
  fieldLeftLayoutR,
  fieldPadding,
  fieldPaddingR,
  fieldRadius,
  fieldText,
  fieldTextR,
  floatingLabel,
  notchedBox,
  notchedLabel,
  notchedLeft,
  type FieldRadius,
  type FieldSize,
  type FieldVariant,
  type LabelPlacement,
} from "./fieldStyles";
import { useFieldDefaults, type NecessityIndicator } from "./formContext";
import { FieldOutline, Label, NecessityMark } from "./Label";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Style: primary — white field with a shadow (on the gray canvas), secondary — gray field (inside white cards) */
  variant?: FieldVariant;
  /** Size */
  size?: FieldSize;
  /** Corner radius */
  radius?: FieldRadius;
  /** Field label */
  label?: ReactNode;
  /** Label placement: outside (above), outside-left (beside), inside (small, inside the box), floating (on the border once focused / filled) or floating-inside (moves to the top inside the box) */
  labelPlacement?: LabelPlacement;
  /** Help shown from an info icon next to the label (outside placements) */
  labelTooltip?: ReactNode;
  /** Content at the far end of the label row, e.g. a "Forgot password?" link (outside placement) */
  labelEndContent?: ReactNode;
  /** Marks the field as optional next to the label */
  isOptional?: boolean;
  /** How required / optional is shown: icon (*) or text ("Required" / "Optional") */
  necessityIndicator?: NecessityIndicator;
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
  /** Adapts to the screen: touch-sized (44px) with 16px text on mobile, touch-sized on tablet, larger lg on desktop; a left label moves on top on mobile. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
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

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const form = useFieldDefaults();
  const {
    variant = form.variant ?? "primary",
    size = form.size ?? "md",
    radius = form.radius ?? "md",
    label,
    labelPlacement = form.labelPlacement ?? "outside",
    labelTooltip,
    labelEndContent,
    isOptional,
    necessityIndicator = form.necessityIndicator ?? "icon",
    description,
    errorMessage,
    isInvalid = false,
    isDisabled = form.isDisabled ?? false,
    isReadOnly = form.isReadOnly ?? false,
    isRequired = false,
    isClearable = false,
    onClear,
    onValueChange,
    startContent,
    endContent,
    fullWidth = true,
    responsive,
    className = "",
    classNames = {},
    inputOverlay,
    value,
    defaultValue,
    onChange,
    type = "text",
    id: idProp,
    ...rest
  } = props;

  const t = useLocale();
  const bps = useResponsive(responsive);
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
  const isInside = Boolean(label) && (labelPlacement === "inside" || labelPlacement === "floating-inside");
  const isFloating = isInside && labelPlacement === "floating-inside";
  const isNotched = Boolean(label) && labelPlacement === "floating";
  // Leading content (an icon, a country code) takes the resting spot, so the label stays on the border
  const notchRaised = startContent != null || inputOverlay !== undefined ? true : ("auto" as const);
  const optional = isOptional ?? (Boolean(form.showOptional) && !isRequired);

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
        rx(bps, fieldTextR[size]),
        isInside && fieldInsidePadding[size],
        // A floating label stands in for the placeholder until the field is focused
        (isFloating || (isNotched && notchRaised === "auto")) && "placeholder:opacity-0 focus:placeholder:opacity-100",
        classNames.input
      )}
      {...rest}
    />
  );

  return (
    <div
      data-disabled={isDisabled || undefined}
      className={cn(
        "flex",
        isLeft && label ? "flex-row items-start gap-3" : "flex-col gap-1.5",
        fullWidth ? "w-full" : cn("w-fit", rx(bps, { m: "mobile:w-full" })),
        isLeft && label && rx(bps, fieldLeftLayoutR),
        isDisabled && "opacity-50 pointer-events-none",
        className,
        classNames.base
      )}
    >
      {label && !isInside && !isNotched && (
        <Label
          htmlFor={id}
          isRequired={isRequired}
          isOptional={optional}
          necessityIndicator={necessityIndicator}
          tooltip={labelTooltip}
          endContent={isLeft ? undefined : labelEndContent}
          style={isLeft && form.labelWidth !== undefined ? { width: form.labelWidth } : undefined}
          className={cn(isLeft && cn("shrink-0 justify-center", fieldHeight[size], rx(bps, fieldLeftLabelR)), classNames.label)}
        >
          {label}
        </Label>
      )}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div
          onClick={() => inputRef.current?.focus()}
          data-filled={hasValue || undefined}
          className={cn(
            "group/field relative flex items-center w-full cursor-text",
            fieldPadding[size],
            isInside ? fieldHeightInside[size] : cn(fieldHeight[size], rx(bps, fieldHeightR[size])),
            rx(bps, fieldPaddingR[size]),
            fieldRadius[radius],
            isNotched ? cn(notchedBox(variant), "mt-1.5") : fieldBoxClasses(variant, isInvalid),
            classNames.inputWrapper
          )}
        >
          {isNotched && (
            <>
              <FieldOutline label={<>{label}<NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} /></>} size={size} radius={fieldRadius[radius]} raised={notchRaised} isInvalid={isInvalid} />
              <label
                htmlFor={id}
                className={cn(
                  notchedLabel.base,
                  notchedLeft[size],
                  notchRaised === true ? notchedLabel.raised : cn(notchedLabel.rest, floatingLabel.restText[size], notchedLabel.whenActive),
                  isInvalid && "text-danger!",
                  classNames.label
                )}
              >
                {label}
                <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
              </label>
            </>
          )}
          {startContent && <span className="flex items-center shrink-0 text-muted">{startContent}</span>}
          {inputOverlay !== undefined || isInside ? (
            <div className="relative flex flex-1 min-w-0 h-full items-center">
              {inputOverlay !== undefined && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center whitespace-pre overflow-hidden",
                    fieldText[size],
                    rx(bps, fieldTextR[size]),
                    isInside && fieldInsidePadding[size],
                    // A mask guide appears once the floating label has moved out of the way
                    isFloating && "opacity-0 transition-opacity group-focus-within/field:opacity-100 group-data-filled/field:opacity-100"
                  )}
                >
                  {inputOverlay}
                </span>
              )}
              {isInside && (
                <label
                  htmlFor={id}
                  className={cn(
                    floatingLabel.base,
                    isFloating
                      ? cn(floatingLabel.rest, floatingLabel.restText[size], floatingLabel.raisedWhenActive[size])
                      : cn(floatingLabel.raised, floatingLabel.raisedText[size]),
                    showError && "!text-danger",
                    classNames.label
                  )}
                >
                  {label}
                  <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
                </label>
              )}
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
});

Input.displayName = "Input";
export default Input;
